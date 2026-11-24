# SetMyWatch

PWA de consulta rápida para acertar relógios analógicos na bancada: hora, data, dia da semana, indicador de 24h, ciclo de bissexto, fase da lua e segundo fuso, com aviso de zona proibida para o passe rápido de data. Roda 100% no navegador, sincronizado com o relógio do sistema operacional.

Mesmo padrão dos apps do [oliverops-apps](https://github.com/oliverluiseduardo/oliverops-apps): React 18 + Vite 5 + TypeScript + Tailwind 3, Vitest, ESLint 9, frontend no Cloudflare Pages.

## Estrutura

| Parte | Onde |
|---|---|
| Motor (funções puras, testadas) | `src/motor/` |
| Loop de tempo real (`requestAnimationFrame`) e Wake Lock | `src/hooks/` |
| Interface | `src/App.tsx` e `src/components/` (mostrador SVG como folha técnica de calibre; temas Folha e Bancada) |
| Produto e sistema visual | [PRODUCT.md](PRODUCT.md), [DESIGN.md](DESIGN.md) |
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

No ar em https://setmywatch.oliverops.com.br (projeto `setmywatch` do Cloudflare Pages, também em https://setmywatch.pages.dev). O domínio é um CNAME com proxy na zona `oliverops.com.br` apontando para `setmywatch.pages.dev`.

Push na `main` roda o portão (lint, typecheck, testes, build) e publica `dist/` no Pages. O job de deploy precisa do segredo `CLOUDFLARE_API_TOKEN` no repositório; sem ele, avisa e é pulado.

Deploy manual, com o token lido do BWS pelo `scripts/cloudflare/cf.ps1` (nunca impresso):

```powershell
npm run build
. ./scripts/cloudflare/cf.ps1
$ErrorActionPreference = 'Continue'
$env:CLOUDFLARE_API_TOKEN = $script:CfToken; $env:CLOUDFLARE_ACCOUNT_ID = $script:AccountId
npx wrangler@3.114.17 pages deploy dist --project-name setmywatch --branch main --commit-hash (git rev-parse HEAD)
Remove-Item Env:CLOUDFLARE_API_TOKEN
```
