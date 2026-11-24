import { describe, expect, it } from 'vitest';
import { naZonaProibida } from '../zonaProibida';

describe('naZonaProibida', () => {
  it('padrão 21h–03h cruza a meia-noite', () => {
    expect(naZonaProibida(20)).toBe(false);
    expect(naZonaProibida(21)).toBe(true);
    expect(naZonaProibida(23)).toBe(true);
    expect(naZonaProibida(0)).toBe(true);
    expect(naZonaProibida(2)).toBe(true);
    expect(naZonaProibida(3)).toBe(false);
    expect(naZonaProibida(12)).toBe(false);
  });

  it('faixa sem cruzar a meia-noite', () => {
    const zona = { inicio: 22, fim: 23 };
    expect(naZonaProibida(21, zona)).toBe(false);
    expect(naZonaProibida(22, zona)).toBe(true);
    expect(naZonaProibida(23, zona)).toBe(false);
  });

  it('início igual ao fim desliga a zona', () => {
    expect(naZonaProibida(0, { inicio: 0, fim: 0 })).toBe(false);
  });
});
