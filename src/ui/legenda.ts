import type { Angulos } from '@/motor/angulos';
import type { Arquitetura } from '@/motor/arquiteturas';
import { fracaoLunar, nomeFaseLunar, rotuloCicloBissexto } from '@/motor/calendario';
import type { Instante } from '@/motor/tipos';
import { DIAS_LONGOS, MESES_CURTOS, doisDigitos, horaTexto } from './textos';

/** Posição de uma complicação no mostrador, como num desenho de calibre. */
export type Posicao = 3 | 6 | 9 | 12;

export type Peca =
  | { tipo: 'janela-data'; posicao: 3 }
  | { tipo: 'janela-dia'; posicao: 12 }
  | { tipo: 'sub-dia'; posicao: Posicao }
  | { tipo: 'sub-data'; posicao: Posicao }
  | { tipo: 'sub-24h'; posicao: Posicao }
  | { tipo: 'sub-mes'; posicao: Posicao }
  | { tipo: 'gmt' }
  | { tipo: 'lua' };

/** Onde cada arquitetura põe cada peça. */
export const PECAS: Record<string, Peca[]> = {
  'tres-ponteiros-data': [{ tipo: 'janela-data', posicao: 3 }],
  'dia-data': [
    { tipo: 'janela-dia', posicao: 12 },
    { tipo: 'janela-data', posicao: 3 },
  ],
  multifuncao: [
    { tipo: 'sub-dia', posicao: 9 },
    { tipo: 'sub-data', posicao: 3 },
    { tipo: 'sub-24h', posicao: 6 },
  ],
  'calendario-perpetuo': [
    { tipo: 'sub-mes', posicao: 12 },
    { tipo: 'sub-dia', posicao: 9 },
    { tipo: 'sub-data', posicao: 3 },
    { tipo: 'sub-24h', posicao: 6 },
    { tipo: 'lua' },
  ],
  gmt: [{ tipo: 'janela-data', posicao: 3 }, { tipo: 'gmt' }],
};

export interface ItemLegenda {
  /** Letra do balão no mostrador; ausente quando o item não tem peça desenhada. */
  letra?: string;
  nome: string;
  valor: string;
  /** A data é o que o passe rápido mexe: marca em vermelho na zona proibida. */
  sensivelZona?: boolean;
}

interface Contexto {
  instante: Instante;
  epocaMs: number;
  /** Segundo fuso (GMT). */
  gmt?: { instante: Instante; angulos: Angulos; rotulo: string };
}

const LETRAS = 'ABCDEFG';

export function itensLegenda(arquitetura: Arquitetura, { instante: i, epocaMs, gmt }: Contexto): ItemLegenda[] {
  const pecas = PECAS[arquitetura.id] ?? [];
  const itens: ItemLegenda[] = pecas.map((p, idx) => {
    const letra = LETRAS[idx];
    switch (p.tipo) {
      case 'janela-data':
      case 'sub-data':
        return { letra, nome: 'Data', valor: doisDigitos(i.dia), sensivelZona: true };
      case 'janela-dia':
      case 'sub-dia':
        return { letra, nome: 'Dia da semana', valor: DIAS_LONGOS[i.diaSemana] };
      case 'sub-24h':
        return { letra, nome: 'Indicador 24 h', valor: `${doisDigitos(i.hora)} h` };
      case 'sub-mes':
        return {
          letra,
          nome: 'Mês e ciclo bissexto',
          valor: `${MESES_CURTOS[i.mes - 1]} · ${rotuloCicloBissexto(i.ano)}`,
        };
      case 'gmt':
        return {
          letra,
          nome: `Segundo fuso · ${gmt?.rotulo ?? ''}`,
          valor: gmt ? horaTexto(gmt.instante.hora, gmt.instante.minuto) : '—',
        };
      case 'lua':
        return { letra, nome: 'Fase da lua', valor: nomeFaseLunar(fracaoLunar(epocaMs)) };
    }
  });

  if (arquitetura.complicacoes.includes('fase-lua') && !pecas.some((p) => p.tipo === 'lua')) {
    itens.push({ nome: 'Fase da lua', valor: nomeFaseLunar(fracaoLunar(epocaMs)) });
  }
  return itens;
}
