// ===========================
// ACTIVITY: SIMPLE PATTERNS
// Practice drawing repeating patterns
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";

let currentPattern = "dots";

const patterns = {
  dots: { name: "Titik-titik" },
  waves: { name: "Gelombang" },
  zigzag: { name: "Zigzag" },
  circles: { name: "Lingkaran" },
  squares: { name: "Kotak" },
};

export function init() {
  ui.updateActivityTitle("Pola Sederhana");
  ui.updateModeIndicator(patterns[currentPattern].name);
  ui.updateInstructions("Ikuti dan ulangi pola yang ditampilkan!");
  ui.clearActivityControls();

  // Add pattern selection buttons
  Object.keys(patterns).forEach((patternKey) => {
    ui.addControlButton(
      patterns[patternKey].name,
      () => selectPattern(patternKey),
      patternKey === currentPattern
    );
  });

  // Add check button
  ui.addControlButton("Cek Hasil", checkResult);

  // Initialize with current pattern
  selectPattern(currentPattern);

  // Add next button for learning flow
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Clear and prepare canvas
  drawing.clear();
}

function selectPattern(patternKey) {
  currentPattern = patternKey;
  ui.updateModeIndicator(patterns[currentPattern].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    if (index < Object.keys(patterns).length) {
      btn.classList.toggle(
        "active",
        Object.keys(patterns)[index] === patternKey
      );
    }
  });

  // Reset and draw pattern guide
  drawing.clear();
  drawPatternGuide();

  sound.playClick();
}

function drawPatternGuide() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.fillStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  const rows = 4;
  const rowHeight = size / (rows + 1);

  for (let row = 0; row < rows; row++) {
    const y = rowHeight * (row + 1);

    // Draw row indicator
    ctx.fillStyle =
      row === 0 ? "rgba(255, 165, 2, 0.5)" : "rgba(108, 92, 231, 0.2)";
    ctx.fillRect(20, y - 30, size - 40, 60);

    if (row === 0) {
      // First row: show example pattern
      drawPattern(ctx, currentPattern, 50, y, size - 100, true);

      // Add text
      ctx.fillStyle = "#6C5CE7";
      ctx.font = "bold 14px Poppins";
      ctx.textAlign = "left";
      ctx.fillText("Contoh:", 30, y - 40);
    } else {
      // Other rows: practice area
      ctx.strokeStyle = "rgba(108, 92, 231, 0.2)";
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(50, y - 25, size - 100, 50);

      ctx.fillStyle = "#999";
      ctx.font = "12px Poppins";
      ctx.textAlign = "left";
      ctx.fillText(`Baris ${row}:`, 30, y - 30);
    }
  }

  ctx.setLineDash([]);
}

function drawPattern(ctx, pattern, x, y, width, isGuide = false) {
  const spacing = 40;
  const count = Math.floor(width / spacing);

  ctx.strokeStyle = isGuide ? "rgba(108, 92, 231, 0.5)" : "#6C5CE7";
  ctx.fillStyle = isGuide ? "rgba(108, 92, 231, 0.5)" : "#6C5CE7";
  ctx.lineWidth = 2;

  if (pattern === "dots") {
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.arc(x + i * spacing, y, 5, 0, Math.PI * 2);
      ctx.fill();
    }
  } else if (pattern === "waves") {
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < count; i++) {
      const waveX = x + i * spacing;
      const waveY = y + (i % 2 === 0 ? -15 : 15);
      ctx.lineTo(waveX, waveY);
    }
    ctx.stroke();
  } else if (pattern === "zigzag") {
    ctx.beginPath();
    ctx.moveTo(x, y);
    for (let i = 0; i < count; i++) {
      const zigX = x + i * spacing;
      const zigY = y + (i % 2 === 0 ? -20 : 20);
      ctx.lineTo(zigX, zigY);
    }
    ctx.stroke();
  } else if (pattern === "circles") {
    for (let i = 0; i < count; i++) {
      ctx.beginPath();
      ctx.arc(x + i * spacing, y, 12, 0, Math.PI * 2);
      ctx.stroke();
    }
  } else if (pattern === "squares") {
    for (let i = 0; i < count; i++) {
      ctx.strokeRect(x + i * spacing - 10, y - 10, 20, 20);
    }
  }
}

function checkResult() {
  sound.playComplete();
  ui.showSuccess("Bagus sekali! Polamu sudah rapi!", 3000);
}

export function cleanup() {
  // No special cleanup needed
}
