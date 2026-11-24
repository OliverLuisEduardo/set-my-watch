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
  complicacoes: Complicacao[];
  movimento: Movimento;
  zonaProibida: ZonaProibida;
}

export const ARQUITETURAS: Arquitetura[] = [
  {
    id: 'tres-ponteiros-data',
    nome: '3 ponteiros + data',
    complicacoes: ['data'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'dia-data',
    nome: 'Dia-data',
    complicacoes: ['data', 'dia-semana'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'multifuncao',
    nome: 'Multifunção (dia, data, 24h)',
    complicacoes: ['dia-semana', 'data', 'indicador-24h'],
    movimento: 1,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'calendario-perpetuo',
    nome: 'Calendário perpétuo',
    complicacoes: ['data', 'dia-semana', 'mes', 'ciclo-bissexto', 'indicador-24h'],
    movimento: 1,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  {
    id: 'gmt',
    nome: 'GMT / segundo fuso',
    complicacoes: ['data', 'gmt'],
    movimento: 8,
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
];
