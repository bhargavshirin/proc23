const audioContext = new (window.AudioContext || window.webkitAudioContext)();
const analyser = audioContext.createAnalyser();
analyser.fftSize = 256;
const dataArray = new Uint8Array(analyser.frequencyBinCount);
const talkingThreshold = 30;

let isMonitoring = true;
let microphoneStream;
let customAlertVisible = false; // Added variable to track alert visibility

function monitorSoundStrength() {
    if (!isMonitoring) {
        return;
    }

    analyser.getByteFrequencyData(dataArray);

    // Calculate the average sound strength across all frequency bins
    let sum = 0;
    for (let i = 0; i < dataArray.length; i++) {
        sum += dataArray[i];
    }
    const averageSoundStrength = sum / dataArray.length;

    if (averageSoundStrength > talkingThreshold && !customAlertVisible) {
        // Display the custom alert
        const customAlert = document.getElementById('customAlert');
        customAlert.style.display = 'block';
        customAlertVisible = true; // Set alert as visible
    } else if (averageSoundStrength <= talkingThreshold && customAlertVisible) {
        // Hide the custom alert
        const customAlert = document.getElementById('customAlert');
        customAlert.style.display = 'none';
        customAlertVisible = false; // Set alert as hidden
    }
    requestAnimationFrame(monitorSoundStrength);
}

// Access the microphone and start monitoring as soon as the page loads
navigator.mediaDevices.getUserMedia({ audio: true })
    .then((stream) => {
        const microphoneSource = audioContext.createMediaStreamSource(stream);
        microphoneSource.connect(analyser);
        microphoneStream = stream;

        // Start monitoring sound strength
        monitorSoundStrength();
    })
    .catch((error) => {
        console.error('Error accessing microphone:', error);
        // Display an error message using the custom alert
        const customAlert = document.getElementById('customAlert');
        customAlert.textContent = "Error accessing microphone. Please try again.";
        customAlert.style.backgroundColor = '#ff0000'; // Red background for error
        customAlert.style.display = 'block';
    });

// Function to stop monitoring when needed
function stopMonitoring() {
    isMonitoring = false;

    // Disconnect the microphone and stop monitoring
    analyser.disconnect();
    if (microphoneStream) {
        microphoneStream.getTracks().forEach((track) => {
            track.stop();
        });
    }
}