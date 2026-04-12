import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';

export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    document.body.style.overflow = 'hidden';

    let current = 0;
    const interval = setInterval(() => {
      current += Math.floor(Math.random() * 4) + 1;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        clearInterval(interval);

        setTimeout(() => {
          setIsLoading(false);
          document.body.style.overflow = '';
        }, 800);
      } else {
        setProgress(current);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      document.body.style.overflow = '';
    };
  }, []);

  return (
    <AnimatePresence>
      {isLoading && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0, scale: 1.05 }}
          transition={{ duration: 1, ease: [0.76, 0, 0.24, 1] }}
          className="fixed inset-0 z-[99999] flex flex-col items-center justify-center bg-ivory"
        >
          {/* Subtle botanical corners (static, matching hero) */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden opacity-40">
            {/* Top-left leaf accent */}
            <svg viewBox="0 0 120 160" className="absolute -top-4 -left-4 h-36 w-auto" fill="none">
              <ellipse cx="40" cy="50" rx="28" ry="16" transform="rotate(-35 40 50)" fill="#9CAF88" opacity={0.5} />
              <ellipse cx="60" cy="30" rx="20" ry="12" transform="rotate(-50 60 30)" fill="#7A9A6B" opacity={0.4} />
              <ellipse cx="30" cy="80" rx="22" ry="14" transform="rotate(-25 30 80)" fill="#B5C4A8" opacity={0.35} />
              <path d="M55 120 C50 80, 45 50, 55 20" stroke="#7A9A6B" strokeWidth="1" opacity={0.3} />
            </svg>
            {/* Bottom-right leaf accent */}
            <svg viewBox="0 0 120 160" className="absolute -bottom-4 -right-4 h-36 w-auto rotate-180" fill="none">
              <ellipse cx="40" cy="50" rx="28" ry="16" transform="rotate(-35 40 50)" fill="#9CAF88" opacity={0.5} />
              <ellipse cx="60" cy="30" rx="20" ry="12" transform="rotate(-50 60 30)" fill="#7A9A6B" opacity={0.4} />
              <ellipse cx="30" cy="80" rx="22" ry="14" transform="rotate(-25 30 80)" fill="#B5C4A8" opacity={0.35} />
            </svg>
            {/* Sparse gold dots */}
            {[
              { x: '12%', y: '8%', s: 3, o: 0.4 },
              { x: '8%', y: '18%', s: 2, o: 0.3 },
              { x: '15%', y: '12%', s: 4, o: 0.25 },
              { x: '88%', y: '85%', s: 3, o: 0.4 },
              { x: '92%', y: '78%', s: 2, o: 0.3 },
              { x: '85%', y: '90%', s: 4, o: 0.25 },
            ].map((d, i) => (
              <div
                key={i}
                className="absolute rounded-full bg-gold"
                style={{ left: d.x, top: d.y, width: d.s, height: d.s, opacity: d.o }}
              />
            ))}
          </div>

          {/* Center content */}
          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Names in Brittany Signature */}
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2, ease: [0.19, 1, 0.22, 1] }}
              className="text-charcoal text-center"
              style={{
                fontFamily: "'Brittany Signature', 'Caveat', cursive",
                fontSize: 'clamp(3rem, 10vw, 5rem)',
              }}
            >
              Laura <span className="text-gold">&</span> Mauro
            </motion.h1>

            {/* Decorative line */}
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 1, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
            />

            {/* Progress number */}
            <motion.span
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="font-body text-sm font-light tracking-[0.3em] text-gold/60"
            >
              {progress}%
            </motion.span>

            {/* Progress bar */}
            <div className="w-40 h-px bg-charcoal/10 overflow-hidden">
              <motion.div
                className="h-full bg-gold/60"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.1 }}
              />
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
