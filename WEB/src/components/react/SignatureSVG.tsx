import { motion } from 'motion/react';

export default function SignatureSVG() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 1.8, delay: 0.6, ease: [0.19, 1, 0.22, 1] }}
      className="relative w-full mx-auto flex justify-center"
    >
      <h1
        className="leading-[1.1] text-charcoal text-center"
        style={{
          fontFamily: "'Brittany Signature', 'Caveat', cursive",
          fontSize: 'clamp(2.8rem, 8vw, 5.5rem)',
          fontWeight: 400,
        }}
      >
        Laura <span className="text-gold">&</span> Mauro
      </h1>
    </motion.div>
  );
}
