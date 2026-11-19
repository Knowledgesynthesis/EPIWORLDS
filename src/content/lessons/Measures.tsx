import { Callout } from '../../components/ui/Callout';
import { OrVsRr } from '../../components/interactives/OrVsRr';
import { TwoByTwoCalculator } from '../../components/interactives/TwoByTwoCalculator';
import { Formula, Section, Table, TryIt, Worked } from '../LessonKit';

export default function Measures() {
  return (
    <>
      <Section id="occurrence" title="Measuring occurrence">
        <p>
          Every epidemiologic comparison starts with a measure of how often an outcome occurs. The four you must keep apart differ in their <strong>denominator</strong>:
        </p>
        <Table
          head={['Measure', 'Numerator', 'Denominator', 'Range / units', 'Example']}
          rows={[
            ['Prevalence', 'Existing cases', 'Population at a point (or period)', '0–1', '15% of adults have hypertension'],
            ['Risk (cumulative incidence)', 'New cases during a period', 'People at risk at the start', '0–1, needs a time window', '10-year MI risk 8%'],
            ['Incidence rate', 'New cases', 'Person-time at risk', '0–∞, per unit time', '5 strokes / 1,000 person-years'],
            ['Odds', 'Events', 'Non-events', '0–∞', 'risk 0.2 → odds 0.25'],
          ]}
        />
        <p>
          Prevalence depends on how long people stay ill: a treatment that keeps people alive longer with a disease <em>raises</em> its prevalence. Risk is meaningless without a time frame ("risk of MI" — over 1 year or 10?). Rates handle unequal follow-up because each person contributes only their own time at risk; for rare outcomes over short periods, risk ≈ rate × time.
        </p>
      </Section>

      <Section id="association" title="Comparing groups">
        <p>All measures below use the same 2×2 layout: rows are exposure, columns are outcome.</p>
        <Formula>Exposed: a with outcome, b without (n₁ = a+b) · Unexposed: c with, d without (n₀ = c+d)</Formula>
        <Table
          head={['Measure', 'Formula', 'Null value', 'Answers']}
          rows={[
            ['Risk ratio (RR)', '[a/(a+b)] / [c/(c+d)]', '1', 'How many times higher is the risk?'],
            ['Risk difference (RD)', 'a/(a+b) − c/(c+d)', '0', 'How many extra (or fewer) cases per person?'],
            ['NNT / NNH', '1 / |RD|', '∞', 'How many people treated for one to benefit or be harmed?'],
            ['Odds ratio (OR)', '(a·d) / (b·c)', '1', 'Ratio of odds; the measure case–control studies and logistic regression give'],
            ['Hazard ratio (HR)', 'from survival models', '1', 'Ratio of instantaneous rates among those still at risk'],
          ]}
        />
        <Worked title="a randomised trial">
          <p>Deaths at 1 year: 40 of 500 with the new treatment, 60 of 500 with usual care.</p>
          <ul>
            <li>Risks: 40/500 = 8%; 60/500 = 12%.</li>
            <li>RR = 0.08/0.12 = 0.67 — a 33% relative reduction.</li>
            <li>RD = 0.08 − 0.12 = −0.04 — 4 fewer deaths per 100 treated for a year.</li>
            <li>NNT = 1/0.04 = 25 over one year.</li>
            <li>OR = (40·440)/(460·60) = 0.64 — close to the RR because deaths are fairly uncommon.</li>
          </ul>
        </Worked>
        <Callout kind="tip" title="Relative vs absolute">
          <p>
            Relative measures describe the strength of an association and are often similar across populations. Absolute measures describe impact and depend on baseline risk: the same RR of 0.67 prevents 4 deaths per 100 at 12% baseline risk but only 0.3 per 100 at 1%. Decisions about whom to treat need absolute effects.
          </p>
        </Callout>
      </Section>

      <Section id="or-vs-rr" title="When the odds ratio misleads">
        <p>
          The OR equals the RR × (1 − r₀)/(1 − r₁). When the outcome is rare in both groups the correction factor is close to 1; when it is common, the OR always lies <em>further from 1</em> than the RR. Logistic regression reports ORs, so studies of common outcomes regularly overstate effects when ORs are described as "times the risk".
        </p>
        <TryIt title="watch the OR drift away from the RR">
          <OrVsRr />
        </TryIt>
      </Section>

      <Section id="precision" title="Confidence intervals for each measure">
        <p>Ratio measures are skewed, so their intervals are computed on the log scale and exponentiated:</p>
        <Formula>ln RR ± 1.96·√(1/a − 1/n₁ + 1/c − 1/n₀) (Katz) · ln OR ± 1.96·√(1/a + 1/b + 1/c + 1/d) (Woolf)</Formula>
        <p>
          For the risk difference, the Newcombe hybrid score interval behaves well even with small counts, unlike the simple Wald interval. An NNT interval is the reciprocal of the RD interval; if the RD interval includes 0, report it as "NNTB x to ∞ to NNTH y" (Altman 1998) rather than a negative NNT.
        </p>
        <TryIt title="the 2×2 calculator" lab={{ to: '/calculators', label: 'Open all calculators' }}>
          <TwoByTwoCalculator />
        </TryIt>
      </Section>

      <Section id="hazards" title="A note on hazard ratios">
        <p>
          A hazard ratio compares event rates among people still event-free at each moment. Because the groups being compared change over time (the frail die first), an HR can differ from the causal effect even in a trial, and a single HR averages over a period where hazards may not be proportional. Report cumulative risks or survival curves at clinically relevant times alongside any HR (Hernán 2010).
        </p>
      </Section>
    </>
  );
}
