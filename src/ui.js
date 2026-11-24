// Komponen tampilan bersama, ikon, navigasi, dan helper permainan.
// ---------------- Navigasi bawah (Beranda / Progres) ----------------
document.querySelectorAll(".bn-item").forEach((btn) => {
  const icons = { dashboard: "map", main: "game", progres: "trophy", favorit: "star", pengaturan: "settings" };
  btn.querySelector(".bn-icon").innerHTML = gameIcon(icons[btn.dataset.nav]);
  btn.addEventListener("click", () => {
    state.view = btn.dataset.nav;
    render();
    window.scrollTo({ top: 0 });
  });
});
function updateBottomNav() {
  const navViews = ["dashboard", "progres", "main", "favorit", "pengaturan"];
  const activeTab = navViews.includes(state.view) ? state.view : "dashboard";
  document.querySelectorAll(".bn-item").forEach((btn) => {
    btn.classList.toggle("active", btn.dataset.nav === activeTab);
    if (btn.dataset.nav === activeTab) btn.setAttribute("aria-current", "page");
    else btn.removeAttribute("aria-current");
  });
}

// ---------------- Render helpers ----------------
function gameIcon(name) {
  const paths = {
    map: '<path d="m3 6 6-3 6 3 6-3v15l-6 3-6-3-6 3V6Z"/><path d="M9 3v15M15 6v15"/>',
    game: '<path d="M7 7h10c3 0 5 10 3 12-2 2-5-3-6-3h-4c-1 0-4 5-6 3C2 17 4 7 7 7Z"/><path d="M7 10v5m-2.5-2.5h5M16 11h.01M18 14h.01"/>',
    trophy: '<path d="M7 3h10v6a5 5 0 0 1-10 0V3ZM12 14v5m-4 2h8M7 5H3v3a4 4 0 0 0 5 4m9-7h4v3a4 4 0 0 1-5 4"/>',
    star: '<path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1 6.2-5.5-2.9-5.5 2.9 1-6.2L3 9.6l6.2-.9L12 3Z"/>',
    settings: '<path d="m10 3-.7 2.3-2 .9L5 5.6 3 9l1.6 1.8v2.4L3 15l2 3.4 2.3-.6 2 .9L10 21h4l.7-2.3 2-.9 2.3.6 2-3.4-1.6-1.8v-2.4L21 9l-2-3.4-2.3.6-2-.9L14 3h-4Z"/><circle cx="12" cy="12" r="3"/>',
    flame: '<path d="M13 3c1 6-6 5-4 11-2 0-3-2-3-3-5 8 6 14 11 7 4-6-2-12-4-15Z"/>',
    arrow: '<path d="M5 12h14m-5-5 5 5-5 5"/>',
    arrowLeft: '<path d="M19 12H5m5-5-5 5 5 5"/>',
    play: '<path d="m8 4 12 8-12 8V4Z"/>',
    book: '<path d="M12 6C9 3 5 3 2 4v15c4-1 7-1 10 2 3-3 6-3 10-2V4c-3-1-7-1-10 2Zm0 0v15"/>',
    slow: '<circle cx="12" cy="12" r="9"/><path d="M12 7v5l-3 2"/>',
    repeat: '<path d="m17 2 4 4-4 4M3 11V9a3 3 0 0 1 3-3h15M7 22l-4-4 4-4m14-1v2a3 3 0 0 1-3 3H3"/>',
    sound: '<path d="M11 4 5 9H2v6h3l6 5V4Zm5 4a6 6 0 0 1 0 8m3-11a10 10 0 0 1 0 14"/>',
    puzzle: '<path d="M4 4h5a3 3 0 1 1 6 0h5v5a3 3 0 1 0 0 6v5h-5a3 3 0 1 0-6 0H4v-5a3 3 0 1 1 0-6V4Z"/>',
    check: '<circle cx="12" cy="12" r="9"/><path d="m7 12 3 3 7-7"/>',
    list: '<rect x="3" y="3" width="5" height="5" rx="1"/><rect x="3" y="16" width="5" height="5" rx="1"/><path d="M13 5h8M13 18h8M5.5 11v2"/>',
    sheet: '<path d="M14 3H5v18h14V8l-5-5Z"/><path d="M14 3v5h5M8 12h8M8 16h6"/>',
    muted: '<path d="M11 4 5 9H2v6h3l6 5V4Zm5 5 6 6m0-6-6 6"/>',
    sun: '<circle cx="12" cy="12" r="4"/><path d="M12 2v2m0 16v2M2 12h2m16 0h2M5 5l1 1m12 12 1 1M5 19l1-1M18 6l1-1"/>'
  };
  return `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.star}</svg>`;
}
// Ilustrasi maskot "Kak Iqro" — SVG vektor bergaya, dengan beberapa pose
// supaya terasa hidup & bergambar penuh di tiap layar (bukan cuma kotak CSS).
let mascotSvgCounter = 0;
// Logo "IqroQu" bergaya huruf warna-warni (terinspirasi gaya branding anak-anak)
function logoHtml(compact) {
  const letters = ["I", "q", "r", "o", "Q", "u"];
  const colors = ["#7C83FD", "#FFC93C", "#2FA84F", "#FF6F59", "#E85D9C", "#1B7A72"];
  const spans = letters.map((l, i) => `<span style="color:${colors[i % colors.length]}">${l}</span>`).join("");
  return `<span class="iqroqu-logo${compact ? " compact" : ""}">${spans}</span>`;
}
function mascotSVG(pose, big) {
  // Sekarang memakai ilustrasi Raqi asli (aset desain IqroQu) alih-alih SVG buatan.
  // Parameter "pose" dipertahankan agar seluruh pemanggil lama tetap kompatibel,
  // dipakai sebagai teks aksesibilitas saja karena hanya ada satu pose gambar.
  return `<div class="mascot-illust${big ? " big" : ""}"><img src="${IMG_MASCOT}" alt="Raqi, maskot IqroQu" draggable="false" /></div>`;
}
function mascot(msg, pose) {
  return `
    <div class="mascot-wrap">
      ${mascotSVG(pose)}
      <div class="speech-bubble">${msg}</div>
    </div>`;
}
function topbar(title, showBack) {
  return `
    ${adventureHeader()}
    <div class="topbar">
      <div class="brand">
        ${showBack ? `<button class="back-btn" id="btnBack">${gameIcon("arrowLeft")} Kembali</button>` : ""}
      </div>
      ${showBack ? `<div class="brand-title" style="font-size:17px">${title}</div>` : ""}
    </div>`;
}
function adventureHeader() {
  const xp = getXP();
  const streak = getStreak();
  return `<header class="adventure-header"><div class="game-logo" aria-label="IqroQu, belajar sambil bermain"><span class="logo-book">ق</span><div>iqro<span>qu</span><small>BELAJAR SAMBIL BERMAIN</small></div></div>
    <div class="player-stats"><div class="player-stat flame" aria-label="${streak} hari belajar berturut-turut">${gameIcon("flame")} <strong>${streak}</strong><small>hari</small></div><div class="player-stat" aria-label="${xp} XP">${gameIcon("star")} <strong>${xp}</strong><small>XP</small></div></div>
  </header>`;
}
function screenHeading(label, title) {
  return `<header class="play-heading screen-heading"><span class="garden-sign">${label}</span><h1>${title}</h1></header>`;
}
function pick(arr) { return arr[Math.floor(Math.random() * arr.length)]; }
function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}
// Ambil pilihan pengecoh (distractor) yang "gayanya" mirip dengan jawaban benar —
// supaya huruf tunggal tidak tercampur dengan kartu latihan gabungan huruf (yang
// berisi " - "), sehingga pilihan ganda terlihat rapi dan setara.
function pickDistractors(kartuArr, correctIdx, count) {
  const target = kartuArr[correctIdx];
  const isDrill = target.latin.includes(" - ");
  let pool = kartuArr.map((k, i) => i).filter((i) => i !== correctIdx && kartuArr[i].latin.includes(" - ") === isDrill);
  if (pool.length < count) pool = kartuArr.map((k, i) => i).filter((i) => i !== correctIdx);
  return shuffle(pool).slice(0, count);
}
function arabSizeClass(text) {
  const len = (text || "").length;
  if (len > 40) return "small";
  if (len > 16) return "medium";
  return "";
}
