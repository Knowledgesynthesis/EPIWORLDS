export interface EthicsCase {
  id: string;
  title: string;
  scenario: string;
  question: string;
  options: string[];
  answer: number;
  explanation: string;
  principle: string;
  refs: string[];
}

export const ethicsCases: EthicsCase[] = [
  {
    id: 'placebo',
    title: 'Placebo control when treatment exists',
    scenario: 'A sponsor proposes a 12-month placebo-controlled trial of a new antihypertensive in adults with stage 2 hypertension (mean 165/100 mmHg). Several effective drugs are available.',
    question: 'What is the most defensible design?',
    options: [
      'Proceed with 12-month placebo — placebo gives the cleanest answer',
      'Compare with an effective active drug (or test as add-on to it); restrict any placebo phase to short periods in lower-risk patients with rescue criteria',
      'Proceed if participants sign a waiver',
      'Skip the trial and approve on mechanism',
    ],
    answer: 1,
    explanation: 'Withholding proven treatment for a year exposes participants to risk of serious harm (stroke, MI). The Declaration of Helsinki allows placebo only when no proven intervention exists, or for compelling methodological reasons without additional risk of serious or irreversible harm.',
    principle: 'Beneficence; Helsinki placebo provisions',
    refs: ['helsinki2024', 'cioms2016'],
  },
  {
    id: 'ehr',
    title: 'Consent for a records study',
    scenario: 'You want to study 80,000 electronic health records to compare two anticoagulants. Contacting patients is impracticable, the risk is limited to privacy, and data will be coded with keys held separately.',
    question: 'Which pathway fits U.S. regulations?',
    options: [
      'No review needed — the data already exist',
      'IRB review with a waiver of consent if all 45 CFR 46.116(f) criteria are met, plus privacy safeguards (e.g. HIPAA waiver, security plan)',
      'Individual written consent from every patient is mandatory',
      'Publish the identifiable dataset for transparency',
    ],
    answer: 1,
    explanation: 'Secondary research with identifiable data is human-subjects research. A waiver requires minimal risk, impracticability without the waiver (and without identifiers, if used), no adverse effect on rights and welfare, and debriefing when appropriate.',
    principle: 'Respect for persons; privacy',
    refs: ['commonrule2018'],
  },
  {
    id: 'cluster',
    title: 'Consent in a cluster trial',
    scenario: 'Forty nursing homes will be randomised to a hand-hygiene programme for staff or usual practice. Outcomes are infection rates among residents, taken from routine records.',
    question: 'Whose consent is needed?',
    options: [
      'Only the nursing-home owners, who can consent for everyone',
      'Identify who the research participants are: staff receiving the intervention may need consent; for residents whose routine data are used, a waiver may be justified if criteria are met; gatekeepers can give permission but cannot consent for individuals',
      'Every resident must give written consent before randomisation, or the trial cannot happen',
      'No consent is ever required in cluster trials',
    ],
    answer: 1,
    explanation: 'The Ottawa Statement asks investigators to identify research participants, obtain consent unless a waiver is justified, and distinguish gatekeepers (who protect cluster interests) from consent.',
    principle: 'Respect for persons in cluster designs',
    refs: ['weijer2012'],
  },
  {
    id: 'interim',
    title: 'An exciting interim result',
    scenario: 'At the first interim analysis (30 events), the DSMB sees HR 0.50, P = 0.01. The pre-specified O\'Brien–Fleming boundary requires P < 0.0005 at this look.',
    question: 'What should the DSMB do?',
    options: [
      'Stop now and announce benefit',
      'Continue as planned: the boundary is not crossed, and trials stopped early with few events overestimate benefit',
      'Unblind the investigators so they can decide',
      'Publish the interim result',
    ],
    answer: 1,
    explanation: 'Early stopping at a random high inflates effect estimates (Bassler et al. 2010). Conservative boundaries protect participants and the validity of the answer future patients depend on. Safety signals follow separate rules.',
    principle: 'Beneficence (future patients); scientific validity',
    refs: ['bassler2010'],
  },
  {
    id: 'coi',
    title: 'A financial interest',
    scenario: 'The principal investigator of a device trial holds equity in the manufacturer.',
    question: 'What is required?',
    options: [
      'Nothing, if the IRB approved the protocol',
      'Disclose to the institution, IRB, participants (as policy requires) and journals; manage the conflict, e.g. independent outcome adjudication and analysis, and limits on the investigator\'s role',
      'Keep it confidential to avoid bias in recruitment',
      'Stop the trial immediately',
    ],
    answer: 1,
    explanation: 'Conflicts are not automatically disqualifying but must be disclosed and managed so that they cannot influence design, conduct, analysis or reporting (ICMJE; institutional COI policy).',
    principle: 'Integrity and transparency',
    refs: ['icmje', 'helsinki2024'],
  },
  {
    id: 'switch',
    title: 'Switching the primary outcome',
    scenario: 'After unblinding, the registered primary outcome is null but a secondary outcome is significant. A co-author suggests presenting the secondary outcome as primary.',
    question: 'What is the correct course?',
    options: [
      'Switch — the secondary outcome is more interesting',
      'Report the registered primary outcome as primary; present secondary outcomes as such; disclose and justify any protocol changes',
      'Omit the primary outcome',
      'Re-register the trial with the new primary outcome',
    ],
    answer: 1,
    explanation: 'Outcome switching is selective reporting and biases the literature. CONSORT 2025 requires reporting changes to outcomes after the trial began, with reasons, and its open-science items point to the registration and protocol.',
    principle: 'Research integrity',
    refs: ['consort2025', 'icmje'],
  },
  {
    id: 'posttrial',
    title: 'After the trial ends',
    scenario: 'A multinational trial of a new HIV regimen enrols participants in a low-income country where the regimen will not be available locally after the trial.',
    question: 'What should be in place before the trial starts?',
    options: [
      'Nothing — post-trial access is the government\'s responsibility',
      'Post-trial provisions arranged in advance for participants who still need a beneficial intervention, described in the protocol and consent, with community engagement',
      'Participants should be told only at the end of the trial',
      'Exclude participants who might need ongoing treatment',
    ],
    answer: 1,
    explanation: 'The Declaration of Helsinki (2024) and CIOMS guidelines require post-trial provisions to be planned in advance and disclosed, and emphasise fair distribution of research benefits and burdens.',
    principle: 'Justice',
    refs: ['helsinki2024', 'cioms2016'],
  },
];
