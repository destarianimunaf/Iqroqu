// Menu permainan, lima mini-game, dan layar hasil.
// ---------------- GAME HUB ----------------
function renderGameHub() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const canOrder = mod.kartu.length >= 3;
  setScreen(`
    ${topbar(mod.judul + " · Main", true)}
    ${mascot("Sekarang ada 5 game seru buat dicoba! Pilih salah satu yuk 🎮", "point")}
    <div class="game-grid">
      <button class="game-tile quiz" id="tileQuiz">
        <div class="icon">${gameIcon(cat.quizMode === "audio" ? "sound" : "star")}</div>
        <h3>${cat.quizLabel}</h3>
        <p>${cat.quizDesc}</p>
      </button>
      <button class="game-tile match" id="tileMatch">
        <div class="icon">${gameIcon("puzzle")}</div>
        <h3>Cocok Kartu</h3>
        <p>${cat.matchDesc}</p>
      </button>
      <button class="game-tile tf" id="tileTF">
        <div class="icon">${gameIcon("check")}</div>
        <h3>Benar / Salah</h3>
        <p>Tebak cepat, pasangannya benar atau salah?</p>
      </button>
      <button class="game-tile order" id="tileOrder" ${canOrder ? "" : "disabled style=\"opacity:.5\""}>
        <div class="icon">${gameIcon("list")}</div>
        <h3>Urutkan Yuk!</h3>
        <p>Susun kartu sesuai urutan yang benar</p>
      </button>
      <button class="game-tile sheet" id="tileSheet">
        <div class="icon">${gameIcon("sheet")}</div>
        <h3>Lembar Latihan</h3>
        <p>Kerjakan soal-soal seperti lembar kerja beneran!</p>
      </button>
    </div>
  `);
  document.getElementById("tileQuiz").addEventListener("click", () => startQuiz(state.jilidId));
  document.getElementById("tileMatch").addEventListener("click", () => startMatch(state.jilidId));
  document.getElementById("tileSheet").addEventListener("click", () => startSheet(state.jilidId));
  document.getElementById("tileTF").addEventListener("click", () => startTF(state.jilidId));
  const tileOrder = document.getElementById("tileOrder");
  if (canOrder) tileOrder.addEventListener("click", () => startOrder(state.jilidId));
}

// ---------------- GAME: Susun Urutan (tap sesuai urutan asli) ----------------
function startOrder(jilidId) {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === jilidId);
  const n = Math.min(5, mod.kartu.length);
  const startAt = mod.kartu.length > n ? Math.floor(Math.random() * (mod.kartu.length - n + 1)) : 0;
  const correctOrder = Array.from({ length: n }, (_, i) => startAt + i);
  state.view = "order";
  state.jilidId = jilidId;
  state.order = { correctOrder, display: shuffle(correctOrder), picks: [], total: n, done: false, reveal: false, xpGiven: false };
  render();
}
function renderOrder() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const o = state.order;

  if (o.done) {
    const right = o.picks.every((idx, i) => idx === o.correctOrder[i]);
    let stars = right ? 3 : (o.picks.filter((idx, i) => idx === o.correctOrder[i]).length >= Math.ceil(o.total / 2) ? 2 : 1);
    if (!o.xpGiven) { addXP(o.total * 3 + stars * 2); o.xpGiven = true; }
    renderCelebration(mod, { stars, right, total: o.total }, "order");
    return;
  }

  setScreen(`
    ${topbar(mod.judul + " · Urutkan", true)}
    ${mascot("Ketuk kartu sesuai urutan yang benar, dari pertama sampai terakhir ya! 🔢", "point")}
    <div class="order-tip">${o.reveal ? "Ini urutan pilihanmu:" : `Langkah ke-${o.picks.length + 1} dari ${o.total}`}</div>
    <div class="order-grid" id="orderGrid">
      ${o.display.map((idx) => {
        const placedAt = o.picks.indexOf(idx);
        const placed = placedAt !== -1;
        let cls = placed ? "placed" : "";
        if (o.reveal && placed) cls += placedAt === o.correctOrder.indexOf(idx) ? " right" : " wrong";
        return `<button class="order-chip ${cls}" data-idx="${idx}" disabled>
          <div class="oc-arab">${mod.kartu[idx].arab}</div>
          <div class="oc-latin">${mod.kartu[idx].latin}</div>
          ${placed ? `<span class="oc-badge">${placedAt + 1}</span>` : `<span class="oc-badge">?</span>`}
        </button>`;
      }).join("")}
    </div>
  `);

  if (!o.reveal) {
    document.querySelectorAll(".order-chip").forEach((btn) => {
      if (o.picks.includes(Number(btn.dataset.idx))) return;
      btn.disabled = false;
      btn.addEventListener("click", () => {
        const idx = Number(btn.dataset.idx);
        if (o.reveal || o.picks.includes(idx)) return;
        const correct = idx === o.correctOrder[o.picks.length];
        o.picks.push(idx);
        if (o.picks.length >= o.total) o.reveal = true;
        render();
        speak(mod.kartu[idx].arab);
        showAnswerFeedback(correct, [root.querySelector(`.order-chip[data-idx="${idx}"]`)]);
        if (o.reveal) scheduleGameStep(() => { o.done = true; render({ preserveSpeech: true }); }, 1400);
      });
    });
  }
}

