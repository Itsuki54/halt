import {
  useEffect,
  useRef,
  useState,
} from 'react';

type Hooks = {
  startRecording: () => void;
  stopRecording: () => void;
  isAudio: boolean;
  transcript: string | null;
  isLoading: boolean;
};

export const useHooks = (): Hooks => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAudio, setIsAudio] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [transcript, setTranscript] = useState<string | null>(null);

  const handleDataAvailable = (event: BlobEvent) => {
    const file = new File([event.data], 'audio.mp3', {
      type: event.data.type,
      lastModified: Date.now(),
    });
    setAudioFile(file);
  };

  const startRecording = async () => {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    mediaRecorder.current.addEventListener(
      'dataavailable',
      handleDataAvailable,
    );
    setIsAudio(true);
  };

  const stopRecording = () => {
    mediaRecorder.current?.stop();
    setIsAudio(false);
  };

  useEffect(() => {
    const uploadAudio = async () => {
      if (!audioFile) return;
      const endPoint = 'https://api.openai.com/v1/audio/transcriptions';

      const formData = new FormData();
      formData.append('file', audioFile, 'audio.mp3');
      formData.append('model', 'whisper-1');
      formData.append('language', 'ja');
      setIsLoading(true);
      const response = await fetch(endPoint, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: formData,
      });
      console.log(response);
      const responseData = await response.json();
      if (responseData.text) {
        setTranscript(responseData.text);
      }
      setAudioFile(null);
      setIsLoading(false);
    };
    uploadAudio();
  }, [audioFile]);

  return {
    startRecording,
    stopRecording,
    isAudio,
    transcript,
    isLoading,
  };
};
