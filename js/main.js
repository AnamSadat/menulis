// ===========================
// MAIN APPLICATION
// Entry point and initialization
// ===========================

import state from "./stateManager.js";
import ui from "./uiManager.js";
import sound from "./soundManager.js";
import drawing from "./drawingTools.js";

// Import activities
import * as activityFreeDraw from "./activities/activityFreeDraw.js";
import * as activityControlledDraw from "./activities/activityControlledDraw.js";
import * as activityConnectDots from "./activities/activityConnectDots.js";
import * as activityConnectRandomDots from "./activities/activityConnectRandomDots.js";
import * as activityStraightLines from "./activities/activityStraightLines.js";
import * as activityCurvedLines from "./activities/activityCurvedLines.js";
import * as activitySimplePatterns from "./activities/activitySimplePatterns.js";
import * as activityBoldLetters from "./activities/activityBoldLetters.js";
import * as activityEvaluationGame from "./activities/activityEvaluationGame.js";

// Activity registry
const activities = {
  freeDraw: activityFreeDraw,
  controlledDraw: activityControlledDraw,
  connectDots: activityConnectDots,
  connectRandomDots: activityConnectRandomDots,
  straightLines: activityStraightLines,
  curvedLines: activityCurvedLines,
  simplePatterns: activitySimplePatterns,
  boldLetters: activityBoldLetters,
  evaluationGame: activityEvaluationGame,
};

let currentActivity = null;

// Initialize application
function init() {
  console.log("🎨 Ruang Latihan Menulis - Initializing...");

  // Setup event listeners
  setupWelcomeScreen();
  setupMenuScreen();
  setupActivityScreen();
  setupSettings();
  setupModals();
  setupToolbar();

  // Initialize canvas
  const canvas = document.getElementById("drawingCanvas");
  if (canvas) {
    drawing.init(canvas);

    // Handle window resize
    window.addEventListener("resize", () => {
      drawing.resizeCanvas();
      if (currentActivity && activities[currentActivity]) {
        // Reinitialize current activity on resize
        activities[currentActivity].init();
      }
    });
  }

  // Resume audio context on first user interaction
  document.addEventListener(
    "click",
    () => {
      sound.resume();
    },
    { once: true }
  );

  console.log("✅ Application initialized successfully!");
}

// Setup welcome screen
function setupWelcomeScreen() {
  const startBtn = document.getElementById("startBtn");
  const userNameInput = document.getElementById("userName");
  const settingsBtn = document.getElementById("settingsBtn");
  const guideBtn = document.getElementById("guideBtn");

  // Start button
  startBtn.addEventListener("click", () => {
    const name = userNameInput.value.trim();

    if (name) {
      state.set("userName", name);
      ui.updateGreeting();
      ui.showScreen("menu");
      sound.playClick();
    } else {
      userNameInput.focus();
      userNameInput.classList.add("animate-shake");
      setTimeout(() => {
        userNameInput.classList.remove("animate-shake");
      }, 500);
    }
  });

  // Enter key on input
  userNameInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
      startBtn.click();
    }
  });

  // Settings button
  settingsBtn.addEventListener("click", () => {
    ui.showModal("settingsModal");
    sound.playClick();
  });

  // Guide button
  guideBtn.addEventListener("click", () => {
    ui.showModal("guideModal");
    sound.playClick();
  });

  // Load saved name if exists
  const savedName = state.get("userName");
  if (savedName) {
    userNameInput.value = savedName;
  }
}

// Setup menu screen
function setupMenuScreen() {
  const activityCards = document.querySelectorAll(".activity-card");

  activityCards.forEach((card) => {
    card.addEventListener("click", () => {
      const activityName = card.dataset.activity;
      startActivity(activityName);
    });
  });
}

// Setup activity screen
function setupActivityScreen() {
  const backBtn = document.getElementById("backToMenuBtn");

  backBtn.addEventListener("click", () => {
    // Cleanup current activity
    if (currentActivity && activities[currentActivity]?.cleanup) {
      activities[currentActivity].cleanup();
    }

    currentActivity = null;
    ui.showScreen("menu");
    sound.playClick();
  });
}

// Setup settings
function setupSettings() {
  const soundToggle = document.getElementById("soundToggle");
  const volumeSlider = document.getElementById("volumeSlider");
  const volumeValue = document.getElementById("volumeValue");
  const languageSelect = document.getElementById("languageSelect");

  // Load saved settings
  soundToggle.checked = state.get("soundEnabled");
  volumeSlider.value = state.get("volume");
  volumeValue.textContent = state.get("volume") + "%";
  languageSelect.value = state.get("language");

  // Sound toggle
  soundToggle.addEventListener("change", (e) => {
    sound.toggleSound(e.target.checked);
    if (e.target.checked) {
      sound.playClick();
    }
  });

  // Volume slider
  volumeSlider.addEventListener("input", (e) => {
    const volume = e.target.value;
    volumeValue.textContent = volume + "%";
    sound.setVolume(volume);
  });

  // Language select
  languageSelect.addEventListener("change", (e) => {
    state.set("language", e.target.value);
    sound.playClick();
  });
}

