// Peta modul dan kartu belajar, termasuk transisi setelah Aku bisa!.
// ---------------- CATEGORY HOME (jalur belajar ala Duolingo) ----------------
function renderCategoryHome() {
  const cat = APP_DATA[state.category];
  const totalKartu = cat.modules.reduce((a, m) => a + m.kartu.length, 0);
  let seenTotal = 0;
  cat.modules.forEach((m) => (seenTotal += getProgress(state.category, m.id).seen.length));
  const persen = totalKartu ? Math.round((seenTotal / totalKartu) * 100) : 0;

  const nodes = cat.modules.map((m, i) => {
    const prog = getProgress(state.category, m.id);
    const locked = isModuleLocked(state.category, cat.modules, i);
    const status = locked ? "locked" : prog.selesai ? "done" : "current";
    const icon = locked ? "🔒" : prog.selesai ? "✓" : "▶";
    const offset = Math.round(Math.sin(i * 1.15) * 78);
    const fav = isFavorite(state.category, m.id);
    return `
      <div class="duo-node-row" style="--path-offset:${offset}px">
        <div class="duo-node-col">
          ${status === "current" ? `<div class="duo-node-ring"></div>` : ""}
          ${!locked ? `<button class="duo-node-fav ${fav ? "active" : ""}" data-fav="${m.id}" title="Favoritkan modul ini">${fav ? "⭐" : "☆"}</button>` : ""}
          <button class="duo-node ${status}" style="--node-color:${m.warna}" data-node="${m.id}" ${locked ? "disabled" : ""} aria-label="${m.judul}">
            <span class="duo-node-icon">${icon}</span>
          </button>
          <div class="duo-node-label">${m.judul}</div>
          <div class="duo-node-progress">⭐ ${prog.seen.length}/${m.kartu.length}</div>
          ${!locked ? `<button class="duo-node-game" data-main="${m.id}" title="Main game modul ini">🎮</button>` : ""}
        </div>
      </div>`;
  }).join("");

  setScreen(`
    ${topbar(cat.label, true)}
    ${mascot(cat.intro, "point")}
    <div class="intro-card" style="background:${cat.heroGradient}">
      <h2>${cat.heroTitle}</h2>
      <p>${cat.heroDesc}</p>
      <div class="intro-progress-bar"><div class="intro-progress-fill" style="width:${persen}%"></div></div>
      <p style="margin-top:6px;font-size:12.5px">Progres kamu: ${seenTotal}/${totalKartu} kartu (${persen}%) ✨</p>
    </div>
    <div class="shelf-label">${cat.shelfLabel}</div>
    <div class="duo-path">${nodes}</div>
    <div class="corner-mascot-block">
      ${mascotSVG("read", true)}
      <div class="corner-mascot-note">Semangat terus belajarnya! 📖</div>
    </div>

  `);

  root.querySelectorAll("[data-node]:not([disabled])").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.view = "lesson";
      state.jilidId = btn.dataset.node;
      state.cardIndex = getResumeCardIndex(state.category, state.jilidId);
      render();
    });
  });
  root.querySelectorAll("[data-main]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      state.jilidId = btn.dataset.main;
      state.view = "gamehub";
      render();
    });
  });
  root.querySelectorAll("[data-fav]").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      e.stopPropagation();
      toggleFavorite(state.category, btn.dataset.fav);
      render();
    });
  });
}

