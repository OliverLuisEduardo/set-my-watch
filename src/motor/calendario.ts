/** Regra gregoriana completa: divisível por 4, exceto séculos não divisíveis por 400. */
export function ehBissexto(ano: number): boolean {
  return (ano % 4 === 0 && ano % 100 !== 0) || ano % 400 === 0;
}

/** Dias no mês (mes de 1 a 12). */
export function diasNoMes(ano: number, mes: number): number {
  if (mes === 2) return ehBissexto(ano) ? 29 : 28;
  return [4, 6, 9, 11].includes(mes) ? 30 : 31;
}

/**
 * Posição no ciclo de 4 anos, como o came de bissexto de um calendário
 * perpétuo: 0 = ano bissexto, 1 a 3 = anos depois dele.
 * Segue o ciclo simples de 4 anos, igual ao mecanismo (2100 sairia como "L").
 */
export function anosDesdeBissexto(ano: number): 0 | 1 | 2 | 3 {
  return (((ano % 4) + 4) % 4) as 0 | 1 | 2 | 3;
}

/** Rótulo do indicador de bissexto: L, +1, +2, +3. */
export function rotuloCicloBissexto(ano: number): 'L' | '+1' | '+2' | '+3' {
  return (['L', '+1', '+2', '+3'] as const)[anosDesdeBissexto(ano)];
}

/** Mês sinódico médio, em dias. */
export const MES_SINODICO_DIAS = 29.530588853;

/** Lua nova de referência: 6 jan 2000, 18:14 UTC. */
const LUA_NOVA_REFERENCIA_MS = Date.UTC(2000, 0, 6, 18, 14);

const MS_POR_DIA = 86_400_000;

/**
 * Fração do ciclo lunar (0 = lua nova, 0,5 = lua cheia, perto de 1 = nova de novo).
 * Usa o mês sinódico médio: erro de algumas horas, suficiente para um disco de fase da lua.
 */
export function fracaoLunar(epocaMs: number): number {
  const dias = (epocaMs - LUA_NOVA_REFERENCIA_MS) / MS_POR_DIA;
  const f = (dias / MES_SINODICO_DIAS) % 1;
  return f < 0 ? f + 1 : f;
}

/** Idade da lua em dias desde a última lua nova. */
export function idadeLunarDias(epocaMs: number): number {
  return fracaoLunar(epocaMs) * MES_SINODICO_DIAS;
}
