import type { Angulos } from '@/motor/angulos';
import type { Arquitetura } from '@/motor/arquiteturas';
import type { Textos } from '@/i18n/textos';
import { faseLunar, fracaoLunar, rotuloCicloBissexto } from '@/motor/calendario';
import type { Instante } from '@/motor/tipos';
import { doisDigitos, horaTexto } from './textos';

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

export function itensLegenda(arquitetura: Arquitetura, { instante: i, epocaMs, gmt }: Contexto, t: Textos): ItemLegenda[] {
  const pecas = PECAS[arquitetura.id] ?? [];
  const lua = t.fasesLua[faseLunar(fracaoLunar(epocaMs))];
  const itens: ItemLegenda[] = pecas.map((p, idx) => {
    const letra = LETRAS[idx];
    switch (p.tipo) {
      case 'janela-data':
      case 'sub-data':
        return { letra, nome: t.legenda.data, valor: doisDigitos(i.dia), sensivelZona: true };
      case 'janela-dia':
      case 'sub-dia':
        return { letra, nome: t.legenda.diaSemana, valor: t.dias[i.diaSemana] };
      case 'sub-24h':
        return { letra, nome: t.legenda.indicador24, valor: `${doisDigitos(i.hora)} h` };
      case 'sub-mes':
        return { letra, nome: t.legenda.mesCiclo, valor: `${t.meses[i.mes - 1]} · ${rotuloCicloBissexto(i.ano)}` };
      case 'gmt':
        return {
          letra,
          nome: `${t.legenda.segundoFuso} · ${gmt?.rotulo ?? ''}`,
          valor: gmt ? horaTexto(gmt.instante.hora, gmt.instante.minuto) : '—',
        };
      case 'lua':
        return { letra, nome: t.legenda.faseLua, valor: lua };
    }
  });

  if (arquitetura.complicacoes.includes('fase-lua') && !pecas.some((p) => p.tipo === 'lua')) {
    itens.push({ nome: t.legenda.faseLua, valor: lua });
  }
  return itens;
}
