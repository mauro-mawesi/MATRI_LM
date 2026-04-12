import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

export default function PhotoShare() {
  const { lang } = useLanguage();

  const t = {
    es: {
      subtitle: 'Captura el Momento',
      title: 'Comparte tus recuerdos',
      description: 'Queremos ver la boda a través de tus ojos. Sube todas las fotos y videos que tomes esta noche a nuestro álbum compartido para que vivan por siempre.',
      button: 'Subir Fotos al Álbum',
      qrAlt: 'Escanea para subir fotos',
    },
    en: {
      subtitle: 'Capture the Moment',
      title: 'Share your memories',
      description: 'We want to see the wedding through your eyes. Upload all the photos and videos you capture tonight to our shared gallery.',
      button: 'Upload to Shared Album',
      qrAlt: 'Scan to upload photos',
    }
  }[lang];

  return (
    <div className="mx-auto max-w-2xl text-center">
      <motion.p
        initial={{ opacity: 0, letterSpacing: '0.6em' }}
        whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
        viewport={{ once: true }}
        transition={{ duration: 1.2, delay: 0.1 }}
        className="font-body mb-3 text-xs font-light uppercase text-gold"
      >
        {t.subtitle}
      </motion.p>
      
      <motion.h2
        initial={{ opacity: 0, y: 25 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className="font-display text-4xl font-bold text-charcoal md:text-5xl"
      >
        {t.title}
      </motion.h2>

      <motion.div
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.4 }}
        className="mx-auto mt-6 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent"
      />

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.5 }}
        className="font-body mx-auto mt-8 max-w-md text-sm font-light leading-relaxed text-charcoal-muted"
      >
        {t.description}
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.6 }}
        className="mt-12 flex flex-col items-center justify-center gap-8 md:flex-row"
      >
        {/* Fake QR Block (Aesthetic) */}
        <div className="flex flex-col items-center gap-4">
          <div className="flex h-32 w-32 items-center justify-center rounded-xl bg-white p-2 shadow-sm border border-gold/20">
            {/* SVG Placeholder for QR Code */}
            <svg className="w-full h-full text-charcoal/80" viewBox="0 0 24 24" fill="currentColor">
              <path fillRule="evenodd" d="M3 3h8v8H3V3zm2 2v4h4V5H5zm8-2h8v8h-8V3zm2 2v4h4V5h-4zM3 13h8v8H3v-8zm2 2v4h4v-4H5zm13-2h3v2h-3v-2zm-3 0h2v2h-2v-2zm3 3h3v2h-3v-2zm-2 3h2v2h-2v-2zm-3 0h2v2h-2v-2zm3-3h-2v-2h2v2zm-6 3h2v2h-2v-2zm0-3h2v2h-2v-2zm-3-3h2v2h-2v-2zm2 2v2h-2v-2h2z" clipRule="evenodd" />
            </svg>
          </div>
        </div>

        {/* Action Button */}
        <a
          href="#"
          className="group relative inline-flex items-center gap-3 overflow-hidden rounded-full border border-gold/30 bg-ivory px-8 py-4 transition-all duration-300 hover:border-gold hover:shadow-lg"
        >
          <div className="absolute inset-0 bg-gold/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
          <svg className="relative z-10 w-5 h-5 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"></path>
          </svg>
          <span className="relative z-10 font-body text-xs font-medium uppercase tracking-[0.2em] text-charcoal">
            {t.button}
          </span>
        </a>
      </motion.div>
    </div>
  );
}
