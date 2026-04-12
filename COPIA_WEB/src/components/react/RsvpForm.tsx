import { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';
import { rsvpSchema } from '../../lib/rsvp-schema';
import RsvpConfirmation from './RsvpConfirmation';

export default function RsvpForm() {
  const { t } = useLanguage();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [attending, setAttending] = useState(true);
  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError('');
    setFormErrors({});

    const formData = new FormData(e.currentTarget);
    const raw = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      attending,
      guests: Number(formData.get('guests') || 0),
      dietary: (formData.get('dietary') as string) || '',
      message: (formData.get('message') as string) || '',
    };

    const result = rsvpSchema.safeParse(raw);
    if (!result.success) {
      const errors: Record<string, string> = {};
      result.error.errors.forEach((err) => {
        if (err.path[0]) errors[String(err.path[0])] = err.message;
      });
      setFormErrors(errors);
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/rsvp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(result.data),
      });
      if (!res.ok) throw new Error('Failed');
      setSubmitted(true);
    } catch {
      setError(t('rsvp.error'));
    } finally {
      setLoading(false);
    }
  }

  if (submitted) {
    return <RsvpConfirmation onClose={() => setSubmitted(false)} />;
  }

  return (
    <form onSubmit={handleSubmit} className="mx-auto max-w-lg">
      {/* Header with staggered entrance */}
      <div className="mb-12 text-center">
        <motion.p
          initial={{ opacity: 0, letterSpacing: '0.6em' }}
          whileInView={{ opacity: 1, letterSpacing: '0.4em' }}
          viewport={{ once: true }}
          transition={{ duration: 1.2, delay: 0.1 }}
          className="font-body mb-3 text-xs font-light uppercase text-gold"
        >
          {t('rsvp.subtitle')}
        </motion.p>
        <motion.h2
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 1, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
          className="font-display text-3xl font-bold text-charcoal md:text-4xl"
        >
          {t('rsvp.title')}
        </motion.h2>
        <motion.div
          initial={{ scaleX: 0 }}
          whileInView={{ scaleX: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.4 }}
          className="mx-auto mt-4 h-px w-16 origin-center bg-gradient-to-r from-transparent via-gold to-transparent"
        />
      </div>

      <div className="space-y-6">
        {/* Name - slides from left */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.19, 1, 0.22, 1] }}
        >
          <label htmlFor="rsvp-name" className="font-body mb-2 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
            {t('rsvp.name')}
          </label>
          <input
            id="rsvp-name"
            name="name"
            type="text"
            required
            className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal transition-colors focus:border-gold focus:outline-none sm:text-sm"
          />
          {formErrors.name && <p className="mt-1 font-body text-xs text-rose">{formErrors.name}</p>}
        </motion.div>

        {/* Email - slides from right */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        >
          <label htmlFor="rsvp-email" className="font-body mb-2 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
            {t('rsvp.email')}
          </label>
          <input
            id="rsvp-email"
            name="email"
            type="email"
            required
            className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal transition-colors focus:border-gold focus:outline-none sm:text-sm"
          />
          {formErrors.email && <p className="mt-1 font-body text-xs text-rose">{formErrors.email}</p>}
        </motion.div>

        {/* Attending - scales in */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3, ease: [0.19, 1, 0.22, 1] }}
        >
          <label className="font-body mb-3 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
            {t('rsvp.attending')}
          </label>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => setAttending(true)}
              className={`flex-1 border py-3 font-body text-sm font-light transition-all duration-300 ${
                attending
                  ? 'border-gold bg-gold text-white'
                  : 'border-gold/20 bg-transparent text-charcoal-muted hover:border-gold/40'
              }`}
            >
              {t('rsvp.attending.yes')}
            </button>
            <button
              type="button"
              onClick={() => setAttending(false)}
              className={`flex-1 border py-3 font-body text-sm font-light transition-all duration-300 ${
                !attending
                  ? 'border-rose bg-rose text-white'
                  : 'border-gold/20 bg-transparent text-charcoal-muted hover:border-gold/40'
              }`}
            >
              {t('rsvp.attending.no')}
            </button>
          </div>
        </motion.div>

        {attending && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.5, ease: [0.19, 1, 0.22, 1] }}
            className="space-y-6 overflow-hidden"
          >
            {/* Guests - slides from left */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.15, duration: 0.5 }}
            >
              <label htmlFor="rsvp-guests" className="font-body mb-2 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
                {t('rsvp.guests')}
              </label>
              <select
                id="rsvp-guests"
                name="guests"
                className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal transition-colors focus:border-gold focus:outline-none sm:text-sm"
              >
                {[0, 1, 2, 3, 4, 5].map((n) => (
                  <option key={n} value={n}>{n}</option>
                ))}
              </select>
            </motion.div>

            {/* Dietary - slides from right */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.25, duration: 0.5 }}
            >
              <label htmlFor="rsvp-dietary" className="font-body mb-2 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
                {t('rsvp.dietary')}
              </label>
              <input
                id="rsvp-dietary"
                name="dietary"
                type="text"
                placeholder={t('rsvp.dietary.placeholder')}
                className="w-full border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none sm:text-sm"
              />
            </motion.div>
          </motion.div>
        )}

        {/* Message - fades up */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.7, delay: 0.4, ease: [0.19, 1, 0.22, 1] }}
        >
          <label htmlFor="rsvp-message" className="font-body mb-2 block text-xs font-light uppercase tracking-[0.2em] text-charcoal-muted">
            {t('rsvp.message')}
          </label>
          <textarea
            id="rsvp-message"
            name="message"
            rows={3}
            placeholder={t('rsvp.message.placeholder')}
            className="w-full resize-none border-b border-gold/20 bg-transparent px-1 py-3 font-body text-base text-charcoal placeholder:text-charcoal-muted/40 transition-colors focus:border-gold focus:outline-none sm:text-sm"
          />
        </motion.div>

        {error && (
          <p className="text-center font-body text-sm text-rose">{error}</p>
        )}

        {/* Submit button - dramatic entrance */}
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.95 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5, ease: [0.19, 1, 0.22, 1] }}
        >
          <motion.button
            type="submit"
            disabled={loading}
            className="mt-4 w-full border border-gold bg-gold py-4 font-body text-sm font-medium uppercase tracking-[0.2em] text-white transition-all duration-500 hover:bg-gold-dark disabled:opacity-50"
            whileHover={{ scale: loading ? 1 : 1.02 }}
            whileTap={{ scale: loading ? 1 : 0.98 }}
          >
            {loading ? t('rsvp.submitting') : t('rsvp.submit')}
          </motion.button>
        </motion.div>
      </div>
    </form>
  );
}
