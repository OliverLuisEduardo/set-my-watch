import type { IdFuso } from '@/i18n/textos';

/** Fusos do seletor rápido. `fuso` ausente = fuso do sistema. O nome vem do idioma. */
export const FUSOS_RAPIDOS: { id: IdFuso; fuso: string | undefined }[] = [
  { id: 'local', fuso: undefined },
  { id: 'utc', fuso: 'UTC' },
  { id: 'sao-paulo', fuso: 'America/Sao_Paulo' },
  { id: 'nova-york', fuso: 'America/New_York' },
  { id: 'londres', fuso: 'Europe/London' },
  { id: 'toquio', fuso: 'Asia/Tokyo' },
];
