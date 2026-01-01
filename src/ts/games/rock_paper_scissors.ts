import { getCurrentUser, saveScore, getScoreboardForGame, renderScoreboardRow } from '../storage';

if (!getCurrentUser()) {
  window.location.href = "../../index.html#games";
}

type Choice = { text: 'rock' | 'paper' | 'scissors'; emoji: string };
const options: Choice[] = [{ text: 'rock', emoji: "🪨" }, { text: 'paper', emoji: "📄" }, { text: 'scissors', emoji: "✂️" }];

const choices = Array.prototype.slice.call(document.querySelectorAll('.rps-choice')) as HTMLButtonElement[];
const playAgainBtn = document.getElementById('playAgainBtn') as HTMLButtonElement | null;
const resultBox = document.getElementById('resultBox') as HTMLDivElement | null;

const mobileWelcome = document.getElementById('mobileWelcomeMessage') as HTMLDivElement | null;
const mobileWelcomeName = document.getElementById('mobileWelcomeName') as HTMLSpanElement | null;

const u = getCurrentUser();
if (u) {
  if (mobileWelcome && mobileWelcomeName) {
    mobileWelcomeName.textContent = u;
    mobileWelcome.classList.remove('hidden');
  }
}

function getComputerChoice(): Choice {
  const randomIndex = Math.floor(Math.random() * options.length);
  return options[randomIndex];
}

function determineWinner(playerChoice: Choice, computerChoice: Choice): "You win!" | "Computer wins!" | "It's a tie!" {
  if (playerChoice.text === computerChoice.text) return "It's a tie!";
  switch (playerChoice.text) {
    case 'rock': return computerChoice.text === 'scissors' ? "You win!" : "Computer wins!";
    case 'paper': return computerChoice.text === 'rock' ? "You win!" : "Computer wins!";
    case 'scissors': return computerChoice.text === 'paper' ? "You win!" : "Computer wins!";
    default: return "Computer wins!";
  }
}

function calculatePoints(result: string): number {
  const WIN_POINTS = 10;
  const TIE_POINTS = 5;
  let points = 0;
  if (result === "You win!") points = WIN_POINTS;
  else if (result === "It's a tie!") points = TIE_POINTS;
  else points = 0;
  return points;
}

function handleChoiceClick(selectedText: string | null): void {
  const playerChoice = options.find((opt) => opt.text === selectedText) as Choice;
  const computerChoice = getComputerChoice();
  const result = determineWinner(playerChoice, computerChoice);
  showStyledResult(result, playerChoice, computerChoice);
  const points = calculatePoints(result);
  saveScore("rock_paper_scissors", points);
  renderGameScoreboard();
}

choices.forEach((btn) => {
  btn.addEventListener('click', function () {
    handleChoiceClick(btn.getAttribute('data-choice'));
  });
});

function showStyledResult(result: string, playerChoice: Choice, computerChoice: Choice): void {
  if (!resultBox) return;
  resultBox.classList.remove("hidden", "bg-green-100", "text-green-800", "bg-red-100", "text-red-800", "bg-yellow-100", "text-yellow-800");
  let html = "";
  if (result === "You win!") {
    resultBox.classList.add("bg-green-100", "text-green-800");
    html = `<h2 class="text-2xl font-bold mb-2">🏆 You Won!</h2><p>You ${playerChoice.emoji} beat ${computerChoice.emoji}. Great job!</p>`;
  } else if (result === "Computer wins!") {
    resultBox.classList.add("bg-red-100", "text-red-800");
    html = `<h2 class="text-2xl font-bold mb-2">💔 You Lost</h2><p>${computerChoice.emoji} beats ${playerChoice.emoji}. Try again!</p>`;
  } else {
    resultBox.classList.add("bg-yellow-100", "text-yellow-800");
    html = `<h2 class="text-2xl font-bold mb-2">🤝 It's a Tie</h2><p>You both chose ${playerChoice.emoji}. Keep going!</p>`;
  }
  resultBox.innerHTML = html;
  resultBox.classList.remove("hidden");
}

playAgainBtn?.addEventListener('click', function () {
  if (resultBox) {
    resultBox.classList.add("hidden");
    resultBox.innerHTML = "";
  }
});

function renderGameScoreboard(): void {
  const tbody = document.getElementById("gameScoreboardBody") as HTMLTableSectionElement | null;
  if (!tbody) return;
  tbody.innerHTML = "";
  const rows = getScoreboardForGame("rock_paper_scissors");
  if (!rows.length) {
    const tr = document.createElement("tr");
    tr.className = "bg-neutral-primary";
    tr.innerHTML = `<td colspan="2" class="px-6 py-4 text-center text-(--color-secondary-text)">There are no scores for Rock Paper Scissors yet.</td>`;
    tbody.appendChild(tr);
    return;
  }
  rows.forEach((u, idx) => {
    const tr = renderScoreboardRow(u.username, (u.score || 0), idx, '');
    if (tr) tbody.appendChild(tr);
  });
}

renderGameScoreboard();
