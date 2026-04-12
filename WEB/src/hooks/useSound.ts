import { useState, useCallback, useEffect, useRef } from 'react';

const SOUND_STORAGE_KEY = 'wedding-sound';
const MUSIC_SRC = '/music/background.mp3';
const DEFAULT_ENABLED = true;

export function useSound() {
  const [enabled, setEnabled] = useState(DEFAULT_ENABLED);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const pendingAutoplayRef = useRef(false);

  const getAudio = useCallback(() => {
    if (!audioRef.current) {
      const audio = new Audio(MUSIC_SRC);
      audio.loop = true;
      audio.volume = 0.25;
      audioRef.current = audio;
    }
    return audioRef.current;
  }, []);

  const attemptPlay = useCallback(async () => {
    const audio = getAudio();

    try {
      await audio.play();
      pendingAutoplayRef.current = false;
      return true;
    } catch {
      pendingAutoplayRef.current = true;
      return false;
    }
  }, [getAudio]);

  useEffect(() => {
    const stored = localStorage.getItem(SOUND_STORAGE_KEY);
    const nextEnabled = stored === null ? DEFAULT_ENABLED : stored === 'true';
    setEnabled(nextEnabled);
    localStorage.setItem(SOUND_STORAGE_KEY, String(nextEnabled));

    if (!nextEnabled) return;

    void attemptPlay();
  }, [attemptPlay]);

  useEffect(() => {
    if (!enabled || !pendingAutoplayRef.current) return;

    const unlock = () => {
      void attemptPlay();
    };

    window.addEventListener('pointerdown', unlock, { passive: true });
    window.addEventListener('keydown', unlock);
    window.addEventListener('touchstart', unlock, { passive: true });

    return () => {
      window.removeEventListener('pointerdown', unlock);
      window.removeEventListener('keydown', unlock);
      window.removeEventListener('touchstart', unlock);
    };
  }, [enabled, attemptPlay]);

  const toggle = useCallback(() => {
    const audio = getAudio();

    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));

      if (next) {
        void attemptPlay();
      } else {
        pendingAutoplayRef.current = false;
        audio.pause();
      }

      return next;
    });
  }, [getAudio, attemptPlay]);

  return { enabled, toggle };
}
