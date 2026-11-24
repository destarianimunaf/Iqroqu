// State layar, progres, favorit, XP, dan streak. Tanpa akun atau server.
const root = document.getElementById("app");
const PROGRESS_KEY = "iqro-ceria-progress-v2";
const MUSIC_KEY = "iqro-ceria-music";

let state = { view: "dashboard", category: null, jilidId: null, cardIndex: 0, quiz: null, match: null, order: null, tf: null };
const gameStepTimers = new Set();
let lessonAdvancing = false;
let lessonAdvanceId = 0;
function scheduleGameStep(callback, delay) {
  const timer = setTimeout(() => {
    gameStepTimers.delete(timer);
    callback();
  }, delay);
  gameStepTimers.add(timer);
}

// ---------------- Progress (localStorage, tanpa akun) ----------------
function loadProgress() {
  try { return JSON.parse(localStorage.getItem(PROGRESS_KEY)) || {}; }
  catch (e) { return {}; }
}
function saveProgress(p) {
  try { localStorage.setItem(PROGRESS_KEY, JSON.stringify(p)); }
  catch (e) { /* localStorage tidak tersedia */ }
}
function progKey(cat, modId) { return cat + ":" + modId; }
function getProgress(cat, modId) {
  const p = loadProgress();
  return p[progKey(cat, modId)] || { seen: [], selesai: false };
}
function getResumeCardIndex(cat, modId) {
  const mod = APP_DATA[cat].modules.find((m) => m.id === modId);
  if (!mod) return 0;
  const seen = getProgress(cat, modId).seen;
  return Math.max(0, mod.kartu.findIndex((_, i) => !seen.includes(i)));
}
function markCardSeen(cat, modId, cardIdx) {
  const p = loadProgress();
  const key = progKey(cat, modId);
  if (!p[key]) p[key] = { seen: [], selesai: false };
  const isNew = !p[key].seen.includes(cardIdx);
  if (isNew) p[key].seen.push(cardIdx);
  const mod = APP_DATA[cat].modules.find((m) => m.id === modId);
  const wasSelesai = p[key].selesai;
  if (mod && p[key].seen.length >= mod.kartu.length) p[key].selesai = true;
  saveProgress(p);
  if (isNew) addXP(2);
  if (mod && p[key].selesai && !wasSelesai) addXP(15);
}
// Cek apakah sebuah modul terkunci (belum boleh diakses) — modul pertama
// dalam kategori selalu terbuka, modul berikutnya terbuka setelah modul
// sebelumnya "selesai" (semua kartunya sudah dipelajari).
function isModuleLocked(cat, modules, index) {
  if (index === 0) return false;
  const prevMod = modules[index - 1];
  return !getProgress(cat, prevMod.id).selesai;
}

// ---------------- Favorit (tanpa akun, tersimpan di perangkat) ----------------
const FAVORIT_KEY = "iqro-ceria-favorit";
function loadFavorites() {
  try { return JSON.parse(localStorage.getItem(FAVORIT_KEY)) || []; }
  catch (e) { return []; }
}
function saveFavorites(arr) {
  try { localStorage.setItem(FAVORIT_KEY, JSON.stringify(arr)); }
  catch (e) {}
}
function isFavorite(cat, modId) { return loadFavorites().includes(cat + ":" + modId); }
function toggleFavorite(cat, modId) {
  const key = cat + ":" + modId;
  let favs = loadFavorites();
  favs = favs.includes(key) ? favs.filter((f) => f !== key) : [...favs, key];
  saveFavorites(favs);
}

// ---------------- XP & Streak (gaya Duolingo, tanpa akun) ----------------
const XP_KEY = "iqro-ceria-xp";
const STREAK_KEY = "iqro-ceria-streak";
const DAILY_XP_KEY = "iqroqu-daily-xp";
function getDailyXP() {
  try {
    const daily = JSON.parse(localStorage.getItem(DAILY_XP_KEY));
    return daily && daily.date === todayStr() ? Math.max(0, Number(daily.xp) || 0) : 0;
  } catch (e) { return 0; }
}
function getXP() {
  const v = parseInt(localStorage.getItem(XP_KEY) || "0", 10);
  return isNaN(v) ? 0 : v;
}
function addXP(amount) {
  try {
    const total = getXP() + amount;
    localStorage.setItem(XP_KEY, String(total));
    localStorage.setItem(DAILY_XP_KEY, JSON.stringify({ date: todayStr(), xp: getDailyXP() + amount }));
    bumpStreak();
  } catch (e) {}
}
function todayStr() {
  const d = new Date();
  return d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate();
}
function bumpStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "null") || { count: 0, last: null };
    const today = todayStr();
    if (data.last === today) return; // sudah dihitung hari ini
    const yest = new Date();
    yest.setDate(yest.getDate() - 1);
    const yestStr = yest.getFullYear() + "-" + (yest.getMonth() + 1) + "-" + yest.getDate();
    data.count = data.last === yestStr ? data.count + 1 : 1;
    data.last = today;
    localStorage.setItem(STREAK_KEY, JSON.stringify(data));
  } catch (e) {}
}
function getStreak() {
  try {
    const data = JSON.parse(localStorage.getItem(STREAK_KEY) || "null") || { count: 0, last: null };
    return data.count;
  } catch (e) { return 0; }
}
