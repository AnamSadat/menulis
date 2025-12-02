// ===========================
// ACTIVITY: CONTROLLED DRAW
// Drawing within boundaries - FIXED: Better boundary detection
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import { isPointInRect, getCanvasCoordinates } from "../helpers.js";

let boundaryBox = null;
let checkInterval = null;
let lastWarning = 0;

export function init() {
  ui.updateActivityTitle("Coretan Terkontrol");
  ui.updateModeIndicator("");
  ui.updateInstructions(
    "Cobalah menggambar di dalam kotak. Jangan sampai keluar ya!"
  );
  ui.clearActivityControls();

  // Add next button
  ui.addControlButton("Lanjut ▶", () => {
    if (window.app && window.app.nextActivity) {
      window.app.nextActivity();
    }
  });

  // Clear and prepare canvas
  drawing.clear();

  // Draw boundary box
  drawBoundaryBox();

  // Start checking for out of bounds
  startBoundaryCheck();
}

function drawBoundaryBox() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  const boxSize = size * 0.7;
  const x = (size - boxSize) / 2;
  const y = (size - boxSize) / 2;

  boundaryBox = { x, y, width: boxSize, height: boxSize };

  // Draw target zone
  ctx.strokeStyle = "#6C5CE7";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.strokeRect(x, y, boxSize, boxSize);
  ctx.setLineDash([]);

  // Add label
  ctx.fillStyle = "#6C5CE7";
  ctx.font = "bold 16px Poppins";
  ctx.textAlign = "center";
  ctx.fillText("Zona Latihan", size / 2, y - 15);
}

function startBoundaryCheck() {
  const canvas = drawing.getCanvas();

  const checkBounds = (e) => {
    // Only check when actually drawing
    if (!drawing.isDrawing) return;

    const coords = getCanvasCoordinates(canvas, e);

    // Check if drawing is outside the boundary box
    if (
      !isPointInRect(
        coords.x,
        coords.y,
        boundaryBox.x,
        boundaryBox.y,
        boundaryBox.width,
        boundaryBox.height
      )
    ) {
      const now = Date.now();
      if (now - lastWarning > 1100) {
        // Throttle warnings
        sound.playError();
        showWarning(coords.x, coords.y);
        lastWarning = now;
      }
    }
  };

  canvas.addEventListener("mousemove", checkBounds);
  canvas.addEventListener("touchmove", checkBounds);
}

function showWarning(x, y) {
  const warning = document.createElement("div");
  warning.textContent = "Ups, keluar kotak!";
  warning.style.cssText = `
        position: fixed;
        left: 50%;
        top: 20%;
        transform: translateX(-50%);
        background: #FF4757;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: shake 0.5s ease-in-out, fadeOut 1s ease-out 0.5s forwards;
        box-shadow: 0 4px 12px rgba(255, 71, 87, 0.3);
    `;

  document.body.appendChild(warning);

  setTimeout(() => {
    warning.remove();
  }, 1500);
}

export function cleanup() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
}
