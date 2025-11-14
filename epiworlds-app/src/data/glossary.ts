import type { GlossaryTerm } from '../types';

export const glossaryTerms: GlossaryTerm[] = [
  {
    id: 'exposure',
    term: 'Exposure',
    definition:
      'A factor, characteristic, or condition that is hypothesized to influence the occurrence of a health outcome. Can be protective or harmful.',
    synonyms: ['Risk factor', 'Predictor', 'Independent variable'],
    relatedTerms: ['outcome', 'confounder', 'effect-modification'],
    examples: [
      'Smoking (exposure) and lung cancer (outcome)',
      'Physical activity (exposure) and cardiovascular disease (outcome)',
    ],
    category: 'Study Design',
  },
  {
    id: 'outcome',
    term: 'Outcome',
    definition:
      'The health event or condition of interest that is being studied; the dependent variable in epidemiologic research.',
    synonyms: ['Endpoint', 'Dependent variable', 'Disease'],
    relatedTerms: ['exposure', 'incidence', 'prevalence'],
    examples: ['Myocardial infarction', 'Death', 'Hospital readmission'],
    category: 'Study Design',
  },
  {
    id: 'confounder',
    term: 'Confounder',
    definition:
      'A variable that is associated with both the exposure and the outcome, but is not in the causal pathway between them, potentially distorting the true relationship.',
    synonyms: ['Confounding variable', 'Third variable'],
    relatedTerms: ['dag', 'backdoor-path', 'adjustment'],
    examples: [
      'Age confounding the relationship between coffee consumption and heart disease',
      'Socioeconomic status confounding education and health outcomes',
    ],
    category: 'Bias & Confounding',
  },
  {
    id: 'effect-modification',
    term: 'Effect Modification',
    definition:
      'When the magnitude of the effect of an exposure on an outcome differs across levels of a third variable (the effect modifier). Also called interaction.',
    synonyms: ['Interaction', 'Effect measure modification'],
    relatedTerms: ['stratification', 'heterogeneity'],
    examples: [
      'Aspirin prevents MI more effectively in men than women',
      'The effect of smoking on lung cancer differs by asbestos exposure',
    ],
    category: 'Bias & Confounding',
  },
  {
    id: 'dag',
    term: 'Directed Acyclic Graph (DAG)',
    definition:
      'A visual representation of assumed causal relationships between variables, where arrows indicate causal direction and acyclic means no variable can cause itself.',
    synonyms: ['Causal diagram', 'Causal graph'],
    relatedTerms: ['collider', 'mediator', 'backdoor-path', 'confounder'],
    examples: ['DAG showing exposure → outcome with confounders'],
    category: 'Causal Inference',
  },
  {
    id: 'collider',
    term: 'Collider',
    definition:
      'A variable that is causally influenced by two or more other variables in a DAG. Conditioning on a collider opens a non-causal path and introduces bias.',
    synonyms: ['Collision node'],
    relatedTerms: ['dag', 'collider-bias', 'backdoor-path'],
    examples: [
      'Selecting only hospitalized patients (hospital admission is a collider)',
      'Adjusting for a disease that is caused by both exposure and outcome',
    ],
    category: 'Causal Inference',
  },
  {
    id: 'mediator',
    term: 'Mediator',
    definition:
      'A variable that lies in the causal pathway between exposure and outcome, transmitting the effect of the exposure.',
    synonyms: ['Intermediate variable'],
    relatedTerms: ['dag', 'indirect-effect', 'causal-pathway'],
    examples: [
      'Smoking → lung inflammation → cancer',
      'Exercise → weight loss → improved glucose control',
    ],
    category: 'Causal Inference',
  },
  {
    id: 'backdoor-path',
    term: 'Backdoor Path',
    definition:
      'A non-causal path between exposure and outcome that begins with an arrow into the exposure. These paths must be blocked to obtain an unbiased causal effect.',
    synonyms: ['Non-causal path', 'Confounding path'],
    relatedTerms: ['dag', 'confounder', 'adjustment'],
    examples: ['Exposure ← Confounder → Outcome'],
    category: 'Causal Inference',
  },
  {
    id: 'incidence',
    term: 'Incidence',
    definition:
      'The number of new cases of a disease or condition occurring in a defined population during a specified time period.',
    synonyms: ['Incidence rate', 'Attack rate'],
    relatedTerms: ['prevalence', 'risk', 'cohort-study'],
    examples: ['50 new cases of diabetes per 100,000 person-years'],
    category: 'Measures',
  },
  {
    id: 'prevalence',
    term: 'Prevalence',
    definition:
      'The proportion of a population that has a disease or condition at a specific point in time (point prevalence) or during a period (period prevalence).',
    synonyms: ['Prevalence proportion'],
    relatedTerms: ['incidence', 'cross-sectional', 'odds'],
    examples: ['15% of adults have hypertension'],
    category: 'Measures',
  },
  {
    id: 'risk-ratio',
    term: 'Risk Ratio',
    definition:
      'The ratio of the risk (probability) of an outcome in the exposed group to the risk in the unexposed group. Also called relative risk.',
    synonyms: ['Relative risk', 'RR'],
    relatedTerms: ['incidence', 'cohort-study', 'attributable-risk'],
    examples: [
      'RR = 2.5 means the exposed group has 2.5 times the risk',
      'RR = 1.0 means no association',
      'RR < 1.0 means protective effect',
    ],
    category: 'Measures',
  },
  {
    id: 'odds-ratio',
    term: 'Odds Ratio',
    definition:
      'The ratio of the odds of an outcome in the exposed group to the odds in the unexposed group. The primary measure of association in case-control studies.',
    synonyms: ['OR'],
    relatedTerms: ['case-control', 'logistic-regression', 'prevalence'],
    examples: [
      'OR = 3.0 means the odds of exposure are 3 times higher in cases',
      'OR approximates RR when outcome is rare',
    ],
    category: 'Measures',
  },
  {
    id: 'internal-validity',
    term: 'Internal Validity',
    definition:
      'The degree to which a study properly measures the relationship it intends to measure, free from systematic bias.',
    synonyms: ['Study validity'],
    relatedTerms: ['external-validity', 'bias', 'confounding'],
    examples: [
      'Randomization enhances internal validity',
      'Selection bias threatens internal validity',
    ],
    category: 'Validity',
  },
  {
    id: 'external-validity',
    term: 'External Validity',
    definition:
      'The degree to which study results can be generalized to other populations, settings, or time periods.',
    synonyms: ['Generalizability', 'Applicability'],
    relatedTerms: ['internal-validity', 'population', 'sampling'],
    examples: [
      'RCT results may have limited external validity if inclusion criteria are strict',
      'Community-based studies often have better external validity',
    ],
    category: 'Validity',
  },
  {
    id: 'randomization',
    term: 'Randomization',
    definition:
      'The process of randomly allocating participants to treatment or control groups to ensure groups are comparable at baseline and to control for confounding.',
    synonyms: ['Random allocation'],
    relatedTerms: ['rct', 'confounding', 'internal-validity'],
    examples: [
      'Simple randomization using random number table',
      'Block randomization to ensure balance',
      'Stratified randomization by important prognostic factors',
    ],
    category: 'Study Design',
  },
  {
    id: 'blinding',
    term: 'Blinding',
    definition:
      'Keeping study participants, investigators, or outcome assessors unaware of treatment allocation to reduce bias.',
    synonyms: ['Masking'],
    relatedTerms: ['rct', 'placebo', 'bias'],
    examples: [
      'Single-blind: participants unaware of treatment',
      'Double-blind: participants and investigators unaware',
      'Triple-blind: participants, investigators, and analysts unaware',
    ],
    category: 'Study Design',
  },
  {
    id: 'equipoise',
    term: 'Equipoise',
    definition:
      'Genuine uncertainty within the expert medical community about the relative therapeutic merits of intervention options, ethically justifying randomization.',
    synonyms: ['Clinical equipoise', 'Uncertainty principle'],
    relatedTerms: ['ethics', 'rct', 'informed-consent'],
    examples: [
      'Equipoise exists when there is no clear evidence favoring one treatment',
      'Loss of equipoise may require stopping a trial early',
    ],
    category: 'Ethics',
  },
  {
    id: 'counterfactual',
    term: 'Counterfactual',
    definition:
      'What would have happened to the same individual under an alternative exposure scenario; the fundamental concept underlying causal inference.',
    synonyms: ['Potential outcome'],
    relatedTerms: ['causal-effect', 'exchangeability', 'dag'],
    examples: [
      'What would have happened to treated patients if they had not been treated?',
      'The outcome an individual would have experienced under different exposure',
    ],
    category: 'Causal Inference',
  },
  {
    id: 'exchangeability',
    term: 'Exchangeability',
    definition:
      'The assumption that exposed and unexposed groups would have the same outcome distribution if they had the same exposure; essential for causal inference.',
    synonyms: ['Comparability', 'No unmeasured confounding'],
    relatedTerms: ['confounding', 'randomization', 'causal-effect'],
    examples: [
      'Randomization creates exchangeability',
      'Violated by unmeasured confounding',
    ],
    category: 'Causal Inference',
  },
  {
    id: 'stratification',
    term: 'Stratification',
    definition:
      'Dividing the study population into subgroups (strata) based on a third variable to examine or control for its effects.',
    synonyms: ['Subgroup analysis'],
    relatedTerms: ['effect-modification', 'confounding', 'adjustment'],
    examples: [
      'Stratifying by age groups to examine effect modification',
      'Mantel-Haenszel stratified analysis',
    ],
    category: 'Analysis',
  },
];