// ---------------- LESSON (flashcard) ----------------
function renderLesson() {
  const cat = APP_DATA[state.category];
  const mod = cat.modules.find((j) => j.id === state.jilidId);
  const kartu = mod.kartu[state.cardIndex];
  const prog = getProgress(state.category, mod.id);
  const isLast = state.cardIndex === mod.kartu.length - 1;
  const sudahDilihat = prog.seen.includes(state.cardIndex);
  const arabClass = arabSizeClass(kartu.arab);
  const hasExample = !!audioExamples(kartu.arab);

  const dots = mod.kartu.map((_, i) => {
    const cls = i === state.cardIndex ? "active" : prog.seen.includes(i) ? "done" : "";
    return `<span class="dot ${cls}"></span>`;
  }).join("");

  setScreen(`
    ${topbar(mod.judul, true)}
    ${mascot(`${mod.tujuan}`, "read")}
    <div class="progress-dots" role="status" aria-live="polite" aria-label="Kartu ${state.cardIndex + 1} dari ${mod.kartu.length}">${dots}</div>
    <div class="flashcard">
      <div class="arabic ${arabClass}">${kartu.arab}</div>
      <div class="latin">${kartu.latin}</div>
      <div class="ket">${kartu.ket}</div>
      <button class="speaker-btn" id="btnSpeak" aria-label="Dengarkan pelafalan">${gameIcon("sound")}</button>
      <div class="audio-tools-row">
        <button class="audio-tool-btn" id="btnSlow">${gameIcon("slow")} Pelan-pelan</button>
        <button class="audio-tool-btn" id="btnVoice">${gameIcon("sound")} ${hasExample ? "Tentang suara" : "Ganti suara"}</button>
      </div>
      ${hasExample ? '<div class="audio-source">Contoh audio IqroQu · Dengar, lalu tirukan!</div>' : ''}
    </div>
    <div class="lesson-success" id="lessonSuccess" role="status" aria-live="polite" hidden>
      ${successScene()}
      <strong>Hebat! Kamu bisa!</strong>
      <small>${isLast ? "Ayo ke arena main!" : "Lanjut petualangan, yuk!"}</small>
    </div>
    <div class="audio-note hidden" id="audioNote"></div>
    <div class="aku-bisa-row">
      <button class="btn btn-ok" id="btnBisa">${gameIcon("check")} ${sudahDilihat ? "Sudah aku pelajari" : "Aku bisa!"}</button>
    </div>
    <div class="nav-row">
      <button class="btn btn-secondary" id="btnPrev" ${state.cardIndex === 0 ? "disabled" : ""}>${gameIcon("arrowLeft")} Sebelumnya</button>
      ${isLast ? `<button class="btn btn-primary" id="btnGame">Main yuk! ${gameIcon("game")}</button>` : `<button class="btn btn-primary" id="btnNext">Selanjutnya ${gameIcon("arrow")}</button>`}
    </div>
  `);

  document.getElementById("btnSpeak").addEventListener("click", (e) => {
    stopSpeech();
    const button = e.currentTarget;
    button.classList.add("speaking");
    speak(kartu.arab, () => button.classList.remove("speaking"));
  });
  document.getElementById("btnSlow").addEventListener("click", () => {
    stopSpeech();
    const sp = document.getElementById("btnSpeak");
    sp.classList.add("speaking");
    speak(kartu.arab, () => sp.classList.remove("speaking"), 0.42);
  });
  document.getElementById("btnVoice").addEventListener("click", () => {
    if (hasExample) showAudioNote(state.category === "arab" ? "Contoh kosakata memakai suara sintetis Arab (Saudi). Dengarkan lalu tirukan pelan-pelan, ya!" : "Huruf berharakat memakai rekaman manusia, bukan ejaan nama huruf.");
    else cycleArabicVoice();
  });
  document.getElementById("btnBisa").addEventListener("click", () => {
    if (lessonAdvancing) return;
    lessonAdvancing = true;
    const advanceId = ++lessonAdvanceId;
    stopSpeech();
    markCardSeen(state.category, mod.id, state.cardIndex);
    const button = document.getElementById("btnBisa");
    button.textContent = isLast ? "Hebat! Ayo main!" : "Hebat! Lanjut yuk…";
    ["btnBisa", "btnPrev", "btnNext", "btnGame", "btnSpeak", "btnSlow", "btnVoice"].forEach((id) => {
      const control = document.getElementById(id);
      if (control) control.disabled = true;
    });
    root.querySelector(".flashcard").classList.add("card-flow-out");
    const reducedMotion = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (!reducedMotion) document.getElementById("lessonSuccess").hidden = false;
    scheduleGameStep(() => {
      if (advanceId !== lessonAdvanceId) return;
      if (isLast) state.view = "gamehub";
      else state.cardIndex += 1;
      render();
      if (!isLast) root.querySelector(".flashcard").classList.add("card-flow-in");
      const nextFocus = document.getElementById(isLast ? "tileQuiz" : "btnBisa");
      if (nextFocus) nextFocus.focus({ preventScroll: true });
    }, reducedMotion ? 0 : 760);
  });
  document.getElementById("btnPrev").addEventListener("click", () => {
    if (!lessonAdvancing && state.cardIndex > 0) { state.cardIndex -= 1; render(); }
  });
  const btnNext = document.getElementById("btnNext");
  if (btnNext) btnNext.addEventListener("click", () => { if (!lessonAdvancing) { state.cardIndex += 1; render(); } });
  const btnGame = document.getElementById("btnGame");
  if (btnGame) btnGame.addEventListener("click", () => { if (!lessonAdvancing) { state.view = "gamehub"; render(); } });
}
