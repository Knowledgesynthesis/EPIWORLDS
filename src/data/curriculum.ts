export type ModuleId =
  | 'measures'
  | 'study-designs'
  | 'random-error'
  | 'causal-dags'
  | 'confounding'
  | 'selection-bias'
  | 'information-bias'
  | 'effect-modification'
  | 'clinical-biases'
  | 'appraisal'
  | 'ethics';

export interface ModuleMeta {
  id: ModuleId;
  n: number;
  title: string;
  /** One-line promise of what the learner can do afterwards. */
  outcome: string;
  minutes: number;
  objectives: string[];
  prerequisites: ModuleId[];
  takeaways: string[];
  pitfalls: string[];
  /** Reference ids from data/references.ts */
  references: string[];
  labs?: { label: string; to: string }[];
}

export const modules: ModuleMeta[] = [
  {
    id: 'measures',
    n: 1,
    title: 'Measuring disease and association',
    outcome: 'Compute and correctly interpret risk, rate, odds, RR, RD, OR and NNT from a 2×2 table.',
    minutes: 25,
    objectives: [
      'Distinguish prevalence, risk (cumulative incidence), incidence rate and odds.',
      'Calculate RR, RD, OR and NNT with 95% confidence intervals.',
      'Explain when the odds ratio approximates the risk ratio and when it exaggerates it.',
      'Choose absolute versus relative measures for clinical and public-health decisions.',
    ],
    prerequisites: [],
    takeaways: [
      'Risk is a proportion over a stated period; a rate has person-time in the denominator; odds = p/(1 − p).',
      'Relative measures (RR, OR, HR) describe strength of association; absolute measures (RD, NNT) describe impact.',
      'OR ≈ RR only when the outcome is rare in every group; with common outcomes the OR lies further from 1 than the RR.',
      'Always report the baseline risk alongside a relative effect — RR 2 means 1%→2% or 30%→60%.',
    ],
    pitfalls: [
      'Calling an odds ratio a "risk" or "likelihood" increase when the outcome is common.',
      'Reporting an NNT without a time horizon or without the baseline risk it depends on.',
      'Treating the hazard ratio as a risk ratio over the whole follow-up (hazards can change over time).',
    ],
    references: ['rothman2021', 'altman1998', 'newcombe1998', 'knol2008', 'hernan2010hr'],
    labs: [{ label: '2×2 & OR-vs-RR calculators', to: '/calculators' }],
  },
  {
    id: 'study-designs',
    n: 2,
    title: 'Study designs',
    outcome: 'Pick the design that answers a given clinical question and name its main threats.',
    minutes: 30,
    objectives: [
      'Classify a study from its sampling and timing: RCT, cohort, case–control, cross-sectional, ecologic.',
      'Explain what each design can estimate (risk, rate, odds, prevalence) and why.',
      'Recognise modern designs: nested case–control, case–cohort, case-crossover, self-controlled case series, target trial emulation.',
      'Match designs to questions (therapy, aetiology, prognosis, diagnosis, burden).',
    ],
    prerequisites: ['measures'],
    takeaways: [
      'Design is defined by how participants are sampled relative to exposure and outcome — not by the calendar ("retrospective" vs "prospective").',
      'Randomisation makes groups exchangeable on average for measured and unmeasured factors; concealment and blinding protect that advantage after allocation.',
      'Case–control studies sample on outcome; with incidence-density sampling the OR estimates the rate ratio with no rare-disease assumption.',
      'Observational analyses of interventions should explicitly emulate a target trial (eligibility, time zero, strategies, follow-up).',
    ],
    pitfalls: [
      'Ranking designs by a rigid hierarchy instead of by the threats that matter for the question.',
      'Calling a cross-sectional association "risk" or inferring temporal order from it.',
      'Ecological fallacy: inferring individual-level effects from group-level correlations.',
    ],
    references: ['rothman2021', 'knol2008', 'hernanrobins2016', 'hernan2022tte', 'maclure1991', 'whitaker2006', 'schulz2002', 'robinson1950'],
    labs: [{ label: 'Design chooser', to: '/study-designs' }],
  },
  {
    id: 'random-error',
    n: 3,
    title: 'Random error, precision and power',
    outcome: 'Interpret confidence intervals and P values correctly and separate imprecision from bias.',
    minutes: 25,
    objectives: [
      'Interpret a 95% CI as a property of the procedure across repeated studies.',
      'State what a P value is and the six principles of the ASA statement.',
      'Calculate sample size and power for comparing two proportions.',
      'Show that a large sample shrinks random error but leaves systematic error untouched.',
    ],
    prerequisites: ['measures'],
    takeaways: [
      'Random error shrinks with sample size; systematic error (bias) does not — a huge biased study is precisely wrong.',
      'A P value measures the compatibility of the data with a model (including H0); it is not the probability that H0 is true.',
      'Report effect estimates with CIs; "not significant" is not evidence of no effect when the CI is wide.',
      'Power depends on the baseline risk and the effect size you want to detect, not only on n.',
    ],
    pitfalls: [
      'Interpreting P > 0.05 as "no difference".',
      'Saying "there is a 95% probability the true value is inside this specific interval".',
      'Post-hoc power calculations to explain a null result (they add nothing beyond the CI).',
    ],
    references: ['wasserstein2016', 'greenland2016', 'fleiss2003', 'rothman2021'],
    labs: [{ label: 'Study simulator: random vs systematic error', to: '/study-sandbox' }],
  },
  {
    id: 'causal-dags',
    n: 4,
    title: 'Causal inference and DAGs',
    outcome: 'Draw a DAG for a clinical question and read off which paths are open, blocked, causal or biasing.',
    minutes: 40,
    objectives: [
      'Define a causal effect with potential outcomes and the identifiability conditions: exchangeability, positivity, consistency.',
      'Read the three building blocks of DAGs: chains, forks and colliders.',
      'Apply d-separation rules, including conditioning on a descendant of a collider.',
      'Use the backdoor criterion to find minimal sufficient adjustment sets.',
    ],
    prerequisites: ['study-designs'],
    takeaways: [
      'A DAG encodes assumptions; the absence of an arrow is the strongest claim it makes.',
      'Forks (common causes) and chains (mediators) are open until you condition on the middle node; colliders are closed until you condition on them or a descendant.',
      'Adjust to block every backdoor path without conditioning on descendants of the exposure.',
      'There can be several valid adjustment sets — choose the one you can measure best.',
    ],
    pitfalls: [
      'Adjusting for "everything associated with exposure and outcome" (can include colliders and mediators).',
      'Reading arrows as strength or direction of effect (+/−) — DAGs are non-parametric.',
      'Presenting every coefficient of the adjusted model as a causal effect (the Table 2 fallacy).',
    ],
    references: ['hernanrobins2020', 'greenland1999dag', 'pearl2009', 'shrier2008', 'textor2016', 'tennant2021', 'westreich2013'],
    labs: [{ label: 'DAG Lab', to: '/dag-builder' }],
  },
  {
    id: 'confounding',
    n: 5,
    title: 'Confounding',
    outcome: 'Diagnose confounding, quantify it by stratification, and choose a method to control it.',
    minutes: 35,
    objectives: [
      'Define confounding structurally (an open backdoor path) and contrast with the classic three criteria.',
      'Compute stratum-specific and Mantel–Haenszel adjusted estimates.',
      'Explain Simpson\'s paradox and confounding by indication.',
      'Compare design-stage (randomisation, restriction, matching) and analysis-stage (stratification, regression, propensity scores, g-methods) control.',
    ],
    prerequisites: ['causal-dags'],
    takeaways: [
      'Confounding is a property of the causal structure, not of a statistical test; decide what to adjust for with subject-matter knowledge (a DAG), not P values.',
      'If stratum estimates agree with each other but differ from the crude, the stratifier was confounding the crude estimate.',
      'Adjustment only removes confounding by what you measured, as well as you measured it — residual and unmeasured confounding remain.',
      'For time-varying confounding affected by prior treatment, standard regression fails; g-methods are needed.',
    ],
    pitfalls: [
      'Selecting confounders by stepwise regression or a change-in-estimate rule alone.',
      'Assuming randomisation guarantees balance in a small trial (it guarantees it on average).',
      'Reading the OR change after adjustment as confounding when it is non-collapsibility.',
    ],
    references: ['hernanrobins2020', 'greenland1999collapse', 'mantel1959', 'greenland1985', 'rosenbaum1983', 'rothman2021'],
    labs: [{ label: 'Confounding Lab', to: '/confounding-lab' }],
  },
  {
    id: 'selection-bias',
    n: 6,
    title: 'Selection bias',
    outcome: 'Recognise selection bias as conditioning on a collider and predict when it distorts RR vs OR.',
    minutes: 30,
    objectives: [
      'Define selection bias structurally (Hernán, Hernández-Díaz & Robins 2004).',
      'Explain Berkson\'s bias, differential loss to follow-up, and the healthy worker effect.',
      'Distinguish selection bias (internal validity) from non-representativeness (external validity).',
      'Quantify bias with the selection odds ratio.',
    ],
    prerequisites: ['causal-dags'],
    takeaways: [
      'Selection bias arises when the analysis is restricted to (conditions on) a common effect of exposure and outcome, or of their causes.',
      'A sample can be unrepresentative yet internally valid; representativeness is a question of transportability.',
      'If selection depends on exposure and outcome jointly, OR_observed = OR_true × (s_a·s_d)/(s_b·s_c).',
      'Inverse probability of censoring weights can correct loss to follow-up if its predictors are measured.',
    ],
    pitfalls: [
      'Believing intention-to-treat analysis fixes missing outcome data (it needs the outcomes).',
      'Restricting to survivors, hospitalised patients or completers without considering the selection DAG.',
      'Calling every unrepresentative sample "biased".',
    ],
    references: ['hernan2004', 'berkson1946', 'cole2010', 'hernandezdiaz2006', 'rothman2021'],
    labs: [{ label: 'Bias Lab — selection', to: '/bias-lab' }],
  },
  {
    id: 'information-bias',
    n: 7,
    title: 'Information bias',
    outcome: 'Predict and correct the effect of misclassification using sensitivity and specificity.',
    minutes: 30,
    objectives: [
      'Distinguish non-differential from differential, and dependent from independent, misclassification.',
      'Predict the expected direction of bias from non-differential misclassification of a binary variable.',
      'Explain recall, interviewer and detection bias as differential misclassification.',
      'Back-correct a 2×2 table with simple quantitative bias analysis.',
    ],
    prerequisites: ['measures'],
    takeaways: [
      'Non-differential, independent misclassification of a binary exposure biases the expected estimate toward the null — but any single study can still land further away by chance.',
      'Differential misclassification can bias in either direction.',
      'With perfect specificity and non-differential sensitivity of the outcome, the RR is unbiased (the RD is not).',
      'Quantitative bias analysis replaces "results may be biased" with numbers.',
    ],
    pitfalls: [
      'Arguing a positive result must be real because misclassification "only biases toward the null".',
      'Assuming non-differential misclassification for polytomous exposures always pulls toward the null (it need not).',
      'Validating a measure in one population and applying the Se/Sp elsewhere without thought.',
    ],
    references: ['jurek2005', 'lash2014', 'lash2021', 'rothman2021'],
    labs: [{ label: 'Bias Lab — misclassification', to: '/bias-lab?tab=misclassification' }],
  },
  {
    id: 'effect-modification',
    n: 8,
    title: 'Effect modification and interaction',
    outcome: 'Assess effect heterogeneity on both scales and judge the credibility of subgroup claims.',
    minutes: 30,
    objectives: [
      'Distinguish effect modification from confounding.',
      'Show that effect modification is scale-dependent (additive vs multiplicative).',
      'Compute RERI and the interaction contrast.',
      'Apply ICEMAN-style criteria to subgroup analyses.',
    ],
    prerequisites: ['confounding'],
    takeaways: [
      'Confounding is a bias to remove; effect modification is a finding to report.',
      'Absence of modification on one scale implies presence on the other whenever both factors have effects.',
      'The additive scale is the one that maps onto who benefits most (and onto NNT).',
      'Credible subgroup effects are pre-specified, few, biologically plausible, within-trial, and supported by a formal interaction test.',
    ],
    pitfalls: [
      'Declaring effect modification because the effect is "significant" in one subgroup and "not significant" in another.',
      'Reporting only multiplicative interaction terms from logistic or Cox models.',
      'Pooling with a Mantel–Haenszel estimate when strata clearly differ.',
    ],
    references: ['knol2012', 'vanderweele2014', 'schandelmaier2020', 'rothman2021'],
    labs: [{ label: 'Effect-modification explorer', to: '/confounding-lab?tab=em' }],
  },
  {
    id: 'clinical-biases',
    n: 9,
    title: 'Time-related and clinical biases',
    outcome: 'Spot immortal time, confounding by indication, and screening biases in published studies.',
    minutes: 30,
    objectives: [
      'Explain and quantify immortal time bias; describe time-varying exposure and landmark fixes.',
      'Recognise confounding by indication, protopathic bias, healthy adherer bias and prevalent-user bias.',
      'Explain lead-time, length-time and overdiagnosis biases in screening.',
      'Recognise regression to the mean.',
    ],
    prerequisites: ['confounding', 'selection-bias'],
    takeaways: [
      'Align eligibility, treatment assignment and start of follow-up at the same time zero — as a trial would.',
      'New-user, active-comparator designs reduce confounding by indication and healthy-user effects.',
      'In screening, compare mortality in randomised groups, not survival from diagnosis.',
      'Extreme baseline values drift toward the mean on re-measurement even without treatment — use a control group.',
    ],
    pitfalls: [
      'Defining exposure by what happens after time zero ("ever used during follow-up").',
      'Comparing users with non-users when non-users are sicker, frailer or less adherent.',
      'Attributing improvement in patients selected for extreme values to the intervention.',
    ],
    references: ['suissa2008', 'levesque2010', 'ray2003', 'hernan2008whi', 'welch2010', 'barnett2005', 'hernan2016timezero'],
    labs: [{ label: 'Immortal time & lead-time demos', to: '/bias-lab?tab=time' }],
  },
  {
    id: 'appraisal',
    n: 10,
    title: 'From association to causation',
    outcome: 'Appraise a causal claim with a structured approach, sensitivity analysis and current reporting standards.',
    minutes: 30,
    objectives: [
      'Use Bradford Hill\'s considerations as prompts, not a checklist (only temporality is necessary).',
      'Compute and interpret an E-value for unmeasured confounding.',
      'Apply risk-of-bias tools (RoB 2, ROBINS-I V2) and GRADE certainty.',
      'Match a study to its reporting guideline (CONSORT 2025, SPIRIT 2025, STROBE, TARGET, PRISMA 2020, STARD 2015, TRIPOD+AI).',
    ],
    prerequisites: ['confounding', 'selection-bias', 'information-bias'],
    takeaways: [
      'Causal conclusions rest on design and assumptions you can state, not on the size of the P value.',
      'An E-value says how strong unmeasured confounding would need to be to explain away an estimate — it is not a probability.',
      'Triangulate: agreement across designs with different bias structures is stronger evidence than many studies sharing one bias.',
      'Reporting guidelines make bias assessable; they do not make a study valid.',
    ],
    pitfalls: [
      'Scoring Bradford Hill "criteria" to reach a verdict.',
      'Treating a large E-value as proof of causation.',
      'Using a reporting checklist as a quality score.',
    ],
    references: ['hill1965', 'fedak2015', 'vanderweele2017', 'lawlor2016', 'sterne2019', 'robinsi2024', 'guyatt2008', 'consort2025', 'spirit2025', 'strobe2007', 'target2025', 'prisma2020', 'stard2015', 'tripodai2024'],
    labs: [{ label: 'E-value calculator', to: '/calculators?tab=evalue' }],
  },
  {
    id: 'ethics',
    n: 11,
    title: 'Research ethics and integrity',
    outcome: 'Evaluate a study proposal against current ethical standards and regulations.',
    minutes: 25,
    objectives: [
      'Apply the Belmont principles: respect for persons, beneficence, justice.',
      'Explain clinical equipoise and placebo-control conditions under the Declaration of Helsinki (2024).',
      'Describe consent waivers, data monitoring, trial registration and conflicts of interest.',
      'Identify the review pathway under the U.S. Common Rule and principles of ICH E6(R3).',
    ],
    prerequisites: ['study-designs'],
    takeaways: [
      'Randomisation is justified only under clinical equipoise — honest professional disagreement about the better option.',
      'Placebo controls are acceptable when no proven intervention exists, or for compelling methodological reasons without risk of serious or irreversible harm.',
      'Prospective registration and full reporting are ethical obligations, not formalities.',
      'Observational research on existing data still requires ethical review, privacy protection and transparency.',
    ],
    pitfalls: [
      'Treating stopping early for benefit as cost-free (truncated trials overestimate effects).',
      'Assuming "anonymous" data cannot be re-identified.',
      'Equating ethics-committee approval with ethical soundness.',
    ],
    references: ['belmont1979', 'helsinki2024', 'ich2025', 'commonrule2018', 'freedman1987', 'cioms2016', 'weijer2012', 'bassler2010', 'icmje'],
    labs: [{ label: 'Ethics case clinic', to: '/ethics' }],
  },
];

export const moduleById = Object.fromEntries(modules.map((m) => [m.id, m])) as Record<ModuleId, ModuleMeta>;
