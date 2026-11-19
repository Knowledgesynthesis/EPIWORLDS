export interface Design {
  id: string;
  name: string;
  family: 'Experimental' | 'Observational — individual' | 'Self-controlled' | 'Observational — group' | 'Evidence synthesis';
  sampling: string;
  estimates: string;
  bestFor: string;
  strengths: string[];
  threats: string[];
  guideline: string;
  example: string;
}

export const designs: Design[] = [
  {
    id: 'rct',
    name: 'Randomised controlled trial',
    family: 'Experimental',
    sampling: 'Eligible participants are randomly assigned to strategies, then followed for outcomes.',
    estimates: 'Risks, rates, RD, RR, HR; intention-to-treat and per-protocol effects.',
    bestFor: 'Effects of interventions that can be assigned ethically and feasibly.',
    strengths: ['Exchangeability on average for measured and unmeasured factors', 'Clear time zero and temporality', 'Blinding possible for many interventions'],
    threats: ['Inadequate concealment', 'Unblinded outcome assessment', 'Non-adherence and missing outcomes', 'Narrow eligibility limits transportability', 'Truncation for benefit'],
    guideline: 'CONSORT 2025 (report); SPIRIT 2025 (protocol)',
    example: 'RECOVERY: dexamethasone reduced 28-day mortality in hospitalised COVID-19 patients receiving respiratory support.',
  },
  {
    id: 'cluster',
    name: 'Cluster randomised trial',
    family: 'Experimental',
    sampling: 'Groups (practices, wards, villages) are randomised; outcomes are measured in individuals.',
    estimates: 'Cluster-adjusted effects; needs the intracluster correlation for sample size.',
    bestFor: 'Interventions delivered at group level or with contamination risk (e.g. hygiene programmes, guidelines).',
    strengths: ['Avoids contamination', 'Matches how policies are delivered'],
    threats: ['Few clusters → chance imbalance', 'Recruitment after randomisation → selection bias', 'Ignoring clustering → falsely narrow CIs', 'Consent complexities (Ottawa Statement)'],
    guideline: 'CONSORT extension for cluster trials',
    example: 'Hand-hygiene programmes randomised by nursing home.',
  },
  {
    id: 'cohort',
    name: 'Cohort study',
    family: 'Observational — individual',
    sampling: 'Defined by exposure (or a source population) and followed forward in time — prospectively or using historical records.',
    estimates: 'Risks, rates, RR, RD, HR directly; multiple outcomes per exposure.',
    bestFor: 'Aetiology, prognosis, harms, rare exposures (sample on exposure).',
    strengths: ['Temporality', 'Absolute risks', 'Several outcomes'],
    threats: ['Confounding', 'Loss to follow-up', 'Immortal time and prevalent-user bias if time zero is misaligned', 'Inefficient for rare outcomes'],
    guideline: 'STROBE; TARGET if emulating a trial',
    example: 'British Doctors Study (1951–2001): smoking and mortality.',
  },
  {
    id: 'case-control',
    name: 'Case–control study',
    family: 'Observational — individual',
    sampling: 'Cases with the outcome and controls sampled from the population that gave rise to the cases; past exposure compared.',
    estimates: 'Odds ratio. With risk-set (density) sampling the OR estimates the rate ratio without a rare-disease assumption; with case-base sampling it estimates the RR.',
    bestFor: 'Rare outcomes, long latency, many candidate exposures.',
    strengths: ['Efficient for rare diseases', 'Fast and inexpensive', 'Many exposures studied at once'],
    threats: ['Control selection not representing the source population', 'Recall and interviewer bias', 'Unclear temporality if exposure measured after onset', 'Cannot estimate absolute risk without external data'],
    guideline: 'STROBE',
    example: 'Doll & Hill (1950): smoking and lung cancer.',
  },
  {
    id: 'nested',
    name: 'Nested case–control / case–cohort',
    family: 'Observational — individual',
    sampling: 'Within an existing cohort: all cases plus controls sampled from each risk set (nested) or a random baseline subcohort (case–cohort).',
    estimates: 'Rate ratios (nested); risk or rate ratios (case–cohort), with cohort-based validity.',
    bestFor: 'Costly exposure measurements on stored samples or records.',
    strengths: ['Cohort validity at a fraction of the cost', 'Exposure measured before outcome'],
    threats: ['Sample degradation or batch effects', 'Incorrect analysis of sampled data'],
    guideline: 'STROBE',
    example: 'Biomarker studies using stored blood in large cohorts.',
  },
  {
    id: 'case-crossover',
    name: 'Case-crossover',
    family: 'Self-controlled',
    sampling: 'Cases only: exposure in a hazard window just before the event is compared with control windows in the same person.',
    estimates: 'Odds ratio for transient effects.',
    bestFor: 'Transient exposures with acute effects (triggers of MI, crashes and phone use).',
    strengths: ['Controls all time-invariant confounders', 'Needs only cases'],
    threats: ['Exposure time trends', 'Within-person time-varying confounding', 'Recall of control windows'],
    guideline: 'STROBE',
    example: 'Triggers of myocardial infarction (Maclure 1991).',
  },
  {
    id: 'sccs',
    name: 'Self-controlled case series',
    family: 'Self-controlled',
    sampling: 'Cases only: incidence in post-exposure risk windows vs other observed time in the same people.',
    estimates: 'Relative incidence (rate ratio).',
    bestFor: 'Vaccine and drug safety with well-defined exposure dates.',
    strengths: ['Controls fixed confounders', 'Efficient with routine data'],
    threats: ['Events that change later exposure or end observation', 'Mis-specified risk windows', 'Age/season confounding if not modelled'],
    guideline: 'STROBE',
    example: 'Vaccine safety signal evaluation (Whitaker et al. 2006).',
  },
  {
    id: 'tte',
    name: 'Target trial emulation',
    family: 'Observational — individual',
    sampling: 'Observational data analysed according to the explicit protocol of a hypothetical randomised trial (eligibility, strategies, time zero, follow-up).',
    estimates: 'Observational analogues of ITT and per-protocol effects, as risks over time.',
    bestFor: 'Comparative effectiveness and safety when a trial is unavailable, too slow, or unethical.',
    strengths: ['Prevents self-inflicted biases (immortal time, prevalent users)', 'Makes assumptions explicit'],
    threats: ['Residual confounding — emulation does not create randomisation', 'Measurement of eligibility and confounders in routine data'],
    guideline: 'TARGET (2025); assess with ROBINS-I V2',
    example: 'Nurses\' Health Study re-analysed as a trial of hormone therapy initiation (Hernán et al. 2008).',
  },
  {
    id: 'quasi',
    name: 'Quasi-experimental designs',
    family: 'Observational — group',
    sampling: 'Interrupted time series, difference-in-differences, regression discontinuity, synthetic controls around a policy or threshold.',
    estimates: 'Policy or programme effects under design-specific assumptions (e.g. parallel trends, no manipulation at the cut-off).',
    bestFor: 'Policies, laws and programmes that cannot be randomised.',
    strengths: ['Uses natural variation', 'Often population-wide'],
    threats: ['Co-interventions at the same time', 'Violated parallel trends', 'Autocorrelation ignored'],
    guideline: 'STROBE; design-specific guidance',
    example: 'Smoke-free legislation and hospital admissions for acute coronary events.',
  },
  {
    id: 'cross-sectional',
    name: 'Cross-sectional study',
    family: 'Observational — individual',
    sampling: 'A sample of a population with exposure and outcome measured at one time.',
    estimates: 'Prevalence, prevalence ratio, prevalence odds ratio.',
    bestFor: 'Burden of disease, service planning, hypothesis generation; diagnostic accuracy (with a reference standard).',
    strengths: ['Fast', 'Representative if sampled well'],
    threats: ['Temporality unclear (reverse causation)', 'Prevalence reflects duration (survivors)', 'Non-response'],
    guideline: 'STROBE; STARD 2015 for diagnostic accuracy',
    example: 'NHANES: national prevalence of hypertension and diabetes.',
  },
  {
    id: 'ecologic',
    name: 'Ecologic study',
    family: 'Observational — group',
    sampling: 'Groups (countries, regions, years) as units of analysis.',
    estimates: 'Group-level associations.',
    bestFor: 'Contextual or policy exposures; generating hypotheses quickly from routine data.',
    strengths: ['Cheap, uses routine data', 'Studies exposures that only exist at group level'],
    threats: ['Ecological fallacy', 'Group-level confounding', 'Within-group exposure heterogeneity'],
    guideline: 'STROBE',
    example: 'Cross-national correlations of dietary fat and cancer rates — not confirmed at the individual level.',
  },
  {
    id: 'sr',
    name: 'Systematic review & meta-analysis',
    family: 'Evidence synthesis',
    sampling: 'Studies identified by a reproducible search and eligibility criteria; results pooled when appropriate.',
    estimates: 'Pooled effects with heterogeneity; certainty of evidence (GRADE).',
    bestFor: 'Summarising all evidence for guidelines and decisions.',
    strengths: ['Transparent, comprehensive', 'Explores heterogeneity'],
    threats: ['Garbage in, garbage out (risk of bias in included studies)', 'Publication and reporting bias', 'Inappropriate pooling'],
    guideline: 'PRISMA 2020; RoB 2 / ROBINS-I V2; GRADE',
    example: 'Cochrane reviews.',
  },
];

