const options = [{ text: 'rock', emoji: "🪨" }, { text: 'paper', emoji: "📄" }, { text: 'scissors', emoji: "✂️" }];

const dropdowns = document.getElementById('playerChoice');
const buttons = document.getElementById('playButton');
const message = document.getElementById('message');

// loop the options to create dropdown items
options.forEach(option => {
    const opt = document.createElement('option');
    opt.value = option.text;
    opt.textContent = `${option.text} ${option.emoji}`;
    dropdowns.appendChild(opt);
});

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


buttons.addEventListener('click', () => {
    console.log("Play button clicked");

    const selectedText = dropdowns.value;
    const playerChoice = options.find(opt => opt.text === selectedText);
    console.log("Player choice:", playerChoice);
    const computerChoice = getComputerChoice();

    const result = determineWinner(playerChoice, computerChoice);

    message.textContent = `You chose ${playerChoice.text} ${playerChoice.emoji}. Computer chose ${computerChoice.text} ${computerChoice.emoji}. ${result}`;
})