import { getCurrentUser, saveScore, getScoreboardForGame, renderScoreboardRow } from '../storage';

if (!getCurrentUser()) {
  window.location.href = "../../index.html#games";
}

let score: number = 0;
const timeLimit: number = 10;
const TICK_MS: number = 1000;

const scoreDisplay = document.getElementById("scoreDisplay") as HTMLSpanElement | null;
const clickButton = document.getElementById("clickButton") as HTMLImageElement | null;
const timerDisplay = document.getElementById("timerDisplay") as HTMLSpanElement | null;
const playAgainBtn = document.getElementById("playAgainBtn") as HTMLButtonElement | null;

const defaultImg = "../assets/images/cat.png";
const openImg = "../assets/images/cat-open.png";
let countdownId: number | null = null;

const audioSources: string[] = ['../assets/audios/pop1.ogg', '../assets/audios/pop2.ogg', '../assets/audios/pop3.ogg', '../assets/audios/pop4.ogg'];
const rotateScores: string[] = ["-rotate-5", "rotate-5", "-rotate-10", "rotate-10", "rotate-15", "-rotate-15"];

function getRandomAudio(): string {
  const randomIndex = Math.floor(Math.random() * audioSources.length);
  return audioSources[randomIndex];
}

function playRandomAudio(): void {
  const selectedSource = getRandomAudio();
  const audio = new Audio(selectedSource);
  audio.play().catch(error => {
    console.error(`Playback failed for ${selectedSource}:`, error);
  });
}

function getRandomRotateScore(): string {
  const randomIndex = Math.floor(Math.random() * rotateScores.length);
  return rotateScores[randomIndex];
}

let currentRotation: string = getRandomRotateScore();

function startTimer(duration: number): void {
  let timer = duration;
  if (countdownId) clearInterval(countdownId);
  playAgainBtn?.classList.add("hidden");
  if (timerDisplay) timerDisplay.textContent = `${duration}s`;

  countdownId = window.setInterval(function () {
    const seconds = parseInt(String(timer), 10);
    if (timerDisplay) timerDisplay.textContent = `${seconds}s`;
    if (--timer < 0) {
      if (countdownId) clearInterval(countdownId);
      countdownId = null;
      if (clickButton) {
        clickButton.setAttribute("disabled", "true");
        clickButton.style.pointerEvents = "none";
        clickButton.classList.add("opacity-50", "cursor-not-allowed");
        clickButton.src = defaultImg;
      }
      saveScore("clicker", score);
      if (timerDisplay) timerDisplay.textContent = `Time's up! Final Score: ${score}`;
      playAgainBtn?.classList.remove("hidden");
      renderGameScoreboard();
    }
  }, TICK_MS);
}

function renderGameScoreboard(): void {
  const tbody = document.getElementById("gameScoreboardBody") as HTMLTableSectionElement | null;
  if (!tbody) return;
  tbody.innerHTML = "";
  const rows = getScoreboardForGame("clicker");
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.className = "bg-neutral-primary";
    tr.innerHTML = `<td colspan="2" class="px-6 py-4 text-center text-(--color-secondary-text)">There are no scores for Clicker yet.</td>`;
    tbody.appendChild(tr);
    return;
  }
  rows.forEach((u, idx) => {
    const tr = renderScoreboardRow(u.username, (u.score || 0), idx, '');
    if (tr) tbody.appendChild(tr);
  });
}

clickButton?.addEventListener("click", function () {
  if (!clickButton || clickButton.hasAttribute("disabled")) return;
  score++;
  if (scoreDisplay) scoreDisplay.textContent = String(score);
});
clickButton?.addEventListener("pointerdown", function () {
  if (!clickButton || clickButton.hasAttribute("disabled")) return;
  clickButton.src = openImg;
  playRandomAudio();
  currentRotation = getRandomRotateScore();
  scoreDisplay?.classList.add("scale-125", currentRotation);
});
clickButton?.addEventListener("pointerup", function () {
  if (!clickButton || clickButton.hasAttribute("disabled")) return;
  clickButton.src = defaultImg;
  scoreDisplay?.classList.remove("scale-125", currentRotation);
});
clickButton?.addEventListener("pointerleave", function () {
  if (!clickButton || clickButton.hasAttribute("disabled")) return;
  clickButton.src = defaultImg;
});
clickButton?.addEventListener("pointercancel", function () {
  if (!clickButton || clickButton.hasAttribute("disabled")) return;
  clickButton.src = defaultImg;
});

window.addEventListener("load", function () {
  startTimer(timeLimit);
});

playAgainBtn?.addEventListener("click", function () {
  score = 0;
  if (scoreDisplay) scoreDisplay.textContent = "0";
  if (clickButton) {
    clickButton.removeAttribute("disabled");
    clickButton.style.pointerEvents = "auto";
    clickButton.classList.remove("opacity-50", "cursor-not-allowed");
    clickButton.src = defaultImg;
  }
  startTimer(timeLimit);
});

renderGameScoreboard();
