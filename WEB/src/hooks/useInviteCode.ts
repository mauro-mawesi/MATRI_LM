import { useState, useEffect, useCallback } from 'react';

const STORAGE_KEY = 'wedding-invite-code';

export function useInviteCode() {
  const [code, setCode] = useState<string | null>(null);
  const [verified, setVerified] = useState(false);
  const [checking, setChecking] = useState(false);
  const [error, setError] = useState('');

  // Restore from localStorage on mount
  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setCode(stored);
      setVerified(true);
    }
  }, []);

  const verify = useCallback(async (inputCode: string) => {
    setChecking(true);
    setError('');

    try {
      const res = await fetch('/api/verify-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: inputCode }),
      });

      const data = await res.json();

      if (data.valid) {
        localStorage.setItem(STORAGE_KEY, inputCode.trim().toUpperCase());
        setCode(inputCode.trim().toUpperCase());
        setVerified(true);
        return true;
      } else {
        setError('Código incorrecto');
        return false;
      }
    } catch {
      setError('Error de conexión');
      return false;
    } finally {
      setChecking(false);
    }
  }, []);

  return { code, verified, verify, checking, error };
}
