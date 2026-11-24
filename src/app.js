// Titik masuk aplikasi: pilih layar, pasang tombol kembali, lalu mulai.
function render({ preserveSpeech = false } = {}) {
  lessonAdvancing = false;
  lessonAdvanceId += 1;
  // In-place game redraws may keep reading; navigation uses the default stop.
  if (!preserveSpeech) stopSpeech();
  // A pending game response must not redraw a screen the player has left.
  gameStepTimers.forEach((timer) => clearTimeout(timer));
  gameStepTimers.clear();
  root.classList.toggle("dashboard-view", state.view === "dashboard");
  root.dataset.view = state.view;
  if (state.view === "dashboard") renderDashboard();
  else if (state.view === "category-home") renderCategoryHome();
  else if (state.view === "lesson") renderLesson();
  else if (state.view === "gamehub") renderGameHub();
  else if (state.view === "quiz") renderQuiz();
  else if (state.view === "match") renderMatch();
  else if (state.view === "order") renderOrder();
  else if (state.view === "tf") renderTF();
  else if (state.view === "sheet") renderSheet();
  else if (state.view === "progres") renderProgres();
  else if (state.view === "main") renderMainPage();
  else if (state.view === "favorit") renderFavorit();
  else if (state.view === "pengaturan") renderPengaturan();
  attachGlobalHandlers();
  updateMusicPlayback();
  updateBottomNav();
}

// ---------------- Global handlers ----------------
function attachGlobalHandlers() {
  const back = document.getElementById("btnBack");
  if (back) {
    back.addEventListener("click", () => {
      if (state.view === "quiz" || state.view === "match" || state.view === "order" || state.view === "tf" || state.view === "sheet") state.view = "gamehub";
      else if (state.view === "gamehub" || state.view === "lesson") state.view = "category-home";
      else state.view = "dashboard";
      render();
    });
  }
}

render();
try {
  if (!sessionStorage.getItem("iqroqu-intro-seen")) showWelcome();
} catch (_) { showWelcome(); }
