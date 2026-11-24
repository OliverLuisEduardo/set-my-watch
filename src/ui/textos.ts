export const DIAS_CURTOS = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sáb'];
export const DIAS_LONGOS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
/** Iniciais do submostrador de dia da semana. */
export const DIAS_INICIAIS = ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'];
export const MESES_CURTOS = ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'];
export const MESES_INICIAIS = ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'];

export const doisDigitos = (n: number) => String(n).padStart(2, '0');

export const horaTexto = (h: number, m: number, s?: number) =>
  `${doisDigitos(h)}:${doisDigitos(m)}${s === undefined ? '' : `:${doisDigitos(s)}`}`;
