import { getCurrentUser, saveScore, getScoreboardForGame, renderScoreboardRow } from '../storage';

const MAX_NUMBER = 100;
const MAX_ATTEMPTS = 10;
const POINTS_PER_ATTEMPT = 10;

let targetNumber: number;
let attemptsLeft: number;
let gameActive: boolean;
let previousGuesses: number[];

const guessInput = document.getElementById("guessInput") as HTMLInputElement | null;
const submitBtn = document.getElementById("submitBtn") as HTMLButtonElement | null;
const feedback = document.getElementById("feedback") as HTMLDivElement | null;
const attemptsLeftSpan = document.getElementById("attemptsLeft") as HTMLSpanElement | null;
const gameContainer = document.getElementById("gameContainer") as HTMLDivElement | null;
const gameOverContainer = document.getElementById("gameOverContainer") as HTMLDivElement | null;
const gameOverMessage = document.getElementById("gameOverMessage") as HTMLDivElement | null;
const resetBtn = document.getElementById("resetBtn") as HTMLButtonElement | null;
const previousGuessesList = document.getElementById("guessList") as HTMLDivElement | null;
const previousGuessesContainer = document.getElementById("previousGuesses") as HTMLDivElement | null;
const mobileWelcome = document.getElementById('mobileWelcomeMessage') as HTMLDivElement | null;
const mobileWelcomeName = document.getElementById('mobileWelcomeName') as HTMLSpanElement | null;

const u = getCurrentUser();
if (!u) {
  window.location.href = "../../index.html#games";
}
if (u) {
  if (mobileWelcome && mobileWelcomeName) {
    mobileWelcomeName.textContent = u;
    mobileWelcome.classList.remove('hidden');
  }
}

function initGame(): void {
  targetNumber = Math.floor(Math.random() * MAX_NUMBER) + 1;
  attemptsLeft = MAX_ATTEMPTS;
  gameActive = true;
  previousGuesses = [];

  if (guessInput) {
    guessInput.value = "";
    guessInput.disabled = false;
    guessInput.focus();
  }
  if (submitBtn) submitBtn.disabled = false;
  if (attemptsLeftSpan) attemptsLeftSpan.textContent = String(attemptsLeft);

  gameContainer?.classList.remove("hidden");
  gameOverContainer?.classList.add("hidden");
  resetBtn?.classList.add("hidden");
  feedback?.classList.add("hidden");
  previousGuessesContainer?.classList.add("hidden");
  if (previousGuessesList) previousGuessesList.innerHTML = "";
}

type ValidationResult = { isValid: boolean; message?: string; number?: number };
function validateInput(input: string): ValidationResult {
  input = input.trim();
  if (input === "") {
    return { isValid: false, message: "Please enter a number!" };
  }
  const num = Number(input);
  if (isNaN(num) || !Number.isInteger(num) || num < 1) {
    return { isValid: false, message: `Please enter a valid number between 1 and ${MAX_NUMBER}!` };
  }
  if (num < 1 || num > MAX_NUMBER) {
    return { isValid: false, message: `Please enter a number between 1 and ${MAX_NUMBER}!` };
  }
  if (previousGuesses.includes(num)) {
    return { isValid: false, message: "You already guessed that number!" };
  }
  return { isValid: true, number: num };
}

function showFeedback(message: string, type: "success" | "error" | "high" | "low" | "info" = "info"): void {
  if (!feedback) return;
  feedback.textContent = message;
  feedback.classList.remove(
    "hidden",
    "bg-green-100",
    "text-green-800",
    "bg-red-100",
    "text-red-800",
    "bg-blue-100",
    "text-blue-800",
    "bg-yellow-100",
    "text-yellow-800"
  );
  switch (type) {
    case "success":
      feedback.classList.add("bg-green-100", "text-green-800"); break;
    case "error":
      feedback.classList.add("bg-red-100", "text-red-800"); break;
    case "high":
      feedback.classList.add("bg-yellow-100", "text-yellow-800"); break;
    case "low":
      feedback.classList.add("bg-blue-100", "text-blue-800"); break;
    default:
      feedback.classList.add("bg-blue-100", "text-blue-800");
  }
}

