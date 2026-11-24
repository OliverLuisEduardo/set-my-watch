import type { ZonaProibida } from './tipos';

/**
 * Faixa genérica em que a engrenagem de data já está engatada na maioria dos
 * movimentos. Cada arquitetura pode trazer a sua.
 */
export const ZONA_PROIBIDA_PADRAO: ZonaProibida = { inicio: 21, fim: 3 };

export function naZonaProibida(hora: number, zona: ZonaProibida = ZONA_PROIBIDA_PADRAO): boolean {
  if (zona.inicio === zona.fim) return false;
  if (zona.inicio < zona.fim) return hora >= zona.inicio && hora < zona.fim;
  // Cruza a meia-noite.
  return hora >= zona.inicio || hora < zona.fim;
}
