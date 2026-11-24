// Beranda, peta utama, progres, favorit, dan pengaturan.
// ---------------- DASHBOARD ----------------
function getRecommendedModule(catKey) {
  const cat = APP_DATA[catKey];
  for (let i = 0; i < cat.modules.length; i++) {
    const locked = isModuleLocked(catKey, cat.modules, i);
    const prog = getProgress(catKey, cat.modules[i].id);
    if (!locked && !prog.selesai) return cat.modules[i];
  }
  return cat.modules[cat.modules.length - 1];
}
const DAILY_POSE = { iqro: "read", sholat: "point", tajwid: "search", nabi: "trophy", arab: "wave", doa: "pray" };

function renderDashboard() {
  const cats = ["iqro", "sholat", "tajwid", "nabi", "arab", "doa"];
  const worlds = {
    iqro: { title: "Ayo Mengaji", bg: "#fff3a8", accent: "#ef9d16", edge: "#bd7511" },
    sholat: { title: "Belajar Sholat", bg: "#c4f4ff", accent: "#16a4d6", edge: "#0875af" },
    tajwid: { title: "Tajwid Seru", bg: "#e9dcff", accent: "#9960df", edge: "#7140b3" },
    nabi: { title: "Kisah Nabi", bg: "#ffe1bb", accent: "#f28a36", edge: "#c85a1b" },
    arab: { title: "Bahasa Arab", bg: "#ffd9ea", accent: "#eb6b9d", edge: "#bf3d79" },
    doa: { title: "Doa Harian", bg: "#e1f7b2", accent: "#79b93c", edge: "#4c8823" }
  };
  const tileHtml = cats.map((key, index) => {
    const cat = APP_DATA[key];
    const world = worlds[key];
    const total = cat.modules.reduce((a, m) => a + m.kartu.length, 0);
    const seen = cat.modules.reduce((a, m) => a + getProgress(key, m.id).seen.length, 0);
    const percent = total ? Math.min(100, Math.round(seen / total * 100)) : 0;
    return `<button class="world-card" data-cat="${key}" style="--world-bg:${world.bg};--world-accent:${world.accent};--world-edge:${world.edge}" aria-label="Jelajahi ${world.title}">
      <div class="world-visual"><span class="world-number">${String(index + 1).padStart(2, "0")}</span><img src="${cat.badgeImg}" alt="" draggable="false"><span class="world-spark" aria-hidden="true">✦</span></div>
      <div class="world-info"><h3>${world.title}</h3><span class="world-arrow" aria-hidden="true">▶</span></div>
      <div class="world-stars" aria-hidden="true">${[1, 2, 3].map((n) => `<span class="${percent >= n * 100 / 3 ? "earned" : ""}">${gameIcon("star")}</span>`).join("")}</div>
      <div class="world-progress" role="progressbar" aria-label="Progres ${world.title}" aria-valuenow="${percent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${percent}%"></span></div>
    </button>`;
  }).join("");
  const xp = getXP();
  const level = Math.floor(xp / 100) + 1;
  const dailyXP = getDailyXP();
  const dailyPercent = Math.min(100, dailyXP / 20 * 100);
  const next = getRecommendedModule("iqro");
  const started = getProgress("iqro", next.id).seen.length > 0;
  setScreen(`
    ${adventureHeader()}
    <section class="play-heading" aria-labelledby="adventure-title"><span class="garden-sign">TAMAN BELAJAR RAQI</span><h1 id="adventure-title">Ayo, pilih petualanganmu!</h1><p>Sentuh gambarnya. Kita main sambil belajar!</p></section>
    <div class="playground-layout">
      <section class="raqi-welcome" aria-label="Teman bermainmu"><div class="raqi-speech">Assalamu’alaikum!<br><strong>Aku Raqi. Main bareng, yuk!</strong></div><img class="raqi-character" src="${IMG_MASCOT}" alt="Raqi, teman petualangan belajar" draggable="false"><button class="hero-cta" id="continueAdventure"><span class="play-triangle" aria-hidden="true">▶</span><span>${started ? "Lanjut main" : "Mulai main"}<small>Petualangan mengaji</small></span></button></section>
      <section class="world-map" aria-label="Enam dunia belajar"><div class="world-grid">${tileHtml}</div></section>
    </div>
    <section class="reward-strip" aria-label="Misi dan level"><div class="daily-trophy" aria-hidden="true">${gameIcon("trophy")}</div><div class="daily-mission"><h2>${dailyXP >= 20 ? "Hore, misi selesai!" : "Misi bintang hari ini"}</h2><div class="daily-progress" role="progressbar" aria-label="Misi XP harian" aria-valuenow="${dailyPercent}" aria-valuemin="0" aria-valuemax="100"><span style="width:${dailyPercent}%"></span></div><span>${Math.min(dailyXP, 20)} / 20 XP · ${dailyXP >= 20 ? "Kamu hebat!" : "Sedikit lagi, semangat!"}</span></div><button class="mission-link" id="dailyPlay">Main yuk! ${gameIcon("arrow")}</button><div class="player-level"><span class="level-medal">${level}</span><div><strong>Level ${level}</strong><small>${100 - xp % 100} XP ke level berikutnya</small></div></div></section>
    <footer class="dashboard-footer"><button class="intro-replay" id="replayIntro">${gameIcon("repeat")} Putar intro IqroQu</button></footer>`);
  document.getElementById("replayIntro").addEventListener("click", showWelcome);
  root.querySelectorAll("[data-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.cat;
      state.view = "category-home";
      render();
      window.scrollTo({ top: 0 });
    });
  });
  document.getElementById("continueAdventure").addEventListener("click", () => {
    state.category = "iqro";
    state.jilidId = next.id;
    state.cardIndex = getResumeCardIndex("iqro", next.id);
    state.view = "lesson";
    render();
    window.scrollTo({ top: 0 });
  });
  document.getElementById("dailyPlay").addEventListener("click", () => {
    state.view = "main";
    render();
    window.scrollTo({ top: 0 });
  });
}

