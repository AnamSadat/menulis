// ===========================
// DOTS MANAGER
// Manages dots for connect-the-dots activities
// ===========================

import sound from "./soundManager.js";
import { distance } from "./helpers.js";

class DotsManager {
  constructor() {
    this.dots = [];
    this.connectedDots = [];
    this.currentDotIndex = 0;
    this.canvas = null;
    this.ctx = null;
    this.onComplete = null;
    this.clickHandler = null;
  }

  // Initialize with canvas
  init(canvas, ctx) {
    this.canvas = canvas;
    this.ctx = ctx;
    this.dots = [];
    this.connectedDots = [];
    this.currentDotIndex = 0;
  }

  // Set dots array
  setDots(dots) {
    this.dots = dots;
    this.connectedDots = [];
    this.currentDotIndex = 0;
  }

  // Draw all dots
  drawDots() {
    if (!this.ctx) return;

    this.dots.forEach((dot, index) => {
      const isConnected = this.connectedDots.includes(index);
      const isNext = index === this.currentDotIndex;
      const isCurrent = index === this.currentDotIndex;

      // Draw dot circle
      this.ctx.beginPath();
      this.ctx.arc(dot.x, dot.y, isNext ? 14 : 10, 0, Math.PI * 2);

      if (isConnected) {
        this.ctx.fillStyle = "#00B894"; // Green for connected
      } else if (isNext) {
        this.ctx.fillStyle = "#FFA502"; // Orange for next
      } else {
        this.ctx.fillStyle = "#6C5CE7"; // Purple for unconnected
      }

      this.ctx.fill();

      // Add glow effect for next dot
      if (isNext) {
        this.ctx.strokeStyle = "#FFA502";
        this.ctx.lineWidth = 3;
        this.ctx.stroke();
      }

      // Draw number or letter
      this.ctx.fillStyle = "#FFFFFF";
      this.ctx.font = "bold 14px Poppins";
      this.ctx.textAlign = "center";
      this.ctx.textBaseline = "middle";
      this.ctx.fillText(dot.number || dot.letter || index + 1, dot.x, dot.y);
    });
  }

  // Draw line between two dots
  drawLine(fromDot, toDot, animated = false) {
    if (!this.ctx) return;

    this.ctx.beginPath();
    this.ctx.moveTo(fromDot.x, fromDot.y);
    this.ctx.lineTo(toDot.x, toDot.y);
    this.ctx.strokeStyle = "#00B894";
    this.ctx.lineWidth = 4;
    this.ctx.lineCap = "round";
    this.ctx.stroke();

    if (animated) {
      this.animateDotConnection(toDot.x, toDot.y);
    }
  }

  // Animate dot connection with particles
  animateDotConnection(x, y) {
    const colors = ["#6C5CE7", "#00B894", "#FD79A8", "#FFA502", "#74B9FF"];
    const particleCount = 8;

    for (let i = 0; i < particleCount; i++) {
      const angle = (Math.PI * 2 * i) / particleCount;
      const velocity = 30;
      const particle = document.createElement("div");
      particle.className = "dot-particle";
      particle.style.cssText = `
                position: fixed;
                width: 6px;
                height: 6px;
                border-radius: 50%;
                background: ${colors[i % colors.length]};
                pointer-events: none;
                z-index: 10000;
                left: ${x}px;
                top: ${y}px;
                animation: particle-burst 0.6s ease-out forwards;
            `;

      const tx = Math.cos(angle) * velocity;
      const ty = Math.sin(angle) * velocity;
      particle.style.setProperty("--tx", tx + "px");
      particle.style.setProperty("--ty", ty + "px");

      document.body.appendChild(particle);

      setTimeout(() => particle.remove(), 600);
    }
  }

  // Setup click handler for connecting dots
  setupClickHandler(onComplete) {
    this.onComplete = onComplete;

    if (this.clickHandler) {
      this.canvas.removeEventListener("click", this.clickHandler);
      this.canvas.removeEventListener("touchend", this.clickHandler);
    }

    this.clickHandler = (e) => this.handleClick(e);

    this.canvas.addEventListener("click", this.clickHandler);
    this.canvas.addEventListener("touchend", this.clickHandler);
  }

