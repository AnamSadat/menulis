// ===========================
// ACTIVITY: STRAIGHT LINES
// Practice drawing straight lines
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";

let currentMode = "horizontal";
let guideLines = [];

const modes = {
  horizontal: { name: "Horizontal", count: 3 },
  vertical: { name: "Vertikal", count: 3 },
  diagonal: { name: "Diagonal", count: 3 },
  mixed: { name: "Campuran", count: 4 },
};

export function init() {
  ui.updateActivityTitle("Garis Lurus");
  ui.updateModeIndicator(modes[currentMode].name);
  ui.updateInstructions(
    "Ikuti garis panduan dengan marker. Usahakan tetap lurus!"
  );
  ui.clearActivityControls();

  // Add mode selection buttons
  Object.keys(modes).forEach((modeKey) => {
    ui.addControlButton(
      modes[modeKey].name,
      () => selectMode(modeKey),
      modeKey === currentMode
    );
  });

  // Add check button
  ui.addControlButton("Cek Hasil", checkResult);

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Initialize with current mode (this will clear and draw guide lines)
  selectMode(currentMode);
}

function selectMode(modeKey) {
  currentMode = modeKey;
  ui.updateModeIndicator(modes[currentMode].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    if (index < Object.keys(modes).length) {
      btn.classList.toggle("active", Object.keys(modes)[index] === modeKey);
    }
  });

  // Reset and draw guide lines
  drawing.clear();
  drawGuideLines();

  sound.playClick();
}

function drawGuideLines() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  guideLines = [];
  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  const count = modes[currentMode].count;
  const spacing = size / (count + 1);

  if (currentMode === "horizontal") {
    for (let i = 1; i <= count; i++) {
      const y = spacing * i;
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.lineTo(size - 50, y);
      ctx.stroke();
      guideLines.push({ x1: 50, y1: y, x2: size - 50, y2: y });
    }
  } else if (currentMode === "vertical") {
    for (let i = 1; i <= count; i++) {
      const x = spacing * i;
      ctx.beginPath();
      ctx.moveTo(x, 50);
      ctx.lineTo(x, size - 50);
      ctx.stroke();
      guideLines.push({ x1: x, y1: 50, x2: x, y2: size - 50 });
    }
  } else if (currentMode === "diagonal") {
    for (let i = 1; i <= count; i++) {
      const offset = (i - 1) * 60;
      ctx.beginPath();
      ctx.moveTo(50 + offset, 50);
      ctx.lineTo(size - 50 - offset, size - 50);
      ctx.stroke();
      guideLines.push({
        x1: 50 + offset,
        y1: 50,
        x2: size - 50 - offset,
        y2: size - 50,
      });
    }
  } else if (currentMode === "mixed") {
    // Horizontal
    ctx.beginPath();
    ctx.moveTo(50, size / 3);
    ctx.lineTo(size - 50, size / 3);
    ctx.stroke();
    guideLines.push({ x1: 50, y1: size / 3, x2: size - 50, y2: size / 3 });

    // Vertical
    ctx.beginPath();
    ctx.moveTo(size / 2, 50);
    ctx.lineTo(size / 2, size - 50);
    ctx.stroke();
    guideLines.push({ x1: size / 2, y1: 50, x2: size / 2, y2: size - 50 });

    // Diagonal 1
    ctx.beginPath();
    ctx.moveTo(50, 50);
    ctx.lineTo(size - 50, size - 50);
    ctx.stroke();
    guideLines.push({ x1: 50, y1: 50, x2: size - 50, y2: size - 50 });

    // Diagonal 2
    ctx.beginPath();
    ctx.moveTo(size - 50, 50);
    ctx.lineTo(50, size - 50);
    ctx.stroke();
    guideLines.push({ x1: size - 50, y1: 50, x2: 50, y2: size - 50 });
  }

  ctx.setLineDash([]);
}

function checkResult() {
  // Simple check: just show success message
  // In a more advanced version, you could analyze the drawn lines
  sound.playComplete();
  ui.showSuccess("Bagus! Garis-garismu sudah cukup lurus!", 3000);
}

export function cleanup() {
  guideLines = [];
}
