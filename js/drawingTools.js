// ===========================
// DRAWING TOOLS
// Manages canvas drawing functionality
// ===========================

import sound from "./soundManager.js";
import { getCanvasCoordinates } from "./helpers.js";

class DrawingTools {
  constructor() {
    this.canvas = null;
    this.ctx = null;
    this.isDrawing = false;
    this.lastX = 0;
    this.lastY = 0;

    // Drawing settings
    this.brushSize = 5;
    this.brushColor = "#000000";
    this.isEraser = false;

    // Size presets
    this.sizes = {
      small: 3,
      medium: 5,
      large: 8,
    };
  }

  // Initialize canvas
  init(canvasElement) {
    this.canvas = canvasElement;
    this.ctx = this.canvas.getContext("2d");

    // Set canvas size
    this.resizeCanvas();

    // Setup event listeners
    this.setupEventListeners();

    // Initial canvas setup
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  // Resize canvas to fit container
  resizeCanvas() {
    if (!this.canvas) return;

    const container = this.canvas.parentElement;
    const rect = container.getBoundingClientRect();

    // Set display size
    const size = Math.min(rect.width - 40, rect.height - 40, 800);
    this.canvas.style.width = size + "px";
    this.canvas.style.height = size + "px";

    // Set actual size in memory (scaled for retina displays)
    const scale = window.devicePixelRatio || 1;
    this.canvas.width = size * scale;
    this.canvas.height = size * scale;

    // Scale context to match
    this.ctx.scale(scale, scale);

    // Reapply settings
    this.ctx.lineCap = "round";
    this.ctx.lineJoin = "round";
  }

  // Setup event listeners for drawing
  setupEventListeners() {
    if (!this.canvas) return;

    // Mouse events
    this.canvas.addEventListener("mousedown", this.startDrawing.bind(this));
    this.canvas.addEventListener("mousemove", this.draw.bind(this));
    this.canvas.addEventListener("mouseup", this.stopDrawing.bind(this));
    this.canvas.addEventListener("mouseout", this.stopDrawing.bind(this));

    // Touch events
    this.canvas.addEventListener("touchstart", this.startDrawing.bind(this));
    this.canvas.addEventListener("touchmove", this.draw.bind(this));
    this.canvas.addEventListener("touchend", this.stopDrawing.bind(this));
    this.canvas.addEventListener("touchcancel", this.stopDrawing.bind(this));
  }

  // Start drawing
  startDrawing(e) {
    e.preventDefault();
    this.isDrawing = true;

    const coords = getCanvasCoordinates(this.canvas, e);
    this.lastX = coords.x;
    this.lastY = coords.y;

    // Draw a dot for single click
    this.ctx.beginPath();
    this.ctx.arc(coords.x, coords.y, this.brushSize / 2, 0, Math.PI * 2);
    this.ctx.fillStyle = this.isEraser ? "#FEFEFE" : this.brushColor;
    this.ctx.fill();
  }

  // Draw
  draw(e) {
    if (!this.isDrawing) return;
    e.preventDefault();

    const coords = getCanvasCoordinates(this.canvas, e);

    this.ctx.beginPath();
    this.ctx.moveTo(this.lastX, this.lastY);
    this.ctx.lineTo(coords.x, coords.y);
    this.ctx.strokeStyle = this.isEraser ? "#FEFEFE" : this.brushColor;
    this.ctx.lineWidth = this.brushSize;
    this.ctx.stroke();

    this.lastX = coords.x;
    this.lastY = coords.y;
  }

  // Stop drawing
  stopDrawing(e) {
    if (this.isDrawing) {
      e.preventDefault();
      this.isDrawing = false;
    }
  }

  // Set brush size
  setBrushSize(size) {
    if (this.sizes[size]) {
      this.brushSize = this.sizes[size];
    } else {
      this.brushSize = size;
    }
  }

  // Set brush color
  setBrushColor(color) {
    this.brushColor = color;
    this.isEraser = false;
  }

  // Toggle eraser
  toggleEraser() {
    this.isEraser = !this.isEraser;
    return this.isEraser;
  }

  // Set eraser mode
  setEraser(enabled) {
    this.isEraser = enabled;
  }

  // Clear canvas
  clear() {
    if (!this.ctx || !this.canvas) return;
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    // Fill with white background
    this.ctx.fillStyle = "#FEFEFE";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  // Get canvas as image data URL
  getImageData() {
    if (!this.canvas) return null;
    return this.canvas.toDataURL("image/png");
  }

  // Draw background elements (for activities)
  drawBackground(drawFunction) {
    if (!this.ctx) return;
    drawFunction(this.ctx, this.canvas.width, this.canvas.height);
  }

  // Get context for custom drawing
  getContext() {
    return this.ctx;
  }

  // Get canvas element
  getCanvas() {
    return this.canvas;
  }

  // Get canvas dimensions
  getDimensions() {
    if (!this.canvas) return { width: 0, height: 0 };
    return {
      width: this.canvas.width,
      height: this.canvas.height,
      displayWidth: parseInt(this.canvas.style.width),
      displayHeight: parseInt(this.canvas.style.height),
    };
  }
}

// Export singleton instance
export default new DrawingTools();