// ─────────────────────────────── Design chooser (decision tree)

export type ChooserAnswer = Record<string, string>;

export interface ChooserStep {
  id: string;
  question: string;
  options: { value: string; label: string }[];
  /** Show this step only when the predicate holds. */
  when?: (a: ChooserAnswer) => boolean;
}

export const chooserSteps: ChooserStep[] = [
  {
    id: 'goal',
    question: 'What kind of question is it?',
    options: [
      { value: 'intervention', label: 'Effect of an intervention we could assign' },
      { value: 'aetiology', label: 'Effect of an exposure we cannot assign (cause, harm)' },
      { value: 'burden', label: 'How common is it?' },
      { value: 'diagnosis', label: 'How accurate is a test?' },
      { value: 'prognosis', label: 'Predict who will have the outcome' },
      { value: 'synthesis', label: 'What does existing evidence show?' },
    ],
  },
  {
    id: 'randomise',
    question: 'Can participants be randomised ethically and feasibly (equipoise, cost, time)?',
    when: (a) => a.goal === 'intervention',
    options: [
      { value: 'individual', label: 'Yes, individuals' },
      { value: 'cluster', label: 'Yes, but only groups (or contamination risk)' },
      { value: 'no', label: 'No — use existing data' },
      { value: 'policy', label: 'No — it is a policy or law' },
    ],
  },
  {
    id: 'timing',
    question: 'Is the exposure transient with an acute effect (minutes to weeks)?',
    when: (a) => a.goal === 'aetiology',
    options: [
      { value: 'transient', label: 'Yes (e.g. vaccine, heavy exertion, a new drug dose)' },
      { value: 'sustained', label: 'No, sustained or cumulative' },
    ],
  },
  {
    id: 'rarity',
    question: 'Which is rare?',
    when: (a) => a.goal === 'aetiology' && a.timing === 'sustained',
    options: [
      { value: 'outcome', label: 'The outcome' },
      { value: 'exposure', label: 'The exposure' },
      { value: 'neither', label: 'Neither' },
    ],
  },
  {
    id: 'cohortExists',
    question: 'Is there an existing cohort with stored data or samples?',
    when: (a) => a.goal === 'aetiology' && a.timing === 'sustained' && a.rarity === 'outcome',
    options: [
      { value: 'yes', label: 'Yes' },
      { value: 'no', label: 'No' },
    ],
  },
];

