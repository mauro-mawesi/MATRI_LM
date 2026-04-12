import { useState } from 'react';
import { motion } from 'motion/react';
import { useLanguage } from '../../hooks/useLanguage';

export default function GiftAccounts() {
  const { lang } = useLanguage();
  const [copied, setCopied] = useState(false);

  const bankInfo = {
    bank: 'Bancolombia',
    accountPrefix: 'Ahorros',
    account: '123-456789-00',
    titular: 'Laura o Mauro',
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(bankInfo.account);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const t = {
    es: {
      transferTitle: 'Transferencia',
      transferDesc: 'Si prefieres la comodidad digital, puedes realizar una transferencia directamente a nuestra cuenta.',
      envelopeTitle: 'Lluvia de Sobres',
      envelopeDesc: 'Es la tradición de entregar dinero en efectivo en un sobre el día del evento. Tendremos un buzón especial en la recepción.',
      copyBtn: 'Copiar Número',
      copied: '¡Copiado!',
    },
    en: {
      transferTitle: 'Bank Transfer',
      transferDesc: 'If you prefer digital convenience, you can make a transfer directly to our account.',
      envelopeTitle: 'Envelope Shower',
      envelopeDesc: 'It is the tradition of giving cash in an envelope on the day of the event. We will have a special mailbox at the reception.',
      copyBtn: 'Copy Number',
      copied: 'Copied!',
    }
  }[lang];

  return (
    <div className="grid gap-6 md:grid-cols-2 max-w-4xl mx-auto mt-12 w-full">
      {/* Transfer Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, ease: [0.19, 1, 0.22, 1] }}
        className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-white p-8 shadow-sm border border-gold/15 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-gold/40 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"></path>
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal mb-3">{t.transferTitle}</h3>
        <p className="font-body text-sm font-light leading-relaxed text-charcoal-muted mb-6">
          {t.transferDesc}
        </p>
        
        <div className="w-full rounded-lg bg-ivory p-4 border border-charcoal/5">
          <p className="font-body text-xs font-light text-charcoal-muted mb-1">{bankInfo.bank} - {bankInfo.accountPrefix}</p>
          <p className="font-body text-lg font-medium text-charcoal tracking-wider mb-1">{bankInfo.account}</p>
          <p className="font-body text-xs font-light text-charcoal-muted mb-4">{bankInfo.titular}</p>
          
          <button
            onClick={handleCopy}
            className="w-full rounded-full border border-gold/40 bg-transparent py-2 font-body text-xs font-medium uppercase tracking-[0.2em] text-gold transition-colors hover:bg-gold hover:text-white"
          >
            {copied ? t.copied : t.copyBtn}
          </button>
        </div>
      </motion.div>

      {/* Envelope Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8, delay: 0.2, ease: [0.19, 1, 0.22, 1] }}
        className="group relative flex flex-col items-center justify-center overflow-hidden rounded-xl bg-ivory-warm p-8 shadow-sm border border-gold/15 transition-all duration-500 hover:shadow-xl hover:-translate-y-1 hover:border-gold/40 text-center"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gold/10">
          <svg className="w-8 h-8 text-gold" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.5" d="M3 19v-8.93a2 2 0 01.89-1.664l7-4.666a2 2 0 012.22 0l7 4.666A2 2 0 0121 10.07V19M3 19a2 2 0 002 2h14a2 2 0 002-2M3 19l6.75-4.5M21 19l-6.75-4.5M3 10l6.75 4.5M21 10l-6.75 4.5m0 0l-1.14.76a2 2 0 01-2.22 0l-1.14-.76"></path>
          </svg>
        </div>
        <h3 className="font-display text-2xl font-bold text-charcoal mb-3">{t.envelopeTitle}</h3>
        <p className="font-body text-sm font-light leading-relaxed text-charcoal-muted">
          {t.envelopeDesc}
        </p>
      </motion.div>
    </div>
  );
}