// ---------------- GAME: Lembar Latihan (bergaya lembar kerja/worksheet) ----------------
function startSheet(jilidId) {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === jilidId);
  const total = Math.min(8, mod.kartu.length);
  const pool = shuffle(mod.kartu.map((k, i) => i)).slice(0, total);
  const questions = pool.map((idx) => {
    const distractors = pickDistractors(mod.kartu, idx, 3);
    const options = shuffle([idx, ...distractors]);
    return { cardIdx: idx, options, chosen: null };
  });
  state.view = "sheet";
  state.jilidId = jilidId;
  state.sheet = { questions, submitted: false, xpGiven: false };
  render();
}
function renderSheet() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const s = state.sheet;
  const semuaTerjawab = s.questions.every((q) => q.chosen !== null);
  const benar = s.questions.filter((q) => q.chosen === q.cardIdx).length;
  const total = s.questions.length;
  const persen = Math.round((benar / total) * 100);
  const bintang = persen >= 90 ? 3 : persen >= 60 ? 2 : 1;

  if (s.submitted && !s.xpGiven) { addXP(benar * 3 + bintang * 2); s.xpGiven = true; }

  const holes = Array.from({ length: 8 }, () => `<span></span>`).join("");

  const rows = s.questions.map((q, i) => {
    const kartu = mod.kartu[q.cardIdx];
    const numCls = !s.submitted ? "" : q.chosen === q.cardIdx ? "correct" : "wrong";
    const numIcon = !s.submitted ? String(i + 1) : q.chosen === q.cardIdx ? "✓" : "✗";
    const opts = q.options.map((optIdx, oi) => {
      const letter = ["A", "B", "C", "D"][oi];
      let cls = q.chosen === optIdx ? "selected" : "";
      if (s.submitted) {
        if (optIdx === q.cardIdx) cls += " correct";
        else if (q.chosen === optIdx) cls += " wrong";
      }
      return `<button class="ws-opt ${cls}" data-q="${i}" data-opt="${optIdx}" ${s.submitted ? "disabled" : ""}>
        <b>${letter}.</b> ${mod.kartu[optIdx].latin}
      </button>`;
    }).join("");
    return `
      <div class="ws-q">
        <div class="ws-q-head">
          <span class="ws-q-num ${numCls}">${numIcon}</span>
          <span class="ws-q-arab ${arabSizeClass(kartu.arab)}">${kartu.arab}</span>
        </div>
        <div class="ws-options">${opts}</div>
        ${s.submitted ? `<p class="ws-result">Soal ${i + 1}: ${q.chosen === q.cardIdx ? "Benar" : "Belum tepat"}. Jawaban: ${kartu.latin}</p>` : ""}
      </div>`;
  }).join("");

  setScreen(`
    ${topbar(mod.judul + " · Lembar Latihan", true)}
    ${mascot(s.submitted ? "Sudah selesai dikoreksi! Lihat hasilnya di atas ya 📝" : "Kerjakan tiap nomor, lalu tekan Periksa Jawaban kalau sudah selesai semua! ✏️", "read")}
    ${s.submitted ? `
      <div class="ws-stamp">
        NILAI ${persen} ${"⭐".repeat(bintang)}${"☆".repeat(3 - bintang)}
        <div style="font-size:12px;font-weight:700;margin-top:4px">Benar ${benar} dari ${total} soal</div>
      </div>` : ""}
    <div class="worksheet-paper">
      <div class="worksheet-holes">${holes}</div>
      <div class="ws-title">📝 Lembar Latihan — ${mod.judul}</div>
      <div class="ws-instruction">Lingkari (tap) jawaban A/B/C/D yang paling tepat untuk tiap nomor ya!</div>
      ${rows}
    </div>
    <div class="ws-submit-row">
      ${s.submitted
        ? `<button class="btn btn-primary" id="btnSheetUlangi">Kerjakan Lagi 🔁</button>
           <button class="btn btn-secondary" id="btnSheetGameLain" style="margin-top:10px">Main Game Lain 🎮</button>`
        : `<button class="btn btn-ok" id="btnSheetSubmit" ${semuaTerjawab ? "" : "disabled"}>Periksa Jawaban ✓</button>
           <p style="font-size:12px;color:#8A7F9C;font-weight:700;margin-top:8px">${semuaTerjawab ? "Semua sudah dijawab, yuk periksa!" : "Jawab semua nomor dulu ya (" + s.questions.filter(q=>q.chosen!==null).length + "/" + total + ")"}</p>`}
    </div>
  `);

  if (!s.submitted) {
    document.querySelectorAll(".ws-opt").forEach((btn) => {
      btn.addEventListener("click", () => {
        const qi = Number(btn.dataset.q);
        const oi = Number(btn.dataset.opt);
        s.questions[qi].chosen = oi;
        render();
      });
    });
    const submitBtn = document.getElementById("btnSheetSubmit");
    if (submitBtn) submitBtn.addEventListener("click", () => {
      if (s.submitted) return;
      s.submitted = true;
      render();
      const allCorrect = s.questions.every((q) => q.chosen === q.cardIdx);
      showAnswerFeedback(allCorrect, [], allCorrect ? "Hebat! Semua jawaban benar!" : "Sudah diperiksa. Yuk, lihat koreksinya!");
    });
  } else {
    document.getElementById("btnSheetUlangi").addEventListener("click", () => startSheet(mod.id));
    document.getElementById("btnSheetGameLain").addEventListener("click", () => { state.view = "gamehub"; render(); });
  }
}

