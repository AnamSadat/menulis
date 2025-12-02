// ===========================
// ACTIVITY: EVALUATION GAME
// Test skills with timed challenges
// ===========================

import drawing from "../drawingTools.js";
import ui from "../uiManager.js";
import sound from "../soundManager.js";
import state from "../stateManager.js";
import { generateStarDots, distance } from "../helpers.js";

let score = 0;
let currentTask = 0;
let tasks = [];
let taskStartTime = 0;
let timerInterval = null;

export function init() {
  ui.updateActivityTitle("Game Evaluasi");
  ui.updateModeIndicator("");
  ui.updateInstructions("Selesaikan tugas-tugas berikut untuk mendapat poin!");
  ui.clearActivityControls();

  // Reset score
  score = 0;
  currentTask = 0;

  // Generate tasks
  generateTasks();

  // Start first task
  startTask();
}

function generateTasks() {
  tasks = [
    {
      type: "connectDots",
      description: "Hubungkan titik membentuk bintang",
      timeLimit: 30,
      points: 10,
    },
    {
      type: "drawLines",
      description: "Gambar 3 garis horizontal",
      timeLimit: 20,
      points: 10,
    },
    {
      type: "drawCircles",
      description: "Gambar 5 lingkaran",
      timeLimit: 25,
      points: 10,
    },
    {
      type: "freeTask",
      description: "Gambar rumah sederhana",
      timeLimit: 40,
      points: 15,
    },
  ];
}

function startTask() {
  if (currentTask >= tasks.length) {
    showFinalScore();
    return;
  }

  const task = tasks[currentTask];
  drawing.clear();

  ui.updateInstructions(
    `Tugas ${currentTask + 1}: ${task.description} (${task.timeLimit} detik)`
  );
  ui.clearActivityControls();

  // Add complete button
  const completeBtn = ui.addControlButton("Selesai", completeTask);

  // Start timer
  taskStartTime = Date.now();
  startTimer(task.timeLimit);

  // Setup task
  if (task.type === "connectDots") {
    setupConnectDotsTask();
  } else if (task.type === "drawLines") {
    setupDrawLinesTask();
  } else if (task.type === "drawCircles") {
    setupDrawCirclesTask();
  }

  sound.playClick();
}

function setupConnectDotsTask() {
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);
  const dots = generateStarDots(size / 2, size / 2, size * 0.3);

  const ctx = drawing.getContext();
  dots.forEach((dot) => {
    ctx.beginPath();
    ctx.arc(dot.x, dot.y, 8, 0, Math.PI * 2);
    ctx.fillStyle = "#6C5CE7";
    ctx.fill();

    ctx.fillStyle = "#FFFFFF";
    ctx.font = "bold 12px Poppins";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText(dot.number, dot.x, dot.y);
  });
}

function setupDrawLinesTask() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  ctx.strokeStyle = "rgba(108, 92, 231, 0.2)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  for (let i = 1; i <= 3; i++) {
    const y = (size / 4) * i;
    ctx.beginPath();
    ctx.moveTo(50, y);
    ctx.lineTo(size - 50, y);
    ctx.stroke();
  }

  ctx.setLineDash([]);
}

function setupDrawCirclesTask() {
  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  ctx.strokeStyle = "rgba(108, 92, 231, 0.2)";
  ctx.lineWidth = 2;
  ctx.setLineDash([5, 5]);

  const positions = [
    { x: size * 0.2, y: size * 0.3 },
    { x: size * 0.5, y: size * 0.3 },
    { x: size * 0.8, y: size * 0.3 },
    { x: size * 0.35, y: size * 0.7 },
    { x: size * 0.65, y: size * 0.7 },
  ];

  positions.forEach((pos) => {
    ctx.beginPath();
    ctx.arc(pos.x, pos.y, 30, 0, Math.PI * 2);
    ctx.stroke();
  });

  ctx.setLineDash([]);
}

function startTimer(seconds) {
  let remaining = seconds;

  const updateTimer = () => {
    ui.updateModeIndicator(`⏱️ ${remaining}s`);
    remaining--;

    if (remaining < 0) {
      clearInterval(timerInterval);
      sound.playError();
      ui.showSuccess("Waktu habis!", 2000);
      setTimeout(() => {
        currentTask++;
        startTask();
      }, 2500);
    }
  };

  updateTimer();
  timerInterval = setInterval(updateTimer, 1000);
}

function completeTask() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }

  const task = tasks[currentTask];
  const timeSpent = (Date.now() - taskStartTime) / 1000;

  if (timeSpent <= task.timeLimit) {
    score += task.points;
    sound.playComplete();
    ui.showSuccess(`+${task.points} poin! Total: ${score}`, 2000);
  } else {
    sound.playError();
    ui.showSuccess("Waktu habis!", 2000);
  }

  setTimeout(() => {
    currentTask++;
    startTask();
  }, 2500);
}

function showFinalScore() {
  drawing.clear();

  const ctx = drawing.getContext();
  const dims = drawing.getDimensions();
  const size = Math.min(dims.displayWidth, dims.displayHeight);

  // Draw final score
  ctx.fillStyle = "#6C5CE7";
  ctx.font = `bold ${size * 0.1}px Poppins`;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText("Skor Akhir", size / 2, size * 0.35);

  ctx.font = `bold ${size * 0.15}px Poppins`;
  ctx.fillStyle = "#00B894";
  ctx.fillText(score, size / 2, size * 0.5);

  ctx.font = `${size * 0.05}px Poppins`;
  ctx.fillStyle = "#666";

  let message = "";
  if (score >= 40) {
    message = "Luar Biasa! 🌟";
  } else if (score >= 25) {
    message = "Bagus Sekali! 👍";
  } else {
    message = "Terus Berlatih! 💪";
  }

  ctx.fillText(message, size / 2, size * 0.65);

  ui.updateInstructions("Selamat! Kamu telah menyelesaikan semua tugas!");
  ui.clearActivityControls();
  ui.addControlButton("Main Lagi", () => {
    score = 0;
    currentTask = 0;
    startTask();
  });

  sound.playComplete();
}

export function cleanup() {
  if (timerInterval) {
    clearInterval(timerInterval);
  }
}
