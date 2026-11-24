import { useTextos } from '@/i18n/contexto';
import { quantizarMs } from '@/motor/angulos';
import type { Instante, Movimento } from '@/motor/tipos';

interface Props {
  instante: Instante;
  movimento: Movimento;
}

/**
 * Escala gráfica de 0 a 60 s, como a barra de escala de um desenho:
 * o marcador anda com a batida do movimento até o próximo :00.
 * O segundo :00 tem estado próprio: é o instante de soltar a coroa.
 */
export function EscalaContagem({ instante, movimento }: Props) {
  const t = useTextos();
  const s = instante.segundo + quantizarMs(instante.ms, movimento) / 1000;
  const soltar = instante.segundo === 0;
  const faltam = 60 - instante.segundo;
  const reta = !soltar && faltam <= 10;
  const x = (s / 60) * 600;

  return (
    <div>
      <div className="flex items-end justify-between gap-4">
        <p className="pb-1 text-lg font-medium text-tinta-2">
          {soltar ? <strong key="agora" className="surgir text-2xl font-bold text-tinta">{t.contagem.agora}</strong> : t.contagem.em}
        </p>
        <p
          className={`font-bold leading-none transition-[font-size] duration-300 ease-saida-expo ${
            soltar || reta ? 'text-7xl' : 'text-5xl'
          }`}
        >
          {soltar ? '00' : String(faltam).padStart(2, '0')}
          <span className="ml-1 text-2xl font-medium text-tinta-2">s</span>
        </p>
      </div>
      <svg viewBox="-12 -20 624 52" className="mt-3 w-full" aria-hidden="true">
        <line x1={0} x2={600} y1={0} y2={0} className="stroke-tinta" strokeWidth={2.6} />
        {Array.from({ length: 61 }, (_, k) => {
          const dez = k % 10 === 0;
          const cinco = k % 5 === 0;
          return (
            <line
              key={k}
              x1={k * 10}
              x2={k * 10}
              y1={0}
              y2={dez ? 14 : cinco ? 9 : 5}
              className="stroke-tinta"
              strokeWidth={dez ? 2.6 : 1.1}
            />
          );
        })}
        {[0, 10, 20, 30, 40, 50, 60].map((k) => (
          <text key={k} x={k * 10} y={32} textAnchor="middle" fontSize={20} fontWeight={600} className="fill-tinta-2">
            {k}
          </text>
        ))}
        <g transform={`translate(${x} 0)`}>
          <path d="M 0 -3 L -8 -17 L 8 -17 Z" className="fill-revisao" />
        </g>
      </svg>
    </div>
  );
}
