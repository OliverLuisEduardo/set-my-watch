import { describe, expect, it } from 'vitest';
import { POSICAO_ZERO, decompor, msAteProximoMinuto, resolverInstante } from '../tempo';

// 15 jan 2026 (quinta-feira), 12:00:00.250 UTC
const JAN = Date.UTC(2026, 0, 15, 12, 0, 0, 250);
// 15 jul 2026, 12:00 UTC
const JUL = Date.UTC(2026, 6, 15, 12, 0, 0);

describe('decompor', () => {
  it('UTC', () => {
    expect(decompor(JAN, 'UTC')).toEqual({
      ano: 2026, mes: 1, dia: 15, diaSemana: 4, hora: 12, minuto: 0, segundo: 0, ms: 250,
    });
  });

  it('Tóquio fica 9 h à frente', () => {
    expect(decompor(JAN, 'Asia/Tokyo')).toMatchObject({ hora: 21, dia: 15 });
  });

  it('Nova York respeita o horário de verão', () => {
    expect(decompor(JAN, 'America/New_York').hora).toBe(7);
    expect(decompor(JUL, 'America/New_York').hora).toBe(8);
  });

  it('meia-noite sai como hora 0, não 24', () => {
    expect(decompor(Date.UTC(2026, 0, 15, 0, 0, 0), 'UTC').hora).toBe(0);
  });

  it('virada de dia muda data e dia da semana', () => {
    // 15 jan 22:00 UTC = 16 jan 07:00 em Tóquio (sexta)
    expect(decompor(Date.UTC(2026, 0, 15, 22), 'Asia/Tokyo')).toMatchObject({ dia: 16, diaSemana: 5 });
  });
});

describe('resolverInstante', () => {
  it('ao vivo', () => {
    expect(resolverInstante({ tipo: 'ao-vivo' }, JAN, 'UTC').hora).toBe(12);
  });

  it('deslocada soma o deslocamento', () => {
    const i = resolverInstante({ tipo: 'deslocada', deslocamentoMs: 2 * 60_000 }, JAN, 'UTC');
    expect(i.minuto).toBe(2);
  });

  it('congelada ignora o relógio', () => {
    expect(resolverInstante({ tipo: 'congelada', instante: POSICAO_ZERO }, JAN, 'UTC')).toBe(POSICAO_ZERO);
  });
});

describe('msAteProximoMinuto', () => {
  it('conta até o próximo :00', () => {
    expect(msAteProximoMinuto({ segundo: 45, ms: 500 })).toBe(14_500);
    expect(msAteProximoMinuto({ segundo: 0, ms: 0 })).toBe(60_000);
  });
});
