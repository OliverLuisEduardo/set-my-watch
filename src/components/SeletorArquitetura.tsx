import { ARQUITETURAS } from '@/motor/arquiteturas';

interface Props {
  valor: string;
  aoMudar: (id: string) => void;
}

/** Controle segmentado das arquiteturas, com o simples primeiro. */
export function SeletorArquitetura({ valor, aoMudar }: Props) {
  return (
    <div role="radiogroup" aria-label="Arquitetura do mostrador" className="flex flex-wrap gap-1 rounded-gabarito bg-tinta/[0.06] p-1">
      {ARQUITETURAS.map((a) => {
        const ativo = a.id === valor;
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={ativo}
            title={a.nome}
            onClick={() => aoMudar(a.id)}
            className={`min-h-11 flex-1 whitespace-nowrap rounded-[0.625rem] px-3 text-base font-semibold transition-colors duration-200 ease-saida-expo ${
              // Seleção por contorno, não por inversão: a única placa invertida é o aviso de zona proibida.
              ativo ? 'bg-folha font-bold text-tinta ring-[1.5px] ring-inset ring-tinta' : 'text-tinta-2 hover:bg-tinta/10 hover:text-tinta'
            }`}
          >
            {a.rotulo}
          </button>
        );
      })}
    </div>
  );
}
