import { useEffect, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useShakeDetection } from '../../hooks/useShakeDetection';

export default function ConfettiExplosion() {
  const [showToast, setShowToast] = useState(false);

  // RSVP confetti (existing)
  useEffect(() => {
    const handler = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 60, spread: 70, origin: { y: 0.6 },
          colors: ['#C9A96E', '#D4BC8E', '#E8C4C4', '#F7E7CE', '#A8B5A0'],
          shapes: ['square'], scalar: 0.8,
        });
        setTimeout(() => confetti({
          particleCount: 30, angle: 60, spread: 45, origin: { x: 0 },
          colors: ['#C9A96E', '#D4BC8E', '#F7E7CE'], shapes: ['square'], scalar: 0.7,
        }), 250);
        setTimeout(() => confetti({
          particleCount: 30, angle: 120, spread: 45, origin: { x: 1 },
          colors: ['#E8C4C4', '#A8B5A0', '#C9A96E'], shapes: ['square'], scalar: 0.7,
        }), 500);
      } catch { /* non-critical */ }
    };

    window.addEventListener('trigger-confetti', handler);
    return () => window.removeEventListener('trigger-confetti', handler);
  }, []);

  // Gold confetti (shake-triggered)
  useEffect(() => {
    const handler = async () => {
      try {
        const confetti = (await import('canvas-confetti')).default;
        confetti({
          particleCount: 80, spread: 160, origin: { y: 0.4 },
          colors: ['#D4AF37', '#E8C86A', '#F3E5AB', '#C9A96E', '#AA8C2C'],
          shapes: ['square'], scalar: 1.1, gravity: 0.8, ticks: 200,
        });
      } catch { /* non-critical */ }
    };

    window.addEventListener('trigger-gold-confetti', handler);
    return () => window.removeEventListener('trigger-gold-confetti', handler);
  }, []);

  // Shake detection
  const handleShake = useCallback(() => {
    window.dispatchEvent(new CustomEvent('trigger-gold-confetti'));
    setShowToast(true);
    setTimeout(() => setShowToast(false), 1500);
  }, []);

  useShakeDetection({ onShake: handleShake });

  return (
    <AnimatePresence>
      {showToast && (
        <motion.div
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -10, scale: 0.9 }}
          transition={{ duration: 0.3 }}
          className="fixed bottom-20 left-1/2 z-[70] -translate-x-1/2 rounded-full border border-gold/30 bg-ivory/90 px-5 py-2 font-body text-sm backdrop-blur-sm shadow-lg"
        >
          <span className="text-gold">✨</span>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
