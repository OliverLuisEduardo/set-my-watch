import { CircleCheck, Crosshair } from 'lucide-react';
import type { ZonaProibida } from '@/motor/tipos';
import { doisDigitos } from '@/ui/textos';

interface Props {
  zona: ZonaProibida;
  ativa: boolean;
  congelado: boolean;
}

/** Delta de revisão de desenho técnico, no lugar de um ícone genérico de alerta. */
function DeltaRevisao() {
  return (
    <svg viewBox="0 0 28 26" className="mt-0.5 size-7 shrink-0" aria-hidden="true">
      <path d="M14 2 L26 24 L2 24 Z" fill="none" stroke="currentColor" strokeWidth={2.2} strokeLinejoin="round" />
      <text x={14} y={20} textAnchor="middle" fontSize={13} fontWeight={700} fill="currentColor">!</text>
    </svg>
  );
}

/** Estado do passe rápido de data. Só a zona proibida ativa vira placa invertida. */
export function AvisoZona({ zona, ativa, congelado }: Props) {
  const ini = `${doisDigitos(zona.inicio)}:00`;
  const fim = `${doisDigitos(zona.fim)}:00`;

  if (congelado) {
    return (
      <div className="flex items-start gap-3 rounded-gabarito border border-tinta/40 px-4 py-3">
        <Crosshair className="mt-0.5 size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
        <p className="text-base leading-snug">
          <strong className="font-semibold">Posição zero.</strong> Ponteiros travados em 12:00:00, domingo, dia 1, janeiro.
          Alinhe os ponteiros do relógio a eles.
        </p>
      </div>
    );
  }

  if (ativa) {
    return (
      <div role="alert" className="surgir flex items-start gap-3 rounded-gabarito bg-revisao px-4 py-3 text-revisao-texto">
        <DeltaRevisao />
        <p className="text-base leading-snug">
          <strong className="block text-xl font-bold">Zona proibida: não use o passe rápido da data</strong>
          Entre {ini} e {fim} a engrenagem da data está engatada. Avance a data pelos ponteiros, girando além da meia-noite.
        </p>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-3 px-1">
      <CircleCheck className="size-5 shrink-0" strokeWidth={1.8} aria-hidden="true" />
      <p className="text-base">
        Passe rápido da data liberado até <strong className="font-semibold">{ini}</strong>
      </p>
    </div>
  );
}