  // Handle click/touch on canvas
  handleClick(e) {
    e.preventDefault();

    if (this.currentDotIndex >= this.dots.length) return;

    const rect = this.canvas.getBoundingClientRect();
    let clientX, clientY;

    if (e.touches && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if (e.changedTouches && e.changedTouches.length > 0) {
      clientX = e.changedTouches[0].clientX;
      clientY = e.changedTouches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    // Simple coordinate mapping since canvas size = display size
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    this.checkDotConnection(x, y);
  }

  // Check if click is on current dot
  checkDotConnection(x, y) {
    if (this.currentDotIndex >= this.dots.length) return;

    const currentDot = this.dots[this.currentDotIndex];
    const dist = distance(x, y, currentDot.x, currentDot.y);

    const threshold = 25; // Click tolerance

    if (dist < threshold) {
      // Correct dot clicked!
      this.connectedDots.push(this.currentDotIndex);

      // Draw line from previous dot
      if (this.currentDotIndex > 0) {
        const prevDot = this.dots[this.currentDotIndex - 1];
        this.drawLine(prevDot, currentDot, true);
      }

      this.currentDotIndex++;
      sound.playSuccess();

      // Redraw dots to update colors
      this.drawDots();

      // Check if all dots are connected
      if (this.currentDotIndex >= this.dots.length) {
        setTimeout(() => {
          sound.playComplete();
          if (this.onComplete) {
            this.onComplete();
          }
        }, 300);
      }
    } else {
      // Wrong dot clicked
      sound.playError();
      this.shakeWrongDot(x, y);
    }
  }

  // Visual feedback for wrong click
  shakeWrongDot(x, y) {
    // Find if click was near any other dot
    this.dots.forEach((dot, index) => {
      if (index !== this.currentDotIndex) {
        const dist = distance(x, y, dot.x, dot.y);
        if (dist < 25) {
          // Show warning near this dot
          this.showWarning(dot.x, dot.y);
        }
      }
    });
  }

  // Show warning text
  showWarning(x, y) {
    const warning = document.createElement("div");
    warning.textContent = "✗";
    warning.style.cssText = `
            position: fixed;
            left: ${x}px;
            top: ${y}px;
            transform: translate(-50%, -50%);
            font-size: 24px;
            color: #FF4757;
            font-weight: bold;
            pointer-events: none;
            z-index: 10000;
            animation: fadeOut 0.5s ease-out forwards;
        `;

    document.body.appendChild(warning);
    setTimeout(() => warning.remove(), 500);
  }

  // Get current progress
  getProgress() {
    return {
      current: this.currentDotIndex,
      total: this.dots.length,
      percentage: (this.currentDotIndex / this.dots.length) * 100,
    };
  }

  // Reset dots
  reset() {
    this.connectedDots = [];
    this.currentDotIndex = 0;
  }

  // Cleanup
  cleanup() {
    if (this.clickHandler && this.canvas) {
      this.canvas.removeEventListener("click", this.clickHandler);
      this.canvas.removeEventListener("touchend", this.clickHandler);
    }
    this.clickHandler = null;
    this.onComplete = null;
  }
}

// Add particle animation CSS
if (!document.getElementById("dots-manager-styles")) {
  const style = document.createElement("style");
  style.id = "dots-manager-styles";
  style.textContent = `
        @keyframes particle-burst {
            0% {
                transform: translate(0, 0) scale(1);
                opacity: 1;
            }
            100% {
                transform: translate(var(--tx), var(--ty)) scale(0);
                opacity: 0;
            }
        }
        
        @keyframes fadeOut {
            from {
                opacity: 1;
                transform: translate(-50%, -50%) scale(1);
            }
            to {
                opacity: 0;
                transform: translate(-50%, -50%) scale(1.5);
            }
        }
    `;
  document.head.appendChild(style);
}

// Export singleton instance
export default new DotsManager();
