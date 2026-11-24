// Komponen tampilan bersama, ikon, navigasi, dan helper permainan.
// ---------------- Navigasi bawah (Beranda / Progres) ----------------
document.querySelectorAll(".nav-bottom-star").forEach((star) => { star.innerHTML = gameIcon("star"); });
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
  const source = GAME_ICON_ALIASES[name] || name;
  const index = Math.max(0, GAME_ICONS.indexOf(source));
  const x = (index % 5) * 25;
  const y = Math.floor(index / 5) * 25;
  return `<span class="game-icon icon-${name}" style="--icon-x:${x}%;--icon-y:${y}%" aria-hidden="true"></span>`;
}
function withGameIcons(markup) {
  // Replace only text between HTML tags, never titles, alt text, or ARIA labels.
  return markup.split(/(<[^>]+>)/g).map((part, index) => index % 2 ? part :
    part.replace(GAME_ICON_PATTERN, (glyph) => gameIcon(GAME_ICON_GLYPHS[glyph]))).join("");
}
function setScreen(markup) {
  root.innerHTML = withGameIcons(markup) +
    '<footer class="footer-note">Dibuat oleh destalabs · IqroQu © 2026</footer>';
}
function successScene() {
  return `<div class="success-scene" aria-hidden="true">
    <span class="success-star star-left">${gameIcon("star")}</span>
    <img class="success-raqi" src="${IMG_MASCOT}" alt="" draggable="false">
    <span class="success-star star-right">${gameIcon("star")}</span>
    <span class="success-star star-top">${gameIcon("trophy")}</span>
    <span class="success-ripple"></span>
  </div>`;
}
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
