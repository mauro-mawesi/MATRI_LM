import { useCallback, useRef, useEffect } from 'react';
import { useReducedMotion } from './useMediaQuery';

export function useHaptic() {
  const reducedMotion = useReducedMotion();
  const supported = useRef(false);

  useEffect(() => {
    supported.current = 'vibrate' in navigator;
  }, []);

  const vibrate = useCallback((pattern: number | number[]) => {
    if (supported.current && !reducedMotion) {
      navigator.vibrate(pattern);
    }
  }, [reducedMotion]);

  const tap = useCallback(() => vibrate(10), [vibrate]);
  const doubleTap = useCallback(() => vibrate([10, 50, 10]), [vibrate]);
  const success = useCallback(() => vibrate(30), [vibrate]);

  return { tap, doubleTap, success, isSupported: supported.current };
}
