import { useEffect, useCallback, useState } from 'react';
import { useMotionValue, useSpring } from 'motion/react';
import { useReducedMotion } from './useMediaQuery';

type PermissionState = 'prompt' | 'granted' | 'denied' | 'unsupported';

export function useDeviceOrientation() {
  const reducedMotion = useReducedMotion();
  const [permissionState, setPermissionState] = useState<PermissionState>('unsupported');

  const rawBeta = useMotionValue(0);
  const rawGamma = useMotionValue(0);

  const beta = useSpring(rawBeta, { damping: 30, stiffness: 120 });
  const gamma = useSpring(rawGamma, { damping: 30, stiffness: 120 });

  useEffect(() => {
    if (typeof window === 'undefined' || !('DeviceOrientationEvent' in window)) {
      setPermissionState('unsupported');
      return;
    }

    const stored = sessionStorage.getItem('gyro-granted');
    if (stored === 'true') {
      setPermissionState('granted');
      return;
    }

    // iOS 13+ requires explicit permission
    const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
    if (typeof doe.requestPermission === 'function') {
      setPermissionState('prompt');
    } else {
      // Android / desktop — auto-granted
      setPermissionState('granted');
    }
  }, []);

  // Start listening when granted
  useEffect(() => {
    if (permissionState !== 'granted' || reducedMotion) return;

    const handler = (e: DeviceOrientationEvent) => {
      if (e.beta != null) rawBeta.set(e.beta);
      if (e.gamma != null) rawGamma.set(e.gamma);
    };

    window.addEventListener('deviceorientation', handler, { passive: true });
    return () => window.removeEventListener('deviceorientation', handler);
  }, [permissionState, reducedMotion, rawBeta, rawGamma]);

  const requestPermission = useCallback(async () => {
    try {
      const doe = DeviceOrientationEvent as unknown as { requestPermission?: () => Promise<string> };
      if (typeof doe.requestPermission !== 'function') return;

      const result = await doe.requestPermission();
      if (result === 'granted') {
        sessionStorage.setItem('gyro-granted', 'true');
        setPermissionState('granted');
      } else {
        setPermissionState('denied');
      }
    } catch {
      setPermissionState('denied');
    }
  }, []);

  return { beta, gamma, permissionState, requestPermission };
}
