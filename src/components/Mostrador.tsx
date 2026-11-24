import type { CSSProperties, ReactNode } from 'react';
import type { Angulos } from '@/motor/angulos';
import type { Arquitetura } from '@/motor/arquiteturas';
import { rotuloCicloBissexto } from '@/motor/calendario';
import type { Instante, ZonaProibida } from '@/motor/tipos';
import { PECAS, type ItemLegenda, type Peca, type Posicao } from '@/ui/legenda';
import { DIAS_CURTOS, DIAS_INICIAIS, MESES_INICIAIS, doisDigitos } from '@/ui/textos';

interface Props {
  arquitetura: Arquitetura;
  instante: Instante;
  angulos: Angulos;
  itens: ItemLegenda[];
  /** Hora dentro da zona proibida: a data é marcada em vermelho. */
  perigo: boolean;
  /** Fração do ciclo lunar (0 = nova, 0,5 = cheia). */
  fracaoLua: number;
  gmt?: { angulos: Angulos };
  rotuloAcessivel: string;
}

// Duas espessuras só, como no desenho: contorno pesado e linha fina.
const PESADA = 2.6;
const FINA = 1.1;

const R = 180;
const DIST_SUB = 92;
const R_SUB = 42;
const LUA = { r: 110, angulo: 225, raio: 15 };

/** Ponto polar com 0° no topo, sentido horário. */
function polar(r: number, graus: number): [number, number] {
  const rad = (graus * Math.PI) / 180;
  return [r * Math.sin(rad), -r * Math.cos(rad)];
}

const CENTRO_SUB: Record<Posicao, [number, number]> = {
  12: [0, -DIST_SUB],
  3: [DIST_SUB, 0],
  6: [0, DIST_SUB],
  9: [-DIST_SUB, 0],
};

/** Ângulo da posição no mostrador (12 = 0°). */
const ANGULO_POSICAO: Record<Posicao, number> = { 12: 0, 3: 90, 6: 180, 9: 270 };

/** Desce em 45° de um ponto até a linha y = ±188 e segue na horizontal até o balão. */
function diagonalAteBalao(x0: number, y0: number, lado: 1 | -1, vertical: 1 | -1) {
  const yAlvo = 188 * vertical;
  const dx = Math.abs(yAlvo - y0) * lado;
  return { pontos: `${x0},${y0} ${x0 + dx},${yAlvo} ${206 * lado},${yAlvo}`, balao: [220 * lado, yAlvo] as [number, number] };
}

/**
 * Linha de chamada só em 0°, 45° e 90°, terminando num balão com a letra,
 * como nas vistas de um desenho de calibre.
 */
function chamada(peca: Peca): { pontos: string; balao: [number, number] } {
  if (peca.tipo === 'gmt') {
    const [x, y] = polar(128, 225);
    return diagonalAteBalao(x, y, -1, 1);
  }
  if (peca.tipo === 'lua') {
    const [x, y] = polar(LUA.r + LUA.raio, LUA.angulo);
    return diagonalAteBalao(x, y, -1, 1);
  }
  const janela = peca.tipo === 'janela-data' || peca.tipo === 'janela-dia';
  switch (peca.posicao) {
    case 3: {
      const x0 = janela ? 150 : DIST_SUB + R_SUB;
      return { pontos: `${x0},0 206,0`, balao: [220, 0] };
    }
    case 9:
      return { pontos: `${-(DIST_SUB + R_SUB)},0 -206,0`, balao: [-220, 0] };
    case 12: {
      const [x0, y0] = janela ? [34, -118] : [R_SUB * Math.SQRT1_2, -DIST_SUB - R_SUB * Math.SQRT1_2];
      return diagonalAteBalao(x0, y0, 1, -1);
    }
    case 6:
      return diagonalAteBalao(R_SUB * Math.SQRT1_2, DIST_SUB + R_SUB * Math.SQRT1_2, 1, 1);
  }
}

const tracado: CSSProperties = { ['--comprimento' as string]: 1 };

