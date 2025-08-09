// Check for browser compatibility
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

if (SpeechRecognition) {
  const recognition = new SpeechRecognition();
  const toggleButton = document.getElementById('toggle-btn');
  const outputArea = document.getElementById('output');
  const languageSelect = document.getElementById('language-select');
  const copyButton = document.getElementById('copy-btn');
  let isRecognizing = false;
  let finalTranscript = ''; // Store finalized transcript

  // Set the initial language based on the dropdown
  recognition.lang = languageSelect.value;
  recognition.interimResults = true; // Enable interim results for live transcription

  // Update language when the user selects a different one
  languageSelect.addEventListener('change', () => {
    recognition.lang = languageSelect.value;
  });

  // Toggle speech recognition start/stop
  toggleButton.addEventListener('click', () => {
    if (isRecognizing) {
      recognition.stop(); // Stop the recognition
      toggleButton.textContent = 'Start Speaking';
      toggleButton.style.backgroundColor = ''; // Reset button color
    } else {
      recognition.start(); // Start the recognition
      toggleButton.textContent = 'Stop Speaking';
      toggleButton.style.backgroundColor = 'red'; // Indicate active recording
    }
    isRecognizing = !isRecognizing; // Toggle the state
  });

  // Update the textarea dynamically with live transcription
  recognition.onresult = (event) => {
    let interimTranscript = ''; // Store interim results
    for (let i = 0; i < event.results.length; i++) {
      const result = event.results[i];
      if (result.isFinal) {
        finalTranscript += result[0].transcript + ' '; // Append final results
      } else {
        interimTranscript += result[0].transcript; // Append interim results
      }
    }
    // Update the textarea: combine final transcript and interim transcript
    outputArea.value = finalTranscript + interimTranscript;
  };

  // Handle recognition errors
  recognition.onerror = (event) => {
    console.error(`Speech Recognition Error: ${event.error}`);
    alert(`Error: ${event.error}`);
    toggleButton.textContent = 'Start Speaking';
    toggleButton.style.backgroundColor = ''; // Reset button color
    isRecognizing = false; // Reset the state
  };

  // Reset when recognition ends
  recognition.onend = () => {
    if (isRecognizing) {
      setTimeout(() => recognition.start(), 500); // Restart recognition with a delay
    } else {
      toggleButton.textContent = 'Start Speaking';
      toggleButton.style.backgroundColor = ''; // Reset button color
    }
  };

  // Copy text from the textarea
  copyButton.addEventListener('click', () => {
    navigator.clipboard.writeText(outputArea.value).then(() => {
      alert('Text copied to clipboard!');
    }).catch((err) => {
      console.error('Error copying text: ', err);
    });
  });
} else {
  alert('Your browser does not support Speech Recognition. Please use Google Chrome for the best experience. Download it from: https://www.google.com/chrome/');
}
