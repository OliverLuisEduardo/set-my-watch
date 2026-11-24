export const doisDigitos = (n: number) => String(n).padStart(2, '0');

export const horaTexto = (h: number, m: number, s?: number) =>
  `${doisDigitos(h)}:${doisDigitos(m)}${s === undefined ? '' : `:${doisDigitos(s)}`}`;
