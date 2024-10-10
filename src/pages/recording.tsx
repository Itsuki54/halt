// pages/index.tsx
import { useState, useRef } from 'react';

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<string[] >([]);
  const [loading, setLoading] = useState(false);
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const audioChunksRef = useRef<Blob[]>([]);

  const startRecording = async () => {
    setIsRecording(true);

    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;

    mediaRecorder.start();
    audioChunksRef.current = [];

    mediaRecorder.ondataavailable = (event) => {
      audioChunksRef.current.push(event.data);
    };
  };

  const stopRecording = () => {
    setIsRecording(false);
    const mediaRecorder = mediaRecorderRef.current;
    if (mediaRecorder) {
      mediaRecorder.stop();

      mediaRecorder.onstop = async () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
        await transcribeAudio(audioBlob);
      };
    }
  };

	const transcribeAudio = async (audioBlob: Blob) => {
    setLoading(true);

    const formData = new FormData();
    formData.append('audioFile', audioBlob, 'audio.wav');

    try {
      const response = await fetch('/api/whisper', {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      console.log(data);

      setTranscription([...transcription, data.transcription]);
    } catch (error) {
      console.error('Error transcribing audio:', error);
      alert('Failed to transcribe audio');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-full max-w-md">
        <h1 className="text-2xl font-bold mb-4">Whisper Audio Transcription</h1>

        <div className="mb-4">
          {!isRecording ? (
            <button
              onClick={startRecording}
              className="w-full bg-green-500 text-white py-2 px-4 rounded hover:bg-green-600"
            >
              Start Recording
            </button>
          ) : (
            <button
              onClick={stopRecording}
              className="w-full bg-red-500 text-white py-2 px-4 rounded hover:bg-red-600"
            >
              Stop Recording
            </button>
          )}
        </div>

        {loading && <p>Transcribing...</p>}

        {transcription && (
          <div className="mt-6 p-4 bg-gray-100 rounded">
            <h2 className="text-xl font-semibold mb-2">Transcription:</h2>
            {transcription.map((t, index) => (
              <p key={index}>{t}</p>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