// ---------------- Popup pratinjau kategori (muncul saat kartu menu di-tap) ----------------
function openCategoryPopup(key) {
  const cat = APP_DATA[key];
  const total = cat.modules.reduce((a, m) => a + m.kartu.length, 0);
  let seen = 0;
  cat.modules.forEach((m) => (seen += getProgress(key, m.id).seen.length));
  const persen = total ? Math.round((seen / total) * 100) : 0;

  const visual = cat.badgeImg
    ? `<img class="cat-popup-img" src="${cat.badgeImg}" alt="${cat.label}" />`
    : `<div class="cat-popup-fallback tile-${key}"><span>${cat.icon}</span></div>`;

  const overlay = document.createElement("div");
  overlay.className = "cat-popup-overlay";
  overlay.innerHTML = withGameIcons(`
    <div class="cat-popup-card">
      <button class="cat-popup-close" id="catPopupClose" aria-label="Tutup">✕</button>
      ${visual}
      <div class="cat-popup-title">${cat.label}</div>
      <div class="cat-popup-desc">${cat.desc}</div>
      <div class="intro-progress-bar"><div class="intro-progress-fill" style="width:${persen}%"></div></div>
      <div class="cat-popup-progress">⭐ ${seen}/${total} kartu dipelajari (${persen}%)</div>
      <button class="btn btn-primary cat-popup-start" id="catPopupStart">Mulai Belajar 🚀</button>
    </div>`);
  document.body.appendChild(overlay);

  const close = () => overlay.remove();
  overlay.addEventListener("click", (e) => { if (e.target === overlay) close(); });
  document.getElementById("catPopupClose").addEventListener("click", close);
  document.getElementById("catPopupStart").addEventListener("click", () => {
    close();
    state.view = "category-home";
    state.category = key;
    render();
  });
}

