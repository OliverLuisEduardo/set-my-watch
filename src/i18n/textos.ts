import type { FaseLua } from '@/motor/calendario';
import type { Movimento } from '@/motor/tipos';

export type Idioma = 'pt-BR' | 'en' | 'es';

export const IDIOMAS: { id: Idioma; nome: string }[] = [
  { id: 'pt-BR', nome: 'Português' },
  { id: 'en', nome: 'English' },
  { id: 'es', nome: 'Español' },
];

export type IdFuso = 'local' | 'utc' | 'sao-paulo' | 'nova-york' | 'londres' | 'toquio';

export interface Textos {
  descricao: string;
  ajustes: string;
  fecharAjustes: string;
  tema: string;
  claro: string;
  escuro: string;
  idioma: string;
  movimento: string;
  movimentos: Record<string, string>;
  fusoReferencia: string;
  segundoFuso: string;
  fusos: Record<IdFuso, string>;
  telaAcesa: string;
  telaAcesaAjuda: string;
  telaAcesaIndisponivel: string;
  arquitetura: string;
  arquiteturas: Record<string, { rotulo: string; nome: string }>;
  dias: string[];
  diasCurtos: string[];
  diasIniciais: string[];
  meses: string[];
  mesesIniciais: string[];
  legenda: {
    data: string;
    diaSemana: string;
    indicador24: string;
    mesCiclo: string;
    segundoFuso: string;
    faseLua: string;
  };
  fasesLua: Record<FaseLua, string>;
  contagem: { em: string; agora: string };
  zona: {
    liberado: string;
    titulo: string;
    texto: (inicio: string, fim: string) => string;
  };
  mostrador: (nome: string, hora: string, dia: number) => string;
  /** Data por extenso: "terça, 24 nov 2026". */
  dataLonga: (diaSemana: string, dia: number, mes: string, ano: number) => string;
}

const movimentos = (q: string, m: string, c: string, passos: string): Record<string, string> => ({
  '1': `${q} · 1 ${passos}`,
  '6': `${m} 21.600 alt/h · 6 ${passos}`,
  '8': `${m} 28.800 alt/h · 8 ${passos}`,
  continuo: c,
});

