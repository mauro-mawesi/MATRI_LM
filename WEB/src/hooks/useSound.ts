import { useState, useCallback, useRef, useEffect } from 'react';

const SOUND_STORAGE_KEY = 'wedding-sound';
const MUSIC_SRC = '/music/background.mp3';

export function useSound() {
  const [enabled, setEnabled] = useState(() => {
    if (typeof window === 'undefined') return false;
    return localStorage.getItem(SOUND_STORAGE_KEY) === 'true';
  });
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Initialize audio element once
  useEffect(() => {
    const audio = new Audio(MUSIC_SRC);
    audio.loop = true;
    audio.volume = 0.25;
    audio.preload = 'none';
    audioRef.current = audio;

    // If sound was enabled in a previous session, try to play
    // (will be blocked until user interacts with the page)
    if (localStorage.getItem(SOUND_STORAGE_KEY) === 'true') {
      const tryAutoplay = () => {
        audio.play().catch(() => {});
        document.removeEventListener('click', tryAutoplay);
        document.removeEventListener('touchstart', tryAutoplay);
      };
      // Browsers require user gesture for autoplay — wait for first interaction
      document.addEventListener('click', tryAutoplay, { once: true });
      document.addEventListener('touchstart', tryAutoplay, { once: true });
    }

    return () => {
      audio.pause();
      audio.src = '';
    };
  }, []);

  const toggle = useCallback(() => {
    setEnabled((prev) => {
      const next = !prev;
      localStorage.setItem(SOUND_STORAGE_KEY, String(next));

      if (audioRef.current) {
        if (next) {
          audioRef.current.play().catch(() => {});
        } else {
          audioRef.current.pause();
        }
      }

      return next;
    });
  }, []);

  return { enabled, toggle };
}
