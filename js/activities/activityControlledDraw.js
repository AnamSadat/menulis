// ===========================
// ACTIVITY: CONTROLLED DRAW
// Drawing within boundaries
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import { isPointInRect } from "../helpers.js";

let boundaryBox = null;
let checkInterval = null;

export function init() {
  ui.updateActivityTitle("Coretan Terkontrol");
  ui.updateModeIndicator("");
  ui.updateInstructions(
    "Cobalah menggambar di dalam kotak. Jangan sampai keluar ya!"
  );
  ui.clearActivityControls();

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

  const boxSize = size * 0.6;
  const x = (size - boxSize) / 2;
  const y = (size - boxSize) / 2;

  boundaryBox = { x, y, width: boxSize, height: boxSize };

  ctx.strokeStyle = "#6C5CE7";
  ctx.lineWidth = 3;
  ctx.setLineDash([10, 5]);
  ctx.strokeRect(x, y, boxSize, boxSize);
  ctx.setLineDash([]);
}

function startBoundaryCheck() {
  const canvas = drawing.getCanvas();
  let lastWarning = 0;

  const checkBounds = (e) => {
    if (!drawing.isDrawing) return;

    const rect = canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX - rect.left;
    const y = clientY - rect.top;

    if (
      !isPointInRect(
        x,
        y,
        boundaryBox.x,
        boundaryBox.y,
        boundaryBox.width,
        boundaryBox.height
      )
    ) {
      const now = Date.now();
      if (now - lastWarning > 1000) {
        sound.playError();
        showWarning();
        lastWarning = now;
      }
    }
  };

  canvas.addEventListener("mousemove", checkBounds);
  canvas.addEventListener("touchmove", checkBounds);
}

function showWarning() {
  const warning = document.createElement("div");
  warning.textContent = "Ups, keluar kotak!";
  warning.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: #FF4757;
        color: white;
        padding: 1rem 2rem;
        border-radius: 12px;
        font-weight: 600;
        z-index: 10000;
        animation: shake 0.5s ease-in-out;
    `;

  document.body.appendChild(warning);

  setTimeout(() => {
    warning.remove();
  }, 1000);
}

export function cleanup() {
  if (checkInterval) {
    clearInterval(checkInterval);
  }
}