export const TEXTOS: Record<Idioma, Textos> = {
  'pt-BR': {
    descricao: 'Referência de hora, data e complicações para acertar relógios analógicos na bancada.',
    ajustes: 'Ajustes',
    fecharAjustes: 'Fechar ajustes',
    tema: 'Tema',
    claro: 'Claro',
    escuro: 'Escuro',
    idioma: 'Idioma',
    movimento: 'Movimento',
    movimentos: movimentos('Quartzo', 'Mecânico', 'Varredura contínua', 'passo/s'),
    fusoReferencia: 'Fuso de referência',
    segundoFuso: 'Segundo fuso (ponteiro GMT)',
    fusos: { local: 'Local', utc: 'UTC', 'sao-paulo': 'São Paulo', 'nova-york': 'Nova York', londres: 'Londres', toquio: 'Tóquio' },
    telaAcesa: 'Manter tela acesa',
    telaAcesaAjuda: 'A tela não apaga enquanto você acerta o relógio.',
    telaAcesaIndisponivel: 'Este navegador não permite manter a tela acesa.',
    arquitetura: 'Tipo de mostrador',
    arquiteturas: {
      'tres-ponteiros-data': { rotulo: '3 ponteiros', nome: '3 ponteiros + data' },
      'dia-data': { rotulo: 'Dia-data', nome: 'Dia e data' },
      multifuncao: { rotulo: 'Multifunção', nome: 'Multifunção (dia, data, 24 h)' },
      'calendario-perpetuo': { rotulo: 'Perpétuo', nome: 'Calendário perpétuo' },
      gmt: { rotulo: 'GMT', nome: 'GMT / segundo fuso' },
    },
    dias: ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'],
    diasCurtos: ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SÁB'],
    diasIniciais: ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'],
    meses: ['jan', 'fev', 'mar', 'abr', 'mai', 'jun', 'jul', 'ago', 'set', 'out', 'nov', 'dez'],
    mesesIniciais: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    legenda: {
      data: 'Data',
      diaSemana: 'Dia da semana',
      indicador24: 'Indicador 24 h',
      mesCiclo: 'Mês e ciclo bissexto',
      segundoFuso: 'Segundo fuso',
      faseLua: 'Fase da lua',
    },
    fasesLua: {
      nova: 'nova',
      crescente: 'crescente',
      'quarto-crescente': 'quarto crescente',
      'crescente-gibosa': 'crescente gibosa',
      cheia: 'cheia',
      'minguante-gibosa': 'minguante gibosa',
      'quarto-minguante': 'quarto minguante',
      minguante: 'minguante',
    },
    contagem: { em: 'Solte a coroa no :00 em', agora: 'Solte a coroa agora' },
    zona: {
      liberado: 'Passe rápido da data liberado até',
      titulo: 'Zona proibida: não use o passe rápido da data',
      texto: (i, f) => `Entre ${i} e ${f} a engrenagem da data está engatada. Avance a data pelos ponteiros, girando além da meia-noite.`,
    },
    mostrador: (n, h, d) => `Mostrador ${n}: ${h}, dia ${d}`,
    dataLonga: (s, d, m, a) => `${s}, ${d} ${m} ${a}`,
  },

  en: {
    descricao: 'Time, date and complication reference for setting analog watches at the bench.',
    ajustes: 'Settings',
    fecharAjustes: 'Close settings',
    tema: 'Theme',
    claro: 'Light',
    escuro: 'Dark',
    idioma: 'Language',
    movimento: 'Movement',
    movimentos: movimentos('Quartz', 'Mechanical', 'Continuous sweep', 'step/s'),
    fusoReferencia: 'Reference time zone',
    segundoFuso: 'Second time zone (GMT hand)',
    fusos: { local: 'Local', utc: 'UTC', 'sao-paulo': 'São Paulo', 'nova-york': 'New York', londres: 'London', toquio: 'Tokyo' },
    telaAcesa: 'Keep screen on',
    telaAcesaAjuda: 'The screen stays on while you set the watch.',
    telaAcesaIndisponivel: 'This browser cannot keep the screen on.',
    arquitetura: 'Dial type',
    arquiteturas: {
      'tres-ponteiros-data': { rotulo: '3 hands', nome: '3 hands + date' },
      'dia-data': { rotulo: 'Day-date', nome: 'Day and date' },
      multifuncao: { rotulo: 'Multifunction', nome: 'Multifunction (day, date, 24 h)' },
      'calendario-perpetuo': { rotulo: 'Perpetual', nome: 'Perpetual calendar' },
      gmt: { rotulo: 'GMT', nome: 'GMT / second time zone' },
    },
    dias: ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'],
    diasCurtos: ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT'],
    diasIniciais: ['S', 'M', 'T', 'W', 'T', 'F', 'S'],
    meses: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
    mesesIniciais: ['J', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    legenda: {
      data: 'Date',
      diaSemana: 'Day of week',
      indicador24: '24 h indicator',
      mesCiclo: 'Month and leap cycle',
      segundoFuso: 'Second time zone',
      faseLua: 'Moon phase',
    },
    fasesLua: {
      nova: 'new',
      crescente: 'waxing crescent',
      'quarto-crescente': 'first quarter',
      'crescente-gibosa': 'waxing gibbous',
      cheia: 'full',
      'minguante-gibosa': 'waning gibbous',
      'quarto-minguante': 'last quarter',
      minguante: 'waning crescent',
    },
    contagem: { em: 'Release the crown at :00 in', agora: 'Release the crown now' },
    zona: {
      liberado: 'Date quick-set allowed until',
      titulo: 'Forbidden window: do not use the date quick-set',
      texto: (i, f) => `Between ${i} and ${f} the date wheel is engaged. Advance the date with the hands, turning past midnight.`,
    },
    mostrador: (n, h, d) => `${n} dial: ${h}, day ${d}`,
    dataLonga: (s, d, m, a) => `${s}, ${m} ${d}, ${a}`,
  },

  es: {
    descricao: 'Referencia de hora, fecha y complicaciones para ajustar relojes analógicos en el banco.',
    ajustes: 'Ajustes',
    fecharAjustes: 'Cerrar ajustes',
    tema: 'Tema',
    claro: 'Claro',
    escuro: 'Oscuro',
    idioma: 'Idioma',
    movimento: 'Movimiento',
    movimentos: movimentos('Cuarzo', 'Mecánico', 'Barrido continuo', 'paso/s'),
    fusoReferencia: 'Huso horario de referencia',
    segundoFuso: 'Segundo huso (aguja GMT)',
    fusos: { local: 'Local', utc: 'UTC', 'sao-paulo': 'São Paulo', 'nova-york': 'Nueva York', londres: 'Londres', toquio: 'Tokio' },
    telaAcesa: 'Mantener pantalla encendida',
    telaAcesaAjuda: 'La pantalla no se apaga mientras ajustas el reloj.',
    telaAcesaIndisponivel: 'Este navegador no puede mantener la pantalla encendida.',
    arquitetura: 'Tipo de esfera',
    arquiteturas: {
      'tres-ponteiros-data': { rotulo: '3 agujas', nome: '3 agujas + fecha' },
      'dia-data': { rotulo: 'Día-fecha', nome: 'Día y fecha' },
      multifuncao: { rotulo: 'Multifunción', nome: 'Multifunción (día, fecha, 24 h)' },
      'calendario-perpetuo': { rotulo: 'Perpetuo', nome: 'Calendario perpetuo' },
      gmt: { rotulo: 'GMT', nome: 'GMT / segundo huso' },
    },
    dias: ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'],
    diasCurtos: ['DOM', 'LUN', 'MAR', 'MIÉ', 'JUE', 'VIE', 'SÁB'],
    diasIniciais: ['D', 'L', 'M', 'X', 'J', 'V', 'S'],
    meses: ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'],
    mesesIniciais: ['E', 'F', 'M', 'A', 'M', 'J', 'J', 'A', 'S', 'O', 'N', 'D'],
    legenda: {
      data: 'Fecha',
      diaSemana: 'Día de la semana',
      indicador24: 'Indicador 24 h',
      mesCiclo: 'Mes y ciclo bisiesto',
      segundoFuso: 'Segundo huso',
      faseLua: 'Fase lunar',
    },
    fasesLua: {
      nova: 'nueva',
      crescente: 'creciente',
      'quarto-crescente': 'cuarto creciente',
      'crescente-gibosa': 'gibosa creciente',
      cheia: 'llena',
      'minguante-gibosa': 'gibosa menguante',
      'quarto-minguante': 'cuarto menguante',
      minguante: 'menguante',
    },
    contagem: { em: 'Suelta la corona al :00 en', agora: 'Suelta la corona ahora' },
    zona: {
      liberado: 'Ajuste rápido de fecha permitido hasta',
      titulo: 'Zona prohibida: no uses el ajuste rápido de fecha',
      texto: (i, f) => `Entre ${i} y ${f} el disco de fecha está engranado. Avanza la fecha con las agujas, pasando la medianoche.`,
    },
    mostrador: (n, h, d) => `Esfera ${n}: ${h}, día ${d}`,
    dataLonga: (s, d, m, a) => `${s}, ${d} ${m} ${a}`,
  },
};

/** Idioma inicial a partir do navegador. */
export function idiomaDoNavegador(): Idioma {
  const langs = typeof navigator !== 'undefined' ? navigator.languages ?? [navigator.language] : [];
  for (const l of langs) {
    const base = l.toLowerCase().slice(0, 2);
    if (base === 'pt') return 'pt-BR';
    if (base === 'es') return 'es';
    if (base === 'en') return 'en';
  }
  return 'pt-BR';
}

export const nomeMovimento = (t: Textos, m: Movimento) => t.movimentos[String(m)];
