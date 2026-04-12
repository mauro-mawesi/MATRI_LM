import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { useInviteCode } from '../../hooks/useInviteCode';
import { useLanguage } from '../../hooks/useLanguage';

interface InviteCodeGateProps {
  children: React.ReactNode;
}

/**
 * Wraps interactive sections (forms). Shows a code prompt overlay
 * the first time the user tries to interact. Once verified, the
 * code is stored in localStorage and never asked again.
 */
export default function InviteCodeGate({ children }: InviteCodeGateProps) {
  const { verified, verify, checking, error } = useInviteCode();
  const { lang } = useLanguage();
  const [showModal, setShowModal] = useState(false);
  const [input, setInput] = useState('');

  const t = {
    es: {
      unlock: 'Ingresa el código de invitación',
      placeholder: 'Código de invitación',
      submit: 'Verificar',
      checking: 'Verificando...',
      hint: 'Lo encontrarás en el grupo de WhatsApp',
      error: 'Código incorrecto, intenta de nuevo',
    },
    en: {
      unlock: 'Enter the invitation code',
      placeholder: 'Invitation code',
      submit: 'Verify',
      checking: 'Verifying...',
      hint: "You'll find it in the WhatsApp group",
      error: 'Incorrect code, try again',
    },
  }[lang];

  if (verified) {
    return <>{children}</>;
  }

  return (
    <div className="relative">
      {/* Blurred content with overlay */}
      <div className="pointer-events-none select-none blur-[3px] opacity-60">
        {children}
      </div>

      {/* Overlay button */}
      <div className="absolute inset-0 flex items-center justify-center">
        <motion.button
          type="button"
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 rounded-full border border-gold/40 bg-ivory/95 px-6 py-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-gold shadow-lg backdrop-blur-sm transition-all duration-300 hover:border-gold hover:shadow-xl active:scale-95"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
          </svg>
          {t.unlock}
        </motion.button>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[80] flex items-center justify-center bg-charcoal/60 backdrop-blur-sm p-4"
            onClick={() => setShowModal(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0, y: 20 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.9, opacity: 0, y: 20 }}
              transition={{ duration: 0.3, ease: [0.19, 1, 0.22, 1] }}
              className="w-full max-w-sm rounded-xl border border-gold/15 bg-ivory p-8 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              {/* Lock icon */}
              <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-full bg-gold/10">
                <svg className="h-6 w-6 text-gold" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="1.5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 10-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 002.25-2.25v-6.75a2.25 2.25 0 00-2.25-2.25H6.75a2.25 2.25 0 00-2.25 2.25v6.75a2.25 2.25 0 002.25 2.25z" />
                </svg>
              </div>

              <h3 className="mb-2 text-center font-display text-xl font-bold text-charcoal">
                {t.unlock}
              </h3>
              <p className="mb-6 text-center font-body text-[0.7rem] text-charcoal-muted/60">
                {t.hint}
              </p>

              <form
                onSubmit={async (e) => {
                  e.preventDefault();
                  const success = await verify(input);
                  if (success) setShowModal(false);
                }}
              >
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder={t.placeholder}
                  autoFocus
                  className="mb-4 w-full rounded-lg border border-gold/20 bg-white/80 px-4 py-3 text-center font-body text-sm uppercase tracking-[0.15em] text-charcoal placeholder:text-charcoal-muted/30 transition-colors focus:border-gold focus:outline-none"
                />

                {error && (
                  <p className="mb-3 text-center font-body text-xs text-red-400">
                    {t.error}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={checking || !input.trim()}
                  className="w-full rounded-lg border border-gold bg-gold/5 py-3 font-body text-xs font-medium uppercase tracking-[0.2em] text-gold transition-all duration-300 hover:bg-gold hover:text-white disabled:opacity-40"
                >
                  {checking ? t.checking : t.submit}
                </button>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
