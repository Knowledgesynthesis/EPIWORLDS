# EpiWorlds — from study design to causation

An interactive course in clinical epidemiology and causal inference. Eleven sequenced modules, five labs and a 78-question bank take a learner from a 2×2 table to target trial emulation, with every number computed by a tested library and every claim linked to its source.

**Live:** https://epiworlds.vercel.app

## What's inside

| # | Module | You will be able to | Interactive |
|---|--------|---------------------|-------------|
| 1 | Measuring disease and association | Compute and interpret risk, rate, odds, RR, RD, OR, NNT with CIs | 2×2 calculator, OR-vs-RR explorer |
| 2 | Study designs | Match designs to questions; know what each estimates | Design chooser |
| 3 | Random error, precision and power | Read CIs and P values correctly; plan sample size | 100-study simulator, power calculator |
| 4 | Causal inference and DAGs | Apply d-separation and the backdoor criterion | DAG workbench |
| 5 | Confounding | Diagnose by stratification; choose a control method | Confounding simulator (Simpson's paradox) |
| 6 | Selection bias | Recognise collider stratification; quantify it | Berkson's bias, loss-to-follow-up simulator |
| 7 | Information bias | Predict and correct misclassification | Se/Sp misclassification simulator |
| 8 | Effect modification and interaction | Assess heterogeneity on both scales; judge subgroup claims | RERI explorer |
| 9 | Time-related and clinical biases | Spot immortal time, confounding by indication, screening biases | Immortal-time and lead-time demos |
| 10 | From association to causation | Appraise causal claims; use E-values and current tools | E-value calculator |
| 11 | Research ethics and integrity | Evaluate proposals against current standards | Ethics case clinic |

Each module has learning objectives, a concise lesson, embedded interactives, checkpoint questions with rationales, takeaways, pitfalls and DOI-linked sources. Progress and mastery are stored locally in the browser.

**Labs:** DAG Lab · Confounding & Effect-Modification Lab · Bias Lab · Study Simulator · Calculators.
**Reference:** study-design catalogue, ethics clinic, 82-term glossary, formula sheet and full bibliography.

## Evidence base

- Methods follow *Modern Epidemiology* (4th ed., 2021) and Hernán & Robins, *Causal Inference: What If*; structural definitions of confounding, selection and measurement bias.
- Standards current to late 2026: CONSORT 2025, SPIRIT 2025, TARGET 2025, STROBE (+ STROBE-Equity 2025), PRISMA 2020, STARD 2015 (+ STARD-AI 2025), TRIPOD+AI 2024, RoB 2, ROBINS-I V2 (2024), GRADE guidance 18, Declaration of Helsinki (Oct 2024), ICH E6(R3) (2025), Common Rule 2018 Requirements.
- All 74 references are listed in `src/data/references.ts`; every DOI was verified against Crossref metadata.

## Correctness

Calculations live in `src/lib` and are unit-tested against published worked examples:

- `epi.ts` — Katz RR, Woolf OR, Newcombe hybrid-score RD (reproduces Newcombe 1998), Altman NNT intervals, Mantel–Haenszel RR/OR with Greenland–Robins and Robins–Breslow–Greenland variances, homogeneity test, RERI, E-values (reproduces VanderWeele & Ding 2017), Fleiss sample size (10% vs 20% → 199/group), misclassification and selection-bias formulas.
- `dag.ts` — path enumeration, d-separation including descendants of colliders, backdoor criterion, minimal sufficient adjustment sets (tested on confounding, mediation, collider, M-bias and butterfly-bias structures).
- `sim.ts` — seeded simulations (CI coverage ≈ 95% without bias, → 0% with confounding as n grows; immortal-time bias).
- `stats.ts` — normal/chi-square distributions, Wilson interval, seeded PRNG.

`scripts/e2e.mjs` renders all 31 routes on desktop and phone in light and dark mode, fails on console errors or horizontal overflow, exercises the DAG Lab, calculators, checkpoints, exam mode, glossary and mobile menu, and verifies the app works offline.

## Development

Requires Node 20+.

```bash
npm install
npm run dev        # http://localhost:5173
npm test           # unit tests (Vitest)
npm run lint
npm run build      # type-check + production build to dist/
npm run test:e2e   # after build; needs Playwright with Chromium
```

Stack: React 19, TypeScript 5.9, Vite 7, Tailwind CSS 3.4, Zustand 5, React Router 7, Lucide icons. Charts are hand-built SVG (no chart library). Routes are code-split; a generated service worker precaches the build so the app works offline after one visit.

```
src/
  lib/            statistics, epidemiology, DAG and simulation code (+ __tests__)
  data/           curriculum, questions, glossary, references, designs, DAG presets, ethics cases
  content/lessons one component per module
  components/     interactives, charts (viz), layout, UI primitives
  pages/          routes
  stores/         theme, progress and DAG workspace (persisted)
docs/             the original product brief and design principles
```

To add a question, append to `src/data/questions.ts` (MCQ or numeric with tolerance; it appears in the module checkpoint and in Practice automatically). To cite a source, add it to `src/data/references.ts` with its DOI.

## Deployment

Vercel builds `npm run build` and serves `dist/`. `vercel.json` rewrites all paths to `index.html` so deep links work, marks hashed assets immutable, and serves `sw.js` uncached so updates propagate.

All datasets are synthetic. MIT License.
