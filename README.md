# SetMyWatch

PWA de consulta rápida para acertar relógios analógicos na bancada: hora, data, dia da semana, indicador de 24h, ciclo de bissexto, fase da lua e segundo fuso, com aviso de zona proibida para o passe rápido de data. Roda 100% no navegador, sincronizado com o relógio do sistema operacional.

Mesmo padrão dos apps do [oliverops-apps](https://github.com/oliverluiseduardo/oliverops-apps): React 18 + Vite 5 + TypeScript + Tailwind 3, Vitest, ESLint 9, frontend no Cloudflare Pages.

## Estrutura

| Parte | Onde |
|---|---|
| Motor (funções puras, testadas) | `src/motor/` |
| Loop de tempo real (`requestAnimationFrame`) e Wake Lock | `src/hooks/` |
| Interface | `src/App.tsx` (provisória; a UI definitiva sai do `/impeccable`) |
| PWA e headers do Pages | `public/` |
| CI/CD | `.github/workflows/ci.yml` |

### Motor

- `tempo.ts`: decompõe a hora no fuso pedido via `Intl` (acerta o horário de verão). Fonte de tempo `ao-vivo`, `deslocada` (ex.: 2 min adiantado) ou `congelada` (posição zero).
- `angulos.ts`: ângulo de cada ponteiro e submostrador. O movimento define o passo do ponteiro de segundos: quartzo (1/s), mecânico de 21.600 (6/s) ou 28.800 alt/h (8/s), ou contínuo.
- `calendario.ts`: bissexto gregoriano, dias no mês, ciclo L/+1/+2/+3 e fase da lua (mês sinódico médio).
- `zonaProibida.ts`: faixa em que não se usa o passe rápido de data (padrão 21h–03h).
- `arquiteturas.ts`: tipos genéricos de mostrador (3 ponteiros + data, dia-data, multifunção, perpétuo, GMT). Sem marcas nem modelos: o que muda entre calibres entra como parâmetro.

## Rodar local

```bash
npm install
npm run dev
```

Lockfile: gere com o npm 11, o mesmo do CI (Node 24).

```bash
npm run lint
npm run typecheck
npm test
npm run build
```

## Deploy

Push na `main` roda o portão (lint, typecheck, testes, build) e publica `dist/` no projeto `setmywatch` do Cloudflare Pages. Antes do primeiro deploy:

1. Criar o projeto: `npx wrangler pages project create setmywatch --production-branch main`.
2. Cadastrar o segredo `CLOUDFLARE_API_TOKEN` no repositório (sem ele, o job de deploy avisa e é pulado).
3. Opcional: domínio próprio no painel do Pages.
