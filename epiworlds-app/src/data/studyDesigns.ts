import type { StudyDesign } from '../types';

export const studyDesigns: StudyDesign[] = [
  {
    id: 'rct',
    name: 'Randomized Controlled Trial (RCT)',
    type: 'rct',
    description:
      'An experimental study design where participants are randomly allocated to intervention or control groups to assess causality while minimizing confounding.',
    strengths: [
      'Best protection against confounding through randomization',
      'Establishes temporal relationship between exposure and outcome',
      'Allows for blinding to reduce bias',
      'Strongest evidence for causality',
    ],
    limitations: [
      'Expensive and time-consuming',
      'May have ethical constraints',
      'Limited generalizability (external validity)',
      'Not feasible for all research questions',
      'Requires large sample sizes',
    ],
    examples: [
      'Testing a new antihypertensive drug vs placebo',
      'Comparing surgical vs medical management of CAD',
      'Evaluating effectiveness of a new vaccine',
    ],
    prerequisites: ['Basic probability', 'Study design fundamentals', 'Ethical principles'],
  },
  {
    id: 'cohort',
    name: 'Cohort Study',
    type: 'cohort',
    description:
      'An observational study that follows a group of individuals over time, comparing those exposed vs unexposed to a risk factor to determine outcome incidence.',
    strengths: [
      'Can establish temporal relationship',
      'Can study multiple outcomes',
      'Calculates incidence and relative risk directly',
      'Less prone to recall bias',
      'Good for studying rare exposures',
    ],
    limitations: [
      'Time-consuming and expensive',
      'Loss to follow-up can introduce bias',
      'Inefficient for rare outcomes',
      'Confounding remains a concern',
      'Cannot prove causality',
    ],
    examples: [
      'Framingham Heart Study',
      'Nurses Health Study',
      'Following smokers vs non-smokers for lung cancer',
    ],
    prerequisites: ['Incidence vs prevalence', 'Risk ratios', 'Basic epidemiology'],
  },
  {
    id: 'case-control',
    name: 'Case-Control Study',
    type: 'case-control',
    description:
      'An observational study that identifies individuals with a disease (cases) and without (controls), then looks backward to compare exposure history.',
    strengths: [
      'Efficient for rare outcomes',
      'Quick and relatively inexpensive',
      'Can study multiple exposures',
      'Requires fewer participants',
      'Good for diseases with long latency',
    ],
    limitations: [
      'Cannot calculate incidence or relative risk directly',
      'Prone to recall bias',
      'Difficult to establish temporal relationship',
      'Selection of controls is challenging',
      'More susceptible to bias than cohort studies',
    ],
    examples: [
      'Studying risk factors for pancreatic cancer',
      'Identifying causes of a rare birth defect',
      'Original studies linking smoking to lung cancer',
    ],
    prerequisites: ['Odds ratios', 'Case definition', 'Control selection'],
  },
  {
    id: 'cross-sectional',
    name: 'Cross-Sectional Study',
    type: 'cross-sectional',
    description:
      'An observational study that measures exposure and outcome simultaneously in a population at a single point in time.',
    strengths: [
      'Quick and inexpensive',
      'Generates hypotheses',
      'Good for prevalence estimation',
      'Can assess multiple outcomes and exposures',
      'Useful for public health planning',
    ],
    limitations: [
      'Cannot establish temporal relationship',
      'Cannot determine causality',
      'Prevalence-incidence bias',
      'Not suitable for rare conditions',
      'Susceptible to survivor bias',
    ],
    examples: [
      'NHANES surveys',
      'Prevalence of hypertension in a community',
      'Snapshot of antibiotic resistance patterns',
    ],
    prerequisites: ['Prevalence', 'Association vs causation', 'Sampling methods'],
  },
  {
    id: 'ecologic',
    name: 'Ecologic Study',
    type: 'ecologic',
    description:
      'An observational study that uses aggregated data at the population level rather than individual-level data to examine associations.',
    strengths: [
      'Uses existing data (low cost)',
      'Generates hypotheses',
      'Studies population-level interventions',
      'Can identify geographic patterns',
      'Quick to conduct',
    ],
    limitations: [
      'Ecological fallacy (group-level ≠ individual-level)',
      'Cannot control for individual confounders',
      'Poor for causal inference',
      'Data quality varies',
      'Cannot establish temporal relationships clearly',
    ],
    examples: [
      'Correlation between national fat intake and heart disease mortality',
      'Association between water fluoridation and dental caries rates',
      'Comparing vaccination rates to disease incidence across regions',
    ],
    prerequisites: ['Population health metrics', 'Ecological fallacy', 'Data aggregation'],
  },
];
