import { describe, expect, it } from 'vitest';
import { ARQUITETURAS } from '@/motor/arquiteturas';
import { FUSOS_RAPIDOS } from '@/motor/fusos';
import { IDIOMAS, TEXTOS } from '../textos';

describe('textos por idioma', () => {
  it.each(IDIOMAS.map((i) => i.id))('%s nomeia todos os tipos de mostrador e fusos', (id) => {
    const t = TEXTOS[id];
    for (const a of ARQUITETURAS) {
      expect(t.arquiteturas[a.id]?.rotulo).toBeTruthy();
      expect(t.arquiteturas[a.id]?.nome).toBeTruthy();
    }
    for (const f of FUSOS_RAPIDOS) expect(t.fusos[f.id]).toBeTruthy();
  });

  it.each(IDIOMAS.map((i) => i.id))('%s tem 7 dias, 12 meses e os 4 movimentos', (id) => {
    const t = TEXTOS[id];
    expect(t.dias).toHaveLength(7);
    expect(t.diasCurtos).toHaveLength(7);
    expect(t.diasIniciais).toHaveLength(7);
    expect(t.meses).toHaveLength(12);
    expect(t.mesesIniciais).toHaveLength(12);
    expect(Object.keys(t.movimentos).sort()).toEqual(['1', '6', '8', 'continuo']);
  });
});
