// Atlas ilustrasi orisinal: lima kolom, lima baris. Satu WebP untuk semua ikon.
const GAME_ICONS = [
  "map", "game", "trophy", "star", "settings",
  "flame", "arrow", "play", "book", "slow",
  "repeat", "sound", "puzzle", "check", "list",
  "sheet", "lock", "heart", "close", "sun",
  "trash", "home", "rocket", "gift", "moon"
];
const GAME_ICON_ALIASES = { arrowLeft: "arrow", muted: "sound", heartEmpty: "heart", starEmpty: "star" };

// Materi lama tetap dapat memakai penanda singkat; tampilannya selalu ilustrasi,
// bukan emoji sistem operasi. Teks Arab dan atribut aksesibilitas tidak diubah.
const GAME_ICON_GLYPHS = {
  "📖": "book", "📚": "book", "📜": "sheet", "🕌": "book", "👳": "book",
  "⭐": "star", "🌟": "star", "✨": "star", "☆": "starEmpty", "★": "star", "✦": "star",
  "🏆": "trophy", "🎮": "game", "🔥": "flame", "🚀": "rocket",
  "🔒": "lock", "🎧": "sound", "🗣️": "sound", "🎵": "sound",
  "🔁": "repeat", "🔄": "repeat", "⚙️": "settings", "🗑️": "trash",
  "▶": "play", "◀": "arrowLeft", "➡️": "arrow", "⬅️": "arrowLeft",
  "✓": "check", "✔️": "check", "✅": "check", "👍": "check", "💪": "check",
  "❌": "close", "✕": "close", "✖": "close", "✗": "close", "❤️": "heart", "💛": "heart", "🤍": "heartEmpty",
  "🧩": "puzzle", "🧠": "puzzle", "🕵️": "puzzle", "🔢": "list", "📊": "list",
  "📝": "sheet", "✏️": "sheet", "❓": "gift", "ℹ️": "book", "⚡": "rocket",
  "🎉": "gift", "🤗": "heart", "🤲": "heart", "👋": "heart"
};
const GAME_ICON_PATTERN = new RegExp(Object.keys(GAME_ICON_GLYPHS).join("|"), "gu");
