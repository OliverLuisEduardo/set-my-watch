import { useEffect, useRef, useState } from 'react';
import { calcularAngulos, quantizarMs, type Angulos } from '@/motor/angulos';
import { resolverInstante } from '@/motor/tempo';
import type { FonteTempo, Instante, Movimento } from '@/motor/tipos';

interface Opcoes {
  fonte: FonteTempo;
  movimento: Movimento;
  /** Fuso IANA; sem fuso, usa o do sistema. */
  fuso?: string;
}

export interface EstadoRelogio {
  instante: Instante;
  angulos: Angulos;
  /** Momento mostrado, em ms desde a época (para fase da lua e afins). */
  epocaMs: number;
}

function epocaMostrada(fonte: FonteTempo, agora: number): number {
  switch (fonte.tipo) {
    case 'ao-vivo':
      return agora;
    case 'deslocada':
      return agora + fonte.deslocamentoMs;
    case 'congelada': {
      const i = fonte.instante;
      return Date.UTC(i.ano, i.mes - 1, i.dia, i.hora, i.minuto, i.segundo, i.ms);
    }
  }
}

function calcular({ fonte, movimento, fuso }: Opcoes): EstadoRelogio {
  const agora = Date.now();
  const instante = resolverInstante(fonte, agora, fuso);
  return { instante, angulos: calcularAngulos(instante, movimento), epocaMs: epocaMostrada(fonte, agora) };
}

/** Chave do passo atual: só re-renderiza quando algum ponteiro anda. */
function chave(i: Instante, movimento: Movimento): string {
  return `${i.ano}-${i.mes}-${i.dia}-${i.hora}-${i.minuto}-${i.segundo}-${quantizarMs(i.ms, movimento)}`;
}

/**
 * Motor de tempo real: um único loop requestAnimationFrame para todos os
 * movimentos. O quartzo re-renderiza 1 vez por segundo, o mecânico de 8 passos
 * 8 vezes, o contínuo a cada quadro.
 */
export function useRelogio(opcoes: Opcoes): EstadoRelogio {
  const { fonte, movimento, fuso } = opcoes;
  const [estado, setEstado] = useState(() => calcular(opcoes));
  const ultimaChave = useRef('');

  useEffect(() => {
    let quadro = 0;
    const passo = () => {
      const novo = calcular({ fonte, movimento, fuso });
      const k = chave(novo.instante, movimento);
      if (k !== ultimaChave.current) {
        ultimaChave.current = k;
        setEstado(novo);
      }
      // Hora congelada não precisa de loop.
      if (fonte.tipo !== 'congelada') quadro = requestAnimationFrame(passo);
    };
    ultimaChave.current = '';
    passo();
    return () => cancelAnimationFrame(quadro);
  }, [fonte, movimento, fuso]);

  return estado;
}
