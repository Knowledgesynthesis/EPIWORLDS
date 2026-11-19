import { useState } from 'react';
import { DagWorkbench } from '../../components/interactives/DagWorkbench';
import { Callout } from '../../components/ui/Callout';
import { DagFigure } from '../../components/viz/DagDrawing';
import { dagPresets } from '../../data/dagPresets';
import { createDagStore } from '../../stores/useDagStore';
import { Formula, Section, Table, TryIt } from '../LessonKit';

export default function CausalDags() {
  const [store] = useState(() => createDagStore(dagPresets[0].workspace, dagPresets[0].id));
  return (
    <>
      <Section id="effects" title="What is a causal effect?">
        <p>
          For each person imagine two <strong>potential outcomes</strong>: Y<sup>a=1</sup> if treated and Y<sup>a=0</sup> if untreated. The individual causal effect compares them, but we only ever observe one. Populations rescue us: the <strong>average causal effect</strong> is E[Y<sup>1</sup>] − E[Y<sup>0</sup>] (or their ratio).
        </p>
        <Formula>Association: E[Y | A=1] − E[Y | A=0] · Causation: E[Y¹] − E[Y⁰]</Formula>
        <p>The two coincide only when the treated and untreated are comparable — which is what the rest of this course is about.</p>
      </Section>

      <Section id="identifiability" title="Three conditions to identify an effect from data">
        <Table
          head={['Condition', 'Meaning', 'How a trial provides it', 'Observational studies']}
          rows={[
            ['Exchangeability', 'Treated and untreated would have had the same risk under the same treatment', 'Randomisation (on average)', 'Must be argued conditional on measured confounders L'],
            ['Positivity', 'Every type of person (every L stratum) has a chance of each treatment', 'Design', 'Check for strata that are always or never treated'],
            ['Consistency', 'The treatment is defined well enough that Y^a is the outcome observed under it', 'Protocol', 'Define the intervention ("start statin at 40 mg"), not a state ("low LDL")'],
          ]}
        />
      </Section>

      <Section id="dag-basics" title="DAGs: three building blocks">
        <p>
          A directed acyclic graph draws assumed causal relations: an arrow means "may directly cause"; a <em>missing</em> arrow claims no direct effect — the strongest assumption in the graph. Acyclic means no variable causes itself; feedback is drawn with time-indexed nodes (BP₁ → Drug₂ → BP₃). Every path between two variables is built from three structures:
        </p>
        <div className="grid gap-3 sm:grid-cols-3">
          <DagFigure title="Chain" height={110} nodes={[{ id: 'X', label: 'X', x: 0, y: 50, role: 'exposure' }, { id: 'M', label: 'M', x: 50, y: 50 }, { id: 'Y', label: 'Y', x: 100, y: 50, role: 'outcome' }]} edges={[{ from: 'X', to: 'M' }, { from: 'M', to: 'Y' }]} caption="Chain (mediation): open; conditioning on M blocks it." />
          <DagFigure title="Fork" height={110} nodes={[{ id: 'C', label: 'C', x: 50, y: 0 }, { id: 'X', label: 'X', x: 0, y: 100, role: 'exposure' }, { id: 'Y', label: 'Y', x: 100, y: 100, role: 'outcome' }]} edges={[{ from: 'C', to: 'X' }, { from: 'C', to: 'Y' }]} caption="Fork (common cause): open; conditioning on C blocks it." />
          <DagFigure title="Collider" height={110} nodes={[{ id: 'X', label: 'X', x: 0, y: 0, role: 'exposure' }, { id: 'Y', label: 'Y', x: 100, y: 0, role: 'outcome' }, { id: 'S', label: 'S', x: 50, y: 100 }]} edges={[{ from: 'X', to: 'S' }, { from: 'Y', to: 'S' }]} caption="Collider: blocked; conditioning on S (or a descendant) opens it." />
        </div>
      </Section>

      <Section id="dsep" title="The rules of d-separation">
        <ol>
          <li>A path is <strong>blocked</strong> if it passes through a non-collider (chain or fork middle) that you condition on.</li>
          <li>A path is <strong>blocked</strong> at any collider you do not condition on, unless you condition on one of its descendants.</li>
          <li>Conditioning on a collider, or a descendant of it, <strong>opens</strong> the path.</li>
          <li>If every path between X and Y is blocked by Z, X and Y are independent given Z in every distribution compatible with the DAG.</li>
        </ol>
        <p>"Conditioning" means anything that holds a variable fixed: stratifying, adjusting in a model, matching, restricting the sample, or selection into the study.</p>
      </Section>

      <Section id="backdoor" title="The backdoor criterion">
        <p>
          A <strong>backdoor path</strong> starts with an arrow into the exposure (X ← …). Open backdoor paths transmit non-causal association: that is confounding. A set Z is sufficient to estimate the total effect of X on Y if:
        </p>
        <ol>
          <li>no variable in Z is a descendant of X, and</li>
          <li>Z blocks every backdoor path from X to Y.</li>
        </ol>
        <p>Procedure: list every path between X and Y → mark backdoor paths → choose variables that block them → check you have not opened a new path through a collider → drop any variable whose removal keeps all paths blocked (minimal set).</p>
        <TryIt title="the DAG workbench" lab={{ to: '/dag-builder', label: 'Open the full DAG Lab' }}>
          <p className="mb-4 text-sm text-muted-foreground">
            Select a variable and press <em>Adjust for it</em>, then <em>Check my adjustment set</em>. Load other examples from the menu — try M-bias and "Several valid sets".
          </p>
          <DagWorkbench store={store} presetIds={['confounding', 'mediator', 'mbias', 'two-sets', 'butterfly']} height={300} />
        </TryIt>
      </Section>

      <Section id="drawing" title="Drawing a useful DAG">
        <ul>
          <li>Include every common cause of <em>any two</em> variables already in the graph, measured or not.</li>
          <li>Arrange nodes in time order; arrows only point forward in time.</li>
          <li>Draw unmeasured variables explicitly (dashed). If they leave a backdoor path open, no adjustment will fix it.</li>
          <li>Justify each arrow — and each missing arrow — with subject-matter knowledge, and publish the DAG with the paper (Tennant et al. 2021).</li>
          <li>A DAG identifies <em>which</em> variables to adjust for; it says nothing about functional form or effect size.</li>
        </ul>
        <Callout kind="pitfall" title="The Table 2 fallacy">
          An adjustment set chosen for exposure X is generally wrong for estimating the effect of any covariate in the same model. Report one effect per model, or build a model per question (Westreich & Greenland 2013).
        </Callout>
      </Section>
    </>
  );
}
