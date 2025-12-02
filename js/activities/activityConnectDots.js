// ===========================
// ACTIVITY: CONNECT DOTS
// Connect dots to form shapes
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import {
  generateStarDots,
  generateHouseDots,
  generateTriangleDots,
  generateFlowerDots,
  distance,
} from "../helpers.js";

let currentShape = "star";
let dots = [];
let connectedDots = [];
let currentDotIndex = 0;

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
    "Hubungkan titik-titik sesuai urutan angka untuk membentuk gambar!"
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

  // Initialize with current shape
  selectShape(currentShape);
}

function selectShape(shapeKey) {
  currentShape = shapeKey;
  ui.updateModeIndicator(shapes[currentShape].name);

  // Update button states
  const buttons = document.querySelectorAll("#activityControls .control-btn");
  buttons.forEach((btn, index) => {
    btn.classList.toggle("active", Object.keys(shapes)[index] === shapeKey);
  });

  // Reset and generate new dots
  resetDots();
  generateDots();
  drawDots();

  sound.playClick();
}

function resetDots() {
  dots = [];
  connectedDots = [];
  currentDotIndex = 0;
  drawing.clear();
}

function generateDots() {
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);
  const centerX = size / 2;
  const centerY = size / 2;
  const shapeSize = size * 0.4;

  dots = shapes[currentShape].generator(centerX, centerY, shapeSize);
}

function drawDots() {
  const ctx = drawing.getContext();

  dots.forEach((dot, index) => {
    const isConnected = connectedDots.includes(index);
    const isNext = index === currentDotIndex;

    // Draw dot
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, isNext ? 12 : 8, 0, Math.PI * 2);
    ctx.fillStyle = isConnected ? "#00B894" : isNext ? "#FFA502" : "#6C5CE7";
    ctx.fill();

    // Draw number
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dot.number, dot.x, dot.y);
  });
}

// Setup canvas click/touch handler
function setupDotConnection() {
  const canvas = drawing.getCanvas();

  const handleClick = (e) => {
    e.preventDefault();

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

    checkDotConnection(x, y);
  };

  canvas.addEventListener("click", handleClick);
  canvas.addEventListener("touchend", handleClick);
}

function checkDotConnection(x, y) {
  if (currentDotIndex >= dots.length) return;

  const currentDot = dots[currentDotIndex];
  const dist = distance(x, y, currentDot.x, currentDot.y);

  if (dist < 20) {
    // Correct dot clicked
    connectedDots.push(currentDotIndex);

    // Draw line from previous dot
    if (currentDotIndex > 0) {
      const prevDot = dots[currentDotIndex - 1];
      const ctx = drawing.getContext();
      ctx.beginPath();
      ctx.moveTo(prevDot.x, prevDot.y);
      ctx.lineTo(currentDot.x, currentDot.y);
      ctx.strokeStyle = "#00B894";
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    currentDotIndex++;
    sound.playSuccess();

    // Redraw dots
    drawDots();

    // Check if complete
    if (currentDotIndex >= dots.length) {
      setTimeout(() => {
        sound.playComplete();
        ui.showSuccess(
          `Hebat! Kamu membentuk ${shapes[currentShape].name}!`,
          3000
        );
      }, 300);
    }
  } else {
    sound.playError();
  }
}

export function cleanup() {
  // Remove event listeners
  const canvas = drawing.getCanvas();
  if (canvas) {
    canvas.replaceWith(canvas.cloneNode(true));
  }
}

// Initialize dot connection after canvas is ready
setTimeout(() => {
  if (drawing.getCanvas()) {
    setupDotConnection();
  }
}, 100);
