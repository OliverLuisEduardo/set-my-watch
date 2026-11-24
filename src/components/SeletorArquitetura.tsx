import { useTextos } from '@/i18n/contexto';
import { ARQUITETURAS } from '@/motor/arquiteturas';

interface Props {
  valor: string;
  aoMudar: (id: string) => void;
}

/** Controle segmentado dos tipos de mostrador. Seleção por contorno, não por inversão. */
export function SeletorArquitetura({ valor, aoMudar }: Props) {
  const t = useTextos();
  return (
    <div role="radiogroup" aria-label={t.arquitetura} className="flex flex-wrap gap-1 rounded-gabarito bg-tinta/[0.06] p-1">
      {ARQUITETURAS.map((a) => {
        const ativo = a.id === valor;
        const nomes = t.arquiteturas[a.id];
        return (
          <button
            key={a.id}
            type="button"
            role="radio"
            aria-checked={ativo}
            title={nomes.nome}
            onClick={() => aoMudar(a.id)}
            className={`min-h-11 flex-1 whitespace-nowrap rounded-[0.625rem] px-3 text-base font-semibold transition-colors duration-200 ease-saida-expo ${
              ativo ? 'bg-folha font-bold text-tinta ring-[1.5px] ring-inset ring-tinta' : 'text-tinta-2 hover:bg-tinta/10 hover:text-tinta'
            }`}
          >
            {nomes.rotulo}
          </button>
        );
      })}
    </div>
  );
}
