import { useEffect, useMemo, useState } from 'react';
import { Crosshair, Eye, Moon, SlidersHorizontal, Sun } from 'lucide-react';
import { AvisoZona } from '@/components/AvisoZona';
import { EscalaContagem } from '@/components/EscalaContagem';
import { Legenda } from '@/components/Legenda';
import { Mostrador } from '@/components/Mostrador';
import { SeletorArquitetura } from '@/components/SeletorArquitetura';
import { usePreferencia } from '@/hooks/usePreferencia';
import { useRelogio } from '@/hooks/useRelogio';
import { useWakeLock } from '@/hooks/useWakeLock';
import { ARQUITETURAS } from '@/motor/arquiteturas';
import { fracaoLunar } from '@/motor/calendario';
import { FUSOS_RAPIDOS } from '@/motor/fusos';
import { POSICAO_ZERO, fusoDoSistema } from '@/motor/tempo';
import type { FonteTempo, Movimento } from '@/motor/tipos';
import { naZonaProibida } from '@/motor/zonaProibida';
import { itensLegenda } from '@/ui/legenda';
import { doisDigitos } from '@/ui/textos';

type Tema = 'folha' | 'bancada';

const MOVIMENTOS: { rotulo: string; valor: Movimento }[] = [
  { rotulo: 'Quartzo · 1 passo/s', valor: 1 },
  { rotulo: 'Mecânico 21.600 alt/h · 6 passos/s', valor: 6 },
  { rotulo: 'Mecânico 28.800 alt/h · 8 passos/s', valor: 8 },
  { rotulo: 'Varredura contínua', valor: 'continuo' },
];

const ehTema = (v: unknown): v is Tema => v === 'folha' || v === 'bancada';
const ehArquitetura = (v: unknown): v is string => ARQUITETURAS.some((a) => a.id === v);
const ehMovimento = (v: unknown): v is Movimento => MOVIMENTOS.some((m) => m.valor === v);
const ehIndiceFuso = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v < FUSOS_RAPIDOS.length;

const rotuloFuso = (indice: number) => FUSOS_RAPIDOS[indice].fuso ?? `Local (${fusoDoSistema().replace(/_/g, ' ')})`;

const campo =
  'min-h-11 w-full rounded-[0.625rem] border border-tinta/60 bg-folha px-3 text-base text-tinta hover:border-tinta';