// ---------------- GAME: Benar atau Salah (tebak cepat) ----------------
function startTF(jilidId) {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === jilidId);
  const total = Math.min(6, mod.kartu.length);
  const pool = shuffle(mod.kartu.map((k, i) => i)).slice(0, total);
  const rounds = pool.map((idx) => {
    const isTrue = Math.random() < 0.5 || mod.kartu.length < 2;
    let shownLatin = mod.kartu[idx].latin;
    if (!isTrue) {
      const others = mod.kartu.map((k, i) => i).filter((i) => i !== idx);
      const swapIdx = pick(others);
      shownLatin = mod.kartu[swapIdx].latin;
    }
    return { idx, shownLatin, isTrue };
  });
  state.view = "tf";
  state.jilidId = jilidId;
  state.tf = { rounds, index: 0, score: 0, total, answered: false, hearts: 3, xpGiven: false };
  render();
}
function renderTF() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const t = state.tf;
  const kehabisanNyawa = t.hearts <= 0;
  if (t.index >= t.total || kehabisanNyawa) {
    if (!t.xpGiven) { addXP(t.score * 4 + (kehabisanNyawa ? 0 : 5)); t.xpGiven = true; }
    renderCelebration(mod, { score: t.score, total: t.total, kehabisan: kehabisanNyawa }, "tf");
    return;
  }

  const r = t.rounds[t.index];
  const kartu = mod.kartu[r.idx];

  setScreen(`
    ${topbar(mod.judul + " · Benar/Salah", true)}
    ${mascot("Perhatikan baik-baik, lalu tebak: benar atau salah? ⚡", "search")}
    <div class="hearts-row" aria-label="Sisa ${t.hearts} dari 3 nyawa" style="text-align:center">${"❤️".repeat(t.hearts)}${"🤍".repeat(3 - t.hearts)}</div>
    <div class="quiz-question" style="text-align:center;margin-bottom:6px">Soal ${t.index + 1} dari ${t.total}</div>
    <div class="tf-card">
      <div class="tf-arab">${kartu.arab}</div>
      <div class="tf-latin">${r.shownLatin}</div>
      <div class="tf-hint">Apakah tulisan latin di atas cocok dengan bacaan Arabnya?</div>
    </div>
    <div class="tf-buttons">
      <button class="tf-btn tf-yes" data-ans="true">Benar ✅</button>
      <button class="tf-btn tf-no" data-ans="false">Salah ❌</button>
    </div>
    <div class="quiz-feedback" id="quizFeedback" style="text-align:center"></div>
    <div style="text-align:center;margin-top:10px"><span class="quiz-score">⭐ ${t.score}/${t.total}</span></div>
  `);

  document.querySelectorAll(".tf-btn").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (t.answered) return;
      t.answered = true;
      document.querySelectorAll(".tf-btn").forEach((b) => (b.disabled = true));
      const chosen = btn.dataset.ans === "true";
      if (chosen === r.isTrue) {
        t.score += 1;
      } else {
        t.hearts -= 1;
      }
      showAnswerFeedback(chosen === r.isTrue, [btn]);
      scheduleGameStep(() => { t.index += 1; t.answered = false; render(); }, 1300);
    });
  });
}

