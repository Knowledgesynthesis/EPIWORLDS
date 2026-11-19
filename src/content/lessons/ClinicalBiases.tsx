import { ImmortalTime, LeadTime } from '../../components/interactives/TimeBiases';
import { Callout } from '../../components/ui/Callout';
import { Section, Table, TryIt } from '../LessonKit';

export default function ClinicalBiases() {
  return (
    <>
      <Section id="time-zero" title="Time zero: the source of self-inflicted bias">
        <p>
          In a trial, three things happen at once: eligibility is confirmed, treatment is assigned, and follow-up starts. Many observational biases come from letting these drift apart (Hernán et al. 2016). Emulating the trial's time zero prevents them.
        </p>
      </Section>

      <Section id="immortal" title="Immortal time bias">
        <p>
          If "users" are defined by something that happens after follow-up starts — a first prescription, a transplant, an award — they must survive until that event to be classified as users. The event-free waiting time is "immortal", and crediting it to the exposed group makes the exposure look protective. A study of statins and diabetes progression showed an apparent large benefit that vanished with correct time-varying classification (Lévesque et al. 2010).
        </p>
        <TryIt title="a drug with no effect that looks protective" lab={{ to: '/bias-lab?tab=time', label: 'Open in the Bias Lab' }}>
          <ImmortalTime />
        </TryIt>
      </Section>

      <Section id="indication" title="Confounding by indication and the healthy user">
        <p>
          Patients receive treatments <em>because</em> of their prognosis. Comparing users with non-users therefore compares different patients: sicker ones (confounding by indication) or — for preventive drugs — healthier, more adherent ones (healthy-user and healthy-adherer effects). Postmenopausal hormone therapy looked cardioprotective in cohorts but not in the WHI trial; re-analysing the Nurses' Health Study as an emulated trial of <em>new</em> users largely reconciled the two (Hernán et al. 2008).
        </p>
        <p>
          Best defence: a <strong>new-user, active-comparator</strong> design — compare initiators of drug A with initiators of drug B for the same indication, with covariates measured before initiation (Ray 2003).
        </p>
      </Section>

      <Section id="protopathic" title="Protopathic bias (reverse causation)">
        <p>
          Early symptoms of an undiagnosed disease prompt a prescription, so the drug appears to cause the disease (analgesics before a cancer diagnosis, iron before colorectal cancer). Lag the exposure: ignore exposure in a window before diagnosis long enough to cover the prodromal period.
        </p>
      </Section>

      <Section id="screening" title="Screening biases">
        <TryIt title="lead time without benefit">
          <LeadTime />
        </TryIt>
        <ul>
          <li><strong>Lead-time bias</strong> — earlier diagnosis lengthens survival from diagnosis without delaying death.</li>
          <li><strong>Length-time bias</strong> — slow-growing tumours are longer in the detectable phase and so over-represented among screen-detected cases.</li>
          <li><strong>Overdiagnosis</strong> — detection of disease that would never have caused harm; inflates incidence and survival (Welch & Black 2010).</li>
        </ul>
        <p>The unbiased comparison is mortality in populations randomised to screening or not.</p>
      </Section>

      <Section id="rtm" title="Regression to the mean">
        <p>
          Patients enrolled because a measurement was extreme (blood pressure, HbA1c, pain score) will on average be less extreme next time, treatment or not, because part of the first value was random fluctuation. Uncontrolled before–after studies mistake this for benefit. Use a randomised control group, average several baseline readings, or adjust for baseline (Barnett et al. 2005).
        </p>
      </Section>

      <Section id="summary" title="Summary">
        <Table
          head={['Bias', 'Mechanism', 'Fix']}
          rows={[
            ['Immortal time', 'Exposure defined after time zero', 'Time-varying exposure; landmark; target trial'],
            ['Prevalent user', 'Survivors of early treatment; covariates affected by treatment', 'New-user design'],
            ['Confounding by indication', 'Prognosis drives treatment', 'Active comparator; adjust for indication severity'],
            ['Healthy adherer', 'Adherence marks healthy behaviour', 'Compare adherers with adherers (e.g. to placebo)'],
            ['Protopathic', 'Prodrome prompts exposure', 'Lag period'],
            ['Lead/length time, overdiagnosis', 'Earlier and indolent detection', 'Randomised mortality endpoints'],
            ['Regression to the mean', 'Selection on extreme noisy values', 'Control group; repeated baseline'],
          ]}
        />
        <Callout kind="info" title="Assessment tools">ROBINS-I V2 (2024) added explicit signalling questions on immortal time — use it to appraise such studies.</Callout>
      </Section>
    </>
  );
}
