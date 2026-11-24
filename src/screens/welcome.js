// Intro promosi dapat dilewati atau diputar ulang; tidak mengubah progres.
function showWelcome() {
  const dialog = document.getElementById("welcomeDialog");
  if (!dialog || typeof dialog.showModal !== "function" || dialog.open) return;
  dialog.innerHTML = withGameIcons(`
    <button class="intro-skip" id="skipIntro">Lewati ${gameIcon("arrow")}</button>
    <div class="intro-scene" aria-hidden="true">
      <div class="intro-sun"></div><span class="intro-spark spark-one">✦</span><span class="intro-spark spark-two">✦</span>
      <div class="intro-orbit orbit-book"><img src="${IMG_CARD_IQRO}" alt=""></div>
      <div class="intro-orbit orbit-arab"><img src="${IMG_CARD_ARAB}" alt=""></div>
      <div class="intro-orbit orbit-pray"><img src="${IMG_CARD_DOA}" alt=""></div>
      <img class="intro-raqi" src="${IMG_MASCOT}" alt="">
      <span class="intro-raqi-name">Hai, aku Raqi!</span>
    </div>
    <div class="intro-copy">
      <div class="intro-logo">iqro<span>qu</span><span class="intro-logo-star" aria-hidden="true">✦</span></div>
      <span class="intro-eyebrow">PETUALANGAN KECIL, ILMU BESAR</span>
      <h1 id="welcomeTitle">Mengaji jadi<br><em>petualangan!</em></h1>
      <p id="welcomeDescription">Jelajahi dunia penuh warna bersama Raqi.<br>Belajar, main, lalu kumpulkan bintangmu!</p>
      <div class="intro-features"><span>${gameIcon("book")} 6 dunia belajar</span><span>${gameIcon("game")} 5 game seru</span><span>${gameIcon("star")} Bintang & XP</span></div>
      <button class="hero-cta intro-start" id="startIntro">${gameIcon("play")} Ayo, main bareng!</button>
      <small class="intro-footnote">Tanpa akun · Progresmu tetap tersimpan</small>
    </div>`);
  const close = () => { primeSpeech(); dialog.close(); };
  document.getElementById("skipIntro").addEventListener("click", close);
  document.getElementById("startIntro").addEventListener("click", close);
  dialog.onclose = () => {
    document.body.classList.remove("intro-open");
    try { sessionStorage.setItem("iqroqu-intro-seen", "1"); } catch (_) { /* Private mode. */ }
  };
  document.body.classList.add("intro-open");
  dialog.showModal();
  document.getElementById("startIntro").focus({ preventScroll: true });
}
