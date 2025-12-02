// ===========================
// ACTIVITY: CURVED LINES
// Practice drawing curved lines
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";

let currentMode = "wave";

const modes = {
  wave: { name: "Gelombang" },
  spiral: { name: "Spiral" },
  curve: { name: "Lengkung" },
  smooth: { name: "Smooth" },
};

export function init() {
  ui.updateActivityTitle("Garis Melengkung");
  ui.updateModeIndicator(modes[currentMode].name);
  ui.updateInstructions("Ikuti pola garis lengkung dengan hati-hati!");
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

  // Initialize with current mode (this will clear and draw guide curves)
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
  drawGuideCurves();

  sound.playClick();
}

function drawGuideCurves() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  if (currentMode === "wave") {
    // Draw wave patterns
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);

      for (let x = 50; x < size - 50; x += 20) {
        const waveY = y + Math.sin((x - 50) / 30) * 30;
        ctx.lineTo(x, waveY);
      }
      ctx.stroke();
    }
  } else if (currentMode === "spiral") {
    // Draw spiral
    const centerX = size / 2;
    const centerY = size / 2;
    ctx.beginPath();

    for (let angle = 0; angle < Math.PI * 6; angle += 0.1) {
      const radius = angle * 10;
      const x = centerX + Math.cos(angle) * radius;
      const y = centerY + Math.sin(angle) * radius;

      if (angle === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    }
    ctx.stroke();
  } else if (currentMode === "curve") {
    // Draw S-curves
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.bezierCurveTo(size / 3, y - 50, (size * 2) / 3, y + 50, size - 50, y);
      ctx.stroke();
    }
  } else if (currentMode === "smooth") {
    // Draw smooth curves
    for (let row = 0; row < 3; row++) {
      const y = size / 4 + row * (size / 4);
      ctx.beginPath();
      ctx.moveTo(50, y);
      ctx.quadraticCurveTo(size / 2, y - 40, size - 50, y);
      ctx.stroke();
    }
  }

  ctx.setLineDash([]);
}

function checkResult() {
  sound.playComplete();
  ui.showSuccess("Hebat! Garis lengkungmu sangat bagus!", 3000);
}

export function cleanup() {
  // No special cleanup needed
}
