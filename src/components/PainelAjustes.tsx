import { Moon, Sun } from 'lucide-react';
import type { ReactNode } from 'react';
import { useTextos } from '@/i18n/contexto';
import { IDIOMAS, type Idioma } from '@/i18n/textos';
import { FUSOS_RAPIDOS } from '@/motor/fusos';
import type { Movimento } from '@/motor/tipos';

export type Tema = 'claro' | 'escuro';

export const MOVIMENTOS: Movimento[] = [1, 6, 8, 'continuo'];

interface Props {
  tema: Tema;
  aoMudarTema: (t: Tema) => void;
  idioma: Idioma;
  aoMudarIdioma: (i: Idioma) => void;
  movimento: Movimento;
  aoMudarMovimento: (m: Movimento) => void;
  fusoIndice: number;
  aoMudarFuso: (i: number) => void;
  /** Só aparece no mostrador GMT. */
  fusoGmtIndice?: number;
  aoMudarFusoGmt: (i: number) => void;
  telaAcesa: { suportado: boolean; ativo: boolean; alternar: () => void };
}

const campo =
  'min-h-11 w-full rounded-[0.625rem] border border-tinta/60 bg-folha px-3 text-base text-tinta hover:border-tinta';

function Campo({ rotulo, children }: { rotulo: string; children: ReactNode }) {
  return (
    <label className="grid gap-1.5">
      <span className="text-base text-tinta-2">{rotulo}</span>
      {children}
    </label>
  );
}

function Chave({ rotulo, ajuda, ligado, desabilitado, aoAlternar }: { rotulo: string; ajuda: string; ligado: boolean; desabilitado?: boolean; aoAlternar: () => void }) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={ligado}
      disabled={desabilitado}
      onClick={aoAlternar}
      className="flex min-h-11 items-start gap-3 rounded-[0.625rem] p-2 text-left hover:bg-tinta/[0.06] disabled:opacity-60 disabled:hover:bg-transparent"
    >
      <span
        aria-hidden="true"
        className={`relative mt-0.5 h-6 w-10 shrink-0 rounded-full border-[1.5px] border-tinta transition-colors duration-200 ease-saida-expo ${ligado ? 'bg-tinta' : 'bg-folha'}`}
      >
        <span
          className={`absolute top-1/2 size-4 -translate-y-1/2 rounded-full transition-[left] duration-200 ease-saida-expo ${
            ligado ? 'left-[1.125rem] bg-papel' : 'left-0.5 bg-tinta'
          }`}
        />
      </span>
      <span>
        <span className="block text-base font-semibold">{rotulo}</span>
        <span className="block text-sm text-tinta-2">{ajuda}</span>
      </span>
    </button>
  );
}

/** Todos os ajustes num lugar só. */
export function PainelAjustes(p: Props) {
  const t = useTextos();
  return (
    <section id="ajustes" aria-label={t.ajustes} className="surgir mb-6 grid gap-x-6 gap-y-4 rounded-gabarito bg-folha p-4 sm:grid-cols-2 lg:grid-cols-4">
      <div className="grid gap-1.5">
        <span className="text-base text-tinta-2" id="rotulo-tema">{t.tema}</span>
        <div role="radiogroup" aria-labelledby="rotulo-tema" className="flex gap-1 rounded-gabarito bg-tinta/[0.06] p-1">
          {(['claro', 'escuro'] as const).map((tm) => (
            <button
              key={tm}
              type="button"
              role="radio"
              aria-checked={p.tema === tm}
              onClick={() => p.aoMudarTema(tm)}
              className={`inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-[0.625rem] px-3 text-base font-semibold ${
                p.tema === tm ? 'bg-folha font-bold ring-[1.5px] ring-inset ring-tinta' : 'text-tinta-2 hover:bg-tinta/10 hover:text-tinta'
              }`}
            >
              {tm === 'claro' ? <Sun className="size-5" strokeWidth={1.8} aria-hidden="true" /> : <Moon className="size-5" strokeWidth={1.8} aria-hidden="true" />}
              {tm === 'claro' ? t.claro : t.escuro}
            </button>
          ))}
        </div>
      </div>

      <Campo rotulo={t.idioma}>
        <select className={campo} value={p.idioma} onChange={(e) => p.aoMudarIdioma(e.target.value as Idioma)}>
          {IDIOMAS.map((i) => (
            <option key={i.id} value={i.id}>{i.nome}</option>
          ))}
        </select>
      </Campo>

      <Campo rotulo={t.movimento}>
        <select className={campo} value={String(p.movimento)} onChange={(e) => p.aoMudarMovimento(MOVIMENTOS.find((m) => String(m) === e.target.value) ?? 1)}>
          {MOVIMENTOS.map((m) => (
            <option key={m} value={String(m)}>{t.movimentos[String(m)]}</option>
          ))}
        </select>
      </Campo>

      <Campo rotulo={t.fusoReferencia}>
        <select className={campo} value={p.fusoIndice} onChange={(e) => p.aoMudarFuso(Number(e.target.value))}>
          {FUSOS_RAPIDOS.map((f, idx) => (
            <option key={f.id} value={idx}>{t.fusos[f.id]}</option>
          ))}
        </select>
      </Campo>

      {p.fusoGmtIndice !== undefined && (
        <Campo rotulo={t.segundoFuso}>
          <select className={campo} value={p.fusoGmtIndice} onChange={(e) => p.aoMudarFusoGmt(Number(e.target.value))}>
            {FUSOS_RAPIDOS.map((f, idx) => (
              <option key={f.id} value={idx}>{t.fusos[f.id]}</option>
            ))}
          </select>
        </Campo>
      )}

      <Chave
        rotulo={t.telaAcesa}
        ajuda={p.telaAcesa.suportado ? t.telaAcesaAjuda : t.telaAcesaIndisponivel}
        ligado={p.telaAcesa.ativo}
        desabilitado={!p.telaAcesa.suportado}
        aoAlternar={p.telaAcesa.alternar}
      />
    </section>
  );
}
