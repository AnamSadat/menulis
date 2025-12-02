// ===========================
// ACTIVITY: FREE DRAW
// Free drawing activity
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";

export function init() {
  ui.updateActivityTitle("Coret-coret Bebas");
  ui.updateModeIndicator("");
  ui.updateInstructions(
    "Gambarlah sesuka hatimu! Gunakan berbagai warna dan ukuran marker."
  );
  ui.clearActivityControls();

  // Clear and prepare canvas
  drawing.clear();
}

export function cleanup() {
  // No special cleanup needed
}
