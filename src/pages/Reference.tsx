import { PageHeader } from '../components/PageHeader';
import { RefList } from '../components/RefList';
import { references } from '../data/references';

const formulas: { name: string; formula: string; note: string; ref: string }[] = [
  { name: 'Risk ratio + 95% CI', formula: 'RR = [a/(a+b)]/[c/(c+d)];  exp(ln RR ± 1.96·√(1/a − 1/(a+b) + 1/c − 1/(c+d)))', note: 'Katz log method', ref: 'Katz 1978' },
  { name: 'Odds ratio + 95% CI', formula: 'OR = ad/bc;  exp(ln OR ± 1.96·√(1/a + 1/b + 1/c + 1/d))', note: 'Woolf logit method; add 0.5 to all cells if one is zero', ref: 'Woolf 1955' },
  { name: 'Risk difference + 95% CI', formula: 'RD = p₁ − p₀;  RD − √((p₁−l₁)² + (u₀−p₀)²) to RD + √((u₁−p₁)² + (p₀−l₀)²)', note: 'Newcombe hybrid score; (l, u) are Wilson limits for each proportion', ref: 'Newcombe 1998' },
  { name: 'Wilson interval for p = x/n', formula: '[p + z²/2n ± z·√(p(1−p)/n + z²/4n²)] / (1 + z²/n)', note: 'Score interval; good coverage near 0 and 1', ref: 'Newcombe 1998' },
  { name: 'NNT', formula: 'NNT = 1/|RD|; CI = reciprocals of the RD limits; if the RD CI spans 0: "NNTB x to ∞ to NNTH y"', note: 'State the time horizon', ref: 'Altman 1998' },
  { name: 'OR ↔ RR', formula: 'OR = RR × (1 − r₀)/(1 − r₁)', note: 'OR ≈ RR only for rare outcomes', ref: 'Modern Epidemiology 4e' },
  { name: 'Mantel–Haenszel RR', formula: 'RR_MH = Σ(aᵢn₀ᵢ/Nᵢ)/Σ(cᵢn₁ᵢ/Nᵢ);  Var(ln RR_MH) = Σ[(m₁ᵢn₁ᵢn₀ᵢ − aᵢcᵢNᵢ)/Nᵢ²] / [Σ(aᵢn₀ᵢ/Nᵢ)·Σ(cᵢn₁ᵢ/Nᵢ)]', note: 'Greenland–Robins variance', ref: 'Greenland 1985' },
  { name: 'Mantel–Haenszel OR', formula: 'OR_MH = Σ(aᵢdᵢ/Nᵢ)/Σ(bᵢcᵢ/Nᵢ)', note: 'Robins–Breslow–Greenland variance', ref: 'Robins 1986' },
  { name: 'Selection bias factor', formula: 'OR_observed = OR_true × (s_a·s_d)/(s_b·s_c)', note: 's = probability of selection for each cell', ref: 'Modern Epidemiology 4e' },
  { name: 'Misclassification', formula: 'observed exposed = Se·E_true + (1 − Sp)·U_true;  E_true = (E_obs − (1 − Sp)·N)/(Se + Sp − 1)', note: 'Simple bias analysis', ref: 'Fox 2021' },
  { name: 'Interaction (additive)', formula: 'RERI = RR₁₁ − RR₁₀ − RR₀₁ + 1', note: 'Multiplicative: RR₁₁/(RR₁₀·RR₀₁)', ref: 'Knol 2012' },
  { name: 'E-value', formula: 'E = RR + √(RR(RR − 1)), with RR → 1/RR if RR < 1; common outcome: RR ≈ √OR; RR ≈ (1 − 0.5^√HR)/(1 − 0.5^√(1/HR))', note: 'Apply to the CI limit closest to 1', ref: 'VanderWeele 2017' },
  { name: 'Sample size, two proportions', formula: 'n = [z₁₋α/₂√(2p̄q̄) + z₁₋β√(p₁q₁ + p₀q₀)]²/(p₁ − p₀)² per group', note: 'No continuity correction', ref: 'Fleiss 2003' },
  { name: 'Population attributable fraction', formula: 'PAF = p_c(RR − 1)/RR', note: 'p_c = proportion of cases exposed; use adjusted RR', ref: 'Modern Epidemiology 4e' },
];

const groups: { kind: (typeof references)[number]['kind']; title: string }[] = [
  { kind: 'textbook', title: 'Textbooks' },
  { kind: 'methods', title: 'Methods' },
  { kind: 'guideline', title: 'Reporting guidelines, risk-of-bias tools and GRADE' },
  { kind: 'ethics', title: 'Ethics and regulation' },
  { kind: 'example', title: 'Landmark examples' },
];

export default function Reference() {
  return (
    <div className="space-y-12">
      <PageHeader eyebrow="Reference" title="Formulas & sources">
        Every number in EpiWorlds comes from these formulas, implemented in a unit-tested library and checked against published worked examples. Datasets are synthetic; no patient data are used.
      </PageHeader>

      <section>
        <h2 className="mb-4 text-xl font-semibold">Formula sheet</h2>
        <p className="mb-4 text-sm text-muted-foreground">2×2 notation: exposed a (outcome +), b (outcome −); unexposed c, d; n₁ = a + b, n₀ = c + d, m₁ = a + c, N = total.</p>
        <div className="space-y-2">
          {formulas.map((f) => (
            <div key={f.name} className="rounded-lg border bg-card p-3 sm:p-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="font-semibold">{f.name}</p>
                <p className="text-xs text-muted-foreground">{f.ref}</p>
              </div>
              <p className="formula mt-2 block overflow-x-auto whitespace-pre-wrap text-xs sm:text-sm">{f.formula}</p>
              <p className="mt-1.5 text-xs text-muted-foreground">{f.note}</p>
            </div>
          ))}
        </div>
      </section>

      {groups.map((g) => (
        <section key={g.kind}>
          <h2 className="mb-4 text-xl font-semibold">{g.title}</h2>
          <div className="rounded-xl border bg-card p-4 sm:p-5">
            <RefList ids={references.filter((r) => r.kind === g.kind).map((r) => r.id)} />
          </div>
        </section>
      ))}
    </div>
  );
}
