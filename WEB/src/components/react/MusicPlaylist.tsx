import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';
import { authedFetch } from '../../lib/authed-fetch';

interface Song {
  id: string;
  song: string;
  artist: string;
  submittedAt: string;
}

export default function MusicPlaylist() {
  const { t } = useLanguage();
  const [songs, setSongs] = useState<Song[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start end', 'end start'],
  });

  const y = useTransform(scrollYProgress, [0, 1], [15, -15]);

  useEffect(() => {
    fetch('/api/songs')
      .then((r) => r.json())
      .then((data) => setSongs(data.songs ?? []))
      .catch(() => {});
  }, []);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const song = (formData.get('song') as string).trim();
    const artist = (formData.get('artist') as string).trim();

    if (!song || !artist) return;

    setLoading(true);
    try {
      const res = await authedFetch('/api/songs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ song, artist }),
      });
      if (res.ok) {
        const data = await res.json();
        setSongs((prev) => [data.entry, ...prev]);
        setSuccess(true);
        (e.target as HTMLFormElement).reset();
        setTimeout(() => setSuccess(false), 3000);
      }
    } catch {
      // Silent fail
    } finally {
      setLoading(false);
    }
  }

  return (
    <motion.div ref={containerRef} style={{ y }} className="mx-auto max-w-xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="font-body mb-3 text-xs font-light uppercase text-gold"
        >
          {t('music.subtitle')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-4xl font-bold text-charcoal md:text-5xl"
        >
          {t('music.title')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </div>

      {/* Form with staggered entrance */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        className="mb-12"
      >
        <div className="flex flex-col gap-4 sm:flex-row">
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.4, duration: 0.6 }}
          >
            <label htmlFor="music-song" className="sr-only">{t('music.song')}</label>
            <input
              id="music-song"
              name="song"
              type="text"
              required
              placeholder={t('music.song')}
              className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none sm:text-sm"
            />
          </motion.div>
          <motion.div
            className="flex-1"
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.5, duration: 0.6 }}
          >
            <label htmlFor="music-artist" className="sr-only">{t('music.artist')}</label>
            <input
              id="music-artist"
              name="artist"
              type="text"
              required
              placeholder={t('music.artist')}
              className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none sm:text-sm"
            />
          </motion.div>
          <motion.button
            type="submit"
            disabled={loading}
            className="border border-gold px-6 py-4 font-body text-xs font-light uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-white disabled:opacity-50 sm:py-3"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: 0.6, duration: 0.5, type: 'spring', stiffness: 200 }}
          >
            {t('music.submit')}
          </motion.button>
        </div>

        <AnimatePresence>
          {success && (
            <motion.p
              initial={{ opacity: 0, y: -5 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="font-body mt-4 text-center text-sm font-light text-gold"
            >
              {t('music.thanks')}
            </motion.p>
          )}
        </AnimatePresence>
      </motion.form>

      {/* Recent suggestions with staggered scroll reveal */}
      {songs.length > 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <motion.h3
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="font-body mb-6 text-center text-xs font-light uppercase tracking-[0.3em] text-charcoal-muted"
          >
            {t('music.recent')}
          </motion.h3>
          <div className="space-y-3">
            <AnimatePresence>
              {songs.slice(0, 8).map((song, i) => (
                <motion.div
                  key={song.id}
                  initial={{ opacity: 0, x: i % 2 === 0 ? -20 : 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.08, duration: 0.6, ease: [0.19, 1, 0.22, 1] }}
                  whileHover={{ x: 4, transition: { duration: 0.2 } }}
                  className="flex items-center gap-4 border-b border-gold/5 py-3"
                >
                  <span className="font-body text-xs text-gold/40">
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <div>
                    <p className="font-body text-sm font-medium text-charcoal">{song.song}</p>
                    <p className="font-body text-xs font-light text-charcoal-muted">{song.artist}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
