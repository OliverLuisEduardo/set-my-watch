import { describe, expect, it } from 'vitest';
import {
  anosDesdeBissexto,
  diasNoMes,
  ehBissexto,
  fracaoLunar,
  idadeLunarDias,
  faseLunar,
  rotuloCicloBissexto,
} from '../calendario';

describe('ehBissexto', () => {
  it('segue a regra gregoriana completa', () => {
    expect(ehBissexto(2024)).toBe(true);
    expect(ehBissexto(2026)).toBe(false);
    expect(ehBissexto(1900)).toBe(false);
    expect(ehBissexto(2000)).toBe(true);
    expect(ehBissexto(2100)).toBe(false);
  });
});

describe('diasNoMes', () => {
  it('cobre 28, 29, 30 e 31', () => {
    expect(diasNoMes(2026, 2)).toBe(28);
    expect(diasNoMes(2028, 2)).toBe(29);
    expect(diasNoMes(2026, 4)).toBe(30);
    expect(diasNoMes(2026, 9)).toBe(30);
    expect(diasNoMes(2026, 1)).toBe(31);
    expect(diasNoMes(2026, 12)).toBe(31);
  });

  it('fevereiro de 2100 tem 28 dias', () => {
    expect(diasNoMes(2100, 2)).toBe(28);
  });
});

describe('ciclo de bissexto', () => {
  it('rotula L, +1, +2, +3', () => {
    expect(rotuloCicloBissexto(2024)).toBe('L');
    expect(rotuloCicloBissexto(2025)).toBe('+1');
    expect(rotuloCicloBissexto(2026)).toBe('+2');
    expect(rotuloCicloBissexto(2027)).toBe('+3');
    expect(rotuloCicloBissexto(2028)).toBe('L');
  });

  it('segue o ciclo simples de 4 anos, como o mecanismo', () => {
    expect(anosDesdeBissexto(2100)).toBe(0);
  });
});

describe('fase da lua', () => {
  const distanciaDaNova = (f: number) => Math.min(f, 1 - f);

  it('lua nova de 8 abr 2024 (eclipse solar) perto de 0', () => {
    expect(distanciaDaNova(fracaoLunar(Date.UTC(2024, 3, 8, 18, 21)))).toBeLessThan(0.03);
  });

  it('lua cheia de 23 abr 2024 perto de 0,5', () => {
    expect(Math.abs(fracaoLunar(Date.UTC(2024, 3, 23, 23, 49)) - 0.5)).toBeLessThan(0.03);
  });

  it('funciona antes da data de referência', () => {
    const f = fracaoLunar(Date.UTC(1999, 0, 1));
    expect(f).toBeGreaterThanOrEqual(0);
    expect(f).toBeLessThan(1);
  });

  it('nomeia as fases nos limites', () => {
    expect(faseLunar(0)).toBe('nova');
    expect(faseLunar(0.98)).toBe('nova');
    expect(faseLunar(0.25)).toBe('quarto-crescente');
    expect(faseLunar(0.5)).toBe('cheia');
    expect(faseLunar(0.75)).toBe('quarto-minguante');
  });

  it('idade entre 0 e 29,53 dias', () => {
    const idade = idadeLunarDias(Date.UTC(2026, 10, 23));
    expect(idade).toBeGreaterThanOrEqual(0);
    expect(idade).toBeLessThan(29.54);
  });
});
