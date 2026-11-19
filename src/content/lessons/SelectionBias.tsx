import { Link } from 'react-router-dom';
import { SelectionSim } from '../../components/interactives/SelectionSim';
import { Callout } from '../../components/ui/Callout';
import { DagFigure } from '../../components/viz/DagDrawing';
import { Formula, Section, Table, TryIt } from '../LessonKit';

export default function SelectionBias() {
  return (
    <>
      <Section id="definition" title="Selection bias is conditioning on a collider">
        <p>
          Selection bias arises when the people analysed are selected (or retained) in a way that depends on both exposure and outcome, or on their causes. The analysis then conditions on a common effect — a collider — and opens a non-causal path (Hernán, Hernández-Díaz & Robins 2004).
        </p>
        <DagFigure
          title="Selection as a collider"
          height={130}
          nodes={[{ id: 'E', label: 'Exposure', x: 2, y: 0, role: 'exposure' }, { id: 'D', label: 'Outcome', x: 98, y: 0, role: 'outcome' }, { id: 'S', label: 'Selected (S = 1)', x: 50, y: 100, adjusted: true }]}
          edges={[{ from: 'E', to: 'S' }, { from: 'D', to: 'S' }]}
          caption="Analysing only S = 1 (boxed) conditions on a collider. Arrows into S can also come from causes of E or D."
        />
      </Section>

      <Section id="forms" title="Recognising it">
        <Table
          head={['Form', 'Mechanism', 'Example']}
          rows={[
            ["Berkson's bias", 'Both conditions raise the chance of admission', 'Inpatient studies of two diseases'],
            ['Differential loss to follow-up', 'Leaving the study depends on exposure and prognosis', 'Patients with side-effects and worsening disease drop out of one arm'],
            ['Self-selection / non-response', 'Participation depends on exposure and outcome', 'Exposed people with symptoms volunteer more'],
            ['Healthy worker effect', 'Health determines entry and retention in work', 'Workers vs general-population mortality'],
            ['Conditioning on survival or a mediator', 'Restricting to those who reached a later stage', 'Birth-weight paradox; "survivor" analyses'],
          ]}
        />
        <Callout kind="info" title="Unrepresentative is not the same as biased">
          A trial of patients under 75 can estimate the effect in under-75s without bias. Whether it applies to older patients is a question of <strong>transportability</strong> (effect modification), not internal validity.
        </Callout>
      </Section>

      <Section id="quantify" title="How much bias?">
        <p>If each cell of the 2×2 table has its own probability of being selected (s<sub>a</sub>…s<sub>d</sub>):</p>
        <Formula>OR_observed = OR_true × (s_a · s_d) / (s_b · s_c)</Formula>
        <p>
          Two consequences: selection that depends only on exposure (s<sub>a</sub> = s<sub>b</sub>, s<sub>c</sub> = s<sub>d</sub>) leaves the OR — and the RR — unbiased; selection that depends only on outcome (s<sub>a</sub> = s<sub>c</sub>, s<sub>b</sub> = s<sub>d</sub>) leaves the OR unbiased, which is exactly why case–control studies work.
        </p>
        <TryIt title="Berkson's bias and loss to follow-up" lab={{ to: '/bias-lab', label: 'Open the Bias Lab' }}>
          <SelectionSim />
        </TryIt>
      </Section>

      <Section id="prevent" title="Preventing and correcting it">
        <ul>
          <li>Choose controls from the same source population as cases; avoid hospital controls with conditions related to the exposure.</li>
          <li>Minimise loss to follow-up and record the predictors of loss (they are needed for correction).</li>
          <li>Use inverse probability of censoring weights or multiple imputation under a stated missing-at-random assumption; add sensitivity analyses for missing-not-at-random.</li>
          <li>Intention-to-treat does not handle missing outcomes — it needs them.</li>
          <li>Never restrict an analysis to a post-exposure subgroup (survivors, responders, a mediator stratum) without drawing the DAG. See the <Link to="/dag-builder">birth-weight paradox in the DAG Lab</Link>.</li>
        </ul>
      </Section>
    </>
  );
}
