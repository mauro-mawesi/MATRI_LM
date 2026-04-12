import { useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

const accounts = [
  {
    id: 'colombia',
    country: { es: 'Colombia', en: 'Colombia' },
    flag: '🇨🇴',
    bank: 'Bancolombia',
    type: { es: 'Ahorros', en: 'Savings' },
    account: '51421866761',
    titular: 'Laura Realpe',
  },
  {
    id: 'netherlands',
    country: { es: 'Países Bajos', en: 'Netherlands' },
    flag: '🇳🇱',
    bank: 'ING',
    type: { es: 'Ahorros', en: 'Savings' },
    account: 'NL37INGB0398301433',
    titular: 'Mauricio Arias',
  },
];

function copyToClipboard(text: string): Promise<boolean> {
  if (navigator.clipboard?.writeText) {
    return navigator.clipboard.writeText(text).then(() => true).catch(() => fallbackCopy(text));
  }
  return Promise.resolve(fallbackCopy(text));
}

function fallbackCopy(text: string): boolean {
  const textarea = document.createElement('textarea');
  textarea.value = text;
  textarea.style.position = 'fixed';
  textarea.style.opacity = '0';
  document.body.appendChild(textarea);
  textarea.select();
  try {
    document.execCommand('copy');
    return true;
  } catch {
    return false;
  } finally {
    document.body.removeChild(textarea);
  }
}

export default function GiftAccounts() {
  const { lang } = useLanguage();
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCopy = useCallback(async (id: string, account: string) => {
    const success = await copyToClipboard(account);
    if (success) {
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
    }
  }, []);

  const t = {
    es: {
      title: 'Transferencia Bancaria',
      desc: 'Si prefieres la comodidad digital, puedes realizar una transferencia a cualquiera de nuestras cuentas.',
      copyBtn: 'Copiar Número',
      copied: 'Copiado!',
      envelopeTitle: 'Lluvia de Sobres',
      envelopeDesc: 'Es la tradición de entregar dinero en efectivo en un sobre el día del evento. Tendremos un buzón especial en la recepción.',
    },
    en: {
      title: 'Bank Transfer',
      desc: 'If you prefer digital convenience, you can make a transfer to either of our accounts.',
      copyBtn: 'Copy Number',
      copied: 'Copied!',
      envelopeTitle: 'Envelope Shower',
      envelopeDesc: 'It is the tradition of giving cash in an envelope on the day of the event. We will have a special mailbox at the reception.',
    },
  }[lang];

  return (
    <div className="mx-auto mt-12 w-full max-w-4xl space-y-6">
      {/* Bank accounts */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="group relative overflow-hidden rounded-xl bg-white p-8 shadow-sm border border-gold/15 transition-all duration-500 hover:shadow-xl hover:border-gold/40"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

        <div className="relative z-10 mb-6 text-center">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-charcoal">{t.title}</h3>
          <p className="font-body mt-2 text-sm font-light text-charcoal-muted">{t.desc}</p>
        </div>

        <div className="relative z-10 grid gap-4 sm:grid-cols-2">
          {accounts.map((acc) => (
            <div
              key={acc.id}
              className="rounded-lg border border-charcoal/5 bg-ivory p-5"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-xl">{acc.flag}</span>
                <span className="font-body text-xs font-medium uppercase tracking-[0.15em] text-charcoal-muted">
                  {acc.country[lang]}
                </span>
              </div>

              <p className="font-body text-xs font-light text-charcoal-muted">
                {acc.bank} — {acc.type[lang]}
              </p>
              <p className="font-body mt-1 text-base font-medium tracking-wider text-charcoal sm:text-lg">
                {acc.account}
              </p>
              <p className="font-body mt-1 text-xs font-light text-charcoal-muted">
                {acc.titular}
              </p>

              <button
                type="button"
                onClick={() => handleCopy(acc.id, acc.account)}
                className="mt-4 w-full rounded-full border border-gold/40 bg-transparent py-2 font-body text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-white active:scale-95"
              >
                {copiedId === acc.id ? t.copied : t.copyBtn}
              </button>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Envelope Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className="group relative flex flex-col items-center overflow-hidden rounded-xl bg-ivory-warm p-8 shadow-sm border border-gold/15 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-gold/40 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="relative z-10">
          <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
            <svg className="w-7 h-7 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76" />
            </svg>
          </div>
          <h3 className="font-display text-2xl font-bold text-charcoal mb-3">{t.envelopeTitle}</h3>
          <p className="font-body text-sm font-light leading-relaxed text-charcoal-muted">
            {t.envelopeDesc}
          </p>
        </div>
      </motion.div>
    </div>
  );
}
