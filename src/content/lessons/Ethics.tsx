import { Link } from 'react-router-dom';
import { EthicsCase } from '../../components/interactives/EthicsCase';
import { Callout } from '../../components/ui/Callout';
import { ethicsCases } from '../../data/ethicsCases';
import { Section, Table, TryIt } from '../LessonKit';

export default function Ethics() {
  return (
    <>
      <Section id="foundations" title="The documents that govern research">
        <Table
          head={['Document', 'Year (current)', 'Key contribution']}
          rows={[
            ['Nuremberg Code', '1947', 'Voluntary consent is absolutely essential'],
            ['Declaration of Helsinki (WMA)', '1964 → revised Oct 2024', '"Participants" not "subjects"; applies to all involved in research; post-trial provisions; placebo limits; research integrity'],
            ['Belmont Report (US)', '1979', 'Respect for persons, beneficence, justice'],
            ['CIOMS International Ethical Guidelines', '2016', 'Research in low-resource settings, community engagement, health-related data'],
            ['ICH E6(R3) Good Clinical Practice', 'Step 4 Jan 2025 (EU effective Jul 2025)', 'Risk-proportionate, quality-by-design conduct of trials'],
            ['US Common Rule, 45 CFR 46', '2018 Requirements', 'IRB review, consent and waivers, exemptions, single IRB for cooperative research'],
          ]}
        />
      </Section>

      <Section id="belmont" title="Three principles and their applications">
        <Table
          head={['Principle', 'Requires', 'Applied through']}
          rows={[
            ['Respect for persons', 'Treat people as autonomous; protect those with diminished autonomy', 'Informed consent; additional protections'],
            ['Beneficence', 'Do no harm; maximise benefits, minimise risks', 'Risk–benefit assessment; sound design; monitoring'],
            ['Justice', 'Fair distribution of burdens and benefits', 'Fair participant selection; post-trial access; inclusion of under-represented groups'],
          ]}
        />
        <p>An invalid study is unethical in itself: it exposes participants to risk without producing reliable knowledge.</p>
      </Section>

      <Section id="equipoise" title="Equipoise and placebo">
        <p>
          Randomising patients is justified under <strong>clinical equipoise</strong>: honest professional disagreement in the expert community about which option is better (Freedman 1987). The Declaration of Helsinki permits placebo controls only when no proven intervention exists, or when compelling and scientifically sound methodological reasons require it and participants face no additional risk of serious or irreversible harm. Add-on designs (new drug vs placebo on top of standard care) often answer the question without withholding treatment.
        </p>
      </Section>

      <Section id="consent" title="Consent, waivers and review">
        <p>
          Consent requires disclosure, understanding and voluntariness; electronic consent is acceptable if these are preserved. Under the Common Rule an IRB may waive consent only if the research is minimal risk, impracticable without the waiver (and without identifiable data, if used), the waiver will not adversely affect rights and welfare, and participants are given additional information when appropriate (45 CFR 46.116(f)).
        </p>
        <Table
          head={['Review pathway', 'Applies to']}
          rows={[
            ['Exempt (46.104)', 'Specific low-risk categories, e.g. certain educational tests, surveys, secondary research with identifiable data under conditions'],
            ['Expedited (46.110)', 'No more than minimal risk AND on the federal list of eligible categories; minor changes to approved research. Reviewed by the chair or one or more experienced members, to the same standards.'],
            ['Full board', 'Greater than minimal risk, or not eligible for exempt/expedited review'],
          ]}
        />
        <p>
          The 2018 Requirements also removed routine continuing review for most minimal-risk studies and require a single IRB for US cooperative research. HHS has signalled further revisions (rulemaking planned for 2026); the 2018 Requirements remain in force until a final rule takes effect — check OHRP for the current status.
        </p>
      </Section>

      <Section id="monitoring" title="Monitoring, stopping and integrity">
        <ul>
          <li><strong>Data monitoring committees</strong> review unblinded interim data against pre-specified, conservative stopping boundaries. Trials stopped early for benefit with few events systematically overestimate effects (Bassler et al. 2010).</li>
          <li><strong>Registration</strong> before the first participant is enrolled is required by ICMJE journals; outcome switching is selective reporting.</li>
          <li><strong>Conflicts of interest</strong> must be disclosed and managed (e.g. independent adjudication and analysis).</li>
          <li><strong>Open science</strong>: CONSORT 2025 and SPIRIT 2025 include items on registration, protocol access, statistical analysis plans and data sharing.</li>
          <li><strong>Data research</strong>: secondary use of records still needs review, privacy safeguards and transparency; "anonymised" data can sometimes be re-identified.</li>
        </ul>
      </Section>

      <Section id="cases" title="Case clinic">
        <TryIt title="decide, then compare with the standards" lab={{ to: '/ethics', label: 'All ethics cases' }}>
          <div className="space-y-4">
            {ethicsCases.slice(0, 3).map((c) => (
              <EthicsCase key={c.id} c={c} />
            ))}
          </div>
        </TryIt>
        <Callout kind="info" title="More cases">
          Four more cases — interim analyses, conflicts of interest, outcome switching and post-trial access — are in the <Link to="/ethics">Ethics clinic</Link>.
        </Callout>
      </Section>
    </>
  );
}
