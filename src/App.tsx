import { useMemo, useState } from 'react';
import { useRelogio } from '@/hooks/useRelogio';
import { useWakeLock } from '@/hooks/useWakeLock';
import { ARQUITETURAS } from '@/motor/arquiteturas';
import { diasNoMes, fracaoLunar, rotuloCicloBissexto } from '@/motor/calendario';
import { FUSOS_RAPIDOS } from '@/motor/fusos';
import { POSICAO_ZERO, msAteProximoMinuto } from '@/motor/tempo';
import type { FonteTempo, Movimento } from '@/motor/tipos';
import { naZonaProibida } from '@/motor/zonaProibida';

const DIAS = ['domingo', 'segunda', 'terça', 'quarta', 'quinta', 'sexta', 'sábado'];
const MOVIMENTOS: { rotulo: string; valor: Movimento }[] = [
  { rotulo: 'Quartzo (1/s)', valor: 1 },
  { rotulo: 'Mecânico 21.600 (6/s)', valor: 6 },
  { rotulo: 'Mecânico 28.800 (8/s)', valor: 8 },
  { rotulo: 'Contínuo', valor: 'continuo' },
];

const doisDigitos = (n: number) => String(n).padStart(2, '0');

/**
 * Tela provisória: mostra os dados do motor em texto, sem mostrador.
 * A interface de verdade sai do /impeccable.
 */
export default function App() {
  const [arquiteturaId, setArquiteturaId] = useState(ARQUITETURAS[0].id);
  const arquitetura = ARQUITETURAS.find((a) => a.id === arquiteturaId) ?? ARQUITETURAS[0];
  const [movimento, setMovimento] = useState<Movimento>(arquitetura.movimento);
  const [fusoIndice, setFusoIndice] = useState(0);
  const [zero, setZero] = useState(false);

  const fonte = useMemo<FonteTempo>(
    () => (zero ? { tipo: 'congelada', instante: POSICAO_ZERO } : { tipo: 'ao-vivo' }),
    [zero],
  );
  const { instante: i, angulos, epocaMs } = useRelogio({ fonte, movimento, fuso: FUSOS_RAPIDOS[fusoIndice].fuso });
  const telaAcesa = useWakeLock();

  const zonaProibida = naZonaProibida(i.hora, arquitetura.zonaProibida);

  return (
    <main className="min-h-screen bg-black p-6 font-mono text-white">
      <h1 className="mb-4 text-xl">SetMyWatch: dados do motor</h1>

      <div className="mb-6 flex flex-wrap gap-3">
        <select
          className="bg-neutral-900 p-2"
          value={arquiteturaId}
          onChange={(e) => {
            const nova = ARQUITETURAS.find((a) => a.id === e.target.value)!;
            setArquiteturaId(nova.id);
            setMovimento(nova.movimento);
          }}
        >
          {ARQUITETURAS.map((a) => (
            <option key={a.id} value={a.id}>{a.nome}</option>
          ))}
        </select>
        <select
          className="bg-neutral-900 p-2"
          value={String(movimento)}
          onChange={(e) => setMovimento(MOVIMENTOS.find((m) => String(m.valor) === e.target.value)!.valor)}
        >
          {MOVIMENTOS.map((m) => (
            <option key={m.valor} value={String(m.valor)}>{m.rotulo}</option>
          ))}
        </select>
        <select className="bg-neutral-900 p-2" value={fusoIndice} onChange={(e) => setFusoIndice(Number(e.target.value))}>
          {FUSOS_RAPIDOS.map((f, idx) => (
            <option key={f.rotulo} value={idx}>{f.rotulo}</option>
          ))}
        </select>
        <button className="bg-neutral-900 p-2" onClick={() => setZero((z) => !z)}>
          {zero ? 'Voltar ao vivo' : 'Posição zero'}
        </button>
        {telaAcesa.suportado && (
          <button
            className="bg-neutral-900 p-2"
            onClick={() => (telaAcesa.ativo ? telaAcesa.desativar() : telaAcesa.ativar())}
          >
            {telaAcesa.ativo ? 'Tela acesa: ligado' : 'Manter tela acesa'}
          </button>
        )}
      </div>

      <dl className="grid max-w-xl grid-cols-2 gap-x-6 gap-y-1">
        <dt>Hora</dt>
        <dd>{doisDigitos(i.hora)}:{doisDigitos(i.minuto)}:{doisDigitos(i.segundo)}</dd>
        <dt>Data</dt>
        <dd>{DIAS[i.diaSemana]}, {doisDigitos(i.dia)}/{doisDigitos(i.mes)}/{i.ano}</dd>
        <dt>Dias no mês</dt>
        <dd>{diasNoMes(i.ano, i.mes)}</dd>
        <dt>Ciclo bissexto</dt>
        <dd>{rotuloCicloBissexto(i.ano)}</dd>
        <dt>Fase da lua</dt>
        <dd>{(fracaoLunar(epocaMs) * 100).toFixed(1)}%</dd>
        <dt>Zona proibida</dt>
        <dd className={zonaProibida ? 'text-red-500' : ''}>
          {zonaProibida ? 'SIM, não use o passe rápido' : 'não'}
        </dd>
        <dt>Próximo :00 em</dt>
        <dd>{Math.ceil(msAteProximoMinuto(i) / 1000)} s</dd>
        {Object.entries(angulos).map(([nome, graus]) => (
          <div key={nome} className="contents">
            <dt className="text-neutral-400">ângulo {nome}</dt>
            <dd className="text-neutral-400">{graus.toFixed(2)}°</dd>
          </div>
        ))}
      </dl>
    </main>
  );
}
