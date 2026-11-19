import { Misclassification } from '../../components/interactives/Misclassification';
import { Callout } from '../../components/ui/Callout';
import { Formula, Section, Table, TryIt, Worked } from '../LessonKit';

export default function InformationBias() {
  return (
    <>
      <Section id="types" title="Types of measurement error">
        <Table
          head={['Term', 'Meaning', 'Typical consequence']}
          rows={[
            ['Non-differential', 'Error in exposure does not depend on outcome (or vice versa)', 'Binary variable, independent errors: expected bias toward the null'],
            ['Differential', 'Error depends on the other variable', 'Bias in either direction'],
            ['Dependent', 'Errors in exposure and outcome are correlated (e.g. same self-report)', 'Can create spurious associations'],
            ['Classical error (continuous)', 'Measured = true + random noise', 'Regression dilution: slope attenuated'],
          ]}
        />
      </Section>

      <Section id="sesp" title="Sensitivity and specificity drive the bias">
        <p>Among truly exposed people, a fraction Se is classified exposed; among the truly unexposed, a fraction 1 − Sp is wrongly classified exposed:</p>
        <Formula>exposed (observed) = Se · exposed (true) + (1 − Sp) · unexposed (true)</Formula>
        <Worked title="non-differential sensitivity loss">
          <p>True: 100/200 cases and 50/200 controls exposed (OR 3.0). Se 0.8, Sp 1.0 in everyone.</p>
          <p>Observed exposed: 80 cases, 40 controls → OR = (80·160)/(120·40) = 2.67 — toward the null.</p>
        </Worked>
        <Callout kind="pitfall" title="An expectation, not a guarantee">
          "Non-differential misclassification biases toward the null" holds on average, for binary variables with independent errors and Se + Sp &gt; 1. A single study can land further from the null by chance; polytomous exposures and dependent errors break the rule (Jurek et al. 2005). Never argue that a positive finding "must be an underestimate".
        </Callout>
      </Section>

      <Section id="differential" title="Differential misclassification in practice">
        <ul>
          <li><strong>Recall bias</strong> — cases search their memory harder (birth defects, cancer). Use records created before the outcome.</li>
          <li><strong>Interviewer bias</strong> — probing differs by case status. Blind interviewers, standardise questions.</li>
          <li><strong>Detection bias</strong> — exposed people are examined more. Classic case: postmenopausal oestrogens cause uterine bleeding, which prompts investigation and uncovers more silent endometrial cancers in users. Blind outcome assessment; apply the same diagnostic work-up to everyone.</li>
        </ul>
        <TryIt title="misclassification simulator" lab={{ to: '/bias-lab?tab=misclassification', label: 'Open in the Bias Lab' }}>
          <Misclassification />
        </TryIt>
      </Section>

      <Section id="outcome" title="Outcome misclassification">
        <p>
          With perfect specificity and the same sensitivity in both groups, every risk is multiplied by Se: the RR is unbiased while risks and the RD are underestimated. False positives (Sp &lt; 1) add the same absolute amount to both groups and pull ratios toward 1 — much more damaging for rare outcomes. Specific outcome definitions (e.g. adjudicated events) are therefore preferred for ratio measures.
        </p>
      </Section>

      <Section id="qba" title="Quantitative bias analysis">
        <p>Given plausible Se and Sp (from validation studies), the observed table can be back-corrected:</p>
        <Formula>exposed (true) = [exposed (observed) − (1 − Sp)·N] / (Se + Sp − 1)</Formula>
        <p>
          Probabilistic bias analysis draws Se and Sp from distributions to propagate uncertainty about them. Report the corrected estimates alongside the conventional ones (Lash et al. 2014).
        </p>
      </Section>
    </>
  );
}