export interface ChooserResult {
  designs: string[];
  why: string;
}

export function chooseDesign(a: ChooserAnswer): ChooserResult | null {
  switch (a.goal) {
    case 'intervention':
      if (a.randomise === 'individual') return { designs: ['rct'], why: 'Randomisation removes confounding on average; protect it with concealment, blinding where possible, and complete follow-up.' };
      if (a.randomise === 'cluster') return { designs: ['cluster'], why: 'Randomise clusters to avoid contamination; you will need enough clusters and must account for the intracluster correlation.' };
      if (a.randomise === 'no') return { designs: ['tte', 'cohort'], why: 'Specify the trial you would run and emulate it with a new-user, active-comparator cohort; adjust for baseline confounders and assess residual confounding.' };
      if (a.randomise === 'policy') return { designs: ['quasi'], why: 'Use the policy\'s timing or threshold: interrupted time series, difference-in-differences, or regression discontinuity, with a comparison group.' };
      return null;
    case 'aetiology':
      if (a.timing === 'transient') return { designs: ['sccs', 'case-crossover'], why: 'Self-controlled designs compare each case with themselves at other times, removing fixed confounders.' };
      if (a.timing === 'sustained' && a.rarity === 'outcome') {
        if (a.cohortExists === 'yes') return { designs: ['nested'], why: 'Sample all cases and risk-set controls from the cohort: cohort validity at case–control cost.' };
        if (a.cohortExists === 'no') return { designs: ['case-control'], why: 'Sample on outcome. Controls must represent the population that produced the cases; collect exposure from pre-outcome records where possible.' };
        return null;
      }
      if (a.timing === 'sustained' && a.rarity === 'exposure') return { designs: ['cohort'], why: 'Sample on exposure (e.g. an occupational group) with an internal comparison group.' };
      if (a.timing === 'sustained' && a.rarity === 'neither') return { designs: ['cohort'], why: 'A cohort gives temporality and absolute risks for several outcomes.' };
      return null;
    case 'burden':
      return { designs: ['cross-sectional', 'cohort'], why: 'Prevalence needs a well-sampled cross-sectional survey; incidence needs follow-up of a population at risk.' };
    case 'diagnosis':
      return { designs: ['cross-sectional', 'rct'], why: 'Accuracy: consecutive patients with the index test and a reference standard (STARD 2015). Whether testing improves outcomes is an intervention question — a trial of test-and-treat strategies.' };
    case 'prognosis':
      return { designs: ['cohort'], why: 'Follow a representative inception cohort; develop and externally validate the model, report with TRIPOD+AI.' };
    case 'synthesis':
      return { designs: ['sr'], why: 'Pre-register the protocol, search comprehensively, assess risk of bias, and grade certainty.' };
    default:
      return null;
  }
}
