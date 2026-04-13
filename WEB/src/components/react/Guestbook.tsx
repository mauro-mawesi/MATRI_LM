import { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';
import type { MessageEntry } from '../../lib/message-schema';
import { authedFetch } from '../../lib/authed-fetch';
import { useInviteCode } from '../../hooks/useInviteCode';

function photoUrl(filename: string): string {
  return `/api/photo/guestbook-photos/${filename}`;
}

/* ─── Client-side image compression ─── */
async function compressImage(file: File, maxWidth = 1200, quality = 0.8): Promise<File> {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => {
      const canvas = document.createElement('canvas');
      let { width, height } = img;
      if (width > maxWidth) {
        height = (height * maxWidth) / width;
        width = maxWidth;
      }
      canvas.width = width;
      canvas.height = height;
      const ctx = canvas.getContext('2d')!;
      ctx.drawImage(img, 0, 0, width, height);
      canvas.toBlob(
        (blob) => {
          resolve(new File([blob!], file.name, { type: 'image/jpeg' }));
        },
        'image/jpeg',
        quality
      );
    };
    img.src = URL.createObjectURL(file);
  });
}

/* ─── Relative time formatting ─── */
function timeAgo(dateStr: string, lang: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return lang === 'es' ? 'Justo ahora' : 'Just now';
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h`;
  const days = Math.floor(hours / 24);
  return `${days}d`;
}

/* ─── Photo Lightbox ─── */
function Lightbox({ src, onClose }: { src: string; onClose: () => void }) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/80 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <motion.img
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        src={src}
        alt=""
        className="max-h-[85vh] max-w-full rounded-lg object-contain shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      />
      <button
        type="button"
        onClick={onClose}
        className="absolute top-6 right-6 flex h-10 w-10 items-center justify-center rounded-full bg-ivory/90 text-charcoal transition-colors hover:bg-white"
        aria-label="Close"
      >
        <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </motion.div>
  );
}

/* ─── Message Card ─── */
function MessageCard({ entry, lang, index, onPhotoClick, onLike, isLiked }: {
  entry: MessageEntry;
  lang: string;
  index: number;
  onPhotoClick: (src: string) => void;
  onLike: (id: string) => void;
  isLiked: boolean;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.08, ease: [0.19, 1, 0.22, 1] }}
      className="group rounded-xl border border-gold/10 bg-white/70 p-6 backdrop-blur-sm transition-all duration-500 hover:border-gold/25 hover:shadow-lg hover:shadow-gold/5"
    >
      <div className="mb-3 flex items-center justify-between">
        <span className="font-display text-base font-bold text-charcoal">{entry.name}</span>
        <span className="font-body text-[0.6rem] tracking-wider text-charcoal-muted/50">
          {timeAgo(entry.submitted_at, lang)}
        </span>
      </div>
      <p className="font-body text-sm font-light leading-relaxed text-charcoal-muted">{entry.message}</p>

      {entry.photos.length > 0 && (
        <div className="mt-4 flex gap-2">
          {entry.photos.map((filename) => (
            <button
              type="button"
              key={filename}
              onClick={() => onPhotoClick(photoUrl(filename))}
              className="h-16 w-16 overflow-hidden rounded-lg border border-gold/10 transition-all duration-300 hover:border-gold/30 hover:shadow-md"
            >
              <img
                src={photoUrl(filename)}
                alt=""
                className="h-full w-full object-cover"
                loading="lazy"
              />
            </button>
          ))}
        </div>
      )}

      {/* Like button */}
      <div className="mt-4 flex items-center gap-2">
        <button
          type="button"
          onClick={() => !isLiked && onLike(entry.id)}
          disabled={isLiked}
          className={`flex items-center gap-1.5 rounded-full px-3 py-1 font-body text-[0.65rem] transition-all duration-300 ${
            isLiked
              ? 'bg-gold/10 text-gold'
              : 'text-charcoal-muted/40 hover:bg-gold/5 hover:text-gold active:scale-95'
          }`}
        >
          <svg
            className={`h-3.5 w-3.5 transition-transform duration-300 ${isLiked ? 'scale-110' : ''}`}
            viewBox="0 0 24 24"
            fill={isLiked ? 'currentColor' : 'none'}
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M21 8.25c0-2.485-2.099-4.5-4.688-4.5-1.935 0-3.597 1.126-4.312 2.733-.715-1.607-2.377-2.733-4.313-2.733C5.1 3.75 3 5.765 3 8.25c0 7.22 9 12 9 12s9-4.78 9-12z" />
          </svg>
          {entry.likes > 0 && (
            <span>{entry.likes}</span>
          )}
        </button>
      </div>
    </motion.div>
  );
}

/* ─── Main Guestbook Component ─── */
export default function Guestbook() {
  const { t, lang } = useLanguage();
  const { guestName } = useInviteCode();
  const [messages, setMessages] = useState<MessageEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState('');
  const [visibility, setVisibility] = useState<'public' | 'private'>('public');
  const [photos, setPhotos] = useState<File[]>([]);
  const [previews, setPreviews] = useState<string[]>([]);
  const [lightboxSrc, setLightboxSrc] = useState<string | null>(null);
  const [likedIds, setLikedIds] = useState<Set<string>>(new Set());
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Load public messages
  useEffect(() => {
    fetch('/api/messages')
      .then((r) => r.json())
      .then((data) => setMessages(data.messages ?? []))
      .catch(() => {});

    // Restore liked messages from localStorage
    try {
      const stored = JSON.parse(localStorage.getItem('wedding-liked-messages') || '[]');
      setLikedIds(new Set(stored));
    } catch { /* ignore */ }
  }, []);

  // Handle like
  const handleLike = useCallback(async (id: string) => {
    try {
      const res = await authedFetch('/api/messages/like', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      if (res.ok) {
        const { likes } = await res.json();
        setMessages((prev) => prev.map((m) => m.id === id ? { ...m, likes } : m));
        setLikedIds((prev) => {
          const next = new Set(prev);
          next.add(id);
          localStorage.setItem('wedding-liked-messages', JSON.stringify([...next]));
          return next;
        });
      }
    } catch { /* silent */ }
  }, []);

  // Handle photo selection
  const handlePhotoSelect = useCallback(async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files || []).slice(0, 3 - photos.length);
    if (files.length === 0) return;

    const compressed = await Promise.all(files.map((f) => compressImage(f)));
    const newPreviews = compressed.map((f) => URL.createObjectURL(f));

    setPhotos((prev) => [...prev, ...compressed].slice(0, 3));
    setPreviews((prev) => [...prev, ...newPreviews].slice(0, 3));
  }, [photos.length]);

  const removePhoto = useCallback((index: number) => {
    URL.revokeObjectURL(previews[index]);
    setPhotos((prev) => prev.filter((_, i) => i !== index));
    setPreviews((prev) => prev.filter((_, i) => i !== index));
  }, [previews]);

  // Submit message
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setLoading(true);

    const form = e.currentTarget;
    const formData = new FormData();
    formData.append('name', (form.elements.namedItem('name') as HTMLInputElement).value.trim());
    formData.append('message', (form.elements.namedItem('message') as HTMLTextAreaElement).value.trim());
    formData.append('visibility', visibility);

    for (const photo of photos) {
      formData.append('photos', photo);
    }

    try {
      const res = await authedFetch('/api/messages', { method: 'POST', body: formData });
      if (res.ok) {
        const data = await res.json();
        if (visibility === 'public') {
          setMessages((prev) => [data.entry, ...prev]);
        }
        setSuccess(true);
        form.reset();
        setPhotos([]);
        setPreviews([]);
        setVisibility('public');
        setTimeout(() => setSuccess(false), 4000);
      } else {
        const data = await res.json();
        setError(data.error || t('guestbook.error'));
      }
    } catch {
      setError(t('guestbook.error'));
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mx-auto max-w-3xl">
      {/* Header */}
      <div className="mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="font-body mb-3 text-xs font-light uppercase text-gold"
        >
          {t('guestbook.subtitle')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="text-4xl text-charcoal md:text-5xl"
          style={{ fontFamily: "'Brittany Signature', 'Caveat', cursive" }}
        >
          {t('guestbook.title')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-6 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </div>

      {/* Form */}
      <motion.form
        onSubmit={handleSubmit}
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.3 }}
        className="mb-16 rounded-xl border border-gold/10 bg-white/60 p-6 backdrop-blur-sm sm:p-8"
      >
        {/* Name */}
        <div className="mb-5">
          <label htmlFor="gb-name" className="sr-only">{t('guestbook.name')}</label>
          <input
            id="gb-name"
            name="name"
            type="text"
            required
            defaultValue={guestName || ''}
            placeholder={t('guestbook.name')}
            className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-sm text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none"
          />
        </div>

        {/* Message */}
        <div className="mb-5">
          <label htmlFor="gb-message" className="sr-only">{t('guestbook.message')}</label>
          <textarea
            id="gb-message"
            name="message"
            required
            rows={4}
            placeholder={t('guestbook.placeholder')}
            className="w-full resize-none border-b border-gold/20 bg-transparent px-1 py-3 font-body text-sm text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none"
          />
        </div>

        {/* Visibility Toggle + Photos */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          {/* Visibility toggle */}
          <div className="flex items-center gap-1 rounded-full border border-gold/20 p-1">
            <button
              type="button"
              onClick={() => setVisibility('public')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-[0.65rem] uppercase tracking-[0.15em] transition-all duration-300 ${
                visibility === 'public'
                  ? 'bg-gold/10 text-gold'
                  : 'text-charcoal-muted/50 hover:text-charcoal-muted'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {t('guestbook.public')}
            </button>
            <button
              type="button"
              onClick={() => setVisibility('private')}
              className={`flex items-center gap-1.5 rounded-full px-4 py-1.5 font-body text-[0.65rem] uppercase tracking-[0.15em] transition-all duration-300 ${
                visibility === 'private'
                  ? 'bg-gold/10 text-gold'
                  : 'text-charcoal-muted/50 hover:text-charcoal-muted'
              }`}
            >
              <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
              </svg>
              {t('guestbook.private')}
            </button>
          </div>

          {/* Photo upload button */}
          <div className="flex items-center gap-3">
            {photos.length < 3 && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center gap-2 rounded-full border border-gold/20 px-4 py-1.5 font-body text-[0.65rem] uppercase tracking-[0.15em] text-charcoal-muted transition-all duration-300 hover:border-gold/40 hover:text-gold"
              >
                <svg className="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.827 6.175A2.31 2.31 0 015.186 7.23c-.38.054-.757.112-1.134.175C2.999 7.58 2.25 8.507 2.25 9.574V18a2.25 2.25 0 002.25 2.25h15A2.25 2.25 0 0021.75 18V9.574c0-1.067-.75-1.994-1.802-2.169a47.865 47.865 0 00-1.134-.175 2.31 2.31 0 01-1.64-1.055l-.822-1.316a2.192 2.192 0 00-1.736-1.039 48.774 48.774 0 00-5.232 0 2.192 2.192 0 00-1.736 1.039l-.821 1.316z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 12.75a4.5 4.5 0 11-9 0 4.5 4.5 0 019 0z" />
                </svg>
                {t('guestbook.photos')}
              </button>
            )}
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handlePhotoSelect}
            />
            {photos.length > 0 && (
              <span className="font-body text-[0.6rem] text-charcoal-muted/40">
                {photos.length}/3
              </span>
            )}
          </div>
        </div>

        {/* Private note */}
        <AnimatePresence>
          {visibility === 'private' && (
            <motion.p
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-4 font-body text-[0.7rem] italic text-gold/70"
            >
              🔒 {t('guestbook.privateNote')}
            </motion.p>
          )}
        </AnimatePresence>

        {/* Photo previews */}
        {previews.length > 0 && (
          <div className="mb-6 flex gap-3">
            {previews.map((src, i) => (
              <div key={src} className="relative">
                <img
                  src={src}
                  alt=""
                  className="h-20 w-20 rounded-lg border border-gold/15 object-cover"
                />
                <button
                  type="button"
                  onClick={() => removePhoto(i)}
                  className="absolute -right-1.5 -top-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-charcoal text-white text-[0.5rem] shadow-sm transition-colors hover:bg-red-500"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        )}

        {/* Submit */}
        <div className="flex items-center gap-4">
          <motion.button
            type="submit"
            disabled={loading}
            className="border border-gold px-8 py-3 font-body text-xs font-light uppercase tracking-[0.15em] text-gold transition-all duration-300 hover:bg-gold hover:text-white disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? t('guestbook.submitting') : t('guestbook.submit')}
          </motion.button>

          <AnimatePresence>
            {success && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="font-body text-sm font-light text-gold"
              >
                {t('guestbook.success')}
              </motion.span>
            )}
            {error && (
              <motion.span
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="font-body text-sm font-light text-red-400"
              >
                {error}
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </motion.form>

      {/* Message Wall */}
      <div>
        {messages.length > 0 ? (
          <>
            <motion.h3
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="font-body mb-8 text-center text-xs font-light uppercase tracking-[0.3em] text-charcoal-muted"
            >
              {t('guestbook.recent')}
            </motion.h3>
            <div className="grid gap-4 sm:grid-cols-2">
              {messages.map((entry, i) => (
                <MessageCard
                  key={entry.id}
                  entry={entry}
                  lang={lang}
                  index={i}
                  onPhotoClick={setLightboxSrc}
                  onLike={handleLike}
                  isLiked={likedIds.has(entry.id)}
                />
              ))}
            </div>
          </>
        ) : (
          <motion.p
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            className="font-body text-center text-sm font-light italic text-charcoal-muted/50"
          >
            {t('guestbook.empty')}
          </motion.p>
        )}
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {lightboxSrc && (
          <Lightbox src={lightboxSrc} onClose={() => setLightboxSrc(null)} />
        )}
      </AnimatePresence>
    </div>
  );
}
