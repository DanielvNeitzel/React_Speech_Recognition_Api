// src/App.js
import React, { useState } from 'react';
import './App.css';

function App() {
  const [transcript, setTranscript] = useState('');
  const [recognition, setRecognition] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [showTextToRead, setShowTextToRead] = useState(false);

  const startRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const recognition = new SpeechRecognition();
    recognition.lang = 'pt-BR';
    setShowTextToRead(false);

    recognition.onresult = event => {
      const transcript = event.results[0][0].transcript;
      setTranscript(transcript);
      setShowTextToRead(true);
      setIsRecording(false); // Adicionamos isso para mostrar o botão "Começar Gravação" após a conclusão da gravação
    };

    recognition.onend = () => {
      setRecognition(null);
    };

    recognition.onerror = event => {
      if (event.error === 'no-speech') {
        setShowTextToRead(true);
        setTranscript('Não foi possível ouvir, tente novamente.');
        setIsRecording(false);
      }
    };

    setRecognition(recognition);
    recognition.start();
    setIsRecording(true);
  };

  const stopRecording = () => {
    if (recognition) {
      recognition.stop();
    }
    setIsRecording(false);
  };

  const speakText = () => {
    if ('speechSynthesis' in window) {
      const speech = new SpeechSynthesisUtterance();
      speech.text = transcript;
      speechSynthesis.speak(speech);
    }
  };

  return (
    <div className="containe d-flex justify-content-center align-content-center flex-column mt-5">
      <h1 className="text-center">Exemplo de fala em texto</h1>
      <div className="d-flex justify-content-center align-content-center">
        <button onClick={startRecording} className={`btn-custom btn-play mt-3 ${isRecording ? 'd-none' : ''}`}>Começar Gravação</button>
        <button onClick={stopRecording} className={`btn-custom btn-stop mt-3 ${!isRecording ? 'd-none' : ''}`}>Parar Gravação</button>
      </div>
      {showTextToRead && (
        <>
          <textarea value={transcript} readOnly rows="4" className="form-control mt-3"></textarea>
          <div className="d-grid gap-2">
            <button onClick={speakText} className="btn btn-success mt-3">Falar Texto</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