// ---------------- PROGRES (rekap XP, streak, dan pencapaian) ----------------
function renderProgres() {
  const cats = ["iqro", "sholat", "tajwid", "nabi", "arab", "doa"];
  const streak = getStreak();
  const xp = getXP();
  let modulesDone = 0;
  let modulesTotal = 0;

  const rows = cats.map((key) => {
    const cat = APP_DATA[key];
    const total = cat.modules.reduce((a, m) => a + m.kartu.length, 0);
    let seen = 0;
    let doneCount = 0;
    cat.modules.forEach((m) => {
      const p = getProgress(key, m.id);
      seen += p.seen.length;
      if (p.selesai) doneCount += 1;
    });
    modulesDone += doneCount;
    modulesTotal += cat.modules.length;
    const persen = total ? Math.round((seen / total) * 100) : 0;
    const tuntas = doneCount === cat.modules.length;
    return `
      <div class="progres-row">
        <div class="progres-row-icon tile-${key}"><img src="${cat.badgeImg}" alt="" draggable="false"></div>
        <div class="progres-row-body">
          <div class="progres-row-head">
            <span class="progres-row-title">${cat.label}</span>
            ${tuntas ? `<span class="progres-row-badge">🏆 Tuntas</span>` : `<span class="progres-row-count">${doneCount}/${cat.modules.length} modul</span>`}
          </div>
          <div class="intro-progress-bar dark"><div class="intro-progress-fill" style="width:${persen}%;background:var(--teal)"></div></div>
          <div class="progres-row-sub">⭐ ${seen}/${total} kartu dipelajari (${persen}%)</div>
        </div>
      </div>`;
  }).join("");

  setScreen(`
    ${adventureHeader()}
    ${screenHeading("HARTA PETUALANGAN", "Bintang-bintangku!")}
    ${mascot("Setiap langkah bikin kamu makin hebat. Kumpulkan semua bintangnya, yuk!", "trophy")}
    <div class="progres-summary">
      <div class="progres-summary-item">
        <div class="ps-num">${xp}</div>
        <div class="ps-label">Total XP</div>
      </div>
      <div class="progres-summary-item">
        <div class="ps-num">🔥 ${streak}</div>
        <div class="ps-label">Hari Beruntun</div>
      </div>
      <div class="progres-summary-item">
        <div class="ps-num">${modulesDone}/${modulesTotal}</div>
        <div class="ps-label">Modul Selesai</div>
      </div>
    </div>
    <div class="menu-section-title">📊 Progres per Kategori</div>
    <div class="progres-list">${rows}</div>

  `);
}

// ---------------- MAIN (akses cepat ke game, gaya tab "Play") ----------------
function renderMainPage() {
  const cats = ["iqro", "sholat", "tajwid", "nabi", "arab", "doa"];
  const cardsHtml = cats.map((key) => {
    const cat = APP_DATA[key];
    const mod = getRecommendedModule(key);
    return `
      <button class="main-play-card tile-${key}" data-play-cat="${key}" data-play-mod="${mod.id}">
        <div class="main-play-icon"><img src="${cat.badgeImg}" alt="" draggable="false"></div>
        <div class="main-play-body">
          <div class="main-play-title">${cat.label}</div>
          <div class="main-play-sub">${mod.judul}</div>
        </div>
        <span class="main-play-btn">Yuk, main! ${gameIcon("arrow")}</span>
      </button>`;
  }).join("");

  setScreen(`
    ${adventureHeader()}
    ${screenHeading("ARENA MAIN RAQI", "Pilih dunia, yuk!")}
    ${mascot("Ada lima permainan di setiap dunia. Pilih gambarnya dan main bareng aku!", "point")}
    <div class="main-play-list">${cardsHtml}</div>

  `);

  root.querySelectorAll("[data-play-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.playCat;
      state.jilidId = btn.dataset.playMod;
      state.view = "gamehub";
      render();
    });
  });
}

