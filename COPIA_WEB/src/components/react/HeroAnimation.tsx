import {
  motion,
  useScroll,
  useTransform,
  useSpring,
  useMotionValue,
  useMotionTemplate,
} from 'motion/react';
import { useEffect, useRef, useMemo, useCallback } from 'react';
import { useLanguage } from '../../hooks/useLanguage';
import { siteConfig } from '../../config/site';

/* ─── Petal Explosion on Click ─── */
const PETAL_COLORS = ['#D4AF37', '#F3E5AB', '#F2DBD9', '#DFA8A8', '#9CAF88', '#C8D6B9'];

async function firePetalBurst(x: number, y: number) {
  try {
    const confettiModule = await import('canvas-confetti');
    const confetti = confettiModule.default;

    // Create petal shapes from SVG paths
    const petalPaths = [
      // Rose petal
      confetti.shapeFromPath({
        path: 'M10 0 C4 6, 0 14, 2 20 C4 26, 8 28, 10 28 C12 28, 16 26, 18 20 C20 14, 16 6, 10 0Z',
      }),
      // Cherry blossom petal
      confetti.shapeFromPath({
        path: 'M11 0 C4 3, 0 8, 1 14 C2 18, 6 20, 11 18 C16 20, 20 18, 21 14 C22 8, 18 3, 11 0Z',
      }),
      // Round petal
      confetti.shapeFromPath({
        path: 'M10 0 C4 0, 0 5, 0 11 C0 17, 4 22, 10 22 C16 22, 20 17, 20 11 C20 5, 16 0, 10 0Z',
      }),
    ];

    const origin = { x, y };

    // Main burst - fan of petals
    confetti({
      particleCount: 40,
      spread: 100,
      origin,
      colors: PETAL_COLORS,
      shapes: petalPaths,
      scalar: 1.3,
      gravity: 0.6,
      drift: 0,
      ticks: 250,
      startVelocity: 30,
    });

    // Secondary burst - slower, wider
    setTimeout(() => {
      confetti({
        particleCount: 25,
        spread: 140,
        origin,
        colors: PETAL_COLORS,
        shapes: petalPaths,
        scalar: 1.0,
        gravity: 0.4,
        drift: -0.3,
        ticks: 300,
        startVelocity: 20,
      });
    }, 100);

    // Third burst - gentle float upward
    setTimeout(() => {
      confetti({
        particleCount: 15,
        spread: 70,
        origin,
        colors: PETAL_COLORS,
        shapes: petalPaths,
        scalar: 1.5,
        gravity: 0.3,
        drift: 0.4,
        ticks: 350,
        startVelocity: 15,
        angle: 90,
      });
    }, 200);
  } catch {
    // canvas-confetti not available — non-critical
  }
}

/* ─── Magnetic Letter ─── */
function MagneticChar({
  char,
  index,
  mouseX,
  mouseY,
  baseDelay,
}: {
  char: string;
  index: number;
  mouseX: { get: () => number };
  mouseY: { get: () => number };
  baseDelay: number;
}) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const springX = useSpring(x, { damping: 20, stiffness: 180 });
  const springY = useSpring(y, { damping: 20, stiffness: 180 });

  useEffect(() => {
    let raf: number;
    const update = () => {
      const mx = mouseX.get();
      const my = mouseY.get();
      // Each char pushes slightly based on mouse, with unique phase
      const phase = index * 0.4;
      x.set(mx * (8 + Math.sin(phase) * 6));
      y.set(my * (6 + Math.cos(phase) * 4));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mouseX, mouseY, index, x, y]);

  if (char === ' ') {
    return <span className="inline-block w-[0.25em]" />;
  }

  return (
    <motion.span
      className="hero-char inline-block"
      style={{ x: springX, y: springY }}
      initial={{ opacity: 0, y: 80, rotate: index % 2 === 0 ? 3 : -3 }}
      animate={{ opacity: 1, y: 0, rotate: 0 }}
      transition={{
        duration: 1.6,
        delay: baseDelay + index * 0.06,
        ease: [0.19, 1, 0.22, 1],
      }}
    >
      {/* Continuous subtle float per character */}
      <motion.span
        className="inline-block"
        animate={{
          y: [0, -3 - (index % 3), 0, 2 + (index % 2), 0],
        }}
        transition={{
          duration: 4 + (index % 3),
          repeat: Infinity,
          ease: 'easeInOut',
          delay: index * 0.3,
        }}
      >
        {char}
      </motion.span>
    </motion.span>
  );
}

