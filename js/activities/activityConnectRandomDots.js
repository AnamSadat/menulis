// ===========================
// ACTIVITY: CONNECT RANDOM DOTS
// Connect randomly placed dots
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import dotsManager from "../dotsManager.js";
import {
  generateRandomNumberDots,
  generateRandomLetterDots,
} from "../helpers.js";

let currentMode = "numbers";

const modes = {
  numbers: { name: "Angka", count: 10 },
  letters: { name: "Huruf", count: 8 },
};

export function init() {
  ui.updateActivityTitle("Menghubungkan Titik Acak");
  ui.updateModeIndicator(modes[currentMode].name);
  ui.updateInstructions("Hubungkan titik sesuai urutan angka atau huruf!");
  ui.clearActivityControls();

  // Add mode selection buttons
  Object.keys(modes).forEach((modeKey) => {
    ui.addControlButton(
      modes[modeKey].name,
      () => selectMode(modeKey),
      modeKey === currentMode
    );
  });

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Clear and prepare canvas
  drawing.clear();
  // Initialize with current mode
  selectMode(currentMode);
}

function selectMode(modeKey) {
  currentMode = modeKey;
  ui.updateModeIndicator(modes[currentMode].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", Object.keys(modes)[index] === modeKey);
  });

  // Reset and generate new dots
  generateDots();

  sound.playClick();
}

function generateDots() {
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  let dots = [];
  if (currentMode === "numbers") {
    dots = generateRandomNumberDots(modes.numbers.count, size, size);
  } else {
    dots = generateRandomLetterDots(modes.letters.count, size, size);
  }

  // Clear canvas
  drawing.clear();

  // Initialize dots manager
  dotsManager.init(drawing.getCanvas(), drawing.getContext());
  dotsManager.setDots(dots);
  dotsManager.drawDots();

  // Setup click handler with completion callback
  dotsManager.setupClickHandler(() => {
    ui.showSuccess("Sempurna! Semua titik terhubung!", 3000);
  });
}

export function cleanup() {
  dotsManager.cleanup();
}