// ---------------- QUIZ: dengar/baca & pilih ----------------
function startQuiz(jilidId) {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === jilidId);
  const totalSoal = Math.min(5, mod.kartu.length);
  const pool = shuffle(mod.kartu.map((k, i) => i)).slice(0, totalSoal);
  state.view = "quiz";
  state.jilidId = jilidId;
  state.quiz = { pool, index: 0, score: 0, total: totalSoal, answered: false, hearts: 3, xpGiven: false };
  render();
}
function renderQuiz() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const q = state.quiz;
  const kehabisanNyawa = q.hearts <= 0;
  if (q.index >= q.total || kehabisanNyawa) {
    if (!q.xpGiven) { addXP(q.score * 4 + (kehabisanNyawa ? 0 : 5)); q.xpGiven = true; }
    renderCelebration(mod, { score: q.score, total: q.total, kehabisan: kehabisanNyawa }, "quiz");
    return;
  }

  const cardIdx = q.pool[q.index];
  const kartu = mod.kartu[cardIdx];
  const distractors = pickDistractors(mod.kartu, cardIdx, 3);
  const options = shuffle([cardIdx, ...distractors]);
  const isAudio = cat.quizMode !== "text";

  setScreen(`
    ${topbar(mod.judul + " · Kuis", true)}
    ${mascot(isAudio ? "Dengarkan suaranya, lalu pilih tulisan yang cocok ya! 🎧" : "Baca petunjuknya, lalu tebak jawabannya ya! 🕵️", "search")}
    <div class="quiz-card">
      <div class="hearts-row" aria-label="Sisa ${q.hearts} dari 3 nyawa">${"❤️".repeat(q.hearts)}${"🤍".repeat(3 - q.hearts)}</div>
      <div class="quiz-question">Soal ${q.index + 1} dari ${q.total}</div>
      ${isAudio ? `<button class="speaker-btn" id="btnSpeakQuiz" aria-label="Dengarkan pelafalan">${gameIcon("sound")}</button><div class="audio-source">${audioSourceLabel(kartu.arab)}</div>` : `<div class="clue-box">${kartu.ket}</div>`}
      <div class="quiz-options ${isAudio ? "audio-options" : "text-options"}" id="quizOptions">
        ${options.map((i) => `<button class="quiz-opt" data-idx="${i}">${mod.kartu[i].latin}</button>`).join("")}
      </div>
      <div class="quiz-feedback" id="quizFeedback"></div>
      <div style="margin-top:10px"><span class="quiz-score">⭐ ${q.score}/${q.total}</span></div>
    </div>
    <div class="audio-note hidden" id="audioNote"></div>
  `);

  if (isAudio) {
    const speakBtn = document.getElementById("btnSpeakQuiz");
    const doSpeak = () => { stopSpeech(); speakBtn.classList.add("speaking"); speak(kartu.arab, () => speakBtn.classList.remove("speaking")); };
    speakBtn.addEventListener("click", doSpeak);
    // The first question must start inside the game tile's tap, not a timer.
    doSpeak();
  }

  document.querySelectorAll(".quiz-opt").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (q.answered) return;
      q.answered = true;
      if (isAudio) { stopSpeech(); primeSpeech(); }
      const chosen = Number(btn.dataset.idx);
      if (chosen === cardIdx) {
        btn.classList.add("correct");
        q.score += 1;
      } else {
        btn.classList.add("wrong");
        document.querySelector(`.quiz-opt[data-idx="${cardIdx}"]`).classList.add("correct");
        q.hearts -= 1;
      }
      showAnswerFeedback(chosen === cardIdx, [btn]);
      scheduleGameStep(() => { q.index += 1; q.answered = false; render(); }, 1400);
    });
  });
}