/** Setor anelar entre dois ângulos (graus, sentido horário). */
function setor(r1: number, r2: number, de: number, ate: number): string {
  const varredura = (((ate - de) % 360) + 360) % 360;
  const grande = varredura > 180 ? 1 : 0;
  const [ax, ay] = polar(r2, de);
  const [bx, by] = polar(r2, ate);
  const [cx, cy] = polar(r1, ate);
  const [dx, dy] = polar(r1, de);
  return `M ${ax} ${ay} A ${r2} ${r2} 0 ${grande} 1 ${bx} ${by} L ${cx} ${cy} A ${r1} ${r1} 0 ${grande} 0 ${dx} ${dy} Z`;
}

/** Contorno da parte iluminada da lua, com o terminador como semi-elipse. */
function caminhoLua(fracao: number, r: number): string {
  const k = Math.cos(2 * Math.PI * fracao);
  const rx = Math.abs(k) * r;
  const crescente = fracao < 0.5;
  const borda = crescente ? 1 : 0;
  const terminador = crescente ? (k > 0 ? 0 : 1) : k > 0 ? 1 : 0;
  return `M 0 ${-r} A ${r} ${r} 0 0 ${borda} 0 ${r} A ${rx} ${r} 0 0 ${terminador} 0 ${-r} Z`;
}

function Submostrador({
  posicao,
  divisoes,
  rotulos,
  angulo,
  perigo = false,
  children,
}: {
  posicao: Posicao;
  divisoes: number;
  /** `extra`: rótulo omitido no celular quando não cabe (os traços continuam). */
  rotulos: { indice: number; texto: string; extra?: boolean }[];
  angulo: number;
  perigo?: boolean;
  children?: ReactNode;
}) {
  const [cx, cy] = CENTRO_SUB[posicao];
  return (
    <g transform={`translate(${cx} ${cy})`}>
      {children}
      <circle r={R_SUB} className={perigo ? 'stroke-revisao' : 'stroke-tinta'} fill="none" strokeWidth={perigo ? PESADA : FINA} />
      {Array.from({ length: divisoes }, (_, k) => {
        const g = (k * 360) / divisoes;
        const [x1, y1] = polar(R_SUB, g);
        const [x2, y2] = polar(R_SUB - 4, g);
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-tinta" strokeWidth={FINA} />;
      })}
      {rotulos.map(({ indice, texto, extra }) => {
        const [x, y] = polar(R_SUB - 14, (indice * 360) / divisoes);
        return (
          <text key={indice} x={x} y={y} dy="0.35em" textAnchor="middle" fontSize={13.5} fontWeight={600} className={`rotulo-sub fill-tinta ${extra ? 'rotulo-extra' : ''}`}>
            {texto}
          </text>
        );
      })}
      <g transform={`rotate(${angulo})`}>
        <line y1={7} y2={-(R_SUB - 5)} className="stroke-tinta" strokeWidth={PESADA} strokeLinecap="round" />
      </g>
      <circle r={3.5} className="fill-tinta" />
    </g>
  );
}

