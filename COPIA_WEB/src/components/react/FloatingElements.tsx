import { motion } from 'motion/react';
import { useMemo, useState, useEffect } from 'react';

/* ─── Petal SVG Shapes ─── */

function RosePetal({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg viewBox="0 0 24 32" fill="none" className="h-full w-full">
      <path
        d="M12 0 C5 7, 0 16, 3 24 C5 30, 9 32, 12 32 C15 32, 19 30, 21 24 C24 16, 19 7, 12 0Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M12 4 Q11 16, 12 30"
        stroke={color}
        strokeWidth="0.4"
        opacity={opacity * 0.6}
      />
      <path
        d="M7 12 Q12 14, 17 12"
        stroke={color}
        strokeWidth="0.2"
        opacity={opacity * 0.4}
      />
    </svg>
  );
}

function CherryPetal({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg viewBox="0 0 22 20" fill="none" className="h-full w-full">
      <path
        d="M11 0 C4 3, 0 8, 1 14 C2 18, 6 20, 11 18 C16 20, 20 18, 21 14 C22 8, 18 3, 11 0Z"
        fill={color}
        opacity={opacity}
      />
      <path
        d="M11 2 Q10 10, 11 17"
        stroke={color}
        strokeWidth="0.3"
        opacity={opacity * 0.5}
      />
    </svg>
  );
}

function RoundPetal({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg viewBox="0 0 20 22" fill="none" className="h-full w-full">
      <ellipse cx="10" cy="11" rx="9" ry="10" fill={color} opacity={opacity} />
      <path
        d="M10 2 Q9 11, 10 20"
        stroke={color}
        strokeWidth="0.3"
        opacity={opacity * 0.4}
      />
    </svg>
  );
}

function ThinPetal({ color, opacity }: { color: string; opacity: number }) {
  return (
    <svg viewBox="0 0 12 30" fill="none" className="h-full w-full">
      <path
        d="M6 0 C2 8, 0 16, 2 24 C3 28, 5 30, 6 30 C7 30, 9 28, 10 24 C12 16, 10 8, 6 0Z"
        fill={color}
        opacity={opacity}
      />
    </svg>
  );
}

const PETAL_COMPONENTS = [RosePetal, CherryPetal, RoundPetal, ThinPetal] as const;

/* ─── Color palette matching the site ─── */
const PETAL_COLORS = [
  '#D4AF37',  // Gold
  '#F3E5AB',  // Champagne Gold
  '#F2DBD9',  // Soft Blush
  '#DFA8A8',  // Deep Blush
  '#9CAF88',  // Sage
  '#C8D6B9',  // Light Sage
  '#F9EBEA',  // Ultra Light Blush
  '#AA8C2C',  // Deep Gold
];

/* ─── Seeded random for consistent SSR/client ─── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Generate petals config ─── */
function generatePetals(count: number) {
  const rng = seededRandom(42);
  return Array.from({ length: count }, (_, i) => {
    const r = rng;
    // Distribute evenly across width with slight jitter for natural look
    const slotWidth = 100 / count;
    const baseX = i * slotWidth;
    const jitter = (r() - 0.5) * slotWidth * 1.5;
    const x = Math.max(0, Math.min(100, baseX + jitter));

    return {
      id: i,
      x,
      startY: -(r() * 80 + 20),           // start above viewport
      size: r() * 14 + 8,                 // 8-22px
      duration: r() * 18 + 14,            // 14-32s fall time
      delay: r() * 25,                    // stagger start up to 25s
      initialRotate: r() * 360,           // random starting rotation
      swayAmount: r() * 80 + 30,          // 30-110px horizontal sway
      swayFrequency: Math.floor(r() * 3) + 3, // 3-5 sway cycles
      spinSpeed: (r() - 0.5) * 720,       // -360 to +360 deg total spin
      colorIndex: Math.floor(r() * PETAL_COLORS.length),
      shapeIndex: Math.floor(r() * PETAL_COMPONENTS.length),
      opacity: r() * 0.25 + 0.10,         // 0.10-0.35
      wobble3d: r() * 60 + 20,            // rotateX tilt 20-80deg
    };
  });
}

/* ─── Single Falling Petal ─── */
function FallingPetal({
  config,
}: {
  config: ReturnType<typeof generatePetals>[number];
}) {
  const PetalShape = PETAL_COMPONENTS[config.shapeIndex];
  const color = PETAL_COLORS[config.colorIndex];

  // Build sway keyframes (smooth sinusoidal path)
  const swayKeyframes = useMemo(() => {
    const points: number[] = [0];
    for (let i = 1; i <= config.swayFrequency; i++) {
      const direction = i % 2 === 0 ? 1 : -1;
      points.push(direction * config.swayAmount * (0.6 + Math.random() * 0.4));
    }
    points.push(0);
    return points;
  }, [config.swayAmount, config.swayFrequency]);

  return (
    <motion.div
      className="absolute"
      style={{
        left: `${config.x}%`,
        width: config.size,
        height: config.size * 1.3,
      }}
      initial={{
        y: config.startY,
        rotate: config.initialRotate,
        opacity: 0,
      }}
      animate={{
        y: [config.startY, 1300],
        x: swayKeyframes,
        rotate: [config.initialRotate, config.initialRotate + config.spinSpeed],
        opacity: [0, config.opacity, config.opacity, config.opacity, 0],
      }}
      transition={{
        duration: config.duration,
        repeat: Infinity,
        ease: 'linear',
        delay: config.delay,
        times: [0, 0.05, 0.4, 0.9, 1],
      }}
    >
      {/* Inner wobble simulates 3D tumble */}
      <motion.div
        animate={{
          rotateX: [0, config.wobble3d, -config.wobble3d * 0.6, config.wobble3d * 0.8, 0],
          rotateY: [0, -config.wobble3d * 0.5, config.wobble3d * 0.7, 0],
          scaleX: [1, 0.6, 1, 0.7, 1],
        }}
        transition={{
          duration: config.duration * 0.4,
          repeat: Infinity,
          ease: 'easeInOut',
        }}
        style={{ perspective: 200 }}
      >
        <PetalShape color={color} opacity={1} />
      </motion.div>
    </motion.div>
  );
}

/* ─── Main Component ─── */
export default function FloatingElements() {
  const [count, setCount] = useState(20); // SSR-safe default

  useEffect(() => {
    // Reduce petals on mobile for performance
    const isMobile = window.innerWidth < 640;
    const isTablet = window.innerWidth < 1024;
    setCount(isMobile ? 18 : isTablet ? 30 : 50);
  }, []);

  const petals = useMemo(() => generatePetals(count), [count]);

  return (
    <div className="pointer-events-none fixed inset-0 z-30 overflow-hidden" aria-hidden="true">
      {petals.map((config) => (
        <FallingPetal key={config.id} config={config} />
      ))}
    </div>
  );
}
