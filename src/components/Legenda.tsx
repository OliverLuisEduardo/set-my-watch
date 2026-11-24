import type { ReactNode } from 'react';
import type { Instante } from '@/motor/tipos';
import type { ItemLegenda } from '@/ui/legenda';
import { DIAS_LONGOS, MESES_CURTOS, doisDigitos } from '@/ui/textos';

interface Props {
  instante: Instante;
  rotuloFuso: string;
  itens: ItemLegenda[];
  perigo: boolean;
  /** Conteúdo urgente logo abaixo da hora (o aviso de zona proibida). */
  depoisDaHora?: ReactNode;
}

/** Legenda do desenho: hora de referência e a lista das peças com seus balões. */
export function Legenda({ instante: i, rotuloFuso, itens, perigo, depoisDaHora }: Props) {
  return (
    <div>
      <p className="text-[clamp(3.5rem,9vw,6rem)] font-bold leading-[0.9] tracking-[-0.01em]">
        {doisDigitos(i.hora)}:{doisDigitos(i.minuto)}
        <span className="text-tinta-2">:{doisDigitos(i.segundo)}</span>
      </p>
      <p className="mt-2 text-lg text-tinta-2">
        {DIAS_LONGOS[i.diaSemana]}, {i.dia} {MESES_CURTOS[i.mes - 1]} {i.ano} · {rotuloFuso}
      </p>

      {depoisDaHora && <div className="mt-4">{depoisDaHora}</div>}

      {itens.length > 0 && (
        <dl className="mt-5 border-t border-tinta/20">
          {itens.map((item) => {
            const vermelho = perigo && item.sensivelZona;
            return (
              <div key={item.nome} className="flex items-center gap-3 border-b border-tinta/20 py-2.5">
                <span
                  aria-hidden="true"
                  className={`grid size-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                    !item.letra ? 'border-dashed border-tinta/40' : vermelho ? 'border-revisao bg-revisao text-revisao-texto' : 'border-tinta'
                  }`}
                >
                  {item.letra ?? ''}
                </span>
                <dt className="text-base text-tinta-2">{item.nome}</dt>
                <dd className={`ml-auto text-right text-xl font-semibold ${vermelho ? 'text-revisao' : ''}`}>{item.valor}</dd>
              </div>
            );
          })}
        </dl>
      )}
    </div>
  );
}
