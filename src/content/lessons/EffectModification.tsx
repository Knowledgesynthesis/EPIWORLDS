import { EffectModification as Explorer } from '../../components/interactives/EffectModification';
import { Callout } from '../../components/ui/Callout';
import { Formula, Section, Table, TryIt } from '../LessonKit';

export default function EffectModification() {
  return (
    <>
      <Section id="definition" title="Confounding versus effect modification">
        <p>
          <strong>Confounding</strong> is a bias: the crude estimate mixes the effect with a common cause, and you remove it. <strong>Effect modification</strong> is a finding: the effect itself differs across levels of another variable (age, sex, baseline risk, genotype), and you report it. The same variable can be both.
        </p>
      </Section>

      <Section id="scale" title="Effect modification depends on the scale">
        <p>
          If an exposure has a constant risk ratio, its risk difference must vary wherever baseline risk varies — and vice versa. "Is there effect modification?" has no answer until you name the scale.
        </p>
        <Table
          head={['', 'Baseline risk', 'Risk if exposed', 'RR', 'RD per 100']}
          rows={[
            ['Low-risk stratum', '5%', '10%', '2.0', '5'],
            ['High-risk stratum', '20%', '40%', '2.0', '20'],
          ]}
        />
        <p>No modification on the ratio scale; fourfold modification on the difference scale. For decisions — who should be treated, where to target prevention — the additive scale is the one that counts people.</p>
        <TryIt title="effect-modification explorer" lab={{ to: '/confounding-lab?tab=em', label: 'Open in the Confounding & EM Lab' }}>
          <Explorer />
        </TryIt>
      </Section>

      <Section id="measures" title="Measuring interaction">
        <p>With R₀₀ as the reference (neither factor) and RR<sub>ij</sub> = R<sub>ij</sub>/R₀₀:</p>
        <Formula>RERI = RR₁₁ − RR₁₀ − RR₀₁ + 1 · Multiplicative interaction = RR₁₁ / (RR₁₀ · RR₀₁)</Formula>
        <p>
          RERI &gt; 0 means the joint effect exceeds the sum of separate effects (super-additive). Logistic and Cox models test only multiplicative interaction; compute RERI from their coefficients or fit additive models when the public-health question is additive.
        </p>
        <Callout kind="tip" title="How to report (Knol & VanderWeele 2012)">
          Present risks (or RRs with a single common reference) for every combination of the two factors, effects of each factor within strata of the other, and interaction on both additive and multiplicative scales, with confidence intervals.
        </Callout>
      </Section>

      <Section id="credibility" title="Are subgroup effects real?">
        <p>Most claimed subgroup effects do not replicate. ICEMAN (Schandelmaier et al. 2020) asks:</p>
        <ul>
          <li>Was the subgroup hypothesis specified a priori, with its direction?</li>
          <li>Is it one of a small number of hypotheses?</li>
          <li>Is the comparison within studies rather than between studies?</li>
          <li>Does a formal test of interaction support it (not "significant in one, not the other")?</li>
          <li>Is the effect modifier a continuous variable analysed without arbitrary cut-points?</li>
          <li>Is there a plausible mechanism, and is the effect consistent across related outcomes?</li>
        </ul>
        <Callout kind="pitfall" title="Different significance ≠ different effects">
          "Significant in men (P = 0.01), not in women (P = 0.20)" can arise with identical effects and unequal sample sizes. Compare the subgroup estimates directly.
        </Callout>
      </Section>
    </>
  );
}