/* ─── Orbiting Particle ─── */
function OrbitingParticle({
  radiusX,
  radiusY,
  duration,
  delay,
  size,
  opacity,
  reverse = false,
}: {
  radiusX: number;
  radiusY: number;
  duration: number;
  delay: number;
  size: number;
  opacity: number;
  reverse?: boolean;
}) {
  return (
    <motion.div
      className="absolute left-1/2 top-1/2 rounded-full bg-gold"
      style={{
        width: size,
        height: size,
        marginLeft: -size / 2,
        marginTop: -size / 2,
        opacity,
      }}
      animate={{
        x: [
          radiusX, radiusX * 0.7, 0, -radiusX * 0.7, -radiusX,
          -radiusX * 0.7, 0, radiusX * 0.7, radiusX,
        ].map((v) => (reverse ? -v : v)),
        y: [
          0, radiusY * 0.7, radiusY, radiusY * 0.7, 0,
          -radiusY * 0.7, -radiusY, -radiusY * 0.7, 0,
        ],
        scale: [1, 1.2, 1.4, 1.2, 1, 0.8, 0.6, 0.8, 1],
      }}
      transition={{
        duration,
        repeat: Infinity,
        ease: 'linear',
        delay,
      }}
    />
  );
}

/* ─── Animated SVG Flourish ─── */
function AnimatedFlourish({ side, mouseX }: { side: 'left' | 'right'; mouseX: { get: () => number } }) {
  const x = useMotionValue(0);
  const springX = useSpring(x, { damping: 30, stiffness: 100 });

  useEffect(() => {
    let raf: number;
    const update = () => {
      const mx = mouseX.get();
      x.set(mx * (side === 'left' ? 15 : -15));
      raf = requestAnimationFrame(update);
    };
    raf = requestAnimationFrame(update);
    return () => cancelAnimationFrame(raf);
  }, [mouseX, side, x]);

  const isLeft = side === 'left';

  return (
    <motion.svg
      viewBox="0 0 200 400"
      fill="none"
      className={`absolute top-1/2 -translate-y-1/2 ${
        isLeft ? '-left-8 md:left-0 lg:left-8' : '-right-8 md:right-0 lg:right-8'
      } h-[300px] w-auto md:h-[400px] lg:h-[500px]`}
      style={{
        x: springX,
        transform: isLeft ? undefined : 'scaleX(-1) translateY(-50%)',
      }}
      initial={{ opacity: 0, pathLength: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 2, delay: 1.5 }}
    >
      {/* Main flowing curve */}
      <motion.path
        d="M180 0 C160 40, 120 60, 80 80 C40 100, 20 140, 40 180 C60 220, 100 200, 120 220 C140 240, 100 280, 80 300 C60 320, 40 360, 60 400"
        stroke="url(#flourish-gradient)"
        strokeWidth="0.8"
        strokeLinecap="round"
        className="hero-flourish-path"
      />
      {/* Spiral detail */}
      <motion.path
        d="M80 80 C70 70, 50 75, 55 90 C60 105, 80 100, 80 80Z"
        stroke="url(#flourish-gradient)"
        strokeWidth="0.6"
        className="hero-flourish-detail"
      />
      {/* Leaf accent */}
      <motion.path
        d="M120 220 C135 210, 150 215, 145 230 C140 245, 125 240, 120 220Z"
        stroke="url(#flourish-gradient)"
        strokeWidth="0.6"
        className="hero-flourish-detail"
      />
      {/* Small curl */}
      <motion.path
        d="M40 180 C30 170, 15 175, 20 190 C25 200, 40 195, 40 180Z"
        stroke="url(#flourish-gradient)"
        strokeWidth="0.5"
        className="hero-flourish-detail"
      />
      <defs>
        <linearGradient id="flourish-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#D4AF37" stopOpacity="0" />
          <stop offset="20%" stopColor="#D4AF37" stopOpacity="0.15" />
          <stop offset="50%" stopColor="#D4AF37" stopOpacity="0.25" />
          <stop offset="80%" stopColor="#D4AF37" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#D4AF37" stopOpacity="0" />
        </linearGradient>
      </defs>
    </motion.svg>
  );
}

