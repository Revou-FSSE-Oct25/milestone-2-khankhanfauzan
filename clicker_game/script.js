// clicker game/script.js
let score = 0;
const timeLimit = 5; // seconds
const scoreDisplay = document.getElementById("scoreDisplay");
const clickButton = document.getElementById("clickButton");
const timerDisplay = document.getElementById("timerDisplay");


clickButton.addEventListener("click", function () {
    score++;
    scoreDisplay.textContent = `Score: ${score}`;
});


function startTimer(duration) {
    let timer = duration, seconds;
    const countdown = setInterval(function () {
        seconds = parseInt(timer, 10);
        timerDisplay.textContent = `${seconds}s`;

        if (--timer < 0) {
            clearInterval(countdown);
            clickButton.disabled = true;
            const finalScore = calculateFinalScore(score, 0);
            timerDisplay.textContent = `Time's up! Final Score: ${score}`;
        }
    }, 1000);
}

window.onload = function () {
    startTimer(timeLimit);
};