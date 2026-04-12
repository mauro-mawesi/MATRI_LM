import { useEffect } from 'react';

export default function ConfettiExplosion() {
  useEffect(() => {
    const handler = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        // Elegant gold + blush confetti
        confetti({
          particleCount: 60,
          spread: 70,
          origin: { y: 0.6 },
          colors: ['#C9A96E', '#D4BC8E', '#E8C4C4', '#F7E7CE', '#A8B5A0'],
          shapes: ['square'],
          scalar: 0.8,
        });
        setTimeout(() => {
          confetti({
            particleCount: 30,
            angle: 60,
            spread: 45,
            origin: { x: 0 },
            colors: ['#C9A96E', '#D4BC8E', '#F7E7CE'],
            shapes: ['square'],
            scalar: 0.7,
          });
        }, 250);
        setTimeout(() => {
          confetti({
            particleCount: 30,
            angle: 120,
            spread: 45,
            origin: { x: 1 },
            colors: ['#E8C4C4', '#A8B5A0', '#C9A96E'],
            shapes: ['square'],
            scalar: 0.7,
          });
        }, 500);
      } catch {
        // Non-critical
      }
    };

    window.addEventListener('trigger-confetti', handler);
    return () => window.removeEventListener('trigger-confetti', handler);
  }, []);

  return null;
}
