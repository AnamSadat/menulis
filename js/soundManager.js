// ===========================
// SOUND MANAGER
// Manages sound effects and audio
// ===========================

import state from "./stateManager.js";

class SoundManager {
  constructor() {
    this.audioContext = null;
    this.sounds = {};
    this.init();
  }

  // Initialize audio context
  init() {
    try {
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();
    } catch (e) {
      console.warn("Web Audio API not supported:", e);
    }
  }

  // Play success sound
  playSuccess() {
    if (!state.get("soundEnabled")) return;
    this.playTone(523.25, 0.1, "sine"); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "sine"), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.2, "sine"), 200); // G5
  }

  // Play click sound
  playClick() {
    if (!state.get("soundEnabled")) return;
    this.playTone(800, 0.05, "square");
  }

  // Play error sound
  playError() {
    if (!state.get("soundEnabled")) return;
    this.playTone(200, 0.1, "sawtooth");
    setTimeout(() => this.playTone(150, 0.15, "sawtooth"), 100);
  }

  // Play draw sound (subtle)
  playDraw() {
    if (!state.get("soundEnabled")) return;
    this.playTone(400, 0.02, "sine");
  }

  // Play complete sound
  playComplete() {
    if (!state.get("soundEnabled")) return;
    this.playTone(523.25, 0.1, "sine"); // C5
    setTimeout(() => this.playTone(659.25, 0.1, "sine"), 100); // E5
    setTimeout(() => this.playTone(783.99, 0.1, "sine"), 200); // G5
    setTimeout(() => this.playTone(1046.5, 0.3, "sine"), 300); // C6
  }

  // Generic tone player using Web Audio API
  playTone(frequency, duration, type = "sine") {
    if (!this.audioContext) return;

    const volume = state.get("volume") / 100;

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.frequency.value = frequency;
    oscillator.type = type;

    gainNode.gain.setValueAtTime(volume * 0.3, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(
      0.01,
      this.audioContext.currentTime + duration
    );

    oscillator.start(this.audioContext.currentTime);
    oscillator.stop(this.audioContext.currentTime + duration);
  }

  // Toggle sound on/off
  toggleSound(enabled) {
    state.set("soundEnabled", enabled);
  }

  // Set volume (0-100)
  setVolume(volume) {
    state.set("volume", Math.max(0, Math.min(100, volume)));
  }

  // Resume audio context (needed for some browsers)
  resume() {
    if (this.audioContext && this.audioContext.state === "suspended") {
      this.audioContext.resume();
    }
  }
}

// Export singleton instance
export default new SoundManager();
