import { useEffect, useMemo, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

interface NotificationItem {
  id: string;
  title: string;
  message: string;
  variant?: 'info' | 'warning' | 'success';
  ctaLabel?: string;
  ctaHref?: string;
  createdAt?: string | null;
}

const STORAGE_KEY = 'wedding-read-notifications';

function getReadIds(): string[] {
  try {
    const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveReadId(id: string) {
  const current = new Set(getReadIds());
  current.add(id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify([...current]));
}

function formatDate(value: string | null | undefined, lang: 'es' | 'en') {
  if (!value) return '';

  try {
    return new Intl.DateTimeFormat(lang === 'es' ? 'es-CO' : 'en-US', {
      month: 'short',
      day: 'numeric',
    }).format(new Date(value));
  } catch {
    return '';
  }
}

function variantClasses(variant: NotificationItem['variant']) {
  switch (variant) {
    case 'success':
      return {
        badge: 'bg-sage/12 text-sage',
        border: 'border-sage/20',
        glow: 'from-sage/12 via-transparent to-transparent',
      };
    case 'warning':
      return {
        badge: 'bg-gold/15 text-gold-dark',
        border: 'border-gold/25',
        glow: 'from-gold/10 via-transparent to-transparent',
      };
    default:
      return {
        badge: 'bg-blush/35 text-charcoal',
        border: 'border-blush-dark/20',
        glow: 'from-blush/30 via-transparent to-transparent',
      };
  }
}

export default function NotificationCenter() {
  const { lang } = useLanguage();
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [bannerDismissed, setBannerDismissed] = useState(false);

  useEffect(() => {
    setReadIds(getReadIds());

    fetch('/api/notifications')
      .then((response) => response.json())
      .then((data) => setNotifications(data.notifications ?? []))
      .catch(() => {});
  }, []);

  const unreadNotifications = useMemo(
    () => notifications.filter((item) => !readIds.includes(item.id)),
    [notifications, readIds],
  );

  const featured = unreadNotifications[0] ?? null;

  const markAsRead = (id: string) => {
    saveReadId(id);
    setReadIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
  };

  const t = {
    es: {
      badge: 'Novedades',
      markRead: 'Marcar como leida',
      empty: 'No hay notificaciones activas por ahora.',
      viewAll: 'Avisos importantes',
      open: 'Abrir',
      dismiss: 'Cerrar aviso',
    },
    en: {
      badge: 'Updates',
      markRead: 'Mark as read',
      empty: 'There are no active notifications right now.',
      viewAll: 'Important updates',
      open: 'Open',
      dismiss: 'Dismiss notice',
    },
  }[lang];

  return (
    <>
      <AnimatePresence>
        {featured && !bannerDismissed && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.35, ease: [0.19, 1, 0.22, 1] }}
            className="sticky top-20 z-40 mx-auto mb-4 w-full max-w-6xl px-4 md:top-24 md:px-6"
          >
            <div className="relative overflow-hidden rounded-2xl border border-gold/20 bg-ivory/95 px-5 py-4 shadow-[0_20px_60px_-35px_rgba(30,30,30,0.35)] backdrop-blur-xl md:px-6 md:py-5">
              <div className="absolute inset-0 bg-gradient-to-r from-gold/8 via-transparent to-blush/10" />
              <div className="relative flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                <div className="pr-8">
                  <p className="font-body mb-2 text-[0.65rem] uppercase tracking-[0.28em] text-gold">
                    {t.badge}
                  </p>
                  <h3 className="font-display text-xl text-charcoal md:text-2xl">
                    {featured.title}
                  </h3>
                  <p className="font-body mt-2 max-w-3xl text-sm font-light leading-relaxed text-charcoal-muted">
                    {featured.message}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  {featured.ctaHref && (
                    <a
                      href={featured.ctaHref}
                      className="rounded-full border border-gold/35 px-5 py-2 font-body text-[0.68rem] uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:bg-gold/5 hover:text-gold-dark"
                    >
                      {featured.ctaLabel || t.open}
                    </a>
                  )}

                  <button
                    type="button"
                    onClick={() => {
                      markAsRead(featured.id);
                      setBannerDismissed(true);
                    }}
                    className="rounded-full border border-charcoal/10 px-5 py-2 font-body text-[0.68rem] uppercase tracking-[0.2em] text-charcoal-muted transition-colors hover:border-gold/30 hover:text-gold-dark"
                  >
                    {t.markRead}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setBannerDismissed(true)}
                  className="absolute right-0 top-0 flex h-10 w-10 items-center justify-center text-charcoal-muted/60 transition-colors hover:text-gold"
                  aria-label={t.dismiss}
                >
                  <svg className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <section className="mx-auto w-full max-w-6xl px-4 py-6 md:px-6 md:py-10">
        <div className="mb-6 text-center">
          <p className="font-body mb-2 text-xs uppercase tracking-[0.3em] text-gold">
            {t.badge}
          </p>
          <h2 className="font-display text-3xl text-charcoal md:text-4xl">
            {t.viewAll}
          </h2>
          <div className="mx-auto mt-4 h-px w-16 bg-gradient-to-r from-transparent via-gold to-transparent" />
        </div>

        {notifications.length === 0 ? (
          <div className="rounded-2xl border border-gold/10 bg-white/55 px-6 py-8 text-center backdrop-blur-sm">
            <p className="font-body text-sm font-light text-charcoal-muted/60">
              {t.empty}
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {notifications.map((item, index) => {
              const isRead = readIds.includes(item.id);
              const tone = variantClasses(item.variant);

              return (
                <motion.article
                  key={item.id}
                  initial={{ opacity: 0, y: 18 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.65, delay: Math.min(index * 0.08, 0.3), ease: [0.19, 1, 0.22, 1] }}
                  className={`group relative overflow-hidden rounded-2xl border bg-white/60 p-6 backdrop-blur-sm transition-all duration-300 hover:shadow-lg ${tone.border} ${isRead ? 'opacity-72' : ''}`}
                >
                  <div className={`absolute inset-0 bg-gradient-to-br ${tone.glow}`} />

                  <div className="relative">
                    <div className="mb-4 flex items-center justify-between gap-3">
                      <span className={`rounded-full px-3 py-1 font-body text-[0.62rem] uppercase tracking-[0.2em] ${tone.badge}`}>
                        {item.variant || 'info'}
                      </span>
                      <span className="font-body text-[0.65rem] uppercase tracking-[0.22em] text-charcoal-muted/45">
                        {formatDate(item.createdAt, lang)}
                      </span>
                    </div>

                    <h3 className="font-display text-2xl text-charcoal">
                      {item.title}
                    </h3>
                    <p className="font-body mt-3 text-sm font-light leading-relaxed text-charcoal-muted">
                      {item.message}
                    </p>

                    <div className="mt-5 flex flex-wrap items-center gap-3">
                      {item.ctaHref && (
                        <a
                          href={item.ctaHref}
                          className="rounded-full border border-gold/30 px-4 py-2 font-body text-[0.65rem] uppercase tracking-[0.2em] text-charcoal transition-colors hover:border-gold hover:text-gold-dark"
                        >
                          {item.ctaLabel || t.open}
                        </a>
                      )}

                      {!isRead && (
                        <button
                          type="button"
                          onClick={() => markAsRead(item.id)}
                          className="rounded-full border border-charcoal/10 px-4 py-2 font-body text-[0.65rem] uppercase tracking-[0.2em] text-charcoal-muted transition-colors hover:border-gold/30 hover:text-gold-dark"
                        >
                          {t.markRead}
                        </button>
                      )}
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </div>
        )}
      </section>
    </>
  );
}
