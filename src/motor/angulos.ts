import type { Instante, Movimento } from './tipos';

/** Arredonda os milissegundos para o último passo do movimento. */
export function quantizarMs(ms: number, movimento: Movimento): number {
  if (movimento === 'continuo') return ms;
  const passo = 1000 / movimento;
  return Math.floor(ms / passo) * passo;
}

/** Ângulos em graus, sentido horário, 0 = posição de 12h (topo). */
export interface Angulos {
  hora: number;
  minuto: number;
  segundo: number;
  /** Ponteiro de 24h: uma volta por dia, 0h no topo. */
  hora24: number;
  /** Submostrador de dia da semana: domingo no topo, salto seco. */
  diaSemana: number;
  /** Submostrador de data: dia 1 no topo, 31 posições, salto seco. */
  data: number;
  /** Submostrador de mês: janeiro no topo, salto seco. */
  mes: number;
}

export function calcularAngulos(i: Instante, movimento: Movimento): Angulos {
  const s = i.segundo + quantizarMs(i.ms, movimento) / 1000;
  const m = i.minuto + s / 60;
  const h = (i.hora % 12) + m / 60;

  return {
    segundo: s * 6,
    minuto: m * 6,
    hora: h * 30,
    hora24: (i.hora + m / 60) * 15,
    diaSemana: (i.diaSemana * 360) / 7,
    data: ((i.dia - 1) * 360) / 31,
    mes: (i.mes - 1) * 30,
  };
}
