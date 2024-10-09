import { useRef, useState } from "react";

type Hooks = {
  startRecording: () => void;
  stopRecording: () => void;
  isAudio: boolean;
};

export const useHooks = (): Hooks => {
  const mediaRecorder = useRef<MediaRecorder | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [isAudio, setIsAudio] = useState<boolean>(false);

  const handleDataAvailable = (event: BlobEvent) => {
    // 音声ファイル生成
    const file = new File([event.data], "audio.mp3", {
      type: event.data.type,
      lastModified: Date.now(),
    });
    setAudioFile(file);
  };

  const startRecording = async() => {
    // 録音開始
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    mediaRecorder.current = new MediaRecorder(stream);
    mediaRecorder.current.start();
    mediaRecorder.current.addEventListener(
      "dataavailable",
      handleDataAvailable
    );
    setIsAudio(true);
  };

  const stopRecording = () => {
    // 録音停止
    mediaRecorder.current?.stop();
    setIsAudio(false);
  };

  return {
    startRecording,
    stopRecording,
    isAudio,
  };
};

