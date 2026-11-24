import type { FonteTempo, Instante } from './tipos';

const DIAS_SEMANA_EN = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

// Criar um Intl.DateTimeFormat é caro; o loop chama isto a cada quadro.
const formatadores = new Map<string, Intl.DateTimeFormat>();

function formatador(fuso: string): Intl.DateTimeFormat {
  let f = formatadores.get(fuso);
  if (!f) {
    f = new Intl.DateTimeFormat('en-US', {
      timeZone: fuso,
      hourCycle: 'h23',
      year: 'numeric',
      month: 'numeric',
      day: 'numeric',
      weekday: 'short',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
    });
    formatadores.set(fuso, f);
  }
  return f;
}

/**
 * Decompõe um timestamp (ms desde a época) no fuso pedido.
 * Sem fuso, usa o fuso do sistema operacional.
 * Usa Intl em vez de offset fixo para acertar o horário de verão.
 */
export function decompor(epocaMs: number, fuso?: string): Instante {
  const d = new Date(epocaMs);
  const ms = ((epocaMs % 1000) + 1000) % 1000;

  if (!fuso) {
    return {
      ano: d.getFullYear(),
      mes: d.getMonth() + 1,
      dia: d.getDate(),
      diaSemana: d.getDay(),
      hora: d.getHours(),
      minuto: d.getMinutes(),
      segundo: d.getSeconds(),
      ms,
    };
  }

  const partes: Record<string, string> = {};
  for (const p of formatador(fuso).formatToParts(d)) partes[p.type] = p.value;

  return {
    ano: Number(partes.year),
    mes: Number(partes.month),
    dia: Number(partes.day),
    diaSemana: DIAS_SEMANA_EN.indexOf(partes.weekday),
    hora: Number(partes.hour),
    minuto: Number(partes.minute),
    segundo: Number(partes.second),
    ms,
  };
}

/** O instante a mostrar, dada a fonte de tempo. */
export function resolverInstante(fonte: FonteTempo, agoraMs: number, fuso?: string): Instante {
  switch (fonte.tipo) {
    case 'ao-vivo':
      return decompor(agoraMs, fuso);
    case 'deslocada':
      return decompor(agoraMs + fonte.deslocamentoMs, fuso);
    case 'congelada':
      return fonte.instante;
  }
}

/**
 * Posição zero: todos os ponteiros no topo.
 * 12:00:00 (hora 0 deixa o ponteiro de 24h também no topo), domingo, janeiro, dia 1.
 */
export const POSICAO_ZERO: Instante = {
  ano: 2000,
  mes: 1,
  dia: 1,
  diaSemana: 0,
  hora: 0,
  minuto: 0,
  segundo: 0,
  ms: 0,
};

/** Milissegundos até o próximo minuto cheio (:00), para soltar a coroa na hora certa. */
export function msAteProximoMinuto(instante: Pick<Instante, 'segundo' | 'ms'>): number {
  return 60_000 - (instante.segundo * 1000 + instante.ms);
}

/** Fuso do sistema operacional, ex.: "America/Sao_Paulo". */
export function fusoDoSistema(): string {
  return Intl.DateTimeFormat().resolvedOptions().timeZone;
}