export default function App() {
  const [tema, setTema] = usePreferencia<Tema>('tema', 'folha', ehTema);
  const [arquiteturaId, setArquiteturaId] = usePreferencia('arquitetura', ARQUITETURAS[0].id, ehArquitetura);
  const [movimento, setMovimento] = usePreferencia<Movimento>('movimento', ARQUITETURAS[0].movimento, ehMovimento);
  const [fusoIndice, setFusoIndice] = usePreferencia('fuso', 0, ehIndiceFuso);
  const [fusoGmtIndice, setFusoGmtIndice] = usePreferencia('fuso-gmt', 1, ehIndiceFuso);
  const [zero, setZero] = useState(false);
  const [ajustesAbertos, setAjustesAbertos] = useState(false);

  const arquitetura = ARQUITETURAS.find((a) => a.id === arquiteturaId) ?? ARQUITETURAS[0];
  const ehGmt = arquitetura.complicacoes.includes('gmt');

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'bancada' ? '#000000' : '#ECF0EF');
  }, [tema]);

  const fonte = useMemo<FonteTempo>(
    () => (zero ? { tipo: 'congelada', instante: POSICAO_ZERO } : { tipo: 'ao-vivo' }),
    [zero],
  );
  const relogio = useRelogio({ fonte, movimento, fuso: FUSOS_RAPIDOS[fusoIndice].fuso });
  const relogioGmt = useRelogio({ fonte, movimento, fuso: FUSOS_RAPIDOS[fusoGmtIndice].fuso });
  const telaAcesa = useWakeLock();

  const { instante, angulos, epocaMs } = relogio;
  const perigo = !zero && naZonaProibida(instante.hora, arquitetura.zonaProibida);
  const gmt = ehGmt
    ? { instante: relogioGmt.instante, angulos: relogioGmt.angulos, rotulo: FUSOS_RAPIDOS[fusoGmtIndice].rotulo }
    : undefined;
  const itens = itensLegenda(arquitetura, { instante, epocaMs, gmt });

  const escolherArquitetura = (id: string) => {
    const nova = ARQUITETURAS.find((a) => a.id === id) ?? ARQUITETURAS[0];
    setArquiteturaId(nova.id);
    setMovimento(nova.movimento);
  };

  const botaoBarra = (ativo: boolean) =>
    `inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] px-2.5 text-base sm:px-3 font-semibold transition-colors duration-200 ease-saida-expo ${
      ativo ? 'bg-folha font-bold ring-[1.5px] ring-inset ring-tinta' : 'text-tinta hover:bg-tinta/10'
    }`;

  return (
    <div className="mx-auto flex min-h-dvh max-w-[1600px] flex-col px-4 pb-8 sm:px-8 lg:px-12">
      <header className="flex flex-wrap items-center gap-x-1 gap-y-2 py-3 sm:gap-x-4 sm:py-4">
        <h1 className="mr-auto text-lg font-bold tracking-[0.01em] sm:text-2xl">SetMyWatch</h1>

        <div role="radiogroup" aria-label="Tema" className="flex rounded-gabarito bg-tinta/[0.06] p-0.5 sm:p-1">
          {(['folha', 'bancada'] as const).map((t) => (
            <button key={t} type="button" role="radio" aria-checked={tema === t} onClick={() => setTema(t)} className={botaoBarra(tema === t)}>
              {t === 'folha' ? <Sun className="size-5" strokeWidth={1.8} aria-hidden="true" /> : <Moon className="size-5" strokeWidth={1.8} aria-hidden="true" />}
              <span className="max-sm:sr-only">{t === 'folha' ? 'Folha' : 'Bancada'}</span>
            </button>
          ))}
        </div>

        <button type="button" aria-pressed={zero} onClick={() => setZero((z) => !z)} className={botaoBarra(zero)}>
          <Crosshair className="size-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="max-sm:sr-only">Posição zero</span>
        </button>

        {telaAcesa.suportado && (
          <button
            type="button"
            aria-pressed={telaAcesa.ativo}
            onClick={() => (telaAcesa.ativo ? telaAcesa.desativar() : telaAcesa.ativar())}
            className={botaoBarra(telaAcesa.ativo)}
          >
            <Eye className="size-5" strokeWidth={1.8} aria-hidden="true" />
            <span className="max-sm:sr-only">Tela acesa</span>
          </button>
        )}

        <button
          type="button"
          aria-expanded={ajustesAbertos}
          aria-controls="ajustes"
          onClick={() => setAjustesAbertos((a) => !a)}
          className={botaoBarra(ajustesAbertos)}
        >
          <SlidersHorizontal className="size-5" strokeWidth={1.8} aria-hidden="true" />
          <span className="max-sm:sr-only">Ajustes</span>
        </button>
      </header>

      {ajustesAbertos && (
        <section id="ajustes" aria-label="Ajustes" className="surgir mb-4 grid gap-4 rounded-gabarito bg-folha p-4 sm:grid-cols-2 lg:grid-cols-3">
          <label className="grid gap-1.5">
            <span className="text-base text-tinta-2">Movimento</span>
            <select className={campo} value={String(movimento)} onChange={(e) => setMovimento(MOVIMENTOS.find((m) => String(m.valor) === e.target.value)!.valor)}>
              {MOVIMENTOS.map((m) => (
                <option key={m.valor} value={String(m.valor)}>{m.rotulo}</option>
              ))}
            </select>
          </label>
          <label className="grid gap-1.5">
            <span className="text-base text-tinta-2">Fuso de referência</span>
            <select className={campo} value={fusoIndice} onChange={(e) => setFusoIndice(Number(e.target.value))}>
              {FUSOS_RAPIDOS.map((f, idx) => (
                <option key={f.rotulo} value={idx}>{f.rotulo}</option>
              ))}
            </select>
          </label>
          {ehGmt && (
            <label className="grid gap-1.5">
              <span className="text-base text-tinta-2">Segundo fuso (ponteiro GMT)</span>
              <select className={campo} value={fusoGmtIndice} onChange={(e) => setFusoGmtIndice(Number(e.target.value))}>
                {FUSOS_RAPIDOS.map((f, idx) => (
                  <option key={f.rotulo} value={idx}>{f.rotulo}</option>
                ))}
              </select>
            </label>
          )}
        </section>
      )}

      <main className="grid flex-1 items-start gap-x-14 gap-y-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
        <section aria-label="Mostrador" className="lg:col-start-1 lg:row-start-1">
          <div className="mx-auto aspect-[500/444] w-full max-w-[min(100%,calc((100dvh-12rem)*500/444))]">
            <Mostrador
              arquitetura={arquitetura}
              instante={instante}
              angulos={angulos}
              itens={itens}
              perigo={perigo}
              gmt={gmt}
              fracaoLua={fracaoLunar(epocaMs)}
              rotuloAcessivel={`Mostrador ${arquitetura.nome}: ${doisDigitos(instante.hora)}:${doisDigitos(instante.minuto)}:${doisDigitos(instante.segundo)}, dia ${instante.dia}`}
            />
          </div>
        </section>

        <aside aria-label="Legenda" className="flex flex-col gap-6 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-6">
          {/* Na zona proibida, o aviso sobe para logo abaixo da hora: tem de caber na primeira tela do celular. */}
          <Legenda
            instante={instante}
            rotuloFuso={rotuloFuso(fusoIndice)}
            itens={itens}
            perigo={perigo}
            depoisDaHora={perigo ? <AvisoZona zona={arquitetura.zonaProibida} ativa congelado={false} /> : undefined}
          />
          <EscalaContagem instante={instante} movimento={movimento} congelado={zero} />
          {!perigo && <AvisoZona zona={arquitetura.zonaProibida} ativa={false} congelado={zero} />}
        </aside>

        {/* No celular fica por último: é tocado raramente. */}
        <div className="lg:col-start-1 lg:row-start-2">
          <SeletorArquitetura valor={arquitetura.id} aoMudar={escolherArquitetura} />
        </div>
      </main>
    </div>
  );
}
