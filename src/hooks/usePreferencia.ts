import { useEffect, useState } from 'react';

/** Estado guardado no localStorage; valores inválidos voltam ao padrão. */
export function usePreferencia<T>(chave: string, padrao: T, valido: (v: unknown) => v is T) {
  const [valor, setValor] = useState<T>(() => {
    try {
      const bruto = localStorage.getItem(`smw:${chave}`);
      if (bruto !== null) {
        const v: unknown = JSON.parse(bruto);
        if (valido(v)) return v;
      }
    } catch {
      // Armazenamento indisponível ou corrompido: fica o padrão.
    }
    return padrao;
  });

  useEffect(() => {
    try {
      localStorage.setItem(`smw:${chave}`, JSON.stringify(valor));
    } catch {
      // Modo privado sem armazenamento: só não persiste.
    }
  }, [chave, valor]);

  return [valor, setValor] as const;
}
