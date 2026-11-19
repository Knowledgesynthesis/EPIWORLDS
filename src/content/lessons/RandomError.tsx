import { PowerCalculator } from '../../components/interactives/PowerCalculator';
import { RepeatedSampling } from '../../components/interactives/RepeatedSampling';
import { Callout } from '../../components/ui/Callout';
import { Formula, Section, TryIt } from '../LessonKit';

export default function RandomError() {
  return (
    <>
      <Section id="two-errors" title="Two kinds of error">
        <p>
          <strong>Random error</strong> is the scatter of estimates you would see if the same study were repeated on new samples. It shrinks as studies grow. <strong>Systematic error</strong> (bias) shifts every repetition in the same direction — confounding, selection and measurement problems — and does not shrink with sample size. Confidence intervals and P values address only the first.
        </p>
      </Section>

      <Section id="ci" title="What a 95% confidence interval means">
        <p>
          If a study were repeated many times and all its assumptions held, 95% of the intervals produced would contain the true value. Any one interval either contains it or not; the useful reading is that the interval spans the effect sizes most <em>compatible</em> with the data. A wide interval crossing the null means "inconclusive", not "no effect".
        </p>
        <TryIt title="run 100 studies at once" lab={{ to: '/study-sandbox', label: 'Open the Study Simulator' }}>
          <RepeatedSampling />
        </TryIt>
      </Section>

      <Section id="p-values" title="P values without the myths">
        <p>The American Statistical Association's 2016 statement sets out six principles:</p>
        <ol>
          <li>P values can indicate how incompatible the data are with a specified statistical model.</li>
          <li>They do not measure the probability that the hypothesis is true, or that the data arose by chance alone.</li>
          <li>Decisions should not rest only on whether P crosses a threshold such as 0.05.</li>
          <li>Proper inference requires full reporting and transparency (no selective reporting of analyses).</li>
          <li>A P value does not measure the size of an effect or the importance of a result.</li>
          <li>By itself, a P value is not a good measure of evidence about a model or hypothesis.</li>
        </ol>
        <Callout kind="pitfall" title="Common misreadings (Greenland et al. 2016)">
          "P = 0.04 means a 4% chance the null is true." "P &gt; 0.05 shows no difference." "Two studies conflict because one is significant and the other is not." All three are wrong — compare the effect estimates and their intervals instead.
        </Callout>
      </Section>

      <Section id="power" title="Power and sample size">
        <p>
          Power is the probability of detecting a specified true effect. For binary outcomes it is driven by the <strong>number of events</strong>: the same relative effect is far easier to detect in a high-risk population. The standard formula for two proportions (normal approximation, equal groups):
        </p>
        <Formula>n per group = [z₁₋α/₂·√(2p̄q̄) + z₁₋β·√(p₁q₁ + p₀q₀)]² / (p₁ − p₀)²</Formula>
        <TryIt title="plan a trial">
          <PowerCalculator />
        </TryIt>
        <p>
          Calculating "observed power" after a null result adds nothing: it is a transformation of the P value. The confidence interval already shows which effects the study could and could not exclude.
        </p>
      </Section>

      <Section id="multiplicity" title="Multiplicity">
        <p>
          Testing k independent true-null hypotheses at α = 0.05 gives a probability of at least one false positive of 1 − 0.95ᵏ — 40% for 10 tests, 64% for 20. Pre-specify one primary outcome, label secondary and subgroup analyses as such, and report every analysis performed.
        </p>
      </Section>
    </>
  );
}
