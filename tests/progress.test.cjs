const vm = require('node:vm');
const assert = require('node:assert/strict');
const { loadApp } = require('./helpers/load-app.cjs');
let clock = new Date(2026, 10, 24, 12).getTime();
class Clock extends Date { constructor(...args) { super(...(args.length ? args : [clock])); } }
const storage = new Map([['iqro-ceria-music', 'off']]);
const nodes = new Map();
function node(id) {
  if (!nodes.has(id)) nodes.set(id, {
    innerHTML: '', dataset: {}, handlers: {},
    classList: { toggle() {}, add() {}, remove() {} },
    setAttribute() {}, removeAttribute() {},
    addEventListener(event, callback) { this.handlers[event] = callback; },
    querySelectorAll() { return []; },
    querySelector() { return node(id + '-child'); }
  });
  return nodes.get(id);
}
const context = vm.createContext({
  Date: Clock, console, setTimeout, clearTimeout, setInterval, clearInterval,
  window: { scrollTo() {} },
  document: { getElementById: node, querySelectorAll() { return []; }, addEventListener() {} },
  localStorage: {
    getItem(key) { return storage.get(key) ?? null; },
    setItem(key, value) { storage.set(key, String(value)); },
    removeItem(key) { storage.delete(key); }
  }
});
// Deliberately omit the bundled manifest to exercise device-speech recovery.
loadApp(context, { bundledAudio: false });
const run = code => vm.runInContext(code, context);
assert.equal(run('getDailyXP()'), 0);
assert.equal(run('getXP()'), 0);
run('addXP(8); addXP(12);');
assert.equal(run('getDailyXP()'), 20);
assert.equal(run('getXP()'), 20);
assert.equal(run('getStreak()'), 1);
clock += 24 * 60 * 60 * 1000;
assert.equal(run('getDailyXP()'), 0, 'daily mission rolls over without resetting lifetime XP');
assert.equal(run('getXP()'), 20);
run('addXP(2)');
assert.equal(run('getDailyXP()'), 2);
assert.equal(run('getXP()'), 22);
assert.equal(run('getStreak()'), 2);
storage.set('iqroqu-daily-xp', '{broken');
assert.equal(run('getDailyXP()'), 0, 'malformed mission data is recoverable');
run('addXP(2)');
assert.equal(run('getDailyXP()'), 2);
storage.set('iqro-ceria-xp', '98');
run('state.view="dashboard"; render()');
assert.match(node('app').innerHTML, /Level 1/);
run('addXP(2); render()');
assert.match(node('app').innerHTML, /Level 2/);
const firstModule = run('APP_DATA.iqro.modules[0].id');
run(`markCardSeen('iqro', '${firstModule}', 0)`);
const xpAfterCard = run('getXP()');
const dailyAfterCard = run('getDailyXP()');
run(`markCardSeen('iqro', '${firstModule}', 0)`);
assert.equal(run('getXP()'), xpAfterCard, 'repeated learning does not duplicate card XP');
assert.equal(run('getDailyXP()'), dailyAfterCard);
assert.equal(run('isModuleLocked("iqro", APP_DATA.iqro.modules, 1)'), true);
run('state.view="dashboard"; render()');
node('continueAdventure').handlers.click();
assert.equal(run('state.view'), 'lesson');
assert.equal(run('state.cardIndex'), 1, 'continue opens first unread card');
run(`APP_DATA.iqro.modules[0].kartu.forEach((_, i) => markCardSeen('iqro', '${firstModule}', i))`);
assert.equal(run('isModuleLocked("iqro", APP_DATA.iqro.modules, 1)'), false);
assert.equal(run('getProgress("iqro", APP_DATA.iqro.modules[0].id).selesai'), true);
const saved = storage.get('iqro-ceria-progress-v2');
run('state.view="dashboard"; render()');
assert.equal(storage.get('iqro-ceria-progress-v2'), saved, 'redrawing never mutates saved progress');
run('state.view="pengaturan"; render()');
context.confirm = () => true;
node('setReset').handlers.click();
for (const key of ['iqro-ceria-progress-v2', 'iqro-ceria-xp', 'iqro-ceria-streak', 'iqro-ceria-favorit', 'iqroqu-daily-xp']) {
  assert.equal(storage.has(key), false, `reset clears ${key}`);
}
console.log('PASS: daily rollover, malformed mission recovery, lifetime XP, streak, level boundary, duplicate card rewards, first-unread resume, unlocks, saved-progress preservation, and reset');
const pending = new Map();
let timerId = 0;
context.setTimeout = callback => { pending.set(++timerId, callback); return timerId; };
context.clearTimeout = id => pending.delete(id);
run('globalThis.timerFired=false; scheduleGameStep(() => { timerFired=true; }, 1400)');
assert.equal(pending.size, 1);
run('state.view="dashboard"; render()');
assert.equal(pending.size, 0, 'navigation cancels delayed game transitions');
assert.equal(run('timerFired'), false);
run('scheduleGameStep(() => { timerFired=true; }, 1400)');
pending.values().next().value();
assert.equal(run('timerFired'), true, 'a live screen still advances normally');
assert.equal(run('gameStepTimers.size'), 0, 'completed timers are released');
let utterance;
context.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
context.window.speechSynthesis = { cancel() {}, speak(utter) { utterance = utter; } };
run('state.category="iqro"; state.jilidId=APP_DATA.iqro.modules[0].id; state.cardIndex=0; state.view="lesson"; render()');
const speaker = node('btnSpeak');
const classes = new Set();
speaker.classList = { add(c) { classes.add(c); }, remove(c) { classes.delete(c); } };
const event = { currentTarget: speaker };
speaker.handlers.click(event);
event.currentTarget = null; // Browsers clear this after event dispatch.
assert.equal(classes.has('speaking'), true);
utterance.onerror();
assert.equal(classes.has('speaking'), false, 'asynchronous audio errors restore the original button');
for (const callback of pending.values()) context.clearTimeout(callback);
console.log('PASS: navigation cancels stale game timers, live timers advance, asynchronous audio fallback clears speaking state');
