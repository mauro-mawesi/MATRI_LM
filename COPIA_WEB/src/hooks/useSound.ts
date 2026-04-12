import { useState, useCallback, useRef } from 'react';

const SOUND_STORAGE_KEY = 'wedding-sound';

export function useSound() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));
      return next;
    });
  }, []);

  const play = useCallback(
    (src: string) => {
      if (!enabled) return;
      try {
        if (audioRef.current) {
          audioRef.current.pause();
          audioRef.current.currentTime = 0;
        }
        audioRef.current = new Audio(src);
        audioRef.current.volume = 0.3;
        audioRef.current.play().catch(() => {});
      } catch {
        // Silently fail - sound is non-critical
      }
    },
    [enabled],
  );

  return { enabled, toggle, play };
}
