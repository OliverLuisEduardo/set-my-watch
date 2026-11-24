/** Um instante já decomposto no fuso escolhido. */
export interface Instante {
  ano: number;
  /** 1 a 12 */
  mes: number;
  /** 1 a 31 */
  dia: number;
  /** 0 = domingo … 6 = sábado */
  diaSemana: number;
  /** 0 a 23 */
  hora: number;
  minuto: number;
  segundo: number;
  /** 0 a 999 */
  ms: number;
}

/**
 * Como o ponteiro de segundos anda:
 * - 1: quartzo, salto seco a cada segundo;
 * - 6 / 8: mecânico de 21.600 / 28.800 alternâncias por hora;
 * - 'continuo': varredura lisa, sem passos.
 */
export type Movimento = 1 | 6 | 8 | 'continuo';

/** De onde vem a hora mostrada. */
export type FonteTempo =
  | { tipo: 'ao-vivo' }
  /** Hora do sistema deslocada (ex.: acertar o relógio 2 min adiantado). */
  | { tipo: 'deslocada'; deslocamentoMs: number }
  /** Hora parada num instante fixo (ex.: posição zero). */
  | { tipo: 'congelada'; instante: Instante };

/** Faixa de horas (0–23) em que o passe rápido de data não deve ser usado. */
export interface ZonaProibida {
  /** Hora de início, inclusiva. */
  inicio: number;
  /** Hora de fim, exclusiva. Menor que o início quando a faixa cruza a meia-noite. */
  fim: number;
}