// ---------------- GAME: Cocok Kartu (memory match) ----------------
function startMatch(jilidId) {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === jilidId);
  const n = Math.min(6, mod.kartu.length);
  const chosen = shuffle(mod.kartu.map((k, i) => i)).slice(0, n);
  let cards = [];
  chosen.forEach((idx) => {
    cards.push({ uid: idx + "-a", idx, type: "arab" });
    cards.push({ uid: idx + "-l", idx, type: "latin" });
  });
  cards = shuffle(cards);
  state.view = "match";
  state.jilidId = jilidId;
  state.match = { cards, flipped: [], matched: [], moves: 0, busy: false, total: n, xpGiven: false };
  render();
}
function renderMatch() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const longFaces = mod.kartu.some((card) => card.arab.length > 35 || card.latin.length > 60);
  const m = state.match;

  if (m.matched.length === m.cards.length) {
    const maxMoves = m.total + 2;
    let stars = 1;
    if (m.moves <= maxMoves) stars = 3;
    else if (m.moves <= maxMoves + 3) stars = 2;
    if (!m.xpGiven) { addXP(m.total * 3 + stars * 2); m.xpGiven = true; }
    renderCelebration(mod, { moves: m.moves, stars }, "match");
    return;
  }

  setScreen(`
    ${topbar(mod.judul + " · Cocok Kartu", true)}
    ${mascot("Buka dua kartu, cari pasangannya! 🧩", "puzzle")}
    <div class="match-stats">
      <span class="pill">🔁 Langkah: ${m.moves}</span>
      <span class="pill">✅ ${m.matched.length / 2}/${m.total} pasang</span>
    </div>
    ${m.reviewMismatch ? `<div class="match-review">
      <p role="status">Belum cocok. Baca kedua kartu dulu, lalu coba pasangan lain.</p>
      <button class="btn btn-secondary" id="btnMatchRetry">${gameIcon("repeat")} Coba pasangan lain</button>
    </div>` : ""}
    <div class="match-grid${longFaces ? " long-faces" : ""}" id="matchGrid">
      ${m.cards.map((c, pos) => {
        const isMatched = m.matched.includes(c.uid);
        const isFlipped = m.flipped.some((f) => f.uid === c.uid) || isMatched;
        const label = isFlipped
          ? (c.type === "arab" ? mod.kartu[c.idx].arab : mod.kartu[c.idx].latin)
          : "❓";
        const faceClass = isFlipped ? (c.type === "arab" ? "face-arab" : "face-latin") : "";
        return `<button class="match-card ${isFlipped ? "flipped" : ""} ${isMatched ? "matched" : ""} ${faceClass}"
                  aria-label="${isFlipped ? label : "Buka kartu " + (pos + 1)}" aria-pressed="${isFlipped}"
                  data-pos="${pos}" ${isMatched || m.reviewMismatch ? "disabled" : ""}>${label}</button>`;
      }).join("")}
    </div>
    <div class="audio-note hidden" id="audioNote"></div>
  `);

  document.querySelectorAll(".match-card").forEach((btn) => {
    btn.addEventListener("click", () => onMatchCardClick(Number(btn.dataset.pos)));
  });
  const retry = document.getElementById("btnMatchRetry");
  if (m.reviewMismatch && retry) retry.addEventListener("click", () => {
    m.reviewMismatch = false;
    m.flipped = [];
    m.busy = false;
    render({ preserveSpeech: true });
    const firstCard = root.querySelector(".match-card:not([disabled])");
    if (firstCard) firstCard.focus({ preventScroll: true });
  });
}
function onMatchCardClick(pos) {
  const m = state.match;
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  if (m.busy) return;
  const card = m.cards[pos];
  if (m.matched.includes(card.uid)) return;
  if (m.flipped.some((f) => f.uid === card.uid)) return;
  if (m.flipped.length >= 2) return;

  m.flipped.push(card);
  render({ preserveSpeech: true });

  if (m.flipped.length === 2) {
    m.busy = true;
    m.moves += 1;
    const [a, b] = m.flipped;
    const isMatch = a.idx === b.idx && a.type !== b.type;
    if (!isMatch) {
      // Never ask children to read and scroll a full prayer against a timer.
      // Keep mismatches visible until they explicitly choose to try again.
      m.reviewMismatch = true;
      render({ preserveSpeech: true });
    }
    showAnswerFeedback(isMatch, m.flipped.map((flipped) => root.querySelector(`.match-card[data-pos="${m.cards.indexOf(flipped)}"]`)));
    if (isMatch) {
      // Start inside the matching tap, not after the response timer: fresh
      // players on gesture-restricted devices must be activated synchronously.
      speak(mod.kartu[a.idx].arab);
      scheduleGameStep(() => {
        m.matched.push(a.uid, b.uid);
        m.flipped = [];
        m.busy = false;
        render({ preserveSpeech: true });
      }, 1100);
    }
  }
}

