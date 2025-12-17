if (!window.getCurrentUser || !getCurrentUser()) {
    window.location.href = "../../index.html#games";
}
let score = 0;
const timeLimit = 10;

const scoreDisplay = document.getElementById("scoreDisplay");
const clickButton = document.getElementById("clickButton");
const timerDisplay = document.getElementById("timerDisplay");
const playAgainBtn = document.getElementById("playAgainBtn");

var defaultImg = "../../assets/images/cat.png";
var openImg = "../../assets/images/cat-open.png";
var countdownId = null;

const audioSources = ['../assets/audios/pop1.ogg', '../assets/audios/pop2.ogg', '../assets/audios/pop3.ogg', '../assets/audios/pop4.ogg'];
const rotateScores = ["-rotate-5", "rotate-5", "-rotate-10", "rotate-10", "rotate-15", "-rotate-15"];


clickButton.addEventListener("click", function () {
    if (clickButton.disabled) return;
    score++;
    scoreDisplay.textContent = String(score);
});
clickButton.addEventListener("pointerdown", function () {
    if (clickButton.disabled) return;
    if (clickButton) clickButton.src = openImg;
    playRandomAudio();
    currentRotation = getRandomRotateScore();
    scoreDisplay.classList.add("scale-125", currentRotation);

});
clickButton.addEventListener("pointerup", function () {
    if (clickButton.disabled) return;
    if (clickButton) clickButton.src = defaultImg;
    scoreDisplay.classList.remove("scale-125", currentRotation);
});
clickButton.addEventListener("pointerleave", function () {
    if (clickButton.disabled) return;
    if (clickButton) clickButton.src = defaultImg;
});
clickButton.addEventListener("pointercancel", function () {
    if (clickButton.disabled) return;
    if (clickButton) clickButton.src = defaultImg;
});

function getRandomAudio() {
    const randomIndex = Math.floor(Math.random() * audioSources.length);
    return audioSources[randomIndex];
}

function playRandomAudio() {
    const selectedSource = getRandomAudio();
    const audio = new Audio(selectedSource);

    audio.play().then(() => {
        // Optional: Log which sound was played
        console.log(`Successfully played: ${selectedSource}`);
    })
        .catch(error => {
            // Handle any errors (e.g., browser restrictions on autoplay)
            console.error(`Playback failed for ${selectedSource}:`, error);
            // Browsers often require a user gesture (like a click) to allow audio.
            // Since this is in a mousedown event, it should usually work.
        });
}

function getRandomRotateScore() {
    const randomIndex = Math.floor(Math.random() * rotateScores.length);
    return rotateScores[randomIndex];
}

let currentRotation = getRandomRotateScore();


function startTimer(duration) {
    let timer = duration, seconds;
    if (countdownId) clearInterval(countdownId);
    if (playAgainBtn) playAgainBtn.classList.add("hidden");
    countdownId = setInterval(function () {
        seconds = parseInt(timer, 10);
        timerDisplay.textContent = `${seconds}s`;

        if (--timer < 0) {
            clearInterval(countdownId);
            countdownId = null;
            clickButton.disabled = true;
            clickButton.style.pointerEvents = "none";
            clickButton.classList.add("opacity-50", "cursor-not-allowed");
            if (window.saveScore) window.saveScore("clicker", score);
            timerDisplay.textContent = `Time's up! Final Score: ${score}`;
            if (clickButton) clickButton.src = defaultImg;
            if (playAgainBtn) playAgainBtn.classList.remove("hidden");
            renderGameScoreboard();
        }
    }, 1000);
}

window.onload = function () {
    startTimer(timeLimit);
};
if (playAgainBtn) {
    playAgainBtn.addEventListener("click", function () {
        score = 0;
        scoreDisplay.textContent = "0";
        clickButton.disabled = false;
        clickButton.style.pointerEvents = "auto";
        clickButton.classList.remove("opacity-50", "cursor-not-allowed");
        if (clickButton) clickButton.src = defaultImg;
        startTimer(timeLimit);
    });
}

function renderGameScoreboard() {
    var tbody = document.getElementById("gameScoreboardBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    var rows = window.getScoreboardForGame ? window.getScoreboardForGame("clicker") : [];
    if (!rows.length) {
        var tr = document.createElement("tr");
        tr.className = "bg-neutral-primary";
        var td = document.createElement("td");
        td.colSpan = 2;
        td.className = "px-6 py-4 text-center text-(--color-secondary-text)";
        td.textContent = "There are no scores for Clicker yet.";
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
