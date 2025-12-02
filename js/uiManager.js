// ===========================
// UI MANAGER
// Manages screen transitions and UI updates
// ===========================

import state from "./stateManager.js";

class UIManager {
  constructor() {
    this.screens = {
      welcome: document.getElementById("welcomeScreen"),
      menu: document.getElementById("menuScreen"),
      activity: document.getElementById("activityScreen"),
    };

    this.currentScreen = "welcome";
  }

  // Show a specific screen
  showScreen(screenName) {
    // Hide all screens
    Object.values(this.screens).forEach((screen) => {
      screen.classList.remove("active");
    });

    // Show requested screen
    if (this.screens[screenName]) {
      this.screens[screenName].classList.add("active");
      this.currentScreen = screenName;
    }
  }

  // Update greeting with user name
  updateGreeting() {
    const userName = state.get("userName");
    const greetingElement = document.getElementById("userGreeting");
    if (greetingElement && userName) {
      greetingElement.textContent = userName;
    }
  }

  // Update activity title
  updateActivityTitle(title) {
    const titleElement = document.getElementById("activityTitle");
    if (titleElement) {
      titleElement.textContent = title;
    }
  }

  // Update mode indicator
  updateModeIndicator(mode) {
    const indicator = document.getElementById("modeIndicator");
    if (indicator) {
      indicator.textContent = mode ? `Mode: ${mode}` : "";
    }
  }

  // Update instructions
  updateInstructions(text) {
    const instructions = document.getElementById("activityInstructions");
    if (instructions) {
      instructions.textContent = text;
    }
  }

  // Show success message
  showSuccess(message, duration = 2000) {
    const successEl = document.getElementById("successMessage");
    const textEl = document.getElementById("successText");

    if (successEl && textEl) {
      textEl.textContent = message;
      successEl.classList.add("show");

      setTimeout(() => {
        successEl.classList.remove("show");
      }, duration);
    }
  }

  // Show modal
  showModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.add("active");
    }
  }

  // Hide modal
  hideModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
      modal.classList.remove("active");
    }
  }

  // Show confirmation dialog
  showConfirm(message, onYes, onNo) {
    const dialog = document.getElementById("confirmDialog");
    const textEl = document.getElementById("confirmText");
    const yesBtn = document.getElementById("confirmYes");
    const noBtn = document.getElementById("confirmNo");

    if (dialog && textEl) {
      textEl.textContent = message;
      dialog.classList.add("active");

      // Remove old listeners
      const newYesBtn = yesBtn.cloneNode(true);
      const newNoBtn = noBtn.cloneNode(true);
      yesBtn.parentNode.replaceChild(newYesBtn, yesBtn);
      noBtn.parentNode.replaceChild(newNoBtn, noBtn);

      // Add new listeners
      newYesBtn.addEventListener("click", () => {
        dialog.classList.remove("active");
        if (onYes) onYes();
      });

      newNoBtn.addEventListener("click", () => {
        dialog.classList.remove("active");
        if (onNo) onNo();
      });
    }
  }

  // Create particles for success animation
  createParticles(x, y, count = 10) {
    const colors = [
      "#6C5CE7",
      "#00B894",
      "#FD79A8",
      "#FFA502",
      "#74B9FF",
      "#FDCB6E",
    ];

    for (let i = 0; i < count; i++) {
      const particle = document.createElement("div");
      particle.className = "particle";
      particle.style.left = x + "px";
      particle.style.top = y + "px";
      particle.style.background =
        colors[Math.floor(Math.random() * colors.length)];

      const angle = (Math.PI * 2 * i) / count;
      const velocity = 50 + Math.random() * 50;
      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;

      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");

      document.body.appendChild(particle);

      setTimeout(() => {
        particle.remove();
      }, 1000);
    }
  }

  // Clear activity controls
  clearActivityControls() {
    const controls = document.getElementById("activityControls");
    if (controls) {
      controls.innerHTML = "";
    }
  }

  // Add control button
  addControlButton(text, onClick, isActive = false) {
    const controls = document.getElementById("activityControls");
    if (controls) {
      const button = document.createElement("button");
      button.className = "control-btn" + (isActive ? " active" : "");
      button.textContent = text;
      button.addEventListener("click", onClick);
      controls.appendChild(button);
      return button;
    }
    return null;
  }
}

// Export singleton instance
export default new UIManager();
