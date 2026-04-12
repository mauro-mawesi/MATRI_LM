import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';

/* ─── SVG Botanical Paths (minimalist line-drawings) ─── */

function RoseBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 120 200"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main stem */}
      <path
        d="M60 200 C60 160, 55 140, 58 120 C61 100, 50 80, 55 60 C58 45, 56 30, 60 10"
        stroke="currentColor"
        strokeWidth="1"
        strokeLinecap="round"
      />
      {/* Rose bloom */}
      <path
        d="M60 10 C50 8, 42 14, 44 22 C46 30, 54 28, 56 20 C58 14, 64 14, 66 20 C68 28, 76 30, 78 22 C80 14, 72 8, 60 10Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M54 16 C56 20, 60 22, 64 18"
        stroke="currentColor"
        strokeWidth="0.6"
        fill="none"
      />
      {/* Left leaf pair */}
      <path
        d="M56 70 C40 60, 28 65, 30 72 C32 79, 46 76, 56 70Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M56 70 C43 68, 33 70, 30 72"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Right leaf */}
      <path
        d="M58 100 C74 88, 88 90, 86 98 C84 106, 70 104, 58 100Z"
        stroke="currentColor"
        strokeWidth="0.8"
        fill="none"
      />
      <path
        d="M58 100 C73 95, 82 96, 86 98"
        stroke="currentColor"
        strokeWidth="0.5"
        fill="none"
      />
      {/* Small left leaf */}
      <path
        d="M57 130 C46 124, 38 128, 40 133 C42 138, 50 136, 57 130Z"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />
      {/* Bud right */}
      <path
        d="M59 50 C66 44, 72 46, 70 52 C68 56, 62 54, 59 50Z"
        stroke="currentColor"
        strokeWidth="0.7"
        fill="none"
      />
    </svg>
  );
}

function EucalyptusBranch({ className = '', flip = false }: { className?: string; flip?: boolean }) {
  return (
    <svg
      viewBox="0 0 100 240"
      fill="none"
      className={className}
      style={flip ? { transform: 'scaleX(-1)' } : undefined}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Main curved stem */}
      <path
        d="M50 240 C48 200, 44 170, 46 140 C48 110, 42 80, 50 50 C54 30, 50 15, 52 0"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Round leaves alternating */}
      <ellipse cx="34" cy="60" rx="10" ry="14" transform="rotate(-15 34 60)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      <ellipse cx="66" cy="85" rx="10" ry="14" transform="rotate(15 66 85)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      <ellipse cx="32" cy="110" rx="9" ry="12" transform="rotate(-20 32 110)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      <ellipse cx="68" cy="135" rx="9" ry="12" transform="rotate(20 68 135)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      <ellipse cx="36" cy="160" rx="10" ry="14" transform="rotate(-10 36 160)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      <ellipse cx="64" cy="185" rx="10" ry="14" transform="rotate(10 64 185)"
        stroke="currentColor" strokeWidth="0.7" fill="none" />
      {/* Leaf midribs */}
      <path d="M44 55 L28 68" stroke="currentColor" strokeWidth="0.4" />
      <path d="M52 80 L72 90" stroke="currentColor" strokeWidth="0.4" />
      <path d="M44 106 L26 118" stroke="currentColor" strokeWidth="0.4" />
      <path d="M52 130 L74 140" stroke="currentColor" strokeWidth="0.4" />
      <path d="M46 155 L30 168" stroke="currentColor" strokeWidth="0.4" />
      <path d="M54 180 L70 192" stroke="currentColor" strokeWidth="0.4" />
    </svg>
  );
}

function OliveBranch({ className = '' }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 300 60"
      fill="none"
      className={className}
      xmlns="http://www.w3.org/2000/svg"
    >
      {/* Curved branch */}
      <path
        d="M0 30 C50 28, 100 20, 150 30 C200 40, 250 32, 300 30"
        stroke="currentColor"
        strokeWidth="0.8"
        strokeLinecap="round"
      />
      {/* Leaves along the branch */}
      <ellipse cx="40" cy="24" rx="5" ry="10" transform="rotate(-30 40 24)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="70" cy="22" rx="4" ry="9" transform="rotate(-20 70 22)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="110" cy="20" rx="5" ry="10" transform="rotate(-10 110 20)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="150" cy="24" rx="5" ry="10" transform="rotate(5 150 24)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="190" cy="34" rx="5" ry="10" transform="rotate(15 190 34)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="230" cy="36" rx="4" ry="9" transform="rotate(25 230 36)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      <ellipse cx="265" cy="32" rx="5" ry="10" transform="rotate(15 265 32)"
        stroke="currentColor" strokeWidth="0.6" fill="none" />
      {/* Small berries */}
      <circle cx="55" cy="28" r="2.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="130" cy="22" r="2" stroke="currentColor" strokeWidth="0.5" fill="none" />
      <circle cx="210" cy="38" r="2.5" stroke="currentColor" strokeWidth="0.5" fill="none" />
    </svg>
  );
}

function LeafSprig({ className = '' }: { className?: string }) {
  return (
    <svg viewBox="0 0 60 80" fill="none" className={className} xmlns="http://www.w3.org/2000/svg">
      <path d="M30 80 C30 60, 28 40, 30 20 C31 10, 30 5, 30 0" stroke="currentColor" strokeWidth="0.7" strokeLinecap="round" />
      <path d="M30 25 C18 18, 12 22, 14 28 C16 34, 26 30, 30 25Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M30 40 C42 32, 50 36, 48 42 C46 48, 36 46, 30 40Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
      <path d="M30 55 C20 50, 14 54, 16 58 C18 62, 26 60, 30 55Z" stroke="currentColor" strokeWidth="0.6" fill="none" />
    </svg>
  );
}

