const simpleMoves = ["Jab", "Hook", "Upper-cut", "Cross"];
const bodyMovements = ["move Front", "move Back", "move Right", "move Left"];
const combinedMoves = ["Jab Cross", "Hook Upper-cut", "Cross Hook", "Jab Hook"];
const arms = ["Left", "Right"]; // Define the arms array

let intervalId = null;
let bpm = 30; // Default BPM value
const speechDuration = 2000; // Estimated duration for the voice to speak (in milliseconds)
let selectedVoice = null;

console.log('Adding event listeners');

// Initialize the voice selection
function setVoice() {
    const voices = window.speechSynthesis.getVoices();
    // Select a voice that fits the description or fallback to a default
    selectedVoice = voices.find(voice => voice.name.includes("en-US") && voice.voiceURI.includes("Google US English")) || voices[0];
    console.log('Selected Voice:', selectedVoice);
}

window.speechSynthesis.onvoiceschanged = setVoice;

document.getElementById('play-pause-button').addEventListener('click', togglePlayPause);
document.getElementById('minus-button').addEventListener('click', decreaseBpm);
document.getElementById('plus-button').addEventListener('click', increaseBpm);
document.getElementById('bpm-input').addEventListener('input', updateBpmFromInput);

document.getElementById('toggle-moves').addEventListener('change', () => {
    if (document.getElementById('toggle-moves').checked) {
        document.getElementById('toggle-combined-moves').checked = false;
    }
});

document.getElementById('toggle-combined-moves').addEventListener('change', () => {
    if (document.getElementById('toggle-combined-moves').checked) {
        document.getElementById('toggle-moves').checked = false;
    }
});

function togglePlayPause() {
    console.log('Toggling play/pause');
    const button = document.getElementById('play-pause-button');
    const pace = (60000 / bpm) + speechDuration; // Convert BPM to interval in milliseconds, adding speech duration
    console.log('Current pace:', pace);

    if (intervalId) {
        clearInterval(intervalId);
        intervalId = null;
        button.innerHTML = '<i class="fas fa-play"></i> Play';
        console.log('Interval cleared');
    } else {
        playInstructions();
        intervalId = setInterval(playInstructions, pace);
        button.innerHTML = '<i class="fas fa-pause"></i> Pause';
        console.log('Interval set with pace:', pace);
    }
}

function playInstructions() {
    console.log('Playing instructions');
    const movesToggle = document.getElementById('toggle-moves').checked;
    const combinedMovesToggle = document.getElementById('toggle-combined-moves').checked;
    const bodyMovementsToggle = document.getElementById('toggle-body-movements').checked;
    console.log('Simple Moves toggle:', movesToggle, 'Combined Moves toggle:', combinedMovesToggle, 'Body Movements toggle:', bodyMovementsToggle);

    let instruction;

    if (combinedMovesToggle) {
        const move = getRandomElement(combinedMoves);
        instruction = getCombinedMoveInstructions(move);
    } else if (movesToggle && bodyMovementsToggle) {
        const instructions = [getSimpleMoveWithArm(getRandomElement(simpleMoves)), getRandomElement(bodyMovements)];
        instruction = instructions.sort(() => Math.random() - 0.5).join(' then ');
    } else if (movesToggle) {
        instruction = getSimpleMoveWithArm(getRandomElement(simpleMoves));
    } else if (bodyMovementsToggle) {
        instruction = getRandomElement(bodyMovements);
    } else {
        instruction = "No instruction selected";
    }

    document.getElementById('instruction').textContent = instruction;
    console.log('Instruction:', instruction);
    speak(instruction);
}

function getSimpleMoveWithArm(move) {
    switch (move) {
        case "Jab":
            return `${move} with Left hand`;
        case "Cross":
            return `${move} with Right hand`;
        case "Hook":
        case "Upper-cut":
            return `${move} with ${getRandomElement(arms)} hand`;
        default:
            return move;
    }
}

function getCombinedMoveInstructions(move) {
    const moveParts = move.split(" ");
    return moveParts.map(part => {
        if (part === "Jab") {
            return "Jab with Left hand";
        } else if (part === "Cross") {
            return "Cross with Right hand";
        } else {
            return `${part} with ${getRandomElement(arms)} hand`;
        }
    }).join(" and ");
}

function getRandomElement(array) {
    return array[Math.floor(Math.random() * array.length)];
}

function speak(text) {
    console.log('Speaking:', text);
    if ('speechSynthesis' in window) {
        const synth = window.speechSynthesis;
        const utterance = new SpeechSynthesisUtterance(text);
        
        if (selectedVoice) {
            utterance.voice = selectedVoice;
        }
        
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