function addToPreviousGuesses(guess: number): void {
  previousGuesses.push(guess);
  const guessSpan = document.createElement("span");
  guessSpan.textContent = String(guess);
  guessSpan.className = "px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm";
  previousGuessesList?.appendChild(guessSpan);
  previousGuessesContainer?.classList.remove("hidden");
}

function processGuess(guess: number): void {
  addToPreviousGuesses(guess);
  attemptsLeft--;
  if (attemptsLeftSpan) attemptsLeftSpan.textContent = String(attemptsLeft);

  if (guess === targetNumber) {
    showFeedback("🎉 Congratulations! You guessed it!", "success");
    endGame(true);
    return;
  }

  if (attemptsLeft === 0) {
    showFeedback(`😞 Game Over! The number was ${targetNumber}.`, "error");
    endGame(false);
    return;
  }

  if (guess > targetNumber) {
    showFeedback("📉 Too high! Try a lower number.", "high");
  } else {
    showFeedback("📈 Too low! Try a higher number.", "low");
  }
  if (guessInput) {
    guessInput.value = "";
    guessInput.focus();
  }
}

function endGame(won: boolean): void {
  gameActive = false;
  if (guessInput) guessInput.disabled = true;
  if (submitBtn) submitBtn.disabled = true;
  gameContainer?.classList.add("hidden");
  gameOverContainer?.classList.remove("hidden");
  resetBtn?.classList.remove("hidden");

  if (won) {
    const attempts = MAX_ATTEMPTS - attemptsLeft;
    const points = attemptsLeft * POINTS_PER_ATTEMPT;
    saveScore("number_guessing", points);
    if (gameOverMessage) {
      gameOverMessage.innerHTML = `
        <h2 class="text-2xl font-bold text-green-600 mb-2">🏆 You Won!</h2>
        <p class="text-gray-700">You guessed the number <strong>${targetNumber}</strong> in <strong>${attempts}</strong> attempt${attempts === 1 ? "" : "s"}!</p>
      `;
    }
  } else {
    saveScore("number_guessing", 0);
    if (gameOverMessage) {
      gameOverMessage.innerHTML = `
        <h2 class="text-2xl font-bold text-red-600 mb-2">💔 Game Over</h2>
        <p class="text-gray-700">The number was <strong>${targetNumber}</strong>. Don't give up!</p>
      `;
    }
  }
  renderGameScoreboard();
}

function handleSubmit(): void {
  if (!gameActive) return;
  const userInput = guessInput?.value || "";
  const validation = validateInput(userInput);
  if (!validation.isValid) {
    showFeedback(validation.message || "Invalid input", "error");
    guessInput?.focus();
    return;
  }
  processGuess(validation.number as number);
}

function renderGameScoreboard(): void {
  const tbody = document.getElementById("gameScoreboardBody") as HTMLTableSectionElement | null;
  if (!tbody) return;
  tbody.innerHTML = "";
  const rows = getScoreboardForGame("number_guessing");
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.className = "bg-neutral-primary";
    tr.innerHTML = `<td colspan="2" class="px-6 py-4 text-center text-(--color-secondary-text)">There are no scores for Number Guessing yet.</td>`;
    tbody.appendChild(tr);
    return;
  }
  rows.forEach((u, idx) => {
    const tr = renderScoreboardRow(u.username, (u.score || 0), idx, '');
    if (tr) tbody.appendChild(tr);
  });
}

// Init
submitBtn?.addEventListener("click", handleSubmit);
guessInput?.addEventListener("keypress", (event: KeyboardEvent) => {
  if (event.key === "Enter") {
    event.preventDefault();
    handleSubmit();
  }
});
resetBtn?.addEventListener("click", initGame);
initGame();
renderGameScoreboard();
