import { useEffect, useState } from 'react';
import { SlidersHorizontal, X } from 'lucide-react';
import { AvisoZona } from '@/components/AvisoZona';
import { EscalaContagem } from '@/components/EscalaContagem';
import { HoraReferencia, Legenda } from '@/components/Legenda';
import { Mostrador } from '@/components/Mostrador';
import { MOVIMENTOS, PainelAjustes, type Tema } from '@/components/PainelAjustes';
import { SeletorArquitetura } from '@/components/SeletorArquitetura';
import { usePreferencia } from '@/hooks/usePreferencia';
import { useRelogio } from '@/hooks/useRelogio';
import { useWakeLock } from '@/hooks/useWakeLock';
import { ContextoTextos } from '@/i18n/contexto';
import { IDIOMAS, TEXTOS, idiomaDoNavegador, type Idioma } from '@/i18n/textos';
import { ARQUITETURAS } from '@/motor/arquiteturas';
import { fracaoLunar } from '@/motor/calendario';
import { FUSOS_RAPIDOS } from '@/motor/fusos';
import { fusoDoSistema } from '@/motor/tempo';
import type { FonteTempo, Movimento } from '@/motor/tipos';
import { naZonaProibida } from '@/motor/zonaProibida';
import { itensLegenda } from '@/ui/legenda';
import { doisDigitos, horaTexto } from '@/ui/textos';

const ehTema = (v: unknown): v is Tema => v === 'claro' || v === 'escuro';
const ehIdioma = (v: unknown): v is Idioma => IDIOMAS.some((i) => i.id === v);
const ehArquitetura = (v: unknown): v is string => ARQUITETURAS.some((a) => a.id === v);
const ehMovimento = (v: unknown): v is Movimento => MOVIMENTOS.some((m) => m === v);
const ehIndiceFuso = (v: unknown): v is number => typeof v === 'number' && v >= 0 && v < FUSOS_RAPIDOS.length;
// A tela sempre mostra a hora ao vivo do sistema.
const FONTE_AO_VIVO: FonteTempo = { tipo: 'ao-vivo' };

