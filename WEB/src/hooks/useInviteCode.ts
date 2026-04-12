import { useState, useEffect, useCallback } from 'react';

const CODE_KEY = 'wedding-invite-code';
const NAME_KEY = 'wedding-guest-name';

export function useInviteCode() {
  const [code, setCode] = useState<string | null>(null);
  const [guestName, setGuestName] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // Restore from localStorage on mount
  useEffect(() => {
    const storedCode = localStorage.getItem(CODE_KEY);
    const storedName = localStorage.getItem(NAME_KEY);
    if (storedCode && storedName) {
      setCode(storedCode);
      setGuestName(storedName);
      setVerified(true);
    }
  }, []);

  const verify = useCallback(async (inputCode: string, inputName: string) => {
    setChecking(true);
    setError('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode, name: inputName }),
      });

      const data = await res.json();

      if (data.valid) {
        const normalizedCode = inputCode.trim().toUpperCase();
        const normalizedName = inputName.trim();
        localStorage.setItem(CODE_KEY, normalizedCode);
        localStorage.setItem(NAME_KEY, normalizedName);
        setCode(normalizedCode);
        setGuestName(normalizedName);
        setVerified(true);
        return true;
      } else {
        setError(data.error || 'Código incorrecto');
        return false;
      }
    } catch {
      setError('Error de conexión');
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return { code, guestName, verified, verify, checking, error };
}
