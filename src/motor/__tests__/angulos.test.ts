import { describe, expect, it } from 'vitest';
import { calcularAngulos, quantizarMs } from '../angulos';
import { POSICAO_ZERO } from '../tempo';
import type { Instante } from '../tipos';

const base: Instante = { ...POSICAO_ZERO };

describe('quantizarMs', () => {
  it('quartzo salta só no segundo cheio', () => {
    expect(quantizarMs(999, 1)).toBe(0);
  });

  it('28.800 alt/h anda em passos de 125 ms', () => {
    expect(quantizarMs(124, 8)).toBe(0);
    expect(quantizarMs(125, 8)).toBe(125);
    expect(quantizarMs(999, 8)).toBe(875);
  });

  it('21.600 alt/h anda em passos de 1/6 s', () => {
    expect(quantizarMs(170, 6)).toBeCloseTo(1000 / 6);
  });

  it('contínuo não arredonda', () => {
    expect(quantizarMs(437, 'continuo')).toBe(437);
  });
});

describe('calcularAngulos', () => {
  it('posição zero põe tudo no topo', () => {
    const a = calcularAngulos(base, 1);
    expect(a).toEqual({ segundo: 0, minuto: 0, hora: 0, hora24: 0, diaSemana: 0, data: 0, mes: 0 });
  });

  it('3:00:00 põe o ponteiro de horas a 90°', () => {
    expect(calcularAngulos({ ...base, hora: 3 }, 1).hora).toBe(90);
  });

  it('15h e 3h dão o mesmo ângulo de 12h, mas não de 24h', () => {
    const tarde = calcularAngulos({ ...base, hora: 15 }, 1);
    const madrugada = calcularAngulos({ ...base, hora: 3 }, 1);
    expect(tarde.hora).toBe(madrugada.hora);
    expect(tarde.hora24).toBe(225);
    expect(madrugada.hora24).toBe(45);
  });

  it('ponteiro de minutos avança com os segundos', () => {
    expect(calcularAngulos({ ...base, minuto: 10, segundo: 30 }, 1).minuto).toBe(63);
  });

  it('quartzo ignora a fração do segundo; mecânico não', () => {
    const i = { ...base, segundo: 10, ms: 600 };
    expect(calcularAngulos(i, 1).segundo).toBe(60);
    // 600 ms cai no passo de 500 ms: 10,5 s.
    expect(calcularAngulos(i, 8).segundo).toBe(63);
    expect(calcularAngulos(i, 'continuo').segundo).toBeCloseTo(63.6);
  });

  it('submostradores saltam por unidade', () => {
    const a = calcularAngulos({ ...base, diaSemana: 3, dia: 16, mes: 7 }, 1);
    expect(a.diaSemana).toBeCloseTo((3 * 360) / 7);
    expect(a.data).toBeCloseTo((15 * 360) / 31);
    expect(a.mes).toBe(180);
  });
});
