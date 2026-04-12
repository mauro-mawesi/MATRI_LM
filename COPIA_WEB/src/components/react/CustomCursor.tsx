import { useState, useEffect } from 'react';
import { motion } from 'motion/react';

export default function CustomCursor() {
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [isHovering, setIsHovering] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isMobile, setIsMobile] = useState(true);

  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)');
    setIsMobile(!mq.matches);
    const handler = (e: MediaQueryListEvent) => setIsMobile(!e.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    if (isMobile) return;

    const move = (e: MouseEvent) => {
      setPosition({ x: e.clientX, y: e.clientY });
      setIsVisible(true);
    };

    const leave = () => setIsVisible(false);

    const handleHover = () => {
      const interactives = document.querySelectorAll('a, button, [role="button"], input, textarea, select');
      interactives.forEach((el) => {
        el.addEventListener('mouseenter', () => setIsHovering(true));
        el.addEventListener('mouseleave', () => setIsHovering(false));
      });
    };

    window.addEventListener('mousemove', move);
    document.addEventListener('mouseleave', leave);
    handleHover();
    const observer = new MutationObserver(handleHover);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => {
      window.removeEventListener('mousemove', move);
      document.removeEventListener('mouseleave', leave);
      observer.disconnect();
    };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] border border-gold/50"
        style={{ borderRadius: isHovering ? '0%' : '50%' }}
        animate={{
          x: position.x - (isHovering ? 20 : 14),
          y: position.y - (isHovering ? 20 : 14),
          width: isHovering ? 40 : 28,
          height: isHovering ? 40 : 28,
          opacity: isVisible ? 0.6 : 0,
          rotate: isHovering ? 45 : 0,
        }}
        transition={{ type: 'spring', stiffness: 400, damping: 30, mass: 0.4 }}
      />
      <motion.div
        className="pointer-events-none fixed left-0 top-0 z-[9999] rounded-full bg-gold"
        animate={{
          x: position.x - 2,
          y: position.y - 2,
          width: 4,
          height: 4,
          opacity: isVisible ? 0.8 : 0,
          scale: isHovering ? 0 : 1,
        }}
        transition={{ type: 'spring', stiffness: 500, damping: 25 }}
      />
    </>
  );
}
