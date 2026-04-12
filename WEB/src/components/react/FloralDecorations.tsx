import { useRef, useMemo } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* ─── Seeded random for SSR consistency ─── */
function seededRandom(seed: number) {
  let s = seed;
  return () => {
    s = (s * 16807 + 0) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

/* ─── Watercolor Leaf Cluster (filled, organic eucalyptus-style) ─── */

function WatercolorLeafCluster({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 200 320"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="leaf-sage-1" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CAF88" />
          <stop offset="100%" stopColor="#7A9A6B" />
        </linearGradient>
        <linearGradient id="leaf-sage-2" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#B5C4A8" />
          <stop offset="100%" stopColor="#9CAF88" />
        </linearGradient>
        <linearGradient id="leaf-sage-light" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C8D6B9" />
          <stop offset="100%" stopColor="#B5C4A8" />
        </linearGradient>
        <linearGradient id="leaf-gold-tint" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#A8B07A" />
          <stop offset="100%" stopColor="#C4B470" />
        </linearGradient>
        <linearGradient id="leaf-dark" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#6B8A5E" />
          <stop offset="100%" stopColor="#4A6B3F" />
        </linearGradient>
      </defs>

      {/* ── Main branch stem ── */}
      <path
        d="M100 320 C98 280, 92 240, 96 200 C100 160, 90 120, 100 80 C106 50, 102 25, 104 0"
        stroke="#7A9A6B"
        strokeWidth="1.2"
        strokeLinecap="round"
        opacity={0.6}
      />

      {/* ── Large back leaves (lighter, behind) ── */}
      <ellipse cx="58" cy="80" rx="28" ry="18" transform="rotate(-35 58 80)"
        fill="url(#leaf-sage-light)" opacity={0.45} />
      <ellipse cx="142" cy="120" rx="26" ry="16" transform="rotate(30 142 120)"
        fill="url(#leaf-sage-light)" opacity={0.4} />
      <ellipse cx="52" cy="200" rx="30" ry="18" transform="rotate(-25 52 200)"
        fill="url(#leaf-sage-light)" opacity={0.35} />

      {/* ── Main leaves (medium opacity, rich green) ── */}
      <ellipse cx="50" cy="60" rx="24" ry="14" transform="rotate(-40 50 60)"
        fill="url(#leaf-sage-1)" opacity={0.7} />
      <path d="M50 60 C38 52, 30 56, 28 60" stroke="#6B8A5E" strokeWidth="0.5" opacity={0.4} />

      <ellipse cx="140" cy="90" rx="22" ry="13" transform="rotate(35 140 90)"
        fill="url(#leaf-sage-2)" opacity={0.75} />
      <path d="M140 90 C150 82, 158 86, 160 90" stroke="#6B8A5E" strokeWidth="0.5" opacity={0.4} />

      <ellipse cx="55" cy="130" rx="26" ry="15" transform="rotate(-30 55 130)"
        fill="url(#leaf-sage-1)" opacity={0.65} />
      <path d="M55 130 C40 122, 32 126, 30 130" stroke="#6B8A5E" strokeWidth="0.5" opacity={0.35} />

      <ellipse cx="145" cy="160" rx="24" ry="14" transform="rotate(25 145 160)"
        fill="url(#leaf-sage-2)" opacity={0.7} />

      <ellipse cx="50" cy="180" rx="22" ry="13" transform="rotate(-35 50 180)"
        fill="url(#leaf-sage-1)" opacity={0.6} />

      <ellipse cx="148" cy="220" rx="26" ry="15" transform="rotate(30 148 220)"
        fill="url(#leaf-sage-2)" opacity={0.55} />

      {/* ── Gold-tinted leaves (accent, as in the reference) ── */}
      <ellipse cx="130" cy="50" rx="18" ry="11" transform="rotate(45 130 50)"
        fill="url(#leaf-gold-tint)" opacity={0.5} />
      <ellipse cx="60" cy="240" rx="20" ry="12" transform="rotate(-20 60 240)"
        fill="url(#leaf-gold-tint)" opacity={0.4} />

      {/* ── Small front leaves (darker, sharper) ── */}
      <ellipse cx="80" cy="40" rx="14" ry="9" transform="rotate(-50 80 40)"
        fill="url(#leaf-dark)" opacity={0.55} />
      <ellipse cx="120" cy="140" rx="15" ry="9" transform="rotate(40 120 140)"
        fill="url(#leaf-dark)" opacity={0.5} />
      <ellipse cx="75" cy="160" rx="13" ry="8" transform="rotate(-45 75 160)"
        fill="url(#leaf-dark)" opacity={0.45} />
      <ellipse cx="130" cy="190" rx="14" ry="8" transform="rotate(35 130 190)"
        fill="url(#leaf-dark)" opacity={0.5} />

      {/* ── Secondary thin stems ── */}
      <path d="M96 100 C70 80, 55 65, 45 55" stroke="#7A9A6B" strokeWidth="0.7" opacity={0.4} strokeLinecap="round" />
      <path d="M100 100 C128 82, 138 75, 145 65" stroke="#7A9A6B" strokeWidth="0.7" opacity={0.4} strokeLinecap="round" />
      <path d="M94 160 C72 148, 58 140, 48 135" stroke="#7A9A6B" strokeWidth="0.6" opacity={0.35} strokeLinecap="round" />
      <path d="M100 165 C125 150, 140 145, 150 140" stroke="#7A9A6B" strokeWidth="0.6" opacity={0.35} strokeLinecap="round" />
      <path d="M96 220 C75 208, 60 200, 50 195" stroke="#7A9A6B" strokeWidth="0.6" opacity={0.3} strokeLinecap="round" />
      <path d="M100 225 C130 210, 142 204, 150 198" stroke="#7A9A6B" strokeWidth="0.6" opacity={0.3} strokeLinecap="round" />
    </svg>
  );
}

/* ─── Watercolor Leaf Sprig (smaller, for scattered accents) ─── */

function WatercolorLeafSprig({ className = '', style }: { className?: string; style?: React.CSSProperties }) {
  return (
    <svg viewBox="0 0 80 120" fill="none" className={className} style={style} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="sprig-sage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CAF88" />
          <stop offset="100%" stopColor="#7A9A6B" />
        </linearGradient>
        <linearGradient id="sprig-light" x1="50%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#C8D6B9" />
          <stop offset="100%" stopColor="#B5C4A8" />
        </linearGradient>
      </defs>
      <path d="M40 120 C40 90, 38 60, 40 30 C41 15, 40 8, 40 0"
        stroke="#7A9A6B" strokeWidth="0.8" strokeLinecap="round" opacity={0.5} />
      <ellipse cx="26" cy="30" rx="14" ry="9" transform="rotate(-30 26 30)"
        fill="url(#sprig-sage)" opacity={0.6} />
      <ellipse cx="54" cy="55" rx="13" ry="8" transform="rotate(25 54 55)"
        fill="url(#sprig-light)" opacity={0.5} />
      <ellipse cx="24" cy="75" rx="15" ry="9" transform="rotate(-20 24 75)"
        fill="url(#sprig-sage)" opacity={0.55} />
      <ellipse cx="50" cy="95" rx="12" ry="7" transform="rotate(30 50 95)"
        fill="url(#sprig-light)" opacity={0.45} />
    </svg>
  );
}

/* ─── Watercolor Olive Branch (horizontal divider) ─── */

function WatercolorOliveBranch({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 300 60" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <defs>
        <linearGradient id="olive-sage" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#9CAF88" />
          <stop offset="100%" stopColor="#7A9A6B" />
        </linearGradient>
      </defs>
      <path
        d="M0 30 C50 28, 100 20, 150 30 C200 40, 250 32, 300 30"
        stroke="#7A9A6B"
        strokeWidth="0.8"
        strokeLinecap="round"
        opacity={0.4}
      />
      <ellipse cx="40" cy="24" rx="5" ry="10" transform="rotate(-30 40 24)"
        fill="url(#olive-sage)" opacity={0.3} />
      <ellipse cx="70" cy="22" rx="4" ry="9" transform="rotate(-20 70 22)"
        fill="url(#olive-sage)" opacity={0.25} />
      <ellipse cx="110" cy="20" rx="5" ry="10" transform="rotate(-10 110 20)"
        fill="url(#olive-sage)" opacity={0.3} />
      <ellipse cx="150" cy="24" rx="5" ry="10" transform="rotate(5 150 24)"
        fill="url(#olive-sage)" opacity={0.35} />
      <ellipse cx="190" cy="34" rx="5" ry="10" transform="rotate(15 190 34)"
        fill="url(#olive-sage)" opacity={0.3} />
      <ellipse cx="230" cy="36" rx="4" ry="9" transform="rotate(25 230 36)"
        fill="url(#olive-sage)" opacity={0.25} />
      <ellipse cx="265" cy="32" rx="5" ry="10" transform="rotate(15 265 32)"
        fill="url(#olive-sage)" opacity={0.3} />
      {/* Small berries */}
      <circle cx="55" cy="28" r="2.5" fill="#D4AF37" opacity={0.25} />
      <circle cx="130" cy="22" r="2" fill="#D4AF37" opacity={0.2} />
      <circle cx="210" cy="38" r="2.5" fill="#D4AF37" opacity={0.25} />
    </svg>
  );
}

/* ─── Gold Glitter Dots (concentrated near corners) ─── */

interface GoldGlitterDotsProps {
  position: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
  count?: number;
  className?: string;
}

const GOLD_COLORS = ['#D4AF37', '#E8C86A', '#F3E5AB', '#C9A96E'];

export function GoldGlitterDots({ position, count = 30, className = '' }: GoldGlitterDotsProps) {
  const dots = useMemo(() => {
    const rng = seededRandom(
      position === 'top-left' ? 11 :
      position === 'top-right' ? 23 :
      position === 'bottom-left' ? 37 :
      51
    );

    return Array.from({ length: count }, (_, i) => {
      const r = rng;
      // Cluster dots toward the corner with exponential falloff
      const spreadX = r() * r() * 100; // 0-100, clustered near 0
      const spreadY = r() * r() * 100;

      return {
        id: i,
        x: spreadX,
        y: spreadY,
        size: r() * 3.5 + 1.5, // 1.5-5px
        color: GOLD_COLORS[Math.floor(r() * GOLD_COLORS.length)],
        opacity: r() * 0.5 + 0.2, // 0.2-0.7
        delay: r() * 6, // 0-6s stagger
        duration: r() * 4 + 4, // 4-8s pulse
      };
    });
  }, [position, count]);

  // Position the dot container based on the corner
  const positionClasses = {
    'top-left': 'top-0 left-0',
    'top-right': 'top-0 right-0',
    'bottom-left': 'bottom-0 left-0',
    'bottom-right': 'bottom-0 right-0',
  }[position];

  // Mirror dots based on corner
  const mirrorX = position.includes('right');
  const mirrorY = position.includes('bottom');

  return (
    <div
      className={`absolute ${positionClasses} pointer-events-none ${className}`}
      style={{ width: '40%', height: '40%' }}
      aria-hidden="true"
    >
      {dots.map((dot) => (
        <motion.div
          key={dot.id}
          className="absolute rounded-full"
          style={{
            width: dot.size,
            height: dot.size,
            backgroundColor: dot.color,
            left: mirrorX ? `${100 - dot.x}%` : `${dot.x}%`,
            top: mirrorY ? `${100 - dot.y}%` : `${dot.y}%`,
            opacity: dot.opacity,
          }}
          animate={{
            scale: [1, 1.3, 1],
            opacity: [dot.opacity, dot.opacity * 0.5, dot.opacity],
          }}
          transition={{
            duration: dot.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: dot.delay,
          }}
        />
      ))}
    </div>
  );
}

/* ─── Parallax-Driven Floral Decorations ─── */

interface FloralDecorationsProps {
  variant: 'hero-corners' | 'section-left' | 'section-right' | 'frame' | 'scattered';
  color?: string;
  intensity?: 'subtle' | 'medium';
}

export default function FloralDecorations({ variant, intensity = 'subtle' }: FloralDecorationsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacityBase = intensity === 'subtle' ? 0.7 : 1;

  // Parallax transforms at different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -30]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-3, 3]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [2, -2]);

  if (variant === 'hero-corners') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left cluster */}
        <motion.div
          style={{ y: y1, rotate: rotate1, opacity: opacityBase }}
          className="absolute -left-8 -top-8 md:left-0 md:top-0"
        >
          <WatercolorLeafCluster className="h-52 w-auto md:h-72 lg:h-80" />
        </motion.div>
        {/* Top-right cluster */}
        <motion.div
          style={{ y: y2, rotate: rotate2, opacity: opacityBase }}
          className="absolute -right-8 -top-8 md:right-0 md:top-0"
        >
          <WatercolorLeafCluster className="h-52 w-auto md:h-72 lg:h-80" flip />
        </motion.div>
        {/* Bottom-left */}
        <motion.div
          style={{ y: y3, opacity: opacityBase * 0.85 }}
          className="absolute -bottom-12 -left-6 rotate-180 md:left-0"
        >
          <WatercolorLeafCluster className="h-44 w-auto md:h-60 lg:h-68" />
        </motion.div>
        {/* Bottom-right */}
        <motion.div
          style={{ y: y1, opacity: opacityBase * 0.85 }}
          className="absolute -bottom-12 -right-6 rotate-180 md:right-0"
        >
          <WatercolorLeafCluster className="h-44 w-auto md:h-60 lg:h-68" flip />
        </motion.div>

        {/* Gold glitter dots near each corner */}
        <GoldGlitterDots position="top-left" count={28} />
        <GoldGlitterDots position="top-right" count={25} />
        <GoldGlitterDots position="bottom-left" count={22} />
        <GoldGlitterDots position="bottom-right" count={20} />
      </div>
    );
  }

  if (variant === 'section-left') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          style={{ y: y2, rotate: rotate1, opacity: opacityBase * 0.4 }}
          className="absolute -left-10 top-1/4 md:-left-4"
        >
          <WatercolorLeafCluster className="h-56 w-auto md:h-72" />
        </motion.div>
        <motion.div
          style={{ y: y3, opacity: opacityBase * 0.3 }}
          className="absolute -left-2 bottom-16 md:left-4"
        >
          <WatercolorLeafSprig className="h-20 w-auto" />
        </motion.div>
      </div>
    );
  }

  if (variant === 'section-right') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          style={{ y: y2, rotate: rotate2, opacity: opacityBase * 0.4 }}
          className="absolute -right-10 top-1/3 md:-right-4"
        >
          <WatercolorLeafCluster className="h-56 w-auto md:h-72" flip />
        </motion.div>
        <motion.div
          style={{ y: y3, opacity: opacityBase * 0.3 }}
          className="absolute -right-2 bottom-20 md:right-4"
        >
          <WatercolorLeafSprig className="h-16 w-auto" style={{ transform: 'scaleX(-1)' }} />
        </motion.div>
      </div>
    );
  }

  if (variant === 'frame') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div style={{ y: y1, rotate: rotate1, opacity: opacityBase * 0.5 }}
          className="absolute -left-6 -top-6 md:left-0 md:top-0">
          <WatercolorLeafCluster className="h-36 w-auto md:h-48" />
        </motion.div>
        <motion.div style={{ y: y1, rotate: rotate2, opacity: opacityBase * 0.5 }}
          className="absolute -right-6 -top-6 md:right-0 md:top-0">
          <WatercolorLeafCluster className="h-36 w-auto md:h-48" flip />
        </motion.div>
        <motion.div style={{ y: y2, opacity: opacityBase * 0.4 }}
          className="absolute -bottom-6 -left-6 rotate-180 md:bottom-0 md:left-0">
          <WatercolorLeafCluster className="h-32 w-auto md:h-44" />
        </motion.div>
        <motion.div style={{ y: y2, opacity: opacityBase * 0.4 }}
          className="absolute -bottom-6 -right-6 rotate-180 md:bottom-0 md:right-0">
          <WatercolorLeafCluster className="h-32 w-auto md:h-44" flip />
        </motion.div>
        <GoldGlitterDots position="top-left" count={15} />
        <GoldGlitterDots position="top-right" count={12} />
        <GoldGlitterDots position="bottom-left" count={10} />
        <GoldGlitterDots position="bottom-right" count={10} />
      </div>
    );
  }

  // 'scattered'
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div style={{ y: y1, opacity: opacityBase * 0.35 }} className="absolute left-[5%] top-[15%]">
        <WatercolorLeafSprig className="h-16 w-auto rotate-12" />
      </motion.div>
      <motion.div style={{ y: y2, opacity: opacityBase * 0.3 }} className="absolute right-[8%] top-[25%]">
        <WatercolorLeafSprig className="h-14 w-auto -rotate-12" style={{ transform: 'scaleX(-1)' }} />
      </motion.div>
      <motion.div style={{ y: y3, opacity: opacityBase * 0.25 }} className="absolute left-[10%] bottom-[20%]">
        <WatercolorLeafSprig className="h-12 w-auto rotate-45" />
      </motion.div>
      <motion.div style={{ y: y1, opacity: opacityBase * 0.3 }} className="absolute right-[12%] bottom-[30%]">
        <WatercolorLeafSprig className="h-14 w-auto -rotate-6" />
      </motion.div>
    </div>
  );
}

/* ─── Horizontal Floral Divider ─── */

export function FloralDivider() {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const scaleX = useTransform(scrollYProgress, [0, 0.5], [0.6, 1]);
  const opacity = useTransform(scrollYProgress, [0, 0.3, 0.7, 1], [0, 1, 1, 0]);

  return (
    <div ref={ref} className="flex items-center justify-center py-8" aria-hidden="true">
      <motion.div style={{ scaleX, opacity }} className="w-full max-w-sm md:max-w-md">
        <WatercolorOliveBranch className="mx-auto h-auto w-full" />
      </motion.div>
    </div>
  );
}