export default function App() {
  const [tema, setTema] = usePreferencia<Tema>('tema', 'claro', ehTema);
  const [idioma, setIdioma] = usePreferencia<Idioma>('idioma', idiomaDoNavegador(), ehIdioma);
  const [arquiteturaId, setArquiteturaId] = usePreferencia('arquitetura', ARQUITETURAS[0].id, ehArquitetura);
  // Quartzo é sempre o padrão; trocar o tipo de mostrador não mexe no movimento.
  const [movimento, setMovimento] = usePreferencia<Movimento>('movimento-v2', 1, ehMovimento);
  const [fusoIndice, setFusoIndice] = usePreferencia('fuso', 0, ehIndiceFuso);
  const [fusoGmtIndice, setFusoGmtIndice] = usePreferencia('fuso-gmt', 1, ehIndiceFuso);
  const [ajustesAbertos, setAjustesAbertos] = useState(false);

  const t = TEXTOS[idioma];
  const arquitetura = ARQUITETURAS.find((a) => a.id === arquiteturaId) ?? ARQUITETURAS[0];
  const ehGmt = arquitetura.complicacoes.includes('gmt');

  useEffect(() => {
    document.documentElement.dataset.tema = tema;
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', tema === 'escuro' ? '#000000' : '#ECF0EF');
  }, [tema]);

  useEffect(() => {
    document.documentElement.lang = idioma;
    document.querySelector('meta[name="description"]')?.setAttribute('content', t.descricao);
  }, [idioma, t]);

  const relogio = useRelogio({ fonte: FONTE_AO_VIVO, movimento, fuso: FUSOS_RAPIDOS[fusoIndice].fuso });
  const relogioGmt = useRelogio({ fonte: FONTE_AO_VIVO, movimento, fuso: FUSOS_RAPIDOS[fusoGmtIndice].fuso });
  const telaAcesa = useWakeLock();

  const { instante: i, angulos, epocaMs } = relogio;
  const perigo = naZonaProibida(i.hora, arquitetura.zonaProibida);
  const gmt = ehGmt
    ? { instante: relogioGmt.instante, angulos: relogioGmt.angulos, rotulo: t.fusos[FUSOS_RAPIDOS[fusoGmtIndice].id] }
    : undefined;
  const itens = itensLegenda(arquitetura, { instante: i, epocaMs, gmt }, t);

  const fusoAtual = FUSOS_RAPIDOS[fusoIndice];
  const nomeFuso = fusoAtual.fuso ?? `${t.fusos.local} (${fusoDoSistema().replace(/_/g, ' ')})`;
  const dataLonga = `${t.dataLonga(t.dias[i.diaSemana], i.dia, t.meses[i.mes - 1], i.ano)} · ${nomeFuso}`;

  return (
    <ContextoTextos.Provider value={t}>
      <div className="mx-auto flex min-h-dvh max-w-[1600px] flex-col px-4 pb-8 sm:px-8 lg:px-12">
        <header className="flex items-center gap-4 py-3 sm:py-4">
          <h1 className="mr-auto text-xl font-bold tracking-[0.01em] sm:text-2xl">SetMyWatch</h1>
          <button
            type="button"
            aria-expanded={ajustesAbertos}
            aria-controls="ajustes"
            onClick={() => setAjustesAbertos((a) => !a)}
            className={`inline-flex min-h-11 items-center gap-2 rounded-[0.625rem] px-3 text-base font-semibold transition-colors duration-200 ease-saida-expo ${
              ajustesAbertos ? 'bg-folha font-bold ring-[1.5px] ring-inset ring-tinta' : 'hover:bg-tinta/10'
            }`}
          >
            {ajustesAbertos ? <X className="size-5" strokeWidth={1.8} aria-hidden="true" /> : <SlidersHorizontal className="size-5" strokeWidth={1.8} aria-hidden="true" />}
            {ajustesAbertos ? t.fecharAjustes : t.ajustes}
          </button>
        </header>

        {ajustesAbertos && (
          <PainelAjustes
            tema={tema}
            aoMudarTema={setTema}
            idioma={idioma}
            aoMudarIdioma={setIdioma}
            movimento={movimento}
            aoMudarMovimento={setMovimento}
            fusoIndice={fusoIndice}
            aoMudarFuso={setFusoIndice}
            fusoGmtIndice={ehGmt ? fusoGmtIndice : undefined}
            aoMudarFusoGmt={setFusoGmtIndice}
            telaAcesa={{
              suportado: telaAcesa.suportado,
              ativo: telaAcesa.ativo,
              alternar: () => void (telaAcesa.ativo ? telaAcesa.desativar() : telaAcesa.ativar()),
            }}
          />
        )}

        <main className="grid flex-1 items-start gap-x-14 gap-y-8 lg:grid-cols-[minmax(0,1fr)_minmax(360px,440px)]">
          <section aria-label={t.arquitetura} className="lg:col-start-1 lg:row-start-1">
            <div className="mx-auto aspect-[500/444] w-full max-w-[min(100%,calc((100dvh-13rem)*500/444))]">
              <Mostrador
                arquitetura={arquitetura}
                instante={i}
                angulos={angulos}
                itens={itens}
                perigo={perigo}
                gmt={gmt}
                fracaoLua={fracaoLunar(epocaMs)}
                rotuloAcessivel={t.mostrador(t.arquiteturas[arquitetura.id].nome, horaTexto(i.hora, i.minuto, i.segundo), i.dia)}
              />
            </div>
          </section>

          {/* Ordem de leitura na bancada: hora, perigo, contagem, estado da data, peças do mostrador. */}
          <aside className="flex flex-col gap-7 lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:pt-6">
            <HoraReferencia hora={doisDigitos(i.hora)} minuto={doisDigitos(i.minuto)} segundo={doisDigitos(i.segundo)} data={dataLonga} />
            {perigo && <AvisoZona zona={arquitetura.zonaProibida} ativa />}
            <EscalaContagem instante={i} movimento={movimento} />
            {!perigo && <AvisoZona zona={arquitetura.zonaProibida} ativa={false} />}
            <Legenda itens={itens} perigo={perigo} />
          </aside>

          {/* Embaixo do mostrador no desktop; no celular vem por último, depois da hora e da contagem. */}
          <div className="lg:col-start-1 lg:row-start-2">
            <SeletorArquitetura valor={arquitetura.id} aoMudar={setArquiteturaId} />
          </div>
        </main>
      </div>
    </ContextoTextos.Provider>
  );
}
