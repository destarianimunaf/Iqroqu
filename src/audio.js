// Contoh pelafalan, suara cadangan perangkat, dan musik latar.
// Same-origin examples first; Web Speech is a fallback for other lesson material.
let arabicVoices = [];
let arabicVoiceIdx = 0;
const VOICE_IDX_KEY = "iqro-ceria-voice-idx";
function pickArabicVoice() {
  const voices = window.speechSynthesis ? window.speechSynthesis.getVoices() : [];
  const isArabic = (v) => v.lang && v.lang.toLowerCase().startsWith("ar");
  const list = voices.filter(isArabic);
  // Prioritaskan suara lokal (biasanya lebih natural) & nama-nama suara Arab yang umum bagus.
  const goodNames = /naayf|hoda|majed|tarik|laila|maged|zeina|salma|google/i;
  list.sort((a, b) => {
    const score = (v) => (v.localService ? 2 : 0) + (goodNames.test(v.name) ? 1 : 0);
    return score(b) - score(a);
  });
  arabicVoices = list;
  let saved = 0;
  try { saved = parseInt(localStorage.getItem(VOICE_IDX_KEY) || "0", 10) || 0; } catch (_) {}
  arabicVoiceIdx = list.length ? Math.max(0, Math.min(saved, list.length - 1)) : 0;
}
if (window.speechSynthesis) {
  pickArabicVoice();
  window.speechSynthesis.onvoiceschanged = pickArabicVoice;
}
function currentArabicVoice() {
  return arabicVoices.length ? arabicVoices[arabicVoiceIdx] : null;
}
function cycleArabicVoice() {
  if (arabicVoices.length < 2) {
    showAudioNote(arabicVoices.length ? "Perangkat ini punya satu suara Arab cadangan." : "Suara Arab cadangan belum tersedia. Contoh audio IqroQu tetap bisa diputar.");
    return;
  }
  arabicVoiceIdx = (arabicVoiceIdx + 1) % arabicVoices.length;
  localStorage.setItem(VOICE_IDX_KEY, String(arabicVoiceIdx));
  const v = currentArabicVoice();
  showAudioNote("Suara diganti ke: " + (v ? v.name : "default") + ". Coba dengarkan lagi ya!");
}
let activeSpeech = null;
function audioExamples(text) {
  return window.IQRO_AUDIO ? window.IQRO_AUDIO.entries[text.normalize("NFC")] : null;
}
function stopSpeech() {
  if (activeSpeech) activeSpeech();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
function speak(text, onEnd, rateOverride) {
  stopSpeech();
  let done = false;
  let audio = null;
  let timeout = null;
  let fallbackStarted = false;
  const cleanup = () => {
    clearTimeout(timeout);
    if (audio) {
      audio.onended = audio.onerror = null;
      audio.pause();
    }
  };
  const finish = () => {
    if (done) return;
    done = true;
    cleanup();
    audio = null;
    if (activeSpeech === finish) activeSpeech = null;
    if (onEnd) onEnd();
  };
  activeSpeech = finish;
  const fallback = () => {
    if (done || fallbackStarted) return;
    fallbackStarted = true;
    cleanup();
    audio = null;
    if (!window.speechSynthesis) {
      showAudioNote("Audio belum bisa diputar. Periksa koneksi lalu ketuk dengarkan lagi, ya.");
      finish();
      return;
    }
    const utter = new SpeechSynthesisUtterance(text);
    utter.lang = "ar-SA";
    const voice = currentArabicVoice();
    if (voice) { utter.voice = voice; utter.lang = voice.lang; }
    utter.rate = rateOverride || 0.72;
    utter.pitch = 1;
    utter.onend = finish;
    utter.onerror = () => {
      if (done) return;
      showAudioNote("Suara Arab belum tersedia untuk bacaan ini. Coba contoh kosakata atau huruf IqroQu, ya.");
      finish();
    };
    timeout = setTimeout(finish, Math.max(15000, text.length * 350));
    window.speechSynthesis.speak(utter);
  };
  const clips = audioExamples(text);
  if (!clips || typeof Audio === "undefined") { fallback(); return; }
  let index = 0;
  let attempts = 0;
  let mediaAttempt = 0;
  const next = (retry = false) => {
    if (done) return;
    cleanup();
    if (index >= clips.length) { finish(); return; }
    // Safari grants playback to a media element, not to the entire page.
    // Keep the element unlocked by the tap when moving between syllables.
    if (!audio) audio = new Audio();
    const attempt = ++mediaAttempt;
    const clip = clips[index];
    audio.preload = "auto";
    audio.src = clip + (retry ? (clip.includes("?") ? "&" : "?") + "retry=1" : "");
    audio.playbackRate = rateOverride ? 0.7 : 1;
    audio.preservesPitch = true;
    audio.onended = () => {
      if (done || attempt !== mediaAttempt) return;
      index += 1;
      attempts = 0;
      next();
    };
    const failed = () => {
      if (done || attempt !== mediaAttempt) return;
      mediaAttempt += 1;
      if (attempts++ === 0) {
        showAudioNote("Sedang memuat ulang contoh suara, sebentar ya…");
        next(true);
        return;
      }
      showAudioNote("Contoh audio belum termuat. Mencoba suara Arab perangkatmu.");
      fallback();
    };
    audio.onerror = failed;
    timeout = setTimeout(failed, 10000);
    audio.play().catch((error) => {
      if (done || attempt !== mediaAttempt) return;
      if (error.name === "NotAllowedError") { showAudioNote("Ketuk dengarkan sekali lagi untuk mengaktifkan suara."); finish(); }
      else failed();
    });
  };
  next();
}
let audioNoteTimer = null;
function showAudioNote(msg) {
  const el = document.getElementById("audioNote");
  if (!el) return;
  el.textContent = msg;
  el.classList.remove("hidden");
  clearTimeout(audioNoteTimer);
  audioNoteTimer = setTimeout(() => el.classList.add("hidden"), 4500);
}

// ---------------- Musik latar ringan (Web Audio, tanpa file audio) ----------------
let musicOn = localStorage.getItem(MUSIC_KEY) !== "off";
let audioCtx = null;
let musicMaster = null;
let musicTimer = null;
function ensureCtx() {
  if (!audioCtx) {
    const Ctx = window.AudioContext || window.webkitAudioContext;
    if (!Ctx) return null;
    audioCtx = new Ctx();
  }
  return audioCtx;
}
function startMusic() {
  if (!musicOn || musicTimer) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  if (ctx.state === "suspended") ctx.resume();
  musicMaster = ctx.createGain();
  musicMaster.gain.value = 0.05;
  musicMaster.connect(ctx.destination);
  const notes = [261.63, 293.66, 329.63, 392.0, 440.0, 392.0, 329.63, 293.66]; // pentatonis lembut
  let step = 0;
  musicTimer = setInterval(() => {
    if (!musicOn || !audioCtx) return;
    const freq = notes[step % notes.length];
    const o = audioCtx.createOscillator();
    const g = audioCtx.createGain();
    o.type = "sine";
    o.frequency.value = freq;
    g.gain.setValueAtTime(0, audioCtx.currentTime);
    g.gain.linearRampToValueAtTime(0.7, audioCtx.currentTime + 0.08);
    g.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 1.3);
    o.connect(g);
    g.connect(musicMaster);
    o.start();
    o.stop(audioCtx.currentTime + 1.4);
    step++;
  }, 780);
}
function stopMusic() {
  if (musicTimer) { clearInterval(musicTimer); musicTimer = null; }
  if (musicMaster) { try { musicMaster.disconnect(); } catch (e) {} musicMaster = null; }
}
function updateMusicPlayback() {
  if (state.view === "dashboard") startMusic();
  else stopMusic();
}
function updateMusicBtn() {
  const btn = document.getElementById("musicBtn");
  if (!btn) return;
  btn.innerHTML = gameIcon(musicOn ? "sound" : "muted");
  btn.setAttribute("aria-pressed", String(musicOn));
  btn.setAttribute("aria-label", musicOn ? "Matikan musik" : "Nyalakan musik");
  btn.classList.toggle("muted", !musicOn);
}
document.getElementById("musicBtn").addEventListener("click", () => {
  musicOn = !musicOn;
  localStorage.setItem(MUSIC_KEY, musicOn ? "on" : "off");
  updateMusicBtn();
  if (musicOn) updateMusicPlayback(); else stopMusic();
});
updateMusicBtn();
// beberapa browser memblokir autoplay audio sebelum ada interaksi pengguna;
// begitu pengguna menyentuh layar pertama kali, coba lanjutkan musik dashboard.
document.addEventListener("pointerdown", function resumeOnce() {
  const ctx = ensureCtx();
  if (ctx && ctx.state === "suspended") ctx.resume();
  updateMusicPlayback();
  document.removeEventListener("pointerdown", resumeOnce);
}, { once: true });
