if (!window.getCurrentUser || !getCurrentUser()) {
    window.location.href = "../../index.html#games";
}
const options = [{ text: 'rock', emoji: "🪨" }, { text: 'paper', emoji: "📄" }, { text: 'scissors', emoji: "✂️" }];

const choices = Array.prototype.slice.call(document.querySelectorAll('.rps-choice'));
const playAgainBtn = document.getElementById('playAgainBtn');
const resultBox = document.getElementById('resultBox');

function getComputerChoice() {
    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}

function determineWinner(playerChoice, computerChoice) {
    if (playerChoice.text === computerChoice.text) {

        return "It's a tie!";
    }

    if (
        (playerChoice.text === 'rock' && computerChoice.text === 'scissors') ||
        (playerChoice.text === 'paper' && computerChoice.text === 'rock') ||
        (playerChoice.text === 'scissors' && computerChoice.text === 'paper')
    ) {
        return "You win!";
    } else {
        return "Computer wins!";
    }
}

function calculatePoints(result) {
    var points = 0;
    if (result === "You win!") points = 10;
    else if (result === "It's a tie!") points = 5;
    else points = 0;
    return points;
}

function handleChoiceClick(selectedText) {
    var playerChoice = options.find(function (opt) { return opt.text === selectedText; });
    var computerChoice = getComputerChoice();
    var result = determineWinner(playerChoice, computerChoice);
    showStyledResult(result, playerChoice, computerChoice);
    var points = calculatePoints(result);
    if (window.saveScore) window.saveScore("rock_paper_scissors", points);
    renderGameScoreboard();
}


choices.forEach(function (btn) {
    btn.addEventListener('click', function () {
        handleChoiceClick(btn.getAttribute('data-choice'));
    });
});

function showStyledResult(result, playerChoice, computerChoice) {
    if (!resultBox) return;
    resultBox.classList.remove("hidden", "bg-green-100", "text-green-800", "bg-red-100", "text-red-800", "bg-yellow-100", "text-yellow-800");
    var html = "";
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

if (playAgainBtn) {
    playAgainBtn.addEventListener('click', function () {
        message.textContent = "";
        if (resultBox) {
            resultBox.classList.add("hidden");
            resultBox.innerHTML = "";
        }
    });
}

function renderGameScoreboard() {
    var tbody = document.getElementById("gameScoreboardBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    var rows = window.getScoreboardForGame ? window.getScoreboardForGame("rock_paper_scissors") : [];
    if (!rows.length) {
        var tr = document.createElement("tr");
        tr.className = "bg-neutral-primary";
        var td = document.createElement("td");
        td.colSpan = 2;
        td.className = "px-6 py-4 text-center text-(--color-secondary-text)";
        td.textContent = "There are no scores for Rock Paper Scissors yet.";
        tr.appendChild(td);
        tbody.appendChild(tr);
        return;
    }
    rows.forEach(function (u, idx) {
        var tr = document.createElement("tr");
        tr.className = "bg-neutral-primary border-b border-default";
        var th = document.createElement("th");
        th.scope = "row";
        th.className = "px-6 py-4 font-medium text-heading whitespace-nowrap";
        th.innerHTML = u.username + (idx === 0 ? ' <i class="ri-vip-crown-fill text-yellow-500 ml-2"></i>' : "");
        var tdScore = document.createElement("td");
        tdScore.className = "px-6 py-4";
        tdScore.textContent = String(u.score || 0);
        tr.appendChild(th);
        tr.appendChild(tdScore);
        tbody.appendChild(tr);
    });
}
renderGameScoreboard();