// ---------------- Celebration ----------------
const CELEB_TITLE = { quiz: "Kuis Selesai!", match: "Semua Kartu Cocok!", order: "Urutan Selesai!", tf: "Tebakan Selesai!" };
const CELEB_START = { quiz: startQuiz, match: startMatch, order: startOrder, tf: startTF };
function renderCelebration(mod, result, kind) {
  const gagalNyawa = (kind === "quiz" || kind === "tf") && result.kehabisan;
  const title = gagalNyawa ? "Nyawa Habis!" : (CELEB_TITLE[kind] || "Selesai!");
  let desc = "";
  if (kind === "quiz" || kind === "tf") {
    desc = gagalNyawa
      ? `Jangan sedih, kamu tetap dapat skor ${result.score} dari ${result.total}. Yuk coba lagi! 💪`
      : `Skor kamu: ${result.score} dari ${result.total} (${Math.round((result.score / result.total) * 100)}%)`;
  } else if (kind === "match") {
    desc = `Selesai dalam ${result.moves} langkah — ${"⭐".repeat(result.stars)}`;
  } else if (kind === "order") {
    desc = result.right
      ? `Semua urutan kamu benar! ${"⭐".repeat(result.stars)}`
      : `Belum semua urutannya pas, yuk coba lagi! ${"⭐".repeat(result.stars)}`;
  }

  setScreen(`
    ${topbar(mod.judul, true)}
    ${mascot(gagalNyawa ? "Tidak apa-apa, semua orang pasti pernah salah. Ayo coba lagi! 🤗" : pick(MASKOT_KATA.selesaiJilid), gagalNyawa ? "point" : "trophy")}
    <div class="celebrate">
      <div class="celebrate-card">
        ${gagalNyawa ? `<div class="big-star">${gameIcon("heart")}</div>` : successScene()}
        <h3>${title}</h3>
        <p>${desc}</p>
        <div class="xp-earned">✨ Total XP kamu sekarang: ${getXP()}</div>
        ${!gagalNyawa ? `<button class="btn btn-primary" id="btnNextAdventure">Lanjut petualangan ${gameIcon("arrow")}</button>` : ""}
        <button class="btn ${gagalNyawa ? "btn-primary" : "btn-secondary"}" id="btnUlangi">Main Lagi 🔁</button>
        <button class="btn btn-secondary" id="btnGameLain">Main Game Lain 🎮</button>
        <button class="btn btn-secondary" id="btnKeRak">Kembali ke Rak 📚</button>
      </div>
    </div>
  `);
  document.getElementById("btnUlangi").addEventListener("click", () => {
    (CELEB_START[kind] || startQuiz)(mod.id);
  });
  if (!gagalNyawa) document.getElementById("btnNextAdventure").addEventListener("click", continueLearning);
  document.getElementById("btnGameLain").addEventListener("click", () => { state.view = "gamehub"; render(); });
  document.getElementById("btnKeRak").addEventListener("click", () => { state.view = "category-home"; render(); });
}

// Continue to unread learning, without unlocking or marking skipped cards.
function continueLearning() {
  const modules = APP_DATA[state.category].modules;
  const next = modules.find((mod, index) => !isModuleLocked(state.category, modules, index) && !getProgress(state.category, mod.id).selesai);
  if (next) {
    state.jilidId = next.id;
    state.cardIndex = getResumeCardIndex(state.category, next.id);
    state.view = "lesson";
  } else {
    state.view = "category-home";
  }
  render();
  window.scrollTo({ top: 0 });
}
