import { ConfoundingSim } from '../../components/interactives/ConfoundingSim';
import { Callout } from '../../components/ui/Callout';
import { DagFigure } from '../../components/viz/DagDrawing';
import { Formula, Section, Table, TryIt, Worked } from '../LessonKit';

export default function Confounding() {
  return (
    <>
      <Section id="definition" title="What confounding is">
        <p>
          Confounding is bias caused by a <strong>common cause</strong> of exposure and outcome: structurally, an open backdoor path. A confounder is a variable you can condition on to block that path.
        </p>
        <DagFigure
          title="Confounding by smoking"
          height={130}
          nodes={[{ id: 'S', label: 'Smoking', x: 50, y: 0 }, { id: 'C', label: 'Coffee', x: 2, y: 100, role: 'exposure' }, { id: 'M', label: 'MI', x: 98, y: 100, role: 'outcome' }]}
          edges={[{ from: 'S', to: 'C' }, { from: 'S', to: 'M' }, { from: 'C', to: 'M', tone: 'faded' }]}
          caption="Even if coffee had no effect (faded arrow), coffee drinkers would have more MIs because they smoke more."
        />
        <p>
          The traditional checklist — "associated with exposure, associated with outcome, not on the causal pathway" — is a useful screen but not a definition. A pre-exposure collider can satisfy all three (M-bias) and adjusting for it introduces bias; the DAG resolves such cases.
        </p>
      </Section>

      <Section id="stratification" title="Seeing confounding in data">
        <p>Stratify on the suspected confounder and compare:</p>
        <ul>
          <li><strong>Stratum estimates similar to each other but different from the crude</strong> → the crude estimate was confounded; report an adjusted estimate.</li>
          <li><strong>Stratum estimates different from each other</strong> → effect modification (Module 8); report them separately.</li>
          <li>Both can occur at once.</li>
        </ul>
        <p>The Mantel–Haenszel estimator pools stratum-specific risk ratios with weights that work even when strata are sparse:</p>
        <Formula>RR_MH = Σᵢ (aᵢ·n₀ᵢ / Nᵢ) / Σᵢ (cᵢ·n₁ᵢ / Nᵢ)</Formula>
        <Worked title="Mantel–Haenszel by hand">
          <p>Stratum 1: 20/100 exposed vs 10/100 unexposed had the outcome (RR 2). Stratum 2: 30/100 vs 10/100 (RR 3).</p>
          <p>Numerator = 20·100/200 + 30·100/200 = 10 + 15 = 25. Denominator = 10·100/200 + 10·100/200 = 10. RR_MH = 2.5.</p>
        </Worked>
        <TryIt title="build confounding from its parts" lab={{ to: '/confounding-lab', label: 'Open the Confounding Lab' }}>
          <ConfoundingSim />
        </TryIt>
      </Section>

      <Section id="simpson" title="Simpson's paradox">
        <p>
          When the confounder is strongly related to both exposure and outcome, the crude association can reverse. Load "Confounding by indication" above: a drug that lowers risk by 30% in every severity stratum looks harmful overall because severe patients are treated more often. The arithmetic alone cannot tell you which estimate is right — the causal structure can. If severity were a <em>consequence</em> of treatment, stratifying on it would be wrong.
        </p>
      </Section>

      <Section id="control" title="Controlling confounding">
        <Table
          head={['Method', 'Stage', 'Handles unmeasured confounders?', 'Caveats']}
          rows={[
            ['Randomisation', 'Design', 'Yes, on average', 'Chance imbalance in small trials; not always ethical or feasible'],
            ['Restriction', 'Design', 'Only for the restricted factor', 'Limits generalisability; residual confounding within broad categories'],
            ['Matching', 'Design', 'No', 'In case–control studies requires a matched analysis and does not itself remove confounding'],
            ['Stratification / standardisation', 'Analysis', 'No', 'Few confounders before strata become sparse'],
            ['Multivariable regression', 'Analysis', 'No', 'Model misspecification; OR/HR non-collapsibility'],
            ['Propensity scores (match, weight, stratify)', 'Analysis', 'No', 'Check overlap (positivity) and balance'],
            ['G-methods (IPW, g-formula)', 'Analysis', 'No', 'Needed when confounders are affected by earlier treatment'],
            ['Instrumental variables, negative controls, self-controlled designs', 'Design/analysis', 'Partly, under strong assumptions', 'Assumptions often untestable'],
          ]}
        />
        <Callout kind="pitfall" title="Change-in-estimate with odds ratios">
          The OR and HR are non-collapsible: adjusting for a strong risk factor changes them even with no confounding (e.g. in a randomised trial). Use the DAG, not the size of the change, to choose covariates.
        </Callout>
      </Section>

      <Section id="residual" title="Residual and unmeasured confounding">
        <p>
          Adjustment removes confounding only by the variables measured, as well as they were measured. Smoking recorded as ever/never leaves confounding by intensity and duration. When important confounders are missing, quantify how strong they would have to be — the E-value (Module 10) — and prefer designs that sidestep them: active comparators, new users, self-controlled comparisons.
        </p>
      </Section>
    </>
  );
}
