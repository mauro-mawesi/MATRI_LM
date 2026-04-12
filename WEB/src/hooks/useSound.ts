import { useState, useCallback, useRef } from 'react';

const SOUND_STORAGE_KEY = 'wedding-sound';
const MUSIC_SRC = '/music/background.mp3';

export function useSound() {
  const [enabled, setEnabled] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = 0.25;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const toggle = useCallback(() => {
    const audio = getAudio();

    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));

      if (next) {
        audio.play().catch(() => {});
      } else {
        audio.pause();
      }

      return next;
    });
  }, [getAudio]);

  return { enabled, toggle };
}
