const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const { test } = require('node:test');
const { root, loadApp } = require('./helpers/load-app.cjs');

function harness() {
  const nodes = new Map();
  const node = id => {
    if (!nodes.has(id)) nodes.set(id, {
      innerHTML: '', dataset: {}, handlers: {},
      classList: { toggle() {}, add() {}, remove() {} },
      setAttribute() {}, removeAttribute() {},
      focus() {},
      addEventListener(event, callback) { this.handlers[event] = callback; },
      querySelectorAll() { return []; }, querySelector() { return node(id + '-child'); }
    });
    return nodes.get(id);
  };
  const audios = [], utterances = [], timers = new Map(), storage = new Map([['iqro-ceria-music', 'off']]);
  let timer = 0;
  const context = vm.createContext({
    console, setTimeout(fn) {
      const id = ++timer;
      timers.set(id, () => { timers.delete(id); fn(); });
      return id;
    }, clearTimeout(id) { timers.delete(id); },
    window: { scrollTo() {}, speechSynthesis: { cancel() {}, getVoices() { return []; }, speak(utterance) { utterances.push(utterance); } } },
    document: { getElementById: node, querySelectorAll() { return []; }, addEventListener() {} },
    localStorage: { getItem(k) { return storage.get(k) ?? null; }, setItem(k, v) { storage.set(k, String(v)); }, removeItem(k) { storage.delete(k); } },
    SpeechSynthesisUtterance: class { constructor(text) { this.text = text; } },
    Audio: class {
      constructor(src) { this.src = src; this.plays = []; audios.push(this); }
      play() { this.plays.push(this.src); return Promise.resolve(); }
      pause() { this.paused = true; }
    }
  });
  loadApp(context);
  return { context, run(code) { return vm.runInContext(code, context); }, audios, utterances, timers, node };
}

test('every vocabulary card and isolated harakat has an existing bundled example', () => {
  const h = harness();
  assert.equal(h.run('ARAB_MODULES.length'), 9);
  assert.equal(h.run('ARAB_MODULES.slice(5).reduce((n,m)=>n+m.kartu.length,0)'), 48);
  assert.deepEqual(JSON.parse(h.run('JSON.stringify(ARAB_MODULES.slice(0,5).map(m=>[m.id,m.kartu.length]))')), [['a1',10],['a2',10],['a3',9],['a4',10],['a5',8]]);
  assert.equal(h.run('ARAB_MODULES.every(m=>m.kartu.every(c=>audioExamples(c.arab)))'), true);
  assert.equal(h.run('IQRO_MODULES[0].kartu.every(c=>audioExamples(c.arab))'), true);
  for (const clips of Object.values(h.context.window.IQRO_AUDIO.entries)) {
    for (const clip of clips) assert.ok(fs.statSync(path.join(root, clip)).size > 1000, clip);
  }
});

test('bundled speech works with no browser speech engine; slow mode preserves pitch', () => {
  const h = harness();
  delete h.context.window.speechSynthesis;
  h.run('globalThis.ended=0; speak(ARAB_MODULES[5].kartu[0].arab,()=>ended++,0.42)');
  assert.equal(h.audios.length, 1);
  assert.equal(h.audios[0].playbackRate, 0.7);
  assert.equal(h.audios[0].preservesPitch, true);
  h.audios[0].onended();
  assert.equal(h.run('ended'), 1);
  assert.equal(h.timers.size, 0);
});

test('letter drills play human syllables sequentially, not letter-name TTS', () => {
  const h = harness();
  h.run('globalThis.ended=0; speak("بَ تَ ثَ جَ",()=>ended++)');
  for (let index = 0; index < 4; index++) {
    assert.equal(h.audios.length, 1, 'reuse the element unlocked by the user gesture on Safari');
    assert.match(h.audios[0].src, /letter-/);
    assert.equal(h.audios[0].plays.length, index + 1);
    h.audios[0].onended();
  }
  assert.equal(h.run('ended'), 1);
  assert.equal(h.utterances.length, 0);
});

test('navigation and replacement stop previous audio and clear callbacks once', () => {
  const h = harness();
  h.run('globalThis.ended=0; speak("بَ",()=>ended++)');
  const staleEnd = h.audios[0].onended;
  h.run('speak("تَ",()=>ended++)');
  assert.equal(h.audios[0].paused, true);
  staleEnd();
  assert.equal(h.run('ended'), 1);
  h.run('render()');
  assert.equal(h.audios[1].paused, true);
  assert.equal(h.run('ended'), 2);
  assert.equal(h.timers.size, 0);
});

test('failed MP3 falls back once; errors and timeout restore controls', () => {
  const h = harness();
  h.run('globalThis.ended=0; speak("بَ",()=>ended++)');
  const fail = h.audios[0].onerror;
  fail(); fail();
  assert.equal(h.utterances.length, 0, 'one media retry precedes device fallback');
  assert.match(h.audios[0].src, /\?retry=1$/);
  h.audios[0].onerror();
  assert.equal(h.utterances.length, 1);
  h.utterances[0].onerror();
  h.utterances[0].onend();
  assert.equal(h.run('ended'), 1);
  h.run('speak("تَ",()=>ended++)');
  // One timer hides a diagnostic, the other guards stalled media.
  for (const fn of [...h.timers.values()]) fn();
  for (const fn of [...h.timers.values()]) fn();
  h.utterances[1].onerror();
  assert.equal(h.run('ended'), 2);
});

test('autoplay rejection restores the speaker and never starts hidden speech', async () => {
  const h = harness();
  h.context.Audio.prototype.play = () => Promise.reject(Object.assign(new Error('gesture required'), { name: 'NotAllowedError' }));
  h.run('globalThis.ended=0; speak("بَ",()=>ended++)');
  await Promise.resolve();
  assert.equal(h.run('ended'), 1);
  assert.equal(h.utterances.length, 0);
  assert.equal(h.audios[0].paused, true);
});

