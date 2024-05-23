const moves = ["Jab", "Hook", "Upper-cut", "Cross"];
const bodyMovements = ["Front", "Back", "Right", "Left"];

let intervalId = null;
let bpm = 30; // Default BPM value
const speechDuration = 2000; // Estimated duration for the voice to speak (in milliseconds)

console.log('Adding event listeners');

document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
document.getElementById('minus-button').addEventListener('click', decreaseBpm);
document.getElementById('plus-button').addEventListener('click', increaseBpm);
document.getElementById('bpm-input').addEventListener('input', updateBpmFromInput);

function togglePlayPause() {
    console.log('Toggling play/pause');
    const button = document.getElementById('play-pause-button');
    const pace = (60000 / bpm) + speechDuration; // Convert BPM to interval in milliseconds, adding speech duration
    console.log('Current pace:', pace);

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        button.textContent = 'Play';
        console.log('Interval cleared');
    } else {
        playInstructions();
        intervalId = setInterval(playInstructions, pace);
        button.textContent = 'Pause';
        console.log('Interval set with pace:', pace);
    }
}

function playInstructions() {
    console.log('Playing instructions');
    const movesToggle = document.getElementById('toggle-moves').checked;
    const bodyMovementsToggle = document.getElementById('toggle-body-movements').checked;
    console.log('Moves toggle:', movesToggle, 'Body movements toggle:', bodyMovementsToggle);

    let instruction;

    if (movesToggle && bodyMovementsToggle) {
        const move = getRandomElement(moves);
        const movement = getRandomElement(bodyMovements);
        instruction = `${move} and move ${movement}`;
    } else if (movesToggle) {
        instruction = getRandomElement(moves);
    } else if (bodyMovementsToggle) {
        instruction = getRandomElement(bodyMovements);
    } else {
        instruction = "No instruction selected";
    }

    document.getElementById('instruction').textContent = instruction;
    console.log('Instruction:', instruction);
    speak(instruction);
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function speak(text) {
    console.log('Speaking:', text);
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        utterance.onstart = () => {
            console.log('Speech started');
        };
        
        utterance.onend = () => {
            console.log('Speech ended');
        };
        
        utterance.onerror = (event) => {
            console.error('Speech error:', event.error);
        };
        
        synth.speak(utterance);
    } else {
        console.error('Speech synthesis not supported');
    }
}

function decreaseBpm() {
    bpm = Math.max(5, bpm - 1);
    updateBpmDisplay();
}

function increaseBpm() {
    bpm = Math.min(60, bpm + 1);
    updateBpmDisplay();
}

function updateBpmFromInput(event) {
    bpm = Math.max(5, Math.min(60, parseInt(event.target.value, 10)));
    updateBpmDisplay();
}

function updateBpmDisplay() {
    document.getElementById('bpm-input').value = bpm;
    console.log('BPM updated to:', bpm);
}