function desenharPeca(peca: Peca, p: Props, perigoData: boolean, zona: ZonaProibida) {
  const { instante: i, angulos: a } = p;
  switch (peca.tipo) {
    case 'janela-data':
      return (
        <g>
          <rect x={108} y={-16} width={42} height={32} rx={4} fill="none" className={perigoData ? 'stroke-revisao' : 'stroke-tinta'} strokeWidth={PESADA} />
          <text x={129} y={0} dy="0.36em" textAnchor="middle" fontSize={20} fontWeight={700} className={perigoData ? 'fill-revisao' : 'fill-tinta'}>
            {doisDigitos(i.dia)}
          </text>
        </g>
      );
    case 'janela-dia':
      return (
        <g>
          <rect x={-34} y={-133} width={68} height={30} rx={4} fill="none" className="stroke-tinta" strokeWidth={PESADA} />
          <text x={0} y={-118} dy="0.36em" textAnchor="middle" fontSize={17} fontWeight={700} letterSpacing="0.08em" className="fill-tinta">
            {DIAS_CURTOS[i.diaSemana].toUpperCase()}
          </text>
        </g>
      );
    case 'sub-dia':
      return (
        <Submostrador
          posicao={peca.posicao}
          divisoes={7}
          rotulos={DIAS_INICIAIS.map((texto, indice) => ({ indice, texto }))}
          angulo={a.diaSemana}
        />
      );
    case 'sub-data':
      return (
        <Submostrador
          posicao={peca.posicao}
          divisoes={31}
          rotulos={[4, 9, 14, 19, 24, 29].map((indice) => ({ indice, texto: String(indice + 1) }))}
          angulo={a.data}
          perigo={perigoData}
        />
      );
    case 'sub-24h':
      return (
        <Submostrador
          posicao={peca.posicao}
          divisoes={24}
          rotulos={[0, 6, 12, 18].map((indice) => ({ indice, texto: indice === 0 ? '24' : String(indice) }))}
          angulo={a.hora24}
        >
          {/* Hachura da zona proibida, na posição em que ela acontece */}
          {/* Vermelha só com a zona ativa; fora dela, em azul de construção */}
          <path
            d={setor(R_SUB - 8, R_SUB, zona.inicio * 15, zona.fim * 15)}
            fill={p.perigo ? 'url(#hachura)' : 'url(#hachura-calma)'}
            className={p.perigo ? 'stroke-revisao' : 'stroke-construcao'}
            strokeWidth={FINA}
          />
        </Submostrador>
      );
    case 'sub-mes':
      return (
        <Submostrador
          posicao={peca.posicao}
          divisoes={12}
          rotulos={MESES_INICIAIS.map((texto, indice) => ({ indice, texto, extra: indice % 3 !== 0 }))}
          angulo={a.mes}
        >
          <text y={16} dy="0.35em" textAnchor="middle" fontSize={12} fontWeight={700} className="rotulo-sub fill-tinta">
            {rotuloCicloBissexto(i.ano)}
          </text>
        </Submostrador>
      );
    case 'lua': {
      const [cx, cy] = polar(LUA.r, LUA.angulo);
      return (
        <g transform={`translate(${cx} ${cy})`}>
          {/* Lado escuro hachurado (convenção de sombra do desenho); lado iluminado liso */}
          <circle r={LUA.raio} fill="url(#sombra)" />
          <path d={caminhoLua(p.fracaoLua, LUA.raio)} className="fill-folha" />
          <circle r={LUA.raio} fill="none" className="stroke-tinta" strokeWidth={FINA} />
        </g>
      );
    }
    case 'gmt':
      return (
        <g>
          <circle r={128} fill="none" className="stroke-tinta" strokeWidth={FINA} />
          {Array.from({ length: 12 }, (_, k) => (k + 1) * 2)
            // O 6 cairia dentro da janela da data às 3h.
            .filter((h) => h !== 6)
            .map((h) => {
              // Por dentro do anel: a ponta da seta (r 116–138) passa por fora, sem cobrir o número.
              const [x, y] = polar(100, h * 15);
              return (
                <text key={h} x={x} y={y} dy="0.35em" textAnchor="middle" fontSize={14} fontWeight={600} className="rotulo-gmt fill-tinta-2">
                  {h}
                </text>
              );
            })}
          {p.gmt && (
            <g transform={`rotate(${p.gmt.angulos.hora24})`}>
              <line y1={0} y2={-116} className="stroke-tinta" strokeWidth={FINA} />
              <path d="M 0 -138 L -8 -116 L 8 -116 Z" className="fill-folha stroke-tinta" strokeWidth={PESADA} strokeLinejoin="round" />
            </g>
          )}
        </g>
      );
  }
}

