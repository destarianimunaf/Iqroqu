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
let speechPlayer = null;
let speechPlayerVersion = 0;
function getSpeechPlayer() {
  if (!speechPlayer && typeof Audio !== "undefined") speechPlayer = new Audio();
  return speechPlayer;
}
function primeSpeech() {
  // Unlock the same player during Aku bisa's tap, before the visual transition.
  // This tiny, silent clip avoids starting the next word behind the old card.
  const player = getSpeechPlayer();
  if (!player) return;
  const version = ++speechPlayerVersion;
  player.src = "assets/audio/unlock.wav";
  player.play().then(() => {
    if (version === speechPlayerVersion) player.pause();
  }).catch(() => {}); // A blocked device still has the visible speaker retry.
}
function audioExamples(text) {
  const recording = audioRecording(text);
  if (recording) return [recording.clip];
  return window.IQRO_AUDIO ? window.IQRO_AUDIO.entries[text.normalize("NFC")] : null;
}
function audioRecording(text) {
  return window.IQRO_RECORDINGS ? window.IQRO_RECORDINGS.entries[text.normalize("NFC")] : null;
}
function audioSourceLabel(text) {
  const recording = audioRecording(text);
  if (recording) return `Rekaman ${recording.reciter} · ${recording.provider}${recording.prefixedBasmala ? " · Diawali basmalah" : ""}`;
  const clips = audioExamples(text);
  if (clips && clips.every((clip) => clip.includes("/letter-"))) return "Rekaman manusia · Latihan huruf berharakat";
  return `${clips ? "Suara sintetis Arab" : "Suara Arab perangkat"} · Bukan acuan tajwid`;
}
function audioSourceDescription(text) {
  const recording = audioRecording(text);
  if (recording) return `${audioSourceLabel(text)}. Sumber: ${recording.reference}.${recording.provider === "OpenDua" ? " Hisn al-Muslim; lisensi CC BY 4.0 (opendua.org)." : " Rekaman asli pada kecepatan normal."}`;
  return `${audioSourceLabel(text)}. Untuk panjang-pendek, makhraj, dan tajwid, tetap ikuti bimbingan guru. Rekaman manusia yang cocok belum tersedia untuk semua materi.`;
}
function playLessonAudio(text, rate) {
  const speaker = document.getElementById("btnSpeak");
  if (!speaker) return;
  stopSpeech();
  speaker.classList.add("speaking");
  speak(text, () => speaker.classList.remove("speaking"), rate);
}
function stopSpeech() {
  speechPlayerVersion += 1;
  if (activeSpeech) activeSpeech();
  if (speechPlayer) speechPlayer.pause();
  if (window.speechSynthesis) window.speechSynthesis.cancel();
}
function speak(text, onEnd, rateOverride) {
  stopSpeech();
  const requestVersion = speechPlayerVersion;
  const recording = audioRecording(text);
  let done = false;
  let audio = null;
  let timeout = null;
  let fallbackStarted = false;
  const cleanup = () => {
    clearTimeout(timeout);
    if (audio) {
      audio.onended = audio.onerror = audio.onplaying = audio.onwaiting = null;
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
    if (!audio) audio = getSpeechPlayer();
    const attempt = ++mediaAttempt;
    const clip = clips[index];
    audio.preload = "auto";
    const source = recording && attempts === 2 ? recording.remote : clip;
    audio.src = source + (retry ? (source.includes("?") ? "&" : "?") + "retry=1" : "");
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
      if (attempts < (recording ? 2 : 1)) {
        attempts += 1;
        showAudioNote("Sedang memuat ulang contoh suara, sebentar ya…");
        next(attempts === 1);
        return;
      }
      if (recording) {
        // Never silently replace a qari with device TTS after a network failure.
        finish();
        showAudioRetry("Rekaman belum termuat. Periksa koneksi, lalu coba lagi.", () => {
          if (requestVersion === speechPlayerVersion) speak(text, onEnd, rateOverride);
        });
        return;
      }
      showAudioNote("Contoh audio belum termuat. Mencoba suara Arab perangkatmu.");
      fallback();
    };
    audio.onerror = failed;
    audio.onplaying = () => {
      if (done || attempt !== mediaAttempt) return;
      // A prayer can run well past ten seconds. Guard loading separately from
      // playback so healthy long clips are not mistaken for stalled downloads.
      clearTimeout(timeout);
      const duration = Number.isFinite(audio.duration) ? audio.duration : Math.max(10, text.length * 0.2);
      timeout = setTimeout(failed, Math.max(10000, duration * 1000 / audio.playbackRate + 5000));
    };
    audio.onwaiting = () => {
      if (done || attempt !== mediaAttempt) return;
      clearTimeout(timeout);
      timeout = setTimeout(failed, 10000);
    };
    timeout = setTimeout(failed, 10000);
    audio.play().catch((error) => {
      if (done || attempt !== mediaAttempt) return;
      if (error.name === "NotAllowedError") {
        finish();
        showAudioRetry("Browser meminta satu ketukan untuk mengaktifkan suara.", () => {
          if (requestVersion === speechPlayerVersion) speak(text, onEnd, rateOverride);
        });
      }
      else failed();
    });
  };
  next();
}
let audioNoteTimer = null;
function showAudioRetry(message, retry) {
  const el = document.getElementById("audioNote");
  if (!el) return;
  clearTimeout(audioNoteTimer);
  el.innerHTML = '<p id="audioFailureText" role="status"></p><button class="btn btn-secondary" id="audioRetry">Aktifkan suara</button>';
  document.getElementById("audioFailureText").textContent = message;
  el.classList.remove("hidden");
  document.getElementById("audioRetry").addEventListener("click", () => {
    el.classList.add("hidden");
    retry();
  });
}
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
