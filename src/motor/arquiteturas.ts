import type { Movimento, ZonaProibida } from './tipos';
import { ZONA_PROIBIDA_PADRAO } from './zonaProibida';

export type Complicacao =
  | 'data'
  | 'dia-semana'
  | 'indicador-24h'
  | 'mes'
  | 'ciclo-bissexto'
  | 'fase-lua'
  | 'gmt';

/**
 * Tipo genérico de mostrador. Não representa marca nem modelo: o que muda
 * entre calibres reais entra como parâmetro (zona proibida, movimento).
 */
export interface Arquitetura {
  id: string;
  nome: string;
  /** Rótulo curto para o seletor. */
  rotulo: string;
  complicacoes: Complicacao[];
  movimento: Movimento;
  zonaProibida: ZonaProibida;
}

export const ARQUITETURAS: Arquitetura[] = [
  {
    id: 'tres-ponteiros-data',
    nome: '3 ponteiros + data',
    rotulo: 'Simples',
    complicacoes: ['data'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'dia-data',
    nome: 'Dia-data',
    rotulo: 'Dia-data',
    complicacoes: ['data', 'dia-semana'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'multifuncao',
    nome: 'Multifunção (dia, data, 24h)',
    rotulo: 'Multifunção',
    complicacoes: ['dia-semana', 'data', 'indicador-24h'],
    movimento: 1,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'calendario-perpetuo',
    nome: 'Calendário perpétuo',
    rotulo: 'Perpétuo',
    complicacoes: ['data', 'dia-semana', 'mes', 'ciclo-bissexto', 'indicador-24h', 'fase-lua'],
    movimento: 1,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'gmt',
    nome: 'GMT / segundo fuso',
    rotulo: 'GMT',
    complicacoes: ['data', 'gmt'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
];