// ---------------- FAVORIT ----------------
function renderFavorit() {
  const favs = loadFavorites();
  const items = favs.map((key) => {
    const [catKey, modId] = key.split(":");
    const cat = APP_DATA[catKey];
    if (!cat) return null;
    const mod = cat.modules.find((m) => m.id === modId);
    if (!mod) return null;
    const prog = getProgress(catKey, modId);
    return `
      <div class="favorit-card tile-${catKey}">
        <div class="favorit-icon"><img src="${cat.badgeImg}" alt="" draggable="false"></div>
        <div class="favorit-body">
          <div class="favorit-title">${mod.judul}</div>
          <div class="favorit-sub">${cat.label} · ⭐ ${prog.seen.length}/${mod.kartu.length}</div>
        </div>
        <div class="favorit-actions">
          <button class="favorit-open" data-open-cat="${catKey}" data-open-mod="${modId}">Buka</button>
          <button class="favorit-remove" aria-label="Hapus ${mod.judul} dari favorit" data-remove-cat="${catKey}" data-remove-mod="${modId}">☆</button>
        </div>
      </div>`;
  }).filter(Boolean).join("");

  setScreen(`
    ${adventureHeader()}
    ${screenHeading("KOLEKSI KESUKAANKU", "Tempat favoritku!")}
    ${mascot(favs.length ? "Petualangan kesukaanmu sudah menunggu. Kita main lagi, yuk!" : "Simpan petualangan kesukaanmu dengan tombol bintang di peta belajar!", "point")}
    ${items ? `<div class="favorit-list">${items}</div>` : `<div class="favorit-empty">Belum ada modul favorit. Yuk jelajahi menu Belajar dan tap bintang ☆ pada modul kesukaanmu!</div>`}

  `);

  root.querySelectorAll("[data-open-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.category = btn.dataset.openCat;
      state.view = "lesson";
      state.jilidId = btn.dataset.openMod;
      state.cardIndex = getResumeCardIndex(state.category, state.jilidId);
      render();
    });
  });
  root.querySelectorAll("[data-remove-cat]").forEach((btn) => {
    btn.addEventListener("click", () => {
      toggleFavorite(btn.dataset.removeCat, btn.dataset.removeMod);
      render();
    });
  });
}

// ---------------- PENGATURAN ----------------
function renderPengaturan() {
  const v = currentArabicVoice();
  setScreen(`
    ${adventureHeader()}
    ${screenHeading("RUMAH RAQI", "Atur cara mainmu!")}
    ${mascot("Mau dengar musik atau pilih suara bacaan? Semuanya ada di sini!", "point")}
    <div class="setting-list">
      <div class="setting-row">
        <div>
          <div class="setting-title">🎵 Musik Latar</div>
          <div class="setting-sub">${musicOn ? "Sedang menyala" : "Sedang mati"}</div>
        </div>
        <button class="setting-toggle ${musicOn ? "on" : ""}" id="setMusicToggle">${musicOn ? "ON" : "OFF"}</button>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-title">🔁 Suara Arab Cadangan</div>
          <div class="setting-sub">Huruf & kosakata memakai audio IqroQu. Cadangan bacaan lain: ${v ? v.name : "belum tersedia di perangkat"}</div>
        </div>
        <button class="setting-btn" id="setVoiceCycle">Ganti</button>
      </div>
      <div class="setting-row">
        <div>
          <div class="setting-title">🗑️ Reset Progres Belajar</div>
          <div class="setting-sub">Menghapus XP, streak, dan progres semua kategori</div>
        </div>
        <button class="setting-btn danger" id="setReset">Reset</button>
      </div>
    </div>
    <div class="menu-section-title">ℹ️ Tentang</div>
    <div class="about-card">
      <div>${logoHtml(false)}</div>
      <p>Aplikasi belajar Iqro, Al-Qur'an, tajwid, sholat, kisah nabi, dan Bahasa Arab untuk anak-anak — ringan, interaktif, dan bisa dipakai tanpa akun.</p>
    </div>

  `);

  document.getElementById("setMusicToggle").addEventListener("click", () => {
    musicOn = !musicOn;
    localStorage.setItem(MUSIC_KEY, musicOn ? "on" : "off");
    updateMusicBtn();
    if (musicOn) updateMusicPlayback(); else stopMusic();
    render();
  });
  document.getElementById("setVoiceCycle").addEventListener("click", () => {
    cycleArabicVoice();
    render();
  });
  document.getElementById("setReset").addEventListener("click", () => {
    if (confirm("Yakin mau reset semua progres belajar, XP, dan streak? Tindakan ini tidak bisa dibatalkan.")) {
      [PROGRESS_KEY, XP_KEY, STREAK_KEY, FAVORIT_KEY, DAILY_XP_KEY].forEach((k) => localStorage.removeItem(k));
      render();
    }
  });
}
