// ===========================
// ACTIVITY: CONNECT DOTS
// Connect dots to form shapes - UPDATED with dotsManager
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import dotsManager from "../dotsManager.js";
import {
  generateStarDots,
  generateHouseDots,
  generateTriangleDots,
  generateFlowerDots,
} from "../helpers.js";

let currentShape = "star";

const shapes = {
  star: { name: "Bintang", generator: generateStarDots },
  house: { name: "Rumah", generator: generateHouseDots },
  triangle: { name: "Segitiga", generator: generateTriangleDots },
  flower: { name: "Bunga", generator: generateFlowerDots },
};

export function init() {
  ui.updateActivityTitle("Menghubungkan Titik");
  ui.updateModeIndicator(shapes[currentShape].name);
  ui.updateInstructions(
    "Klik titik sesuai urutan angka untuk membentuk gambar!"
  );
  ui.clearActivityControls();

  // Add shape selection buttons
  Object.keys(shapes).forEach((shapeKey) => {
    ui.addControlButton(
      shapes[shapeKey].name,
      () => selectShape(shapeKey),
      shapeKey === currentShape
    );
  });

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Initialize with current shape
  selectShape(currentShape);
}

function selectShape(shapeKey) {
  currentShape = shapeKey;
  ui.updateModeIndicator(shapes[currentShape].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    if (index < Object.keys(shapes).length) {
      btn.classList.toggle("active", Object.keys(shapes)[index] === shapeKey);
    }
  });

  // Reset and generate new dots
  drawing.clear();
  generateDots();

  sound.playClick();
}

function generateDots() {
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);
  const centerX = size / 2;
  const centerY = size / 2;
  const shapeSize = size * 0.35;

  const dots = shapes[currentShape].generator(centerX, centerY, shapeSize);

  // Initialize dots manager
  dotsManager.init(drawing.getCanvas(), drawing.getContext());
  dotsManager.setDots(dots);
  dotsManager.drawDots();

  // Setup click handler with completion callback
  dotsManager.setupClickHandler(() => {
    ui.showSuccess(`Hebat! Kamu membentuk ${shapes[currentShape].name}!`, 3000);
  });
}

export function cleanup() {
  dotsManager.cleanup();
}