test('map and Favorites reopen the first unread vocabulary card without changing saved progress', () => {
  const h = harness();
  h.run('saveProgress({"arab:a8":{seen:[],selesai:true},"arab:a9":{seen:[0],selesai:false}}); saveFavorites(["arab:a9"])');
  const saved = h.run('JSON.stringify(loadProgress())');
  const mapButton = h.node('map-a9');
  mapButton.dataset.node = 'a9';
  const favoriteButton = h.node('favorite-a9');
  favoriteButton.dataset.openCat = 'arab';
  favoriteButton.dataset.openMod = 'a9';
  h.node('app').querySelectorAll = selector => {
    if (selector === '[data-node]:not([disabled])') return [mapButton];
    if (selector === '[data-open-cat]') return [favoriteButton];
    return [];
  };
  h.run('state.category="arab"; state.view="category-home"; render()');
  mapButton.handlers.click();
  assert.equal(h.run('state.cardIndex'), 1);
  h.run('state.view="favorit"; render()');
  favoriteButton.handlers.click();
  assert.equal(h.run('state.cardIndex'), 1);
  assert.equal(h.run('JSON.stringify(loadProgress())'), saved);
  h.run('saveProgress({"arab:a9":{seen:ARAB_MODULES[8].kartu.map((_,i)=>i),selesai:true}})');
  assert.equal(h.run('getResumeCardIndex("arab","a9")'), 0, 'completed lessons restart for review');
});

test('Aku bisa advances exactly once, cancels on navigation, and opens games after the last card', () => {
  const h = harness();
  h.run('state.category="arab"; state.jilidId="a9"; state.cardIndex=0; state.view="lesson"; render()');
  const click = h.node('btnBisa').handlers.click;
  click(); click();
  assert.equal(h.run('getXP()'), 2);
  assert.equal(h.run('getProgress("arab","a9").seen.length'), 1);
  assert.equal(h.run('state.cardIndex'), 0, 'keep the current card during its departure');
  assert.equal(h.node('lessonSuccess').hidden, false, 'show the lightweight success scene before advancing');
  h.timers.values().next().value();
  assert.equal(h.run('state.cardIndex'), 1);
  assert.equal(h.run('getProgress("arab","a9").seen.length'), 1, 'do not mark the arriving card learned');
  h.node('btnBisa').handlers.click();
  const staleAdvance = h.timers.values().next().value;
  h.run('state.view="dashboard"; render()');
  staleAdvance();
  assert.equal(h.run('state.view'), 'dashboard');
  assert.equal(h.run('state.cardIndex'), 1);
  h.context.window.matchMedia = () => ({ matches: true });
  h.run('state.view="lesson"; state.cardIndex=11; render()');
  h.node('btnBisa').handlers.click();
  h.timers.values().next().value();
  assert.equal(h.run('state.view'), 'gamehub');
  assert.equal(h.run('getProgress("arab","a9").selesai'), false, 'never complete skipped cards');
});

test('illustrated icons preserve Arabic content and accessible labels', () => {
  const h = harness();
  const markup = '<button aria-label="Suara ⭐ بَ" title="Putar ▶">بَ ▶ ☆</button>';
  const result = h.run(`withGameIcons(${JSON.stringify(markup)})`);
  assert.match(result, /aria-label="Suara ⭐ بَ" title="Putar ▶"/);
  assert.match(result, />بَ <span/);
  assert.match(result, /icon-play/);
  assert.match(result, /icon-starEmpty/);
});

test('success continues to unread, unlocked learning without marking skipped cards', () => {
  const h = harness();
  h.run(`
    state.category = "iqro";
    const first = APP_DATA.iqro.modules[0];
    const second = APP_DATA.iqro.modules[1];
    first.kartu.forEach((_, i) => markCardSeen("iqro", first.id, i));
    markCardSeen("iqro", second.id, 0);
    state.jilidId = first.id;
    state.view = "quiz";
    renderCelebration(first, { score: 8, total: 8 }, "quiz");
  `);
  h.node('btnNextAdventure').handlers.click();
  assert.equal(h.run('state.view'), 'lesson');
  assert.equal(h.run('state.jilidId === APP_DATA.iqro.modules[1].id'), true);
  assert.equal(h.run('state.cardIndex'), 1);
  assert.equal(h.run('getProgress("iqro", state.jilidId).seen.length'), 1);
});

test('icon-only favorites and face-down matching controls keep accessible names', () => {
  const h = harness();
  h.run('saveFavorites(["iqro:" + APP_DATA.iqro.modules[0].id]); renderFavorit()');
  assert.match(h.node('app').innerHTML, /class="favorit-remove" aria-label="Hapus .+ dari favorit"/);
  h.run('state.category="iqro"; startMatch(APP_DATA.iqro.modules[0].id)');
  assert.match(h.node('app').innerHTML, /aria-label="Buka kartu 1" aria-pressed="false"/);
});

test('worksheet corrections describe each result without relying on icon or color', () => {
  const h = harness();
  h.run(`
    state.category = "iqro";
    startSheet(APP_DATA.iqro.modules[0].id);
    state.sheet.questions.forEach(q => { q.chosen = q.cardIdx; });
    const wrong = state.sheet.questions[0];
    wrong.chosen = wrong.options.find(index => index !== wrong.cardIdx);
    state.sheet.submitted = true;
    render();
  `);
  assert.match(h.node('app').innerHTML, /Soal 1: Belum tepat\. Jawaban:/);
  assert.match(h.node('app').innerHTML, /Soal 2: Benar\. Jawaban:/);
});
