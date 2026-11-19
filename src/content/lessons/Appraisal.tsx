import { EValueCalculator } from '../../components/interactives/EValueCalculator';
import { Callout } from '../../components/ui/Callout';
import { Formula, Section, Table, TryIt } from '../LessonKit';

export default function Appraisal() {
  return (
    <>
      <Section id="framework" title="A ten-step reasoning framework">
        <p>Work through any causal claim — in a paper, a guideline or your own protocol — in this order:</p>
        <ol>
          <li><strong>Question</strong>: population, intervention/exposure, comparator, outcome, time horizon.</li>
          <li><strong>Estimand</strong>: which causal contrast (ITT, per-protocol, total, direct)? On which scale?</li>
          <li><strong>Design</strong>: how were people sampled; is there a clear time zero?</li>
          <li><strong>DAG</strong>: draw common causes, mediators and selection nodes.</li>
          <li><strong>Adjustment</strong>: does the adjustment set satisfy the backdoor criterion? Any mediators or colliders adjusted?</li>
          <li><strong>Selection</strong>: who was excluded or lost, and could that depend on exposure and outcome?</li>
          <li><strong>Measurement</strong>: how accurately were exposure, outcome and confounders measured — differentially?</li>
          <li><strong>Precision</strong>: what range of effects does the CI allow? Multiplicity?</li>
          <li><strong>Sensitivity</strong>: how strong would unmeasured bias need to be (E-value, QBA)? Do alternative analyses agree?</li>
          <li><strong>Synthesis</strong>: does the totality of evidence — across designs with different biases — point the same way?</li>
        </ol>
      </Section>

      <Section id="hill" title="Bradford Hill's considerations, read correctly">
        <p>Hill (1965) offered nine "viewpoints", explicitly not criteria. Modern reading:</p>
        <Table
          head={['Consideration', 'Useful because…', 'But…']}
          rows={[
            ['Temporality', 'Cause must precede effect', 'The only necessary condition'],
            ['Strength', 'Strong associations are harder to explain by modest confounding', 'Weak effects can be causal; strong ones can be confounded'],
            ['Consistency', 'Replication across settings', 'Shared biases replicate too'],
            ['Biological gradient', 'Dose–response supports causation', 'Confounders can also have gradients; thresholds exist'],
            ['Plausibility / coherence', 'Fits known biology', 'Limited by current knowledge'],
            ['Experiment', 'Removing exposure reduces outcome', 'Strongest when randomised'],
            ['Specificity, analogy', 'Occasionally helpful', 'Weak; most exposures have many effects'],
          ]}
        />
      </Section>

      <Section id="sensitivity" title="How strong would unmeasured confounding need to be?">
        <p>The E-value is the minimum strength of association, on the risk-ratio scale, that an unmeasured confounder would need with both exposure and outcome to fully explain away an estimate (VanderWeele & Ding 2017):</p>
        <Formula>E = RR + √(RR × (RR − 1)) (use 1/RR when RR &lt; 1; apply to the CI limit nearest 1)</Formula>
        <TryIt title="E-value calculator" lab={{ to: '/calculators?tab=evalue', label: 'Open in Calculators' }}>
          <EValueCalculator />
        </TryIt>
        <Callout kind="pitfall" title="Interpreting E-values">
          A large E-value does not prove causation; it addresses only unmeasured confounding, not selection or measurement bias. Compare it with the strength of the strongest measured confounders in the field.
        </Callout>
      </Section>

      <Section id="triangulation" title="Triangulation and negative controls">
        <p>
          Confidence grows when approaches with <em>different and unrelated</em> sources of bias agree — a cohort, a sibling comparison, Mendelian randomisation, a trial (Lawlor et al. 2016). Negative-control exposures or outcomes (which should show no association if the analysis is unbiased) detect residual confounding.
        </p>
      </Section>

      <Section id="tools" title="Risk of bias, certainty and reporting standards">
        <Table
          head={['Purpose', 'Tool (current version)']}
          rows={[
            ['Risk of bias — randomised trial', 'RoB 2 (2019)'],
            ['Risk of bias — non-randomised study of an intervention', 'ROBINS-I V2 (launched Nov 2024; adds algorithms, triage and immortal-time items)'],
            ['Certainty of a body of evidence', 'GRADE; with ROBINS-I, non-randomised evidence starts high and is rated down (GRADE guidance 18, 2019)'],
            ['Report a randomised trial / its protocol', 'CONSORT 2025 (30 items) / SPIRIT 2025 (34 items)'],
            ['Report an observational study', 'STROBE (2007; extensions incl. STROBE-Equity 2025)'],
            ['Report a target trial emulation', 'TARGET (2025, 21 items)'],
            ['Report a systematic review', 'PRISMA 2020'],
            ['Report diagnostic accuracy', 'STARD 2015 (STARD-AI 2025 for AI tests)'],
            ['Report a prediction model', 'TRIPOD+AI (2024)'],
          ]}
        />
        <p>Reporting guidelines make a study appraisable; they are not quality scores. A perfectly reported study can still be badly biased.</p>
      </Section>
    </>
  );
}
