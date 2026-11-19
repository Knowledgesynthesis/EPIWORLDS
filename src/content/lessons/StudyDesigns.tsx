import { Link } from 'react-router-dom';
import { DesignChooser } from '../../components/interactives/DesignChooser';
import { Callout } from '../../components/ui/Callout';
import { Section, Table, TryIt } from '../LessonKit';

export default function StudyDesigns() {
  return (
    <>
      <Section id="sampling" title="A design is defined by how people are sampled">
        <p>
          Forget "prospective" and "retrospective" — they describe when data were collected, not the design. Ask instead: <strong>who decided the exposure, and on what basis were participants selected?</strong>
        </p>
        <Table
          head={['Design', 'Exposure assigned by', 'Participants sampled on', 'Directly estimates']}
          rows={[
            ['Randomised trial', 'Investigator, by chance', 'Eligibility', 'Risks, RR, RD, HR'],
            ['Cohort', 'Life / clinicians', 'Exposure or a source population', 'Risks, rates, RR, RD, HR'],
            ['Case–control', 'Life / clinicians', 'Outcome', 'Odds ratio'],
            ['Cross-sectional', 'Life / clinicians', 'Nothing (a snapshot)', 'Prevalence, prevalence ratios'],
            ['Ecologic', 'Groups', 'Groups', 'Group-level associations'],
          ]}
        />
      </Section>

      <Section id="rct" title="Randomised trials">
        <p>
          Randomisation makes the treatment groups <strong>exchangeable on average</strong>: any difference in prognosis at baseline, measured or not, arises by chance and is reflected in the confidence interval. Three things protect that advantage:
        </p>
        <ul>
          <li><strong>Allocation concealment</strong> — nobody enrolling patients can foresee the next assignment. Always achievable; its absence is associated with exaggerated effects (Schulz & Grimes 2002).</li>
          <li><strong>Blinding</strong> of participants, clinicians and outcome assessors where feasible. Report exactly who was blinded; "double-blind" is interpreted inconsistently (Devereaux et al. 2001).</li>
          <li><strong>Complete follow-up</strong> and analysis by <strong>intention to treat</strong> (as randomised). The per-protocol effect requires adjustment for post-randomisation confounding, not just excluding non-adherers.</li>
        </ul>
        <p>
          Trials are reported with <strong>CONSORT 2025</strong> (30 items, including a new open-science section) and planned with <strong>SPIRIT 2025</strong> (34 protocol items).
        </p>
      </Section>

      <Section id="cohort" title="Cohort studies">
        <p>
          A cohort is a group followed from a defined <strong>time zero</strong>. Whether data are collected going forward or extracted from existing records, the logic is the same: classify exposure at baseline (or as it changes) and count outcomes. Cohorts establish temporality and absolute risks, and can study many outcomes. Their main threats are confounding, loss to follow-up, and errors in defining time zero — the source of immortal time and prevalent-user biases (Module 9).
        </p>
      </Section>

      <Section id="case-control" title="Case–control studies: what does the OR estimate?">
        <p>
          Cases and controls must come from the <strong>same source population</strong> (study base): controls should be people who would have become cases in the study had they developed the disease. What the OR estimates depends on how controls are sampled (Knol et al. 2008):
        </p>
        <Table
          head={['Control sampling', 'Controls are…', 'The OR estimates']}
          rows={[
            ['Cumulative (end of follow-up)', 'Non-cases at the end', 'The risk OR; ≈ RR only if the disease is rare'],
            ['Case-base / case–cohort', 'A sample of everyone at baseline', 'The risk ratio — no rare-disease assumption'],
            ['Risk-set (incidence density)', 'Those still at risk when each case occurs', 'The incidence rate ratio — no rare-disease assumption'],
          ]}
        />
        <p>
          A <strong>nested case–control</strong> study uses risk-set sampling inside an established cohort — efficient when exposure measurement is expensive (stored blood, chart abstraction). Doll and Hill's 1950 case–control study of smoking and lung cancer remains the classic example.
        </p>
      </Section>

      <Section id="self-controlled" title="Self-controlled designs">
        <p>
          When an exposure is transient and its effect acute, compare each person with themselves. The <strong>case-crossover</strong> design compares exposure just before the event with earlier control windows; the <strong>self-controlled case series</strong> compares incidence in post-exposure risk windows with other observed time. Both remove confounding by anything constant within a person (genes, chronic disease, socioeconomic status) but need care with time trends and with events that change later exposure.
        </p>
      </Section>

      <Section id="snapshot" title="Cross-sectional and ecologic studies">
        <p>
          Cross-sectional surveys estimate burden (prevalence) and are the standard design for diagnostic accuracy (index test and reference standard in the same patients — STARD 2015). For causal questions they usually cannot establish which came first. Ecologic studies compare groups; an association across countries may not hold for individuals within them (the <strong>ecological fallacy</strong>), and group-level confounding is hard to control.
        </p>
      </Section>

      <Section id="tte" title="Target trial emulation">
        <p>
          When a trial is unavailable, write down the protocol of the trial you would run, then emulate each component with observational data (Hernán & Robins 2016). This prevents self-inflicted biases and makes remaining assumptions explicit:
        </p>
        <Table
          head={['Protocol component', 'What to specify', 'Common error it prevents']}
          rows={[
            ['Eligibility', 'Criteria assessed at time zero only', 'Selecting on post-baseline information'],
            ['Treatment strategies', 'Well-defined strategies (e.g. initiate statin vs not)', 'Vague exposures; prevalent users'],
            ['Assignment', 'Randomised → emulate by adjusting for baseline confounders', 'Ignoring confounding'],
            ['Time zero', 'Eligibility, assignment and follow-up start coincide', 'Immortal time bias'],
            ['Follow-up & outcome', 'Start, end, censoring, outcome definition', 'Differential ascertainment'],
            ['Causal contrast', 'ITT-like or per-protocol', 'Unclear estimand'],
            ['Analysis', 'Methods matching the contrast (e.g. IPW for per-protocol)', 'Adjusting for post-baseline variables'],
          ]}
        />
        <p>
          Report emulations with the <strong>TARGET</strong> guideline (BMJ/JAMA 2025, 21 items). Emulation does not create randomisation: baseline confounding must still be measured and adjusted for.
        </p>
      </Section>

      <Section id="choose" title="Choosing a design">
        <TryIt title="the design chooser" lab={{ to: '/study-designs', label: 'Full design catalogue' }}>
          <DesignChooser />
        </TryIt>
        <Callout kind="pitfall" title="Beware rigid evidence pyramids">
          A well-conducted cohort can give better evidence about rare harms than an underpowered trial, and a case–control study can be the only feasible design for a rare cancer. Judge the specific threats to the specific question — see the <Link to="/study-designs">design catalogue</Link> for each design's threats and reporting guideline.
        </Callout>
      </Section>
    </>
  );
}