// Setup modals
function setupModals() {
  const modalCloseButtons = document.querySelectorAll(".modal-close");
  const modals = document.querySelectorAll(".modal");

  // Close buttons
  modalCloseButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      ui.hideModal(modalId);
      sound.playClick();
    });
  });

  // Save buttons in modals
  const saveButtons = document.querySelectorAll(".modal-footer .btn-primary");
  saveButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const modalId = btn.dataset.modal;
      if (modalId) {
        ui.hideModal(modalId);
        sound.playClick();
      }
    });
  });

  // Click outside to close
  modals.forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) {
        modal.classList.remove("active");
        sound.playClick();
      }
    });
  });
}

// Setup toolbar
function setupToolbar() {
  // Size buttons
  const sizeButtons = document.querySelectorAll(".size-btn");
  sizeButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const size = btn.dataset.size;
      drawing.setBrushSize(size);

      // Update active state
      sizeButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      sound.playClick();
    });
  });

  // Color buttons
  const colorButtons = document.querySelectorAll(".color-btn");
  colorButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
      const color = btn.dataset.color;
      drawing.setBrushColor(color);
      drawing.setEraser(false);

      // Update active state
      colorButtons.forEach((b) => b.classList.remove("active"));
      btn.classList.add("active");

      // Deactivate eraser
      const eraserBtn = document.getElementById("eraserBtn");
      eraserBtn.classList.remove("active");

      sound.playClick();
    });
  });

  // Eraser button
  const eraserBtn = document.getElementById("eraserBtn");
  eraserBtn.addEventListener("click", () => {
    const isEraser = drawing.toggleEraser();
    eraserBtn.classList.toggle("active", isEraser);

    // Deactivate color buttons
    if (isEraser) {
      colorButtons.forEach((b) => b.classList.remove("active"));
    }

    sound.playClick();
  });

  // Reset button
  const resetBtn = document.getElementById("resetBtn");
  resetBtn.addEventListener("click", () => {
    ui.showConfirm(
      "Apakah kamu yakin ingin menghapus semua coretan?",
      () => {
        drawing.clear();

        // Reinitialize current activity
        if (currentActivity && activities[currentActivity]) {
          activities[currentActivity].init();
        }

        sound.playClick();
      },
      () => {
        sound.playClick();
      }
    );
  });
}

// Start an activity
function startActivity(activityName) {
  if (!activities[activityName]) {
    console.error("Activity not found:", activityName);
    return;
  }

  // Cleanup previous activity
  if (currentActivity && activities[currentActivity]?.cleanup) {
    activities[currentActivity].cleanup();
  }

  // Set current activity
  currentActivity = activityName;
  state.set("currentActivity", activityName);

  // Show activity screen
  ui.showScreen("activity");

  // Initialize activity
  setTimeout(() => {
    activities[activityName].init();
    sound.playClick();
  }, 100);
}

// Start application when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}

// LEARNING FLOW SYSTEM
const activityOrder = [
  "freeDraw",
  "controlledDraw",
  "connectDots",
  "connectRandomDots",
  "straightLines",
  "curvedLines",
  "simplePatterns",
  "boldLetters",
  "evaluationGame",
];

// Get current activity index
function getCurrentActivityIndex() {
  return activityOrder.indexOf(currentActivity);
}

// Go to next activity in learning flow
function nextActivity() {
  const currentIndex = getCurrentActivityIndex();
  if (currentIndex < activityOrder.length - 1) {
    const nextActivityName = activityOrder[currentIndex + 1];
    startActivity(nextActivityName);
    sound.playSuccess();
  } else {
    // Completed all activities!
    ui.showSuccess(
      "Selamat! Kamu telah menyelesaikan semua kegiatan! 🎉",
      3000
    );
    sound.playComplete();
    setTimeout(() => {
      ui.showScreen("menu");
    }, 3000);
  }
}

// Go to previous activity
function previousActivity() {
  const currentIndex = getCurrentActivityIndex();
  if (currentIndex > 0) {
    const prevActivityName = activityOrder[currentIndex - 1];
    startActivity(prevActivityName);
    sound.playClick();
  }
}

// Export for debugging
window.app = {
  state,
  ui,
  sound,
  drawing,
  activities,
  startActivity,
  nextActivity,
  previousActivity,
  activityOrder,
};
