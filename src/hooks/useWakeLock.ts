import { useCallback, useEffect, useRef, useState } from 'react';

/**
 * Mantém a tela acesa (Screen Wake Lock API). Precisa de HTTPS (ou localhost)
 * e de um gesto do usuário. O navegador solta a trava quando a aba some;
 * ela é pedida de novo ao voltar, enquanto o usuário quiser.
 */
export function useWakeLock() {
  const suportado = typeof navigator !== 'undefined' && 'wakeLock' in navigator;
  const [ativo, setAtivo] = useState(false);
  const desejado = useRef(false);
  const trava = useRef<WakeLockSentinel | null>(null);

  const pedir = useCallback(async () => {
    if (!suportado) return;
    try {
      const t = await navigator.wakeLock.request('screen');
      trava.current = t;
      setAtivo(true);
      t.addEventListener('release', () => {
        trava.current = null;
        setAtivo(false);
      });
    } catch (err) {
      console.error('Wake Lock recusado:', err);
      setAtivo(false);
    }
  }, [suportado]);

  const ativar = useCallback(async () => {
    desejado.current = true;
    await pedir();
  }, [pedir]);

  const desativar = useCallback(async () => {
    desejado.current = false;
    await trava.current?.release();
  }, []);

  useEffect(() => {
    const aoMudarVisibilidade = () => {
      if (document.visibilityState === 'visible' && desejado.current && !trava.current) {
        void pedir();
      }
    };
    document.addEventListener('visibilitychange', aoMudarVisibilidade);
    return () => {
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
      void trava.current?.release();
    };
  }, [pedir]);

  return { suportado, ativo, ativar, desativar };
}