/* ─── Main Hero Component ─── */
export default function HeroAnimation() {
  const { t } = useLanguage();
  const containerRef = useRef<HTMLElement>(null);

  const brideChars = useMemo(() => siteConfig.names.bride.split(''), []);
  const groomChars = useMemo(() => siteConfig.names.groom.split(''), []);

  // Mouse tracking
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springConfig = { damping: 25, stiffness: 150 };
  const springX = useSpring(mouseX, springConfig);
  const springY = useSpring(mouseY, springConfig);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      const { innerWidth, innerHeight } = window;
      mouseX.set(clientX / innerWidth - 0.5);
      mouseY.set(clientY / innerHeight - 0.5);
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [mouseX, mouseY]);

  // Scroll parallax
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 200]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);

  // Background blob mouse reactivity
  const blob1X = useTransform(springX, (v) => v * 40);
  const blob1Y = useTransform(springY, (v) => v * 40);
  const blob2X = useTransform(springX, (v) => v * -60);
  const blob2Y = useTransform(springY, (v) => v * -60);
  const blob3X = useTransform(springX, (v) => v * 30);
  const blob3Y = useTransform(springY, (v) => v * 30);

  // Radial gradient that follows the mouse
  const gradientX = useTransform(springX, [-0.5, 0.5], [30, 70]);
  const gradientY = useTransform(springY, [-0.5, 0.5], [20, 60]);
  const dynamicBg = useMotionTemplate`radial-gradient(ellipse 60vw 50vh at ${gradientX}% ${gradientY}%, rgba(212,175,55,0.04) 0%, transparent 70%)`;

  // Petal explosion on click/tap
  const handlePetalClick = useCallback((e: React.MouseEvent | React.TouchEvent) => {
    // Don't fire if clicking a link or button
    const target = e.target as HTMLElement;
    if (target.closest('a') || target.closest('button')) return;

    let clientX: number;
    let clientY: number;

    if ('touches' in e) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const x = clientX / window.innerWidth;
    const y = clientY / window.innerHeight;
    firePetalBurst(x, y);
  }, []);

  return (
    <section
      ref={containerRef}
      id="home"
      className="bg-gradient-hero relative flex min-h-[105vh] flex-col items-center justify-center overflow-hidden px-6 pt-20"
      onClick={handlePetalClick}
    >
      {/* Mouse-following radial light */}
      <motion.div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{ background: dynamicBg }}
      />

      {/* Morphing Background Blobs */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <motion.div
          style={{ x: blob1X, y: blob1Y }}
          className="hero-blob absolute -left-[10%] -top-[10%] h-[600px] w-[600px] rounded-full bg-champagne/30 blur-[120px]"
        />
        <motion.div
          style={{ x: blob2X, y: blob2Y }}
          className="hero-blob-reverse absolute -right-[5%] top-[20%] h-[500px] w-[500px] rounded-full bg-blush/20 blur-[100px]"
        />
        <motion.div
          style={{ x: blob3X, y: blob3Y }}
          className="hero-blob absolute -bottom-[20%] left-[10%] h-[700px] w-[700px] rounded-full bg-gold/5 blur-[120px]"
        />
      </div>

      {/* Animated SVG Flourishes (sides) */}
      <div className="pointer-events-none absolute inset-0 z-[2]">
        <AnimatedFlourish side="left" mouseX={mouseX} />
        <AnimatedFlourish side="right" mouseX={mouseX} />
      </div>

      {/* Content */}
      <motion.div style={{ y: y1, opacity }} className="relative z-10 text-center">
        {/* Top Ornament - breathing */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, ease: [0.19, 1, 0.22, 1] }}
          className="hero-line-breathe mx-auto mb-6 h-16 w-px bg-gradient-to-b from-transparent via-gold to-transparent sm:mb-10 sm:h-24"
        />

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.2, delay: 0.2, ease: 'easeOut' }}
          className="font-body mb-8 text-sm font-light uppercase tracking-[0.4em] text-charcoal-muted"
        >
          {t('hero.subtitle')}
        </motion.p>

        {/* Names with magnetic letters */}
        <div className="relative">
          <h1 className="font-display text-5xl font-bold leading-[0.9] tracking-tight text-charcoal sm:text-7xl md:text-9xl lg:text-[11rem]">
            {/* Bride name - each char is magnetic */}
            <span className="hero-shimmer block origin-bottom-left">
              {brideChars.map((char, i) => (
                <MagneticChar
                  key={`bride-${i}`}
                  char={char}
                  index={i}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  baseDelay={0.4}
                />
              ))}
            </span>

            {/* Ampersand with orbiting particles */}
            <span className="relative block">
              <motion.span
                initial={{ opacity: 0, scale: 0, rotate: -180 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                transition={{ duration: 1.8, delay: 1, ease: [0.19, 1, 0.22, 1] }}
                className="hero-ampersand font-accent relative inline-block text-4xl text-gold/80 mix-blend-multiply sm:text-6xl md:text-8xl lg:text-9xl"
              >
                &
                {/* Orbiting particles around & */}
                <OrbitingParticle radiusX={35} radiusY={25} duration={6} delay={0} size={3} opacity={0.35} />
                <OrbitingParticle radiusX={50} radiusY={35} duration={8} delay={1} size={2} opacity={0.25} reverse />
                <OrbitingParticle radiusX={28} radiusY={20} duration={5} delay={2} size={2.5} opacity={0.3} />
                <OrbitingParticle radiusX={60} radiusY={40} duration={10} delay={3} size={1.5} opacity={0.2} reverse />
                <OrbitingParticle radiusX={42} radiusY={30} duration={7} delay={4} size={2} opacity={0.28} />
              </motion.span>
            </span>

            {/* Groom name - each char is magnetic */}
            <span className="hero-shimmer block origin-bottom-right">
              {groomChars.map((char, i) => (
                <MagneticChar
                  key={`groom-${i}`}
                  char={char}
                  index={i}
                  mouseX={mouseX}
                  mouseY={mouseY}
                  baseDelay={0.6}
                />
              ))}
            </span>
          </h1>
        </div>

        {/* Bottom Ornament - breathing */}
        <motion.div
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ duration: 1.5, delay: 1.2, ease: [0.19, 1, 0.22, 1] }}
          className="hero-line-breathe mx-auto mt-10 h-24 w-px bg-gradient-to-b from-transparent via-gold to-transparent"
        />

        {/* Date & CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.5, ease: 'easeOut' }}
          className="mt-8 flex flex-col items-center gap-6"
        >
          <p className="font-body text-base font-light tracking-[0.15em] text-charcoal-muted sm:text-xl sm:tracking-[0.25em] md:text-2xl">
            {t('hero.date')}
          </p>

          <motion.a
            href="#rsvp"
            className="hero-cta group relative overflow-hidden rounded-sm border border-gold/40 px-10 py-4 transition-all duration-500 hover:border-gold"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="relative z-10 font-body text-xs font-medium uppercase tracking-[0.25em] text-charcoal-light transition-colors group-hover:text-gold">
              {t('hero.cta')}
            </span>
            <div className="absolute inset-0 z-0 bg-gold/5 opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
            {/* Shimmer sweep on CTA */}
            <div className="hero-cta-shimmer absolute inset-0 z-[1]" />
          </motion.a>
        </motion.div>
      </motion.div>

      {/* Scroll Indicator - continuous bob */}
      <motion.div
        style={{ opacity }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 2.5, duration: 1.5 }}
        className="absolute bottom-10 left-1/2 -translate-x-1/2"
      >
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
        >
          <span className="font-body text-[10px] uppercase tracking-[0.3em] text-charcoal-muted/60">
            Scroll
          </span>
          <motion.div
            className="mx-auto mt-2 h-12 w-px bg-charcoal-muted/20"
            initial={{ scaleY: 0 }}
            animate={{ scaleY: 1 }}
            transition={{ delay: 3, duration: 1 }}
            style={{ originY: 0 }}
          />
        </motion.div>
      </motion.div>
    </section>
  );
}
