import { useEffect, useRef } from 'react';
import { useReducedMotion } from './useMediaQuery';

interface ShakeOptions {
  threshold?: number;
  cooldownMs?: number;
  onShake: () => void;
}

export function useShakeDetection({ threshold = 15, cooldownMs = 3000, onShake }: ShakeOptions) {
  const reducedMotion = useReducedMotion();
  const lastTrigger = useRef(0);
  const samples = useRef<number[]>([]);

  useEffect(() => {
    if (reducedMotion || typeof window === 'undefined' || !('DeviceMotionEvent' in window)) return;

    // Check if permission is needed (iOS) and already granted
    const stored = sessionStorage.getItem('gyro-granted');
    const doe = DeviceMotionEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === 'function' && stored !== 'true') return;

    const handler = (e: DeviceMotionEvent) => {
      const acc = e.accelerationIncludingGravity;
      if (!acc || acc.x == null || acc.y == null || acc.z == null) return;

      const magnitude = Math.sqrt(acc.x ** 2 + acc.y ** 2 + acc.z ** 2);
      const now = Date.now();

      if (magnitude > threshold) {
        samples.current.push(now);
      }

      // Keep only samples within 500ms window
      samples.current = samples.current.filter((t) => now - t < 500);

      // 3+ high samples in 500ms = shake detected
      if (samples.current.length >= 3 && now - lastTrigger.current > cooldownMs) {
        lastTrigger.current = now;
        samples.current = [];
        onShake();
      }
    };

    window.addEventListener('devicemotion', handler, { passive: true });
    return () => window.removeEventListener('devicemotion', handler);
  }, [reducedMotion, threshold, cooldownMs, onShake]);
}
