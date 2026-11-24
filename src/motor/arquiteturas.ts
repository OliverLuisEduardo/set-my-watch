import type { ZonaProibida } from './tipos';
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
 * entre calibres reais entra como parâmetro (zona proibida). Os nomes vêm do
 * idioma (src/i18n). O movimento é escolha do usuário, com quartzo por padrão.
 */
export interface Arquitetura {
  id: string;
  complicacoes: Complicacao[];
  zonaProibida: ZonaProibida;
}

export const ARQUITETURAS: Arquitetura[] = [
  { id: 'tres-ponteiros-data', complicacoes: ['data'], zonaProibida: ZONA_PROIBIDA_PADRAO },
  { id: 'dia-data', complicacoes: ['data', 'dia-semana'], zonaProibida: ZONA_PROIBIDA_PADRAO },
  { id: 'multifuncao', complicacoes: ['dia-semana', 'data', 'indicador-24h'], zonaProibida: ZONA_PROIBIDA_PADRAO },
  {
    id: 'calendario-perpetuo',
    complicacoes: ['data', 'dia-semana', 'mes', 'ciclo-bissexto', 'indicador-24h', 'fase-lua'],
    zonaProibida: ZONA_PROIBIDA_PADRAO,
  },
  { id: 'gmt', complicacoes: ['data', 'gmt'], zonaProibida: ZONA_PROIBIDA_PADRAO },
];
