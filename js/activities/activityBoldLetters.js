// ===========================
// ACTIVITY: BOLD LETTERS
// Practice tracing and bolding letters A-Z
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";

let currentLetter = "A";
const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");

export function init() {
  ui.updateActivityTitle("Menebalkan Huruf");
  ui.updateModeIndicator(`Huruf ${currentLetter}`);
  ui.updateInstructions("Tebalkan huruf dengan mengikuti garis outline!");
  ui.clearActivityControls();

  // Add navigation buttons
  ui.addControlButton("◀ Sebelumnya", previousLetter);
  ui.addControlButton("Berikutnya ▶", nextLetter);
  ui.addControlButton("Cek Hasil", checkResult);

  // Draw current letter
  drawLetter();
}

function previousLetter() {
  const currentIndex = alphabet.indexOf(currentLetter);
  if (currentIndex > 0) {
    currentLetter = alphabet[currentIndex - 1];
    ui.updateModeIndicator(`Huruf ${currentLetter}`);
    drawing.clear();
    drawLetter();
    sound.playClick();
  }
}

function nextLetter() {
  const currentIndex = alphabet.indexOf(currentLetter);
  if (currentIndex < alphabet.length - 1) {
    currentLetter = alphabet[currentIndex + 1];
    ui.updateModeIndicator(`Huruf ${currentLetter}`);
    drawing.clear();
    drawLetter();
    sound.playClick();
  }
}

function drawLetter() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  // Draw letter outline
  ctx.strokeStyle = "rgba(108, 92, 231, 0.3)";
  ctx.lineWidth = 30;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  ctx.font = `bold ${size * 0.6}px Arial`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";

  // Draw outline
  ctx.strokeText(currentLetter, size / 2, size / 2);

  // Draw inner guide
  ctx.strokeStyle = "rgba(108, 92, 231, 0.15)";
  ctx.lineWidth = 15;
  ctx.strokeText(currentLetter, size / 2, size / 2);
}

function checkResult() {
  sound.playComplete();
  ui.showSuccess(`Bagus! Huruf ${currentLetter} sudah tebal!`, 2000);

  // Auto move to next letter after success
  setTimeout(() => {
    const currentIndex = alphabet.indexOf(currentLetter);
    if (currentIndex < alphabet.length - 1) {
      nextLetter();
    }
  }, 2500);
}

export function cleanup() {
  // No special cleanup needed
}
