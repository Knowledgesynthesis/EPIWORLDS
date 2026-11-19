import type { ModuleId } from './curriculum';

interface Base {
  id: string;
  module: ModuleId;
  /** 1 = recall/understand, 2 = apply, 3 = analyse/evaluate. */
  level: 1 | 2 | 3;
  stem: string;
  explanation: string;
  refs?: string[];
}

export interface MCQ extends Base {
  type: 'mcq';
  options: string[];
  answer: number;
}

export interface NumericQ extends Base {
  type: 'numeric';
  answer: number;
  tolerance: number;
  unit?: string;
}

export type Question = MCQ | NumericQ;

export const questions: Question[] = [
  // ───────────────────────────── 1. Measures
  {
    id: 'ms-rr', module: 'measures', level: 2, type: 'numeric',
    stem: 'In a cohort followed for 10 years, 30 of 200 smokers and 10 of 200 non-smokers develop COPD. What is the risk ratio?',
    answer: 3, tolerance: 0.01,
    explanation: 'Risk in smokers = 30/200 = 0.15; in non-smokers = 10/200 = 0.05. RR = 0.15 / 0.05 = 3.0 over 10 years.',
  },
  {
    id: 'ms-rd', module: 'measures', level: 2, type: 'numeric',
    stem: 'Same cohort (30/200 smokers vs 10/200 non-smokers over 10 years). How many extra COPD cases per 100 smokers are associated with smoking (risk difference × 100)?',
    answer: 10, tolerance: 0.05, unit: 'per 100',
    explanation: 'RD = 0.15 − 0.05 = 0.10, i.e. 10 extra cases per 100 smokers over 10 years. Absolute measures need a time horizon.',
  },
  {
    id: 'ms-nnt', module: 'measures', level: 2, type: 'numeric',
    stem: 'In a trial, 1-year mortality is 12% with usual care and 8% with the new treatment. What is the number needed to treat for 1 year to prevent one death?',
    answer: 25, tolerance: 0.1,
    explanation: 'Absolute risk reduction = 0.12 − 0.08 = 0.04. NNT = 1/0.04 = 25 over 1 year. Always state the time frame and the comparator.',
    refs: ['altman1998'],
  },
  {
    id: 'ms-or-common', module: 'measures', level: 3, type: 'mcq',
    stem: 'An outcome occurs in 40% of unexposed people and the true risk ratio is 1.5. What is the odds ratio?',
    options: ['1.50 — the OR equals the RR', '1.80', '2.25', '3.00'],
    answer: 2,
    explanation: 'r₁ = 0.60, r₀ = 0.40. OR = (0.60/0.40)/(0.40/0.60) = 1.5/0.667 = 2.25. With a common outcome the OR lies further from 1 than the RR; it approximates the RR only when the outcome is rare.',
  },
  {
    id: 'ms-rate', module: 'measures', level: 1, type: 'mcq',
    stem: 'Which statement about an incidence rate is correct?',
    options: [
      'It is a proportion bounded by 0 and 1.',
      'Its denominator is person-time at risk, so it has units of 1/time.',
      'It equals prevalence divided by disease duration only in case–control studies.',
      'It can be measured only in randomised trials.',
    ],
    answer: 1,
    explanation: 'A rate = new cases / person-time (e.g. 5 per 1,000 person-years). Risk (cumulative incidence) is the proportion. In a steady state, prevalence odds ≈ incidence rate × mean duration — a property of the population, not of a design.',
  },
  {
    id: 'ms-baseline', module: 'measures', level: 3, type: 'mcq',
    stem: 'A drug lowers 5-year stroke risk from 2% to 1% (RR 0.5). If the RR is constant, what is the 5-year NNT in patients whose baseline risk is 20%?',
    options: ['100', '50', '20', '10'],
    answer: 3,
    explanation: 'With RR 0.5, 20% falls to 10%: ARR = 0.10, NNT = 10 (versus 100 at 2% baseline). A constant relative effect means absolute benefit — and treatment priority — scale with baseline risk.',
  },
  {
    id: 'ms-hr', module: 'measures', level: 3, type: 'mcq',
    stem: 'A Cox model reports HR 0.70 for death over 5 years. Which interpretation is most defensible?',
    options: [
      '30% fewer treated patients will have died by 5 years.',
      'Averaged over follow-up, the death rate among those still alive is about 30% lower; cumulative risks at 5 years should be reported separately.',
      'Treatment extends life expectancy by 30%.',
      'There is a 70% probability that the treatment works.',
    ],
    answer: 1,
    explanation: 'An HR compares instantaneous rates among survivors and is a weighted average if hazards are not proportional. It is not a ratio of cumulative risks; report survival curves or risks at fixed times (Hernán 2010).',
    refs: ['hernan2010hr'],
  },

  // ───────────────────────────── 2. Study designs
  {
    id: 'sd-cc', module: 'study-designs', level: 1, type: 'mcq',
    stem: 'Investigators identify 200 people with pancreatic cancer and 400 people without it, then ask about past smoking. What design is this?',
    options: ['Retrospective cohort', 'Case–control', 'Cross-sectional', 'Ecologic'],
    answer: 1,
    explanation: 'Participants were sampled on outcome status, which defines a case–control study. "Retrospective" describes timing of data collection, not the design; cohorts can also be retrospective.',
  },
  {
    id: 'sd-nested', module: 'study-designs', level: 3, type: 'mcq',
    stem: 'A cohort of 50,000 nurses stored blood in 1990. Investigators now assay samples from 300 women who developed breast cancer and, for each case, 4 women still at risk on that case\'s diagnosis date. What does the OR estimate?',
    options: [
      'Only the risk ratio, and only if breast cancer is rare',
      'The incidence rate ratio, without a rare-disease assumption (risk-set sampling)',
      'The prevalence ratio',
      'Nothing interpretable, because controls were matched on time',
    ],
    answer: 1,
    explanation: 'This is a nested case–control study with incidence-density (risk-set) sampling. Under this sampling the OR estimates the rate ratio directly, no rare-disease assumption needed (Knol et al. 2008).',
    refs: ['knol2008'],
  },
  {
    id: 'sd-random', module: 'study-designs', level: 2, type: 'mcq',
    stem: 'What does randomisation guarantee?',
    options: [
      'That the groups are identical at baseline in every trial.',
      'Exchangeability in expectation: baseline differences, measured or not, arise only by chance.',
      'That the results apply to all patients with the condition.',
      'Protection against differential loss to follow-up.',
    ],
    answer: 1,
    explanation: 'Randomisation removes confounding on average. Small trials can be imbalanced by chance (handled by the CI and by pre-specified adjustment). Post-randomisation problems — non-adherence, loss to follow-up, unblinded assessment — are not prevented by randomisation.',
  },
  {
    id: 'sd-conceal', module: 'study-designs', level: 2, type: 'mcq',
    stem: 'Allocation concealment primarily prevents:',
    options: [
      'Recruiters steering particular patients into a group because they know the next assignment',
      'Patients changing behaviour because they know their treatment',
      'Outcome assessors judging outcomes differently by arm',
      'Loss to follow-up',
    ],
    answer: 0,
    explanation: 'Concealment protects the randomisation sequence until assignment (selection bias at enrolment). It is always possible, unlike blinding. Inadequate concealment is associated with exaggerated effects (Schulz & Grimes 2002).',
    refs: ['schulz2002'],
  },
  {
    id: 'sd-xs', module: 'study-designs', level: 2, type: 'mcq',
    stem: 'A 2025 national survey finds that physically active adults have a lower prevalence of current depression (prevalence ratio 0.7). What is the main obstacle to a causal reading?',
    options: [
      'Temporality: depression may reduce activity, and prevalence also reflects duration of depression',
      'Recall bias is the only concern',
      'No measure of association can be computed in a survey',
      'The ecological fallacy',
    ],
    answer: 0,
    explanation: 'Exposure and outcome are measured at the same time, so direction is unclear (reverse causation). Prevalence mixes incidence with duration: if activity shortens depressive episodes, prevalence falls even with unchanged incidence.',
  },
  {
    id: 'sd-sccs', module: 'study-designs', level: 3, type: 'mcq',
    stem: 'Does influenza vaccination transiently raise Guillain–Barré syndrome risk in the next 6 weeks? Which design uses only cases and automatically controls for fixed individual confounders?',
    options: ['Cross-sectional survey', 'Ecologic time series', 'Self-controlled case series', 'Case–cohort study'],
    answer: 2,
    explanation: 'The SCCS compares incidence in post-vaccination risk windows with other time in the same individuals, removing time-invariant confounding. Key assumptions: the event does not change the probability of later exposure (or this is handled) and does not censor observation (Whitaker 2006).',
    refs: ['whitaker2006'],
  },
  {
    id: 'sd-tte', module: 'study-designs', level: 2, type: 'mcq',
    stem: 'What is the core step of target trial emulation?',
    options: [
      'Using the largest available database',
      'Writing the protocol of the randomised trial you would ideally run — eligibility, strategies, assignment, time zero, follow-up, outcome, causal contrast, analysis — and emulating each element',
      'Matching on the propensity score',
      'Excluding everyone with missing data',
    ],
    answer: 1,
    explanation: 'Explicit specification of the target trial aligns eligibility, treatment assignment and start of follow-up, preventing immortal time and prevalent-user biases. Report with the TARGET guideline (2025).',
    refs: ['hernanrobins2016', 'hernan2022tte', 'target2025'],
  },
  {
    id: 'sd-eco', module: 'study-designs', level: 2, type: 'mcq',
    stem: 'Across 40 countries, chocolate consumption per capita correlates with Nobel laureates per capita. Why does this not show that chocolate makes individuals laureates?',
    options: [
      'The correlation is too weak',
      'Group-level data cannot show that the individuals eating chocolate are the laureates (ecological fallacy), and national wealth confounds both',
      'Ecologic studies cannot compute correlations',
      'Because of recall bias',
    ],
    answer: 1,
    explanation: 'An ecologic association need not hold at the individual level (Robinson 1950), and country-level confounders (wealth, research investment) drive both variables.',
    refs: ['robinson1950'],
  },

  // ───────────────────────────── 3. Random error
  {
    id: 're-ci', module: 'random-error', level: 2, type: 'mcq',
    stem: 'A trial reports RR 0.80 (95% CI 0.62 to 1.03) for death. Best interpretation?',
    options: [
      'The drug does not work.',
      'There is a 95% probability that the true RR lies between 0.62 and 1.03.',
      'The data are compatible with effects from a 38% reduction to a 3% increase; the trial can exclude neither no effect nor a meaningful benefit.',
      'The estimate is biased.',
    ],
    answer: 2,
    explanation: 'The CI shows the range of effect sizes reasonably compatible with the data and model. P > 0.05 is not evidence of no effect; the interval includes clinically important benefit (Greenland et al. 2016).',
    refs: ['greenland2016'],
  },
  {
    id: 're-p', module: 'random-error', level: 1, type: 'mcq',
    stem: 'P = 0.03 means:',
    options: [
      'There is a 3% probability the null hypothesis is true.',
      'There is a 97% probability the treatment works.',
      'If the null hypothesis and every model assumption were true, data at least this extreme would occur 3% of the time.',
      'There is a 3% probability the result is due to bias.',
    ],
    answer: 2,
    explanation: 'A P value measures incompatibility of the data with a specified model. It is not the probability that a hypothesis is true and says nothing about bias or effect size (ASA statement 2016).',
    refs: ['wasserstein2016'],
  },
  {
    id: 're-n', module: 'random-error', level: 2, type: 'numeric',
    stem: 'You plan to compare event risks of 10% vs 20% with two-sided α = 0.05 and 80% power (normal approximation, no continuity correction). How many participants per group?',
    answer: 199, tolerance: 2,
    explanation: 'n = [1.96·√(2·0.15·0.85) + 0.842·√(0.2·0.8 + 0.1·0.9)]² / 0.1² ≈ 199 per group. Add a continuity correction or inflate for expected drop-out in practice.',
    refs: ['fleiss2003'],
  },
  {
    id: 're-big', module: 'random-error', level: 2, type: 'mcq',
    stem: 'A registry study of 2 million patients reports HR 0.85 (95% CI 0.84 to 0.86) for statins and fracture. The narrow interval mainly tells you:',
    options: [
      'The result is unbiased.',
      'There is little random error; it says nothing about confounding, selection or measurement bias.',
      'The association is causal.',
      'The result generalises to all populations.',
    ],
    answer: 1,
    explanation: 'Precision and validity are different. Large datasets shrink random error but leave systematic error untouched — a precise estimate can be precisely wrong (e.g. healthy-user confounding).',
  },
  {
    id: 're-power', module: 'random-error', level: 3, type: 'mcq',
    stem: 'Holding the sample size and the risk ratio fixed, which change increases power?',
    options: [
      'Using α = 0.01 instead of 0.05',
      'Enrolling a higher-risk population so more outcome events occur',
      'Adding more secondary outcomes',
      'Measuring the outcome with lower sensitivity',
    ],
    answer: 1,
    explanation: 'Power for binary outcomes is driven by the number of events and the absolute difference. A higher baseline risk at the same RR gives a larger absolute difference. Smaller α and outcome misclassification reduce power.',
  },
  {
    id: 're-mult', module: 'random-error', level: 2, type: 'mcq',
    stem: 'A trial tests 20 independent secondary outcomes at α = 0.05 and the treatment truly affects none. How many "significant" results do you expect, and what is the chance of at least one?',
    options: ['0, and about 5%', '1, and about 64%', '5, and about 95%', '1, and exactly 5%'],
    answer: 1,
    explanation: 'Expected false positives = 20 × 0.05 = 1. P(at least one) = 1 − 0.95²⁰ ≈ 0.64. Pre-specify primary outcomes and interpret secondary findings cautiously.',
  },

  // ───────────────────────────── 4. Causal DAGs
  {
    id: 'cd-ident', module: 'causal-dags', level: 1, type: 'mcq',
    stem: 'Which is NOT one of the conditions for identifying a causal effect from data?',
    options: ['Exchangeability (no unmeasured confounding)', 'Positivity', 'Consistency (well-defined interventions)', 'Statistical significance'],
    answer: 3,
    explanation: 'Exchangeability, positivity and consistency (plus no interference and correct model specification) are needed to identify causal effects. Statistical significance concerns random error, not identifiability.',
    refs: ['hernanrobins2020'],
  },
  {
    id: 'cd-pos', module: 'causal-dags', level: 2, type: 'mcq',
    stem: 'Positivity is violated when:',
    options: [
      'Some patients with a given covariate pattern can never receive one of the treatments (e.g. an absolute contraindication)',
      'The exposure has a positive effect',
      'The P value is positive',
      'There is a confounder with a positive association',
    ],
    answer: 0,
    explanation: 'Positivity requires a non-zero probability of each treatment level within every confounder stratum. If one stratum always or never gets treated, the data contain no information on the contrast there — restrict the question or the population.',
  },
  {
    id: 'cd-fork', module: 'causal-dags', level: 1, type: 'mcq',
    stem: 'In the DAG L → X, L → Y, X → Y, the path X ← L → Y is:',
    options: ['A causal path', 'A backdoor path, open unless you condition on L', 'Blocked, because L is a collider', 'A mediating path'],
    answer: 1,
    explanation: 'L is a common cause (fork). The path starts with an arrow into X, so it is a backdoor path, open until you condition on L.',
  },
  {
    id: 'cd-collider', module: 'causal-dags', level: 1, type: 'mcq',
    stem: 'X → C ← Y, and X has no effect on Y. What happens if you condition on C (restrict, stratify or adjust)?',
    options: [
      'Nothing — the path was already blocked',
      'You open the path and create an X–Y association although there is no effect',
      'You remove confounding',
      'You estimate the direct effect of X',
    ],
    answer: 1,
    explanation: 'A collider blocks a path by default. Conditioning on it (or on a descendant) opens the path and induces a spurious association — the structure of selection bias (Cole et al. 2010).',
    refs: ['cole2010'],
  },
  {
    id: 'cd-arrows', module: 'causal-dags', level: 2, type: 'mcq',
    stem: 'Which statement about arrows in a DAG is correct?',
    options: [
      'Thicker arrows denote stronger effects.',
      'An arrow allows a possible direct effect; a missing arrow asserts no direct effect at all.',
      'Arrows may point both ways to show feedback.',
      'Arrows represent correlations found in the data.',
    ],
    answer: 1,
    explanation: 'DAGs are non-parametric and qualitative. The strong assumptions are the missing arrows. Feedback over time is drawn by indexing variables by time (X₁ → Y₂ → X₃), keeping the graph acyclic.',
  },
  {
    id: 'cd-mbias', module: 'causal-dags', level: 3, type: 'mcq',
    stem: 'DAG: X ← U1 → M ← U2 → Y and X → Y, where U1 and U2 are unmeasured and M is measured before X. Should you adjust for M?',
    options: [
      'Yes — M precedes X and is associated with both X and Y',
      'No — M is a collider; adjusting opens X ← U1 → M ← U2 → Y. No adjustment is needed.',
      'Yes, but only with propensity scores',
      'It makes no difference',
    ],
    answer: 1,
    explanation: 'This is M-bias. M satisfies the traditional "confounder" criteria (associated with X and Y, not a mediator) yet adjusting for it creates bias. The empty set already blocks the only backdoor path.',
    refs: ['greenland1999dag'],
  },
  {
    id: 'cd-sets', module: 'causal-dags', level: 2, type: 'mcq',
    stem: 'DAG: A → B → X, A → Y, X → Y. Which adjustment sets satisfy the backdoor criterion?',
    options: ['Only the empty set', 'Only {A}', 'Only {B}', 'Either {A} or {B}'],
    answer: 3,
    explanation: 'The only backdoor path is X ← B ← A → Y. Conditioning on any non-collider on it — A or B — blocks it. Choose the one measured more accurately.',
  },
  {
    id: 'cd-table2', module: 'causal-dags', level: 3, type: 'mcq',
    stem: 'To estimate the effect of alcohol on MI you adjust for age and smoking. The model also outputs a coefficient for smoking. That coefficient:',
    options: [
      'Is the total effect of smoking on MI',
      'May not estimate any causal effect: the set was chosen for alcohol, and adjusting for alcohol can block part of smoking\'s effect (Table 2 fallacy)',
      'Is always biased toward the null',
      'Is the direct effect of smoking free of confounding',
    ],
    answer: 1,
    explanation: 'Each estimand needs its own adjustment set. Presenting all coefficients of one model as effects is the Table 2 fallacy (Westreich & Greenland 2013).',
    refs: ['westreich2013'],
  },

  // ───────────────────────────── 5. Confounding
  {
    id: 'cf-strata', module: 'confounding', level: 2, type: 'mcq',
    stem: 'Crude RR = 2.8. By age: RR 1.4 (<65 y) and 1.5 (≥65 y); Mantel–Haenszel RR 1.45. Interpretation?',
    options: [
      'Strong effect modification by age',
      'Age confounded the crude estimate; the age-adjusted RR is about 1.45 with little evidence of modification',
      'Selection bias',
      'The crude estimate is the causal effect',
    ],
    answer: 1,
    explanation: 'Similar stratum-specific estimates that differ from the crude estimate indicate confounding by the stratification variable (assuming it is a confounder, not a collider or mediator, per the DAG).',
  },
  {
    id: 'cf-simpson', module: 'confounding', level: 2, type: 'mcq',
    stem: 'A treatment looks harmful overall but beneficial within every disease-severity stratum. Most likely explanation?',
    options: [
      'Random error',
      'Sicker patients were more likely to receive the treatment — confounding by severity (Simpson\'s paradox)',
      'Effect modification by severity',
      'Information bias',
    ],
    answer: 1,
    explanation: 'Reversal between crude and stratified estimates is Simpson\'s paradox. Whether to trust the stratified result is a causal question: it is right if severity is a confounder (affects treatment and outcome), wrong if severity were caused by treatment.',
  },
  {
    id: 'cf-stepwise', module: 'confounding', level: 2, type: 'mcq',
    stem: 'Why not choose confounders by stepwise selection on P values?',
    options: [
      'Because it is too slow',
      'Confounding is causal, not statistical: stepwise rules can keep colliders or mediators and drop true confounders, and P values depend on sample size',
      'Because P values are always wrong',
      'Because only randomised trials can be adjusted',
    ],
    answer: 1,
    explanation: 'Select adjustment variables from causal knowledge (a DAG). Data-driven selection ignores structure and invalidates standard CIs (Tennant et al. 2021).',
    refs: ['tennant2021'],
  },
  {
    id: 'cf-unmeasured', module: 'confounding', level: 1, type: 'mcq',
    stem: 'Which method protects against unmeasured confounding by design?',
    options: ['Multivariable regression', 'Propensity-score matching', 'Stratification', 'Randomisation'],
    answer: 3,
    explanation: 'Regression, stratification and propensity scores only handle measured confounders. Randomisation (and, under strong assumptions, instrumental variables or some self-controlled designs) addresses unmeasured ones.',
  },
  {
    id: 'cf-collapse', module: 'confounding', level: 3, type: 'mcq',
    stem: 'In a well-randomised trial, adjusting the OR for a strong prognostic factor moves it from 1.8 to 2.1. This is best explained by:',
    options: ['Confounding', 'Non-collapsibility of the odds ratio', 'Selection bias', 'Effect modification'],
    answer: 1,
    explanation: 'Even without confounding, conditional and marginal ORs differ when the covariate affects the outcome. The RR and RD are collapsible; the OR and HR are not (Greenland, Robins & Pearl 1999). Do not use change-in-OR as a confounding test.',
    refs: ['greenland1999collapse'],
  },
  {
    id: 'cf-mh', module: 'confounding', level: 2, type: 'numeric',
    stem: 'Stratum 1: 20/100 exposed vs 10/100 unexposed had the outcome. Stratum 2: 30/100 vs 10/100. Compute the Mantel–Haenszel risk ratio.',
    answer: 2.5, tolerance: 0.01,
    explanation: 'RR_MH = Σ(aᵢn₀ᵢ/Nᵢ) / Σ(cᵢn₁ᵢ/Nᵢ) = (20·100/200 + 30·100/200) / (10·100/200 + 10·100/200) = (10 + 15)/(5 + 5) = 2.5. Stratum RRs are 2 and 3 — check for modification before pooling.',
    refs: ['mantel1959'],
  },
  {
    id: 'cf-residual', module: 'confounding', level: 2, type: 'mcq',
    stem: 'A study of coffee and lung cancer adjusts for smoking as ever/never. What remains?',
    options: ['Nothing — smoking is controlled', 'Residual confounding by smoking intensity and duration', 'Selection bias', 'Collider bias'],
    answer: 1,
    explanation: 'Crude or mismeasured confounders leave residual confounding. Model confounders with adequate detail (e.g. pack-years, time since quitting).',
  },

  // ───────────────────────────── 6. Selection bias
  {
    id: 'sb-def', module: 'selection-bias', level: 1, type: 'mcq',
    stem: 'In the structural sense, selection bias results from:',
    options: [
      'A sample that does not resemble the general population',
      'Conditioning on a common effect of exposure and outcome (or of their causes), e.g. by restricting the analysis',
      'Uncontrolled common causes of exposure and outcome',
      'Small sample size',
    ],
    answer: 1,
    explanation: 'Hernán, Hernández-Díaz & Robins (2004) define selection bias as collider stratification. Unrepresentativeness affects generalisability; common causes produce confounding.',
    refs: ['hernan2004'],
  },
  {
    id: 'sb-berkson', module: 'selection-bias', level: 2, type: 'mcq',
    stem: 'Among hospital inpatients, diabetes and gallbladder disease are negatively associated although they are independent in the community. Why?',
    options: [
      'Diabetes protects against gallbladder disease',
      'Both raise the chance of admission, so restricting to inpatients conditions on a collider (Berkson\'s bias)',
      'Recall bias',
      'Confounding by age',
    ],
    answer: 1,
    explanation: 'If either disease can lead to admission, an inpatient without one is more likely to have the other. Restriction to admitted patients induces a spurious (usually negative) association (Berkson 1946).',
    refs: ['berkson1946'],
  },
  {
    id: 'sb-ltfu', module: 'selection-bias', level: 2, type: 'mcq',
    stem: 'A cohort loses 30% of participants, equally in exposed and unexposed groups, and loss is unrelated to outcome risk. What is the expected effect on the RR?',
    options: ['Bias toward the null', 'Bias away from the null', 'No bias; only precision falls', 'Unpredictable bias'],
    answer: 2,
    explanation: 'Selection that depends on exposure only (not on outcome) leaves risks within each exposure group unchanged. Bias appears when retention depends on the outcome and differs by exposure (or on their common causes).',
  },
  {
    id: 'sb-or-factor', module: 'selection-bias', level: 3, type: 'numeric',
    stem: 'True OR = 2.0. Probabilities of being included: exposed cases 0.8, unexposed cases 0.4, exposed controls 0.5, unexposed controls 0.5. What OR will the study observe?',
    answer: 4, tolerance: 0.01,
    explanation: 'OR_obs = OR_true × (s_a·s_d)/(s_b·s_c) = 2 × (0.8·0.5)/(0.5·0.4) = 2 × 2 = 4.0 — e.g. a referral clinic that preferentially sees exposed cases.',
  },
  {
    id: 'sb-hwe', module: 'selection-bias', level: 1, type: 'mcq',
    stem: 'Workers in a chemical plant have lower all-cause mortality than the general population. The most likely explanation is:',
    options: [
      'The chemical is protective',
      'The healthy worker effect: being and staying employed requires health, so workers differ from the general population',
      'Recall bias',
      'Ecological fallacy',
    ],
    answer: 1,
    explanation: 'Comparisons with the general population are distorted by health-related selection into and out of work. Use internal comparisons (exposed vs unexposed workers) and handle time since hire and employment status.',
  },
  {
    id: 'sb-transport', module: 'selection-bias', level: 2, type: 'mcq',
    stem: 'A trial enrols only patients younger than 75. Its effect estimate for younger patients is:',
    options: [
      'Biased by selection',
      'Internally valid; whether it applies to older patients is a question of generalisability (transportability)',
      'Invalid for everyone',
      'Confounded by age',
    ],
    answer: 1,
    explanation: 'Restriction is a legitimate design choice that improves internal validity. Extending results to excluded groups requires assumptions about effect modification.',
  },
  {
    id: 'sb-itt', module: 'selection-bias', level: 3, type: 'mcq',
    stem: 'Twenty per cent of trial participants have missing final outcomes. Does an intention-to-treat analysis solve this?',
    options: [
      'Yes — ITT includes everyone randomised by definition',
      'No — ITT needs outcomes for everyone; use methods such as multiple imputation or inverse-probability weighting under stated assumptions, plus sensitivity analyses',
      'Yes, if missingness is above 10%',
      'Only for continuous outcomes',
    ],
    answer: 1,
    explanation: 'ITT is about analysing participants in the arm they were randomised to. Missing outcomes still have to be handled; complete-case analysis is biased when missingness depends on prognosis and arm.',
  },

  // ───────────────────────────── 7. Information bias
  {
    id: 'ib-nd', module: 'information-bias', level: 2, type: 'mcq',
    stem: 'Non-differential, independent misclassification of a binary exposure in a cohort study is expected to bias the RR:',
    options: ['Away from the null', 'Toward the null (on average)', 'Not at all', 'Always to exactly 1'],
    answer: 1,
    explanation: 'Mixing exposed and unexposed people dilutes the contrast. This is an expectation across studies, assuming Se + Sp > 1; a single study can still be further from the null by chance (Jurek et al. 2005).',
    refs: ['jurek2005'],
  },
  {
    id: 'ib-recall', module: 'information-bias', level: 1, type: 'mcq',
    stem: 'Mothers of infants with malformations report medication use more completely than control mothers. This is:',
    options: ['Selection bias', 'Differential exposure misclassification (recall bias)', 'Confounding', 'Non-differential misclassification'],
    answer: 1,
    explanation: 'Sensitivity of exposure recall is higher in cases than controls. Differential misclassification can bias in either direction; here it typically exaggerates the association. Prefer records collected before the outcome.',
  },
  {
    id: 'ib-outcome', module: 'information-bias', level: 3, type: 'mcq',
    stem: 'An outcome is detected with 70% sensitivity and 100% specificity in both arms of a trial. What happens to the estimates?',
    options: [
      'RR unbiased; risks and the RD are underestimated',
      'RR biased toward the null',
      'RR biased away from the null',
      'All measures unbiased',
    ],
    answer: 0,
    explanation: 'With perfect specificity, observed risk = 0.7 × true risk in each arm; the ratio is unchanged but the difference shrinks by 30%. Specificity matters more than sensitivity for ratio measures of rare outcomes.',
  },
  {
    id: 'ib-blind', module: 'information-bias', level: 1, type: 'mcq',
    stem: 'Which feature best prevents detection (ascertainment) bias for a subjective outcome?',
    options: ['Larger sample size', 'Blinding outcome assessors to exposure or treatment', 'Stratified randomisation', 'Matching'],
    answer: 1,
    explanation: 'If assessors know allocation, they may look harder or judge differently. Blinded adjudication or objective outcomes prevent differential outcome misclassification. Describe who was blinded instead of using "double-blind" (Devereaux et al. 2001).',
    refs: ['devereaux2001'],
  },
  {
    id: 'ib-calc', module: 'information-bias', level: 2, type: 'numeric',
    stem: 'True data: 100 of 200 cases and 50 of 200 controls exposed (OR 3.0). Exposure is measured with sensitivity 0.8 and specificity 1.0 in everyone. What OR will be observed?',
    answer: 2.67, tolerance: 0.02,
    explanation: 'Observed exposed: cases 80 (120 unexposed); controls 40 (160 unexposed). OR = (80·160)/(120·40) = 2.67 — toward the null, as expected for non-differential misclassification.',
  },
  {
    id: 'ib-single', module: 'information-bias', level: 3, type: 'mcq',
    stem: 'A case–control study with suspected non-differential exposure misclassification reports OR 2.5. Can you conclude the true OR is at least 2.5?',
    options: [
      'Yes — non-differential misclassification only biases toward the null',
      'No — the toward-null rule is an average; random error, dependent errors, or polytomous exposures can put a single estimate further from the null',
      'Yes, if the CI excludes 1',
      'No, because the bias is always away from the null',
    ],
    answer: 1,
    explanation: 'Use quantitative bias analysis rather than the heuristic (Jurek et al. 2005; Lash et al. 2014).',
    refs: ['jurek2005', 'lash2014'],
  },

  // ───────────────────────────── 8. Effect modification
  {
    id: 'em-aspirin', module: 'effect-modification', level: 2, type: 'mcq',
    stem: 'Aspirin reduced first MI in men (Physicians\' Health Study, RR ≈ 0.56) but not in women (Women\'s Health Study, RR ≈ 1.02), where it reduced ischaemic stroke. Taken at face value, this suggests:',
    options: [
      'Confounding by sex',
      'Effect modification by sex — though between-trial comparisons are weak evidence because dose, age and follow-up also differed',
      'Selection bias',
      'Measurement error',
    ],
    answer: 1,
    explanation: 'Different effects across levels of a third factor is effect modification. Comparisons across separate trials are less credible than within-trial interaction tests (ICEMAN).',
    refs: ['ridker2005', 'schandelmaier2020'],
  },
  {
    id: 'em-scale', module: 'effect-modification', level: 3, type: 'mcq',
    stem: 'Illustrative lung-cancer risks per 1,000 (pattern like Hammond et al. 1979): neither exposure 1, smoking only 10, asbestos only 5, both 50. Which is true?',
    options: [
      'No interaction on either scale',
      'No multiplicative interaction (10 × 5 = 50) but strong additive interaction (RERI = 36)',
      'Multiplicative interaction only',
      'The exposures are antagonistic',
    ],
    answer: 1,
    explanation: 'RR₁₁ = 50 = RR₁₀ × RR₀₁ → no multiplicative interaction. RERI = 50 − 10 − 5 + 1 = 36 → far more cases among the jointly exposed than the sum of separate effects predicts. Removing either exposure prevents most joint cases.',
    refs: ['hammond1979', 'vanderweele2014'],
  },
  {
    id: 'em-signif', module: 'effect-modification', level: 2, type: 'mcq',
    stem: '"The effect was significant in men (P = 0.01) but not in women (P = 0.20)." What follows?',
    options: [
      'The treatment works only in men',
      'Nothing about modification — you need a direct comparison (interaction test or the difference between subgroup estimates with its CI)',
      'Sex is a confounder',
      'Women should not receive the treatment',
    ],
    answer: 1,
    explanation: 'A difference in significance is not a significant difference. Subgroups often differ in size and precision; compare estimates directly.',
  },
  {
    id: 'em-reri', module: 'effect-modification', level: 2, type: 'numeric',
    stem: 'Risks: R₀₀ = 0.05, R₁₀ = 0.10, R₀₁ = 0.15, R₁₁ = 0.30. Compute the relative excess risk due to interaction (RERI).',
    answer: 2, tolerance: 0.01,
    explanation: 'RR₁₀ = 2, RR₀₁ = 3, RR₁₁ = 6. RERI = 6 − 2 − 3 + 1 = 2 > 0 → positive additive interaction. Multiplicatively, 6/(2·3) = 1: none.',
    refs: ['knol2012'],
  },
  {
    id: 'em-vs-conf', module: 'effect-modification', level: 1, type: 'mcq',
    stem: 'Which statement is correct?',
    options: [
      'Effect modification is a bias that should be removed by adjustment.',
      'Confounding is a bias to remove; effect modification is a property of the effect to describe and report.',
      'They are the same thing on different scales.',
      'A variable cannot be both a confounder and an effect modifier.',
    ],
    answer: 1,
    explanation: 'A variable can be both. Remove confounding, then report stratum-specific effects if they genuinely differ.',
  },
  {
    id: 'em-iceman', module: 'effect-modification', level: 2, type: 'mcq',
    stem: 'Which feature most increases the credibility of a subgroup effect in a trial?',
    options: [
      'It was discovered after looking at 30 subgroups',
      'It was pre-specified with a stated direction, is one of few hypotheses, comes from within-trial comparison and is supported by an interaction test',
      'It has a very small P value in one subgroup',
      'It reverses the overall result',
    ],
    answer: 1,
    explanation: 'These are core ICEMAN criteria (Schandelmaier et al. 2020).',
    refs: ['schandelmaier2020'],
  },
  {
    id: 'em-nnt', module: 'effect-modification', level: 2, type: 'mcq',
    stem: 'A drug has RR 0.75 at every baseline risk. Compare patients at 40% and 4% risk:',
    options: [
      'Same absolute benefit',
      'High-risk NNT = 10, low-risk NNT = 100 — effect modification on the additive scale',
      'High-risk patients benefit less',
      'No modification on any scale',
    ],
    answer: 1,
    explanation: 'ARR = 0.25 × baseline: 0.10 vs 0.01. Constant relative effects imply heterogeneous absolute effects — which is what treatment decisions depend on.',
  },

  // ───────────────────────────── 9. Clinical biases
  {
    id: 'cb-immortal', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'Post-MI patients are called "statin users" if they fill a prescription any time in the first year; follow-up for death starts at discharge for everyone. What bias results?',
    options: [
      'Immortal time bias favouring statins',
      'Recall bias',
      'Lead-time bias',
      'Bias toward the null from misclassification',
    ],
    answer: 0,
    explanation: 'Users must survive until their first fill, and that event-free time is credited to the exposed group. Fix by classifying exposure as time-varying, using a landmark, or emulating a target trial with a common time zero (Suissa 2008).',
    refs: ['suissa2008', 'levesque2010'],
  },
  {
    id: 'cb-indication', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'In routine-care data, patients started on a new anticoagulant have higher mortality than untreated patients. Best design response?',
    options: [
      'Conclude the drug is harmful',
      'Suspect confounding by indication; compare new users with new users of an active comparator for the same indication',
      'Increase the sample size',
      'Exclude patients who died early',
    ],
    answer: 1,
    explanation: 'Patients are treated because they are at risk. New-user, active-comparator designs make groups more comparable and align time zero (Ray 2003).',
    refs: ['ray2003'],
  },
  {
    id: 'cb-protopathic', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'Iron prescriptions appear to "cause" colon cancer diagnosed within 6 months. What is the likely explanation and fix?',
    options: [
      'Confounding by smoking; adjust for smoking',
      'Protopathic bias (reverse causation): early symptoms of undiagnosed cancer prompt the prescription; apply a lag period',
      'Selection bias; use hospital controls',
      'Lead-time bias; use survival',
    ],
    answer: 1,
    explanation: 'Exposure prescribed for prodromal signs of the outcome. Excluding exposure in a window before diagnosis (lag) reduces it.',
  },
  {
    id: 'cb-leadtime', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'Screening detects a cancer 3 years earlier, yet patients die at the same age as without screening. Five-year survival from diagnosis rises from 40% to 70%. This is:',
    options: ['Real benefit', 'Lead-time bias', 'Recall bias', 'Healthy-user effect'],
    answer: 1,
    explanation: 'The survival clock starts earlier; death is not postponed. Evaluate screening by disease-specific or all-cause mortality in randomised populations.',
    refs: ['welch2010'],
  },
  {
    id: 'cb-length', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'Why do screen-detected cancers have better prognosis than interval cancers even if screening is useless?',
    options: [
      'Length-time bias: slow-growing tumours spend longer in the detectable preclinical phase and are over-represented; overdiagnosis adds indolent cases',
      'Recall bias',
      'Berkson\'s bias',
      'Confounding by age only',
    ],
    answer: 0,
    explanation: 'Periodic screening preferentially catches indolent disease and some that would never cause harm (overdiagnosis).',
    refs: ['welch2010'],
  },
  {
    id: 'cb-rtm', module: 'clinical-biases', level: 2, type: 'mcq',
    stem: 'Patients selected for a single blood-pressure reading ≥ 160 mmHg have a mean fall of 12 mmHg at re-measurement without treatment. Why?',
    options: ['Placebo effect only', 'Regression to the mean', 'Hawthorne effect only', 'Lead time'],
    answer: 1,
    explanation: 'Selecting on an extreme, noisy measurement guarantees that re-measurements move toward the mean. Use a randomised control group, multiple baseline readings, or analysis of covariance (Barnett et al. 2005).',
    refs: ['barnett2005'],
  },
  {
    id: 'cb-whi', module: 'clinical-biases', level: 3, type: 'mcq',
    stem: 'Observational cohorts suggested hormone therapy prevents coronary disease; the WHI trial did not. Re-analysing the Nurses\' Health Study as a target trial of new users largely reconciled the results. The main lesson:',
    options: [
      'Observational studies are useless',
      'Prevalent-user bias and misaligned time zero (plus healthy-user effects) can distort observational analyses; emulating the trial\'s design fixes much of it',
      'Randomised trials are always wrong',
      'Only sample size mattered',
    ],
    answer: 1,
    explanation: 'Prevalent users have survived early treatment, and early risks were missed. Comparing initiators from a common time zero brought estimates close to WHI (Hernán et al. 2008).',
    refs: ['hernan2008whi'],
  },

  // ───────────────────────────── 10. Appraisal
  {
    id: 'ap-hill', module: 'appraisal', level: 1, type: 'mcq',
    stem: 'Which of Bradford Hill\'s considerations is a necessary condition for causation?',
    options: ['Strength', 'Consistency', 'Temporality', 'Biological gradient'],
    answer: 2,
    explanation: 'The cause must precede the effect. Hill presented the others as aids to judgement, not criteria; strong, consistent or dose–response associations can still be confounded (Hill 1965).',
    refs: ['hill1965'],
  },
  {
    id: 'ap-evalue', module: 'appraisal', level: 2, type: 'numeric',
    stem: 'An observational study reports RR = 2.0. What is the E-value for the point estimate? (two decimals)',
    answer: 3.41, tolerance: 0.02,
    explanation: 'E = RR + √(RR(RR − 1)) = 2 + √2 = 3.41.',
    refs: ['vanderweele2017'],
  },
  {
    id: 'ap-evalue-meaning', module: 'appraisal', level: 2, type: 'mcq',
    stem: 'An E-value of 3.4 means:',
    options: [
      'There is a 3.4% chance the result is confounded.',
      'An unmeasured confounder associated with both exposure and outcome by a risk ratio of at least 3.4 each, beyond measured covariates, could explain away the estimate; weaker confounding alone could not.',
      'The causal effect is 3.4.',
      'The study needs 3.4 times more participants.',
    ],
    answer: 1,
    explanation: 'The E-value is a threshold of joint confounder strength. Judge its plausibility against known strong risk factors in the field; it does not prove causation.',
    refs: ['vanderweele2017'],
  },
  {
    id: 'ap-guideline', module: 'appraisal', level: 1, type: 'mcq',
    stem: 'An observational study that explicitly emulates a target trial of statin initiation should report using:',
    options: ['CONSORT 2025', 'PRISMA 2020', 'TARGET (2025)', 'STARD 2015'],
    answer: 2,
    explanation: 'TARGET (BMJ/JAMA 2025) is the reporting guideline for target trial emulations (21 items). CONSORT 2025 is for randomised trials, PRISMA 2020 for systematic reviews, STARD 2015 for diagnostic accuracy.',
    refs: ['target2025'],
  },
  {
    id: 'ap-rob', module: 'appraisal', level: 1, type: 'mcq',
    stem: 'Which tool assesses risk of bias in a non-randomised study of an intervention?',
    options: ['RoB 2', 'ROBINS-I (version 2, 2024)', 'PRISMA 2020', 'CONSORT 2025'],
    answer: 1,
    explanation: 'ROBINS-I compares the study with a hypothetical target trial across confounding, selection, classification of interventions, deviations, missing data, measurement and reporting. V2 adds algorithms and immortal-time items. RoB 2 is for randomised trials; PRISMA and CONSORT are reporting guidelines.',
    refs: ['robinsi2024', 'sterne2019'],
  },
  {
    id: 'ap-grade', module: 'appraisal', level: 2, type: 'mcq',
    stem: 'In GRADE, where does a body of non-randomised evidence start?',
    options: [
      'High, always',
      'Low — or high if risk of bias is judged with ROBINS-I, which then usually rates it down',
      'Very low, always',
      'It cannot be graded',
    ],
    answer: 1,
    explanation: 'Classically observational evidence starts low and can be rated up (large effect, dose–response, plausible bias against the effect) or down. GRADE guidance 18 (2019) allows starting high when ROBINS-I is used because that tool already benchmarks against a target trial.',
    refs: ['guyatt2008', 'schunemann2019'],
  },
  {
    id: 'ap-tri', module: 'appraisal', level: 3, type: 'mcq',
    stem: 'Which gives the strongest support for a causal effect?',
    options: [
      'Ten cohort studies in the same database with the same analysis',
      'Consistent results across designs with different, unrelated bias structures (e.g. cohort, sibling comparison, Mendelian randomisation, trial)',
      'One study with P < 0.0001',
      'A large meta-analysis of case–control studies sharing the same recall bias',
    ],
    answer: 1,
    explanation: 'Triangulation: if different approaches with different likely biases agree, a single shared bias is an unlikely explanation (Lawlor et al. 2016).',
    refs: ['lawlor2016'],
  },

  // ───────────────────────────── 11. Ethics
  {
    id: 'et-equipoise', module: 'ethics', level: 1, type: 'mcq',
    stem: 'Clinical equipoise (Freedman 1987) exists when:',
    options: [
      'The individual investigator is personally undecided',
      'There is honest, professional disagreement in the expert clinical community about the preferred treatment',
      'The sponsor has no financial interest',
      'Patients have no preference',
    ],
    answer: 1,
    explanation: 'Freedman moved the requirement from the individual clinician (theoretical equipoise) to the community of experts, which is what justifies randomising patients.',
    refs: ['freedman1987'],
  },
  {
    id: 'et-placebo', module: 'ethics', level: 2, type: 'mcq',
    stem: 'Under the Declaration of Helsinki (2024), a placebo-controlled trial is acceptable when:',
    options: [
      'Placebo is cheaper',
      'No proven intervention exists, or there are compelling, scientifically sound methodological reasons and patients face no additional risk of serious or irreversible harm',
      'The disease is mild, regardless of available treatments',
      'Participants sign a waiver',
    ],
    answer: 1,
    explanation: 'Otherwise the new intervention should be compared with the best proven intervention. Extreme care is required to avoid abuse of the methodological exception.',
    refs: ['helsinki2024'],
  },
  {
    id: 'et-belmont', module: 'ethics', level: 1, type: 'mcq',
    stem: 'Informed consent is the main application of which Belmont principle?',
    options: ['Beneficence', 'Justice', 'Respect for persons', 'Equipoise'],
    answer: 2,
    explanation: 'Belmont: respect for persons → informed consent; beneficence → assessment of risks and benefits; justice → fair selection of participants. Equipoise is a separate concept specific to trials.',
    refs: ['belmont1979'],
  },
  {
    id: 'et-waiver', module: 'ethics', level: 3, type: 'mcq',
    stem: 'For a minimal-risk review of 50,000 health records, under what conditions can a U.S. IRB waive informed consent (45 CFR 46.116(f))?',
    options: [
      'Whenever obtaining consent is inconvenient',
      'Minimal risk; research impracticable without the waiver; (if identifiable data) impracticable without identifiers; no adverse effect on rights and welfare; additional information to participants when appropriate',
      'Only if the data are already published',
      'Never — consent is always required',
    ],
    answer: 1,
    explanation: 'All criteria must be met and documented by the IRB. Privacy rules (e.g. HIPAA) may impose further requirements.',
    refs: ['commonrule2018'],
  },
  {
    id: 'et-stop', module: 'ethics', level: 2, type: 'mcq',
    stem: 'A trial stops early for benefit at its first interim analysis, with few events. What should readers expect?',
    options: [
      'An accurate effect estimate',
      'Overestimation of the treatment effect (truncated trials exaggerate benefit, especially with few events)',
      'Underestimation of benefit',
      'No impact on the estimate',
    ],
    answer: 1,
    explanation: 'Stopping at a random high produces inflated estimates (Bassler et al. 2010). DSMBs use conservative boundaries and a minimum number of events.',
    refs: ['bassler2010'],
  },
  {
    id: 'et-register', module: 'ethics', level: 1, type: 'mcq',
    stem: 'ICMJE journals require clinical trials to be registered:',
    options: ['Before submission', 'At or before enrolment of the first participant', 'Within a year of completion', 'Only if industry-funded'],
    answer: 1,
    explanation: 'Prospective registration (since 2005) deters selective reporting and outcome switching. CONSORT 2025 adds an open-science section covering registration, protocol and data sharing.',
    refs: ['icmje', 'consort2025'],
  },
  {
    id: 'et-expedited', module: 'ethics', level: 2, type: 'mcq',
    stem: 'Under the Common Rule, expedited IRB review (45 CFR 46.110) applies to:',
    options: [
      'Any study with a tight deadline',
      'Research involving no more than minimal risk that falls within the federal list of eligible categories, or minor changes to approved research',
      'Studies with slightly more than minimal risk',
      'All observational studies',
    ],
    answer: 1,
    explanation: 'Expedited review is a procedure (the IRB chair or one or more experienced members review it), not a lower standard. Greater-than-minimal-risk research needs convened full-board review; some minimal-risk research is exempt (46.104).',
    refs: ['commonrule2018'],
  },
  {
    id: 'et-posttrial', module: 'ethics', level: 2, type: 'mcq',
    stem: 'What does the 2024 Declaration of Helsinki say about access after a trial?',
    options: [
      'Nothing — post-trial access is a local matter',
      'Sponsors and researchers must arrange, in advance, post-trial provisions for participants who still need an intervention identified as beneficial, and disclose them during consent',
      'Participants must pay for continued treatment',
      'Access is required only for placebo arms',
    ],
    answer: 1,
    explanation: 'The 2024 revision (which also replaces "subjects" with "participants") reinforces planning post-trial provisions in advance.',
    refs: ['helsinki2024'],
  },
];

export const questionsByModule = (id: ModuleId) => questions.filter((q) => q.module === id);

/** Check an answer; numeric answers accept a tolerance. */
export function isCorrect(q: Question, response: number): boolean {
  if (q.type === 'mcq') return response === q.answer;
  return Math.abs(response - q.answer) <= q.tolerance;
}