/** Mostrador analógico como vista frontal de desenho técnico. */
export function Mostrador(props: Props) {
  const { arquitetura, angulos: a, itens, perigo, rotuloAcessivel } = props;
  const pecas = PECAS[arquitetura.id] ?? [];
  const ocupadas = new Set<Posicao>(pecas.flatMap((p) => ('posicao' in p ? [p.posicao] : [])));
  const temSub = pecas.some((p) => p.tipo.startsWith('sub-'));

  return (
    <svg viewBox="-250 -222 500 444" role="img" aria-label={rotuloAcessivel} className="h-full w-full select-none">
      <defs>
        <pattern id="hachura" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={5} className="stroke-revisao" strokeWidth={FINA} />
        </pattern>
        <pattern id="hachura-calma" width={5} height={5} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={5} className="stroke-construcao" strokeWidth={FINA} />
        </pattern>
        <pattern id="sombra" width={4} height={4} patternUnits="userSpaceOnUse" patternTransform="rotate(45)">
          <line x1={0} y1={0} x2={0} y2={4} className="stroke-tinta" strokeWidth={FINA} />
        </pattern>
      </defs>

      {/* Linhas de construção */}
      <g className="stroke-construcao" strokeWidth={FINA} strokeDasharray="6 4" opacity={0.7}>
        <line x1={-244} x2={244} y1={0} y2={0} />
        <line x1={0} x2={0} y1={-216} y2={216} />
        {temSub && <circle r={DIST_SUB} fill="none" />}
      </g>

      {/* Caixa e trilho de minutos */}
      <circle r={R + 7} fill="none" className="stroke-tinta" strokeWidth={FINA} />
      <circle r={R} className="fill-folha stroke-tinta" strokeWidth={PESADA} />
      {Array.from({ length: 60 }, (_, k) => {
        const hora = k % 5 === 0;
        const [x1, y1] = polar(R - 2, k * 6);
        const [x2, y2] = polar(hora ? R - 20 : R - 9, k * 6);
        return <line key={k} x1={x1} y1={y1} x2={x2} y2={y2} className="stroke-tinta" strokeWidth={hora ? PESADA : FINA} strokeLinecap="round" />;
      })}
      {([12, 3, 6, 9] as Posicao[])
        .filter((p) => !ocupadas.has(p))
        .map((p) => {
          const [x, y] = polar(R - 42, ANGULO_POSICAO[p]);
          return (
            <text key={p} x={x} y={y} dy="0.36em" textAnchor="middle" fontSize={30} fontWeight={600} className="fill-tinta">
              {p}
            </text>
          );
        })}

      {/* Complicações: desenhadas de novo ao trocar de arquitetura */}
      <g key={arquitetura.id} className="surgir">
        {pecas.map((peca, idx) => (
          <g key={idx}>{desenharPeca(peca, props, perigo && itens[idx]?.sensivelZona === true, arquitetura.zonaProibida)}</g>
        ))}
        {pecas.map((peca, idx) => {
          const { pontos, balao } = chamada(peca);
          const item = itens[idx];
          const vermelho = perigo && item?.sensivelZona === true;
          return (
            <g key={`c${idx}`}>
              <polyline points={pontos} pathLength={1} fill="none" strokeWidth={FINA} className={`tracar ${vermelho ? 'stroke-revisao' : 'stroke-tinta'}`} style={tracado} />
              <circle cx={balao[0]} cy={balao[1]} r={14} strokeWidth={FINA} className={vermelho ? 'fill-revisao stroke-revisao' : 'fill-papel stroke-tinta'} />
              <text x={balao[0]} y={balao[1]} dy="0.36em" textAnchor="middle" fontSize={15} fontWeight={700} className={vermelho ? 'fill-revisao-texto' : 'fill-tinta'}>
                {item?.letra}
              </text>
            </g>
          );
        })}
      </g>

      {/* Ponteiros cheios, em nanquim: dominam os ponteiros dos submostradores */}
      <g transform={`rotate(${a.hora})`}>
        <path d="M 0 22 L -10 0 L 0 -102 L 10 0 Z" className="fill-tinta stroke-tinta" strokeWidth={PESADA} strokeLinejoin="round" />
      </g>
      <g transform={`rotate(${a.minuto})`}>
        <path d="M 0 26 L -7 0 L 0 -162 L 7 0 Z" className="fill-tinta stroke-tinta" strokeWidth={PESADA} strokeLinejoin="round" />
      </g>
      <circle r={8} className="fill-tinta" />
      <g transform={`rotate(${a.segundo})`}>
        <line y1={36} y2={-170} className="stroke-revisao" strokeWidth={PESADA} strokeLinecap="round" />
        <circle cy={27} r={6} className="fill-folha stroke-revisao" strokeWidth={PESADA} />
      </g>
      <circle r={4.5} className="fill-revisao" />
    </svg>
  );
}
