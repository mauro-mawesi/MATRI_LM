import { useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export default function LiquidMesh() {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const { clientX, clientY } = e;
      const x = (clientX / window.innerWidth - 0.5) * 20;
      const y = (clientY / window.innerHeight - 0.5) * 20;
      
      containerRef.current.style.transform = `translate(${x}px, ${y}px)`;
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none z-0 bg-[#050505]">
      <motion.div 
        ref={containerRef}
        className="absolute w-[150vw] h-[150vh] -top-[25vh] -left-[25vw] opacity-60 mix-blend-screen"
        initial={{ filter: 'blur(80px)' }}
        animate={{
          background: [
            'radial-gradient(circle at 20% 30%, var(--color-blush) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-gold) 0%, transparent 50%), radial-gradient(circle at 60% 20%, var(--color-sage) 0%, transparent 40%)',
            'radial-gradient(circle at 80% 20%, var(--color-sage) 0%, transparent 50%), radial-gradient(circle at 20% 80%, var(--color-blush) 0%, transparent 40%), radial-gradient(circle at 40% 60%, var(--color-gold) 0%, transparent 50%)',
            'radial-gradient(circle at 20% 30%, var(--color-blush) 0%, transparent 40%), radial-gradient(circle at 80% 70%, var(--color-gold) 0%, transparent 50%), radial-gradient(circle at 60% 20%, var(--color-sage) 0%, transparent 40%)',
          ]
        }}
        transition={{
          duration: 15,
          repeat: Infinity,
          ease: "linear"
        }}
      />
      {/* Noise overlay purely for texture */}
      <div className="absolute inset-0 opacity-10 mix-blend-overlay" style={{backgroundImage: 'url("data:image/svg+xml,%3Csvg viewBox=\"0 0 200 200\" xmlns=\"http://www.w3.org/2000/svg\"%3E%3Cfilter id=\"noiseFilter\"%3E%3CfeTurbulence type=\"fractalNoise\" baseFrequency=\"0.8\" numOctaves=\"3\" stitchTiles=\"stitch\"/%3E%3C/filter%3E%3Crect width=\"100%25\" height=\"100%25\" filter=\"url(%23noiseFilter)\"/%3E%3C/svg%3E")'}}></div>
    </div>
  );
}
