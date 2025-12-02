// ===========================
// ACTIVITY: CONNECT RANDOM DOTS
// Connect randomly placed dots
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import {
  generateRandomNumberDots,
  generateRandomLetterDots,
  distance,
} from "../helpers.js";

let currentMode = "numbers";
let dots = [];
let connectedDots = [];
let currentDotIndex = 0;

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

  if (currentMode === "numbers") {
    dots = generateRandomNumberDots(modes.numbers.count, size, size);
  } else {
    dots = generateRandomLetterDots(modes.letters.count, size, size);
  }
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

    // Draw label
    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 14px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dot.number || dot.letter, dot.x, dot.y);
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
        ui.showSuccess("Sempurna! Semua titik terhubung!", 3000);
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
