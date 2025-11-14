import type { BiasDefinition } from '../types';

export const biasTypes: BiasDefinition[] = [
  {
    id: 'selection-bias',
    name: 'Selection Bias',
    type: 'selection',
    description:
      'Error introduced when the study population is not representative of the target population, or when comparison groups differ systematically.',
    examples: [
      'Healthy worker effect: employed individuals are generally healthier',
      'Volunteer bias: study participants differ from non-participants',
      'Berkson bias: hospital-based studies overrepresent certain conditions',
      'Loss to follow-up that differs between exposure groups',
    ],
    prevention: [
      'Random sampling from target population',
      'High participation rates',
      'Minimize loss to follow-up',
      'Use appropriate sampling frame',
      'Consider selection mechanisms in analysis',
    ],
    direction: 'unpredictable',
  },
  {
    id: 'information-bias',
    name: 'Information Bias',
    type: 'information',
    description:
      'Systematic error in the measurement or classification of exposure, outcome, or other variables, leading to misclassification.',
    examples: [
      'Using self-reported weight instead of measured weight',
      'Different diagnostic criteria applied to cases vs controls',
      'Interviewer bias when assessors know exposure status',
      'Measurement error from poorly calibrated instruments',
    ],
    prevention: [
      'Use validated measurement tools',
      'Standardize data collection procedures',
      'Blind assessors to exposure/outcome status',
      'Train data collectors thoroughly',
      'Use objective measures when possible',
    ],
    direction: 'unpredictable',
  },
  {
    id: 'recall-bias',
    name: 'Recall Bias',
    type: 'recall',
    description:
      'Differential accuracy or completeness of recall of past exposures between cases and controls, common in retrospective studies.',
    examples: [
      'Mothers of infants with birth defects recall exposures more thoroughly',
      'Patients with disease remember risk factors better than controls',
      'Selective recall based on knowledge of disease association',
    ],
    prevention: [
      'Use prospective designs when possible',
      'Obtain records rather than relying on memory',
      'Blind participants to study hypothesis',
      'Use structured questionnaires',
      'Validate self-reports with objective data',
    ],
    direction: 'away-from-null',
  },
  {
    id: 'measurement-bias',
    name: 'Measurement Bias',
    type: 'measurement',
    description:
      'Systematic error in how exposure or outcome is measured, which can be differential (varies by group) or non-differential (same across groups).',
    examples: [
      'Non-differential misclassification: equally inaccurate exposure classification',
      'Differential misclassification: outcome measured more carefully in exposed',
      'Digit preference in blood pressure readings',
      'Instrument drift over time',
    ],
    prevention: [
      'Use precise, validated instruments',
      'Calibrate equipment regularly',
      'Standardize measurement protocols',
      'Train observers consistently',
      'Blind outcome assessors to exposure status',
    ],
    direction: 'towards-null',
  },
  {
    id: 'observer-bias',
    name: 'Observer Bias',
    type: 'observer',
    description:
      'Systematic difference in how information is collected, measured, or interpreted by observers based on their knowledge or expectations.',
    examples: [
      'Assessor expects exposed individuals to have worse outcomes',
      'Differential probing in interviews based on case status',
      'More thorough examination of exposed participants',
      'Interpretation of ambiguous findings influenced by hypothesis',
    ],
    prevention: [
      'Blind observers to exposure and disease status',
      'Use objective, standardized measures',
      'Multiple independent observers',
      'Automated data collection when possible',
      'Standard protocols for all participants',
    ],
    direction: 'unpredictable',
  },
  {
    id: 'confounding',
    name: 'Confounding',
    type: 'confounding',
    description:
      'Distortion of the exposure-outcome relationship due to a third variable (confounder) that is associated with both exposure and outcome but is not in the causal pathway.',
    examples: [
      'Age as confounder in smoking and heart disease relationship',
      'Socioeconomic status confounding education and health outcomes',
      'Comorbidities confounding treatment effectiveness',
      'Behavioral factors confounding dietary studies',
    ],
    prevention: [
      'Randomization (in experimental studies)',
      'Restriction to specific strata',
      'Matching in study design',
      'Stratification in analysis',
      'Multivariable adjustment',
      'Use DAGs to identify confounders',
    ],
    direction: 'unpredictable',
  },
  {
    id: 'publication-bias',
    name: 'Publication Bias',
    type: 'publication',
    description:
      'Selective publication of studies based on the nature and direction of results, typically favoring statistically significant findings.',
    examples: [
      'Positive trials more likely to be published than null findings',
      'Industry-sponsored trials with unfavorable results remain unpublished',
      'Large effect sizes published faster',
      'Language bias: English-language studies over-represented',
    ],
    prevention: [
      'Pre-registration of trials',
      'Mandatory reporting requirements',
      'Search for unpublished data in systematic reviews',
      'Funnel plot analysis',
      'Include conference abstracts and grey literature',
    ],
    direction: 'away-from-null',
  },
  {
    id: 'loss-to-followup',
    name: 'Loss to Follow-up Bias',
    type: 'loss-to-followup',
    description:
      'Bias introduced when participants who are lost to follow-up differ systematically from those who remain in the study.',
    examples: [
      'Sicker patients more likely to drop out',
      'Younger, mobile populations harder to track',
      'Patients with side effects discontinue medication trials',
      'Differential loss between treatment arms',
    ],
    prevention: [
      'Minimize follow-up time when possible',
      'Frequent contact with participants',
      'Incentives for continued participation',
      'Intent-to-treat analysis',
      'Compare characteristics of those lost vs retained',
      'Sensitivity analyses',
    ],
    direction: 'unpredictable',
  },
];
