// pages/index.tsx
import { playAudio } from '@/lib/playaudio';
import { useState, useRef } from 'react';

type chat = {
  user: string;
  bot: string | null;
}

const Home = () => {
  const [isRecording, setIsRecording] = useState(false);
  const [transcription, setTranscription] = useState<chat[]>([]);
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

			try {
				const botResponse = await fetch('/api/chatgpt', {
					headers: {
						'Content-Type': 'application/json',
					},
					method: 'POST',
					body: JSON.stringify({ message: data.transcription }),
				});
				const botData = await botResponse.json();
				try {
					playAudio(botData.chatgptResponse, '3')
				} catch (e) {
					console.error(e)
				}
				setTranscription([...transcription, { user: data.transcription, bot: botData.chatgptResponse }]);
			}
			catch (error) {
				console.error('Error transcribing audio:', error);
				alert('Failed to transcribe audio');
			}
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
						{
							transcription.map((t, index) => (
								<div key={index} className="mb-4">
									<div className="bg-blue-100 p-2 rounded-lg shadow-md">
										<p className="text-blue-800 font-semibold">User:</p>
										<p className="text-blue-600">{t.user}</p>
									</div>
									<div className="bg-green-100 p-2 rounded-lg shadow-md mt-2">
										<p className="text-green-800 font-semibold">Bot:</p>
										<p className="text-green-600">{t.bot}</p>
									</div>
								</div>
							))
						}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
