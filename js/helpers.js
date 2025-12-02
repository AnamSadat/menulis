// ===========================
// HELPERS
// Utility functions
// ===========================

// Generate random number between min and max
export function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// Generate random float between min and max
export function randomFloat(min, max) {
  return Math.random() * (max - min) + min;
}

// Shuffle array
export function shuffle(array) {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
}

// Calculate distance between two points
export function distance(x1, y1, x2, y2) {
  return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

// Check if point is near line segment
export function isPointNearLine(px, py, x1, y1, x2, y2, threshold = 10) {
  const lineLength = distance(x1, y1, x2, y2);
  if (lineLength === 0) return distance(px, py, x1, y1) < threshold;

  const t = Math.max(
    0,
    Math.min(
      1,
      ((px - x1) * (x2 - x1) + (py - y1) * (y2 - y1)) /
        (lineLength * lineLength)
    )
  );
  const projX = x1 + t * (x2 - x1);
  const projY = y1 + t * (y2 - y1);

  return distance(px, py, projX, projY) < threshold;
}

// Check if point is inside rectangle
export function isPointInRect(px, py, rx, ry, rw, rh) {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh;
}

// Check if point is inside circle
export function isPointInCircle(px, py, cx, cy, radius) {
  return distance(px, py, cx, cy) <= radius;
}

// Generate dots for star shape
export function generateStarDots(centerX, centerY, size) {
  const dots = [];
  const points = 5;
  const outerRadius = size;
  const innerRadius = size * 0.4;

  for (let i = 0; i < points * 2; i++) {
    const angle = (Math.PI * 2 * i) / (points * 2) - Math.PI / 2;
    const radius = i % 2 === 0 ? outerRadius : innerRadius;
    dots.push({
      x: centerX + Math.cos(angle) * radius,
      y: centerY + Math.sin(angle) * radius,
      number: i + 1,
    });
  }

  return dots;
}

// Generate dots for house shape
export function generateHouseDots(centerX, centerY, size) {
  const dots = [];
  const width = size;
  const height = size * 0.8;
  const roofHeight = size * 0.4;

  // Roof
  dots.push({ x: centerX, y: centerY - height / 2 - roofHeight, number: 1 }); // Top
  dots.push({ x: centerX - width / 2, y: centerY - height / 2, number: 2 }); // Left roof

  // Walls
  dots.push({ x: centerX - width / 2, y: centerY + height / 2, number: 3 }); // Bottom left
  dots.push({ x: centerX + width / 2, y: centerY + height / 2, number: 4 }); // Bottom right
  dots.push({ x: centerX + width / 2, y: centerY - height / 2, number: 5 }); // Top right
  dots.push({ x: centerX, y: centerY - height / 2 - roofHeight, number: 6 }); // Back to top

  return dots;
}

// Generate dots for triangle
export function generateTriangleDots(centerX, centerY, size) {
  const dots = [];
  const height = size * 0.866; // equilateral triangle height

  dots.push({ x: centerX, y: centerY - height / 2, number: 1 }); // Top
  dots.push({ x: centerX - size / 2, y: centerY + height / 2, number: 2 }); // Bottom left
  dots.push({ x: centerX + size / 2, y: centerY + height / 2, number: 3 }); // Bottom right
  dots.push({ x: centerX, y: centerY - height / 2, number: 4 }); // Back to top

  return dots;
}

// Generate dots for flower
export function generateFlowerDots(centerX, centerY, size) {
  const dots = [];
  const petalCount = 6;
  const petalRadius = size * 0.4;

  // Center
  dots.push({ x: centerX, y: centerY, number: 1 });

  // Petals
  for (let i = 0; i < petalCount; i++) {
    const angle = (Math.PI * 2 * i) / petalCount;
    dots.push({
      x: centerX + Math.cos(angle) * petalRadius,
      y: centerY + Math.sin(angle) * petalRadius,
      number: i + 2,
    });
  }

  // Back to center
  dots.push({ x: centerX, y: centerY, number: petalCount + 2 });

  return dots;
}

// Generate random dots with numbers
export function generateRandomNumberDots(count, width, height, margin = 50) {
  const dots = [];
  const numbers = shuffle([...Array(count)].map((_, i) => i + 1));

  for (let i = 0; i < count; i++) {
    dots.push({
      x: random(margin, width - margin),
      y: random(margin, height - margin),
      number: numbers[i],
    });
  }

  // Sort by number for correct order
  return dots.sort((a, b) => a.number - b.number);
}

// Generate random dots with letters
export function generateRandomLetterDots(count, width, height, margin = 50) {
  const dots = [];
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").slice(0, count);
  const shuffled = shuffle(letters);

  for (let i = 0; i < count; i++) {
    dots.push({
      x: random(margin, width - margin),
      y: random(margin, height - margin),
      letter: shuffled[i],
    });
  }

  // Sort by letter for correct order
  return dots.sort((a, b) => a.letter.localeCompare(b.letter));
}

// Get letter path data for SVG
export function getLetterPath(letter, scale = 1) {
  // Simplified letter paths (you can expand this)
  const paths = {
    A: "M 50 150 L 100 50 L 150 150 M 75 100 L 125 100",
    B: "M 50 50 L 50 150 L 120 150 Q 150 150 150 125 Q 150 100 120 100 L 50 100 L 120 100 Q 150 100 150 75 Q 150 50 120 50 Z",
    C: "M 150 50 Q 50 50 50 100 Q 50 150 150 150",
    // Add more letters as needed
  };

  return paths[letter.toUpperCase()] || "";
}

// Check if drawing covers enough of target area
export function checkCoverage(drawnPixels, targetPixels, threshold = 0.6) {
  if (targetPixels === 0) return false;
  return drawnPixels / targetPixels >= threshold;
}

// Debounce function
export function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle function
export function throttle(func, limit) {
  let inThrottle;
  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// Format time (seconds to MM:SS)
export function formatTime(seconds) {
  const mins = Math.floor(seconds / 60);
  const secs = seconds % 60;
  return `${mins.toString().padStart(2, "0")}:${secs
    .toString()
    .padStart(2, "0")}`;
}

// Get canvas coordinates from event
export function getCanvasCoordinates(canvas, event) {
  const rect = canvas.getBoundingClientRect();
  const scaleX = canvas.width / rect.width;
  const scaleY = canvas.height / rect.height;

  let clientX, clientY;

  if (event.touches && event.touches.length > 0) {
    clientX = event.touches[0].clientX;
    clientY = event.touches[0].clientY;
  } else {
    clientX = event.clientX;
    clientY = event.clientY;
  }

  return {
    x: (clientX - rect.left) * scaleX,
    y: (clientY - rect.top) * scaleY,
  };
}