/* ─── Parallax-Driven Floral Decorations ─── */

interface FloralDecorationsProps {
  variant: 'hero-corners' | 'section-left' | 'section-right' | 'frame' | 'scattered';
  color?: string;
  intensity?: 'subtle' | 'medium';
}

export default function FloralDecorations({ variant, color = 'text-gold/[0.12]', intensity = 'subtle' }: FloralDecorationsProps) {
  const ref = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ['start end', 'end start'],
  });

  const opacityBase = intensity === 'subtle' ? 0.08 : 0.14;

  // Parallax transforms at different speeds
  const y1 = useTransform(scrollYProgress, [0, 1], [40, -40]);
  const y2 = useTransform(scrollYProgress, [0, 1], [60, -60]);
  const y3 = useTransform(scrollYProgress, [0, 1], [20, -30]);
  const rotate1 = useTransform(scrollYProgress, [0, 1], [-5, 5]);
  const rotate2 = useTransform(scrollYProgress, [0, 1], [3, -3]);
  const scale1 = useTransform(scrollYProgress, [0, 0.5, 1], [0.95, 1, 0.97]);

  if (variant === 'hero-corners') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left rose */}
        <motion.div
          style={{ y: y1, rotate: rotate1, scale: scale1 }}
          className="absolute -left-4 -top-4 md:left-4 md:top-4"
        >
          <RoseBranch className={`h-48 w-auto md:h-64 ${color}`} />
        </motion.div>
        {/* Top-right eucalyptus */}
        <motion.div
          style={{ y: y2, rotate: rotate2 }}
          className="absolute -right-4 -top-4 md:right-4 md:top-4"
        >
          <EucalyptusBranch className={`h-52 w-auto md:h-72 ${color}`} flip />
        </motion.div>
        {/* Bottom-left sprig */}
        <motion.div
          style={{ y: y3 }}
          className="absolute -bottom-8 left-8 rotate-180 md:left-16"
        >
          <LeafSprig className={`h-24 w-auto md:h-32 ${color}`} />
        </motion.div>
        {/* Bottom-right sprig */}
        <motion.div
          style={{ y: y1 }}
          className="absolute -bottom-8 right-8 rotate-180 scale-x-[-1] md:right-16"
        >
          <LeafSprig className={`h-20 w-auto md:h-28 ${color}`} />
        </motion.div>
      </div>
    );
  }

  if (variant === 'section-left') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          style={{ y: y2, rotate: rotate1, opacity: opacityBase }}
          className="absolute -left-6 top-1/4 md:left-0"
        >
          <RoseBranch className={`h-56 w-auto md:h-72 ${color}`} />
        </motion.div>
        <motion.div
          style={{ y: y3 }}
          className="absolute -left-2 bottom-16 md:left-8"
        >
          <LeafSprig className={`h-20 w-auto ${color}`} />
        </motion.div>
      </div>
    );
  }

  if (variant === 'section-right') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        <motion.div
          style={{ y: y2, rotate: rotate2, opacity: opacityBase }}
          className="absolute -right-6 top-1/3 md:right-0"
        >
          <EucalyptusBranch className={`h-56 w-auto md:h-72 ${color}`} flip />
        </motion.div>
        <motion.div
          style={{ y: y3 }}
          className="absolute -right-2 bottom-20 md:right-8"
        >
          <LeafSprig className={`h-16 w-auto scale-x-[-1] ${color}`} />
        </motion.div>
      </div>
    );
  }

  if (variant === 'frame') {
    return (
      <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
        {/* Top-left */}
        <motion.div
          style={{ y: y1, rotate: rotate1 }}
          className="absolute -left-4 -top-4 md:left-2 md:top-2"
        >
          <RoseBranch className={`h-36 w-auto md:h-48 ${color}`} />
        </motion.div>
        {/* Top-right */}
        <motion.div
          style={{ y: y1, rotate: rotate2 }}
          className="absolute -right-4 -top-4 md:right-2 md:top-2"
        >
          <RoseBranch className={`h-36 w-auto md:h-48 ${color}`} flip />
        </motion.div>
        {/* Bottom-left */}
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-4 -left-4 rotate-180 md:bottom-2 md:left-2"
        >
          <EucalyptusBranch className={`h-36 w-auto md:h-44 ${color}`} />
        </motion.div>
        {/* Bottom-right */}
        <motion.div
          style={{ y: y2 }}
          className="absolute -bottom-4 -right-4 rotate-180 md:bottom-2 md:right-2"
        >
          <EucalyptusBranch className={`h-36 w-auto md:h-44 ${color}`} flip />
        </motion.div>
      </div>
    );
  }

  // 'scattered'
  return (
    <div ref={ref} className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
      <motion.div style={{ y: y1 }} className="absolute left-[5%] top-[15%]">
        <LeafSprig className={`h-16 w-auto rotate-12 ${color}`} />
      </motion.div>
      <motion.div style={{ y: y2 }} className="absolute right-[8%] top-[25%]">
        <LeafSprig className={`h-14 w-auto -rotate-12 scale-x-[-1] ${color}`} />
      </motion.div>
      <motion.div style={{ y: y3 }} className="absolute left-[10%] bottom-[20%]">
        <LeafSprig className={`h-12 w-auto rotate-45 ${color}`} />
      </motion.div>
      <motion.div style={{ y: y1 }} className="absolute right-[12%] bottom-[30%]">
        <LeafSprig className={`h-14 w-auto -rotate-6 ${color}`} />
      </motion.div>
    </div>
  );
}

/* ─── Horizontal Floral Divider (export for use in Astro via island) ─── */

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
        <OliveBranch className="mx-auto h-auto w-full text-gold/20" />
      </motion.div>
    </div>
  );
}
