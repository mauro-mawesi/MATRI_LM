import { useCallback, useRef, useEffect } from 'react';
import { useReducedMotion } from './useMediaQuery';

export function useHaptic() {
  const reducedMotion = useReducedMotion();
  const supported = useRef(false);
  const userInteracted = useRef(false);

  useEffect(() => {
    supported.current = 'vibrate' in navigator;

    const markInteracted = () => { userInteracted.current = true; };
    document.addEventListener('click', markInteracted, { once: true });
    document.addEventListener('touchstart', markInteracted, { once: true });
    return () => {
      document.removeEventListener('click', markInteracted);
      document.removeEventListener('touchstart', markInteracted);
    };
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (supported.current && !reducedMotion && userInteracted.current) {
      navigator.vibrate(pattern);
    }
  }, [reducedMotion]);

  const tap = useCallback(() => vibrate(10), [vibrate]);
  const doubleTap = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const success = useCallback(() => vibrate(30), [vibrate]);

  return { tap, doubleTap, success, isSupported: supported.current };
}
