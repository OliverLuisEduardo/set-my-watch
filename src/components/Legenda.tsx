import type { ItemLegenda } from '@/ui/legenda';

interface Props {
  itens: ItemLegenda[];
  perigo: boolean;
}

/** Lista das peças do mostrador: a letra do balão, o nome e o valor. */
export function Legenda({ itens, perigo }: Props) {
  if (itens.length === 0) return null;
  return (
    <dl className="border-t border-tinta/20">
      {itens.map((item) => {
        const vermelho = perigo && item.sensivelZona;
        return (
          <div key={item.nome} className="flex items-center gap-3 border-b border-tinta/20 py-2.5">
            <span
              aria-hidden="true"
              className={`grid size-7 shrink-0 place-items-center rounded-full border text-sm font-bold ${
                vermelho ? 'border-revisao bg-revisao text-revisao-texto' : 'border-tinta'
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
  );
}

/** Hora de referência em destaque, com a data e o fuso por extenso. */
export function HoraReferencia({ hora, minuto, segundo, data }: { hora: string; minuto: string; segundo: string; data: string }) {
  return (
    <div>
      <p className="text-[clamp(3.5rem,9vw,6rem)] font-bold leading-[0.9] tracking-[-0.01em]">
        {hora}:{minuto}
        <span className="text-tinta-2">:{segundo}</span>
      </p>
      <p className="mt-2 text-lg text-tinta-2">{data}</p>
    </div>
  );
}
