if (!window.getCurrentUser || !getCurrentUser()) {
    window.location.href = "../../index.html#games";
}
// Game state variables
let targetNumber;
let attemptsLeft;
let gameActive;
let previousGuesses;

// DOM elements
const guessInput = document.getElementById("guessInput");
const submitBtn = document.getElementById("submitBtn");
const feedback = document.getElementById("feedback");
const attemptsLeftSpan = document.getElementById("attemptsLeft");
const gameContainer = document.getElementById("gameContainer");
const gameOverContainer = document.getElementById("gameOverContainer");
const gameOverMessage = document.getElementById("gameOverMessage");
const resetBtn = document.getElementById("resetBtn");
const previousGuessesList = document.getElementById("guessList");
const previousGuessesContainer = document.getElementById("previousGuesses");

/**
 * Initialize a new game
 * Sets up all game variables and resets the UI
 */
function initGame() {
    // Generate random number between 1 and 100
    targetNumber = Math.floor(Math.random() * 100) + 1;
    attemptsLeft = 10;
    gameActive = true;
    previousGuesses = [];

    // Reset UI elements
    guessInput.value = "";
    guessInput.disabled = false;
    submitBtn.disabled = false;
    attemptsLeftSpan.textContent = attemptsLeft;

    // Hide/show appropriate containers
    gameContainer.classList.remove("hidden");
    gameOverContainer.classList.add("hidden");
    resetBtn.classList.add("hidden");
    feedback.classList.add("hidden");
    previousGuessesContainer.classList.add("hidden");

    // Clear previous guesses display
    previousGuessesList.innerHTML = "";

    // Focus on input for better UX
    guessInput.focus();

    console.log("New game started! Target number:", targetNumber); // For debugging (remove in production)
}

/**
 * Validate user input
 * @param {string} input - The user's input
 * @returns {object} - Validation result with isValid boolean and message
 */
function validateInput(input) {
    // Trim whitespace
    input = input.trim();

    // Check if empty
    if (input === "") {
        return { isValid: false, message: "Please enter a number!" };
    }

    // Check if it's a valid integer
    const num = Number(input);
    if (isNaN(num) || !Number.isInteger(num) || num < 1) {
        return { isValid: false, message: "Please enter a valid number between 1 and 100!" };
    }

    // Check range (1-100)
    if (num < 1 || num > 100) {
        return { isValid: false, message: "Please enter a number between 1 and 100!" };
    }

    // Check for duplicate guesses
    if (previousGuesses.includes(num)) {
        return { isValid: false, message: "You already guessed that number!" };
    }

    // All checks passed
    return { isValid: true, number: num };
}

/**
 * Display feedback message to the user
 * @param {string} message - The message to display
 * @param {string} type - The type of message (success, error, info)
 */
function showFeedback(message, type = "info") {
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

    // Apply appropriate styling based on message type
    switch (type) {
        case "success":
            feedback.classList.add("bg-green-100", "text-green-800");
            break;
        case "error":
            feedback.classList.add("bg-red-100", "text-red-800");
            break;
        case "high":
            feedback.classList.add("bg-yellow-100", "text-yellow-800");
            break;
        case "low":
            feedback.classList.add("bg-blue-100", "text-blue-800");
            break;
        default:
            feedback.classList.add("bg-blue-100", "text-blue-800");
    }
}

/**
 * Add a guess to the previous guesses display
 * @param {number} guess - The number that was guessed
 */
function addToPreviousGuesses(guess) {
    previousGuesses.push(guess);

    // Create a span element for the guess
    const guessSpan = document.createElement("span");
    guessSpan.textContent = guess;
    guessSpan.className = "px-2 py-1 bg-gray-200 text-gray-700 rounded text-sm";

    previousGuessesList.appendChild(guessSpan);
    previousGuessesContainer.classList.remove("hidden");
}

/**
 * Process the user's guess
 * @param {number} guess - The user's guess
 */
function processGuess(guess) {
    // Add to previous guesses and display
    addToPreviousGuesses(guess);

    // Decrement attempts
    attemptsLeft--;
    attemptsLeftSpan.textContent = attemptsLeft;

    // Check if guess is correct
    if (guess === targetNumber) {
        showFeedback("🎉 Congratulations! You guessed it!", "success");
        endGame(true);
        return;
    }

    // Check if no attempts left
    if (attemptsLeft === 0) {
        showFeedback(`😞 Game Over! The number was ${targetNumber}.`, "error");
        endGame(false);
        return;
    }

    // Provide high/low feedback
    if (guess > targetNumber) {
        showFeedback("📉 Too high! Try a lower number.", "high");
    } else {
        showFeedback("📈 Too low! Try a higher number.", "low");
    }

    // Clear input field and refocus
    guessInput.value = "";
    guessInput.focus();
}

/**
 * End the current game
 * @param {boolean} won - Whether the player won or lost
 */
function endGame(won) {
    gameActive = false;
    guessInput.disabled = true;
    submitBtn.disabled = true;

    // Show game over container
    gameContainer.classList.add("hidden");
    gameOverContainer.classList.remove("hidden");
    resetBtn.classList.remove("hidden");

    // Set appropriate game over message
    if (won) {
        const attempts = 10 - attemptsLeft;
        const points = attemptsLeft * 10;
        if (window.saveScore) window.saveScore("number_guessing", points);
        gameOverMessage.innerHTML = `
            <h2 class="text-2xl font-bold text-green-600 mb-2">🏆 You Won!</h2>
            <p class="text-gray-700">You guessed the number <strong>${targetNumber}</strong> in <strong>${attempts}</strong> attempt${attempts === 1 ? "" : "s"
            }!</p>
        `;
    } else {
        if (window.saveScore) window.saveScore("number_guessing", 0);
        gameOverMessage.innerHTML = `
            <h2 class="text-2xl font-bold text-red-600 mb-2">💔 Game Over</h2>
            <p class="text-gray-700">The number was <strong>${targetNumber}</strong>. Don't give up!</p>
        `;
    }
    renderGameScoreboard();
}

/**
 * Handle the submit button click or Enter key press
 */
function handleSubmit() {
    if (!gameActive) return;

    const userInput = guessInput.value;
    const validation = validateInput(userInput);

    if (!validation.isValid) {
        showFeedback(validation.message, "error");
        guessInput.focus();
        return;
    }

    processGuess(validation.number);
}

// Event listeners
// YOUR CODE HERE

submitBtn.addEventListener("click", handleSubmit);
guessInput.addEventListener("keypress", (event) => {
    if (event.key == "Enter") {
        event.preventDefault();
        handleSubmit();
        console.log("Submit")
    }

})

resetBtn.addEventListener("click", initGame);


// Initialize the game when page loads
initGame();

function renderGameScoreboard() {
    var tbody = document.getElementById("gameScoreboardBody");
    if (!tbody) return;
    tbody.innerHTML = "";
    var rows = window.getScoreboardForGame ? window.getScoreboardForGame("number_guessing") : [];
    if (!rows.length) {
        var tr = document.createElement("tr");
        tr.className = "bg-neutral-primary";
        var td = document.createElement("td");
        td.colSpan = 2;
        td.className = "px-6 py-4 text-center text-(--color-secondary-text)";
        td.textContent = "There are no scores for Number Guessing yet.";
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
