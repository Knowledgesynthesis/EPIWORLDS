import type { Question, Assessment } from '../types';

// Study Design Questions
const studyDesignQuestions: Question[] = [
  {
    id: 'sd-1',
    type: 'multiple-choice',
    question:
      'A researcher wants to study the relationship between smoking and lung cancer. She identifies 200 patients with lung cancer and 200 patients without lung cancer, then looks back at their smoking history. What type of study is this?',
    options: [
      'Randomized controlled trial',
      'Cohort study',
      'Case-control study',
      'Cross-sectional study',
    ],
    correctAnswer: 'Case-control study',
    explanation:
      'This is a case-control study because the researcher starts with the outcome (lung cancer) and looks backward to determine exposure (smoking history). Case-control studies are retrospective and efficient for rare outcomes.',
    difficulty: 'beginner',
    category: 'Study Design',
  },
  {
    id: 'sd-2',
    type: 'multiple-choice',
    question:
      'Which study design provides the strongest evidence for causality?',
    options: [
      'Ecologic study',
      'Cross-sectional study',
      'Case-control study',
      'Randomized controlled trial',
    ],
    correctAnswer: 'Randomized controlled trial',
    explanation:
      'RCTs provide the strongest evidence for causality because randomization balances both measured and unmeasured confounders between groups, and the prospective design establishes temporal relationship.',
    difficulty: 'beginner',
    category: 'Study Design',
  },
  {
    id: 'sd-3',
    type: 'multiple-choice',
    question:
      'A study follows 1000 healthcare workers over 5 years, tracking who develops COVID-19 based on their baseline vaccination status. This is a:',
    options: [
      'Case-control study',
      'Prospective cohort study',
      'Cross-sectional study',
      'Randomized trial',
    ],
    correctAnswer: 'Prospective cohort study',
    explanation:
      'This is a prospective cohort study because it follows a defined population forward in time from exposure (vaccination status) to outcome (COVID-19). The temporal relationship is clear and incidence can be directly calculated.',
    difficulty: 'intermediate',
    category: 'Study Design',
  },
  {
    id: 'sd-4',
    type: 'multiple-choice',
    question:
      'What is the main limitation of cross-sectional studies for establishing causality?',
    options: [
      'They are too expensive',
      'They cannot establish temporal relationship',
      'They require randomization',
      'They take too long to complete',
    ],
    correctAnswer: 'They cannot establish temporal relationship',
    explanation:
      'Cross-sectional studies measure exposure and outcome at the same time, making it impossible to determine which came first. This temporal ambiguity prevents causal inference.',
    difficulty: 'intermediate',
    category: 'Study Design',
  },
  {
    id: 'sd-5',
    type: 'multiple-choice',
    question:
      'A researcher compares national smoking rates with national lung cancer mortality rates across 50 countries. What is the main concern with this study?',
    options: [
      'Sample size is too small',
      'Ecological fallacy',
      'Selection bias',
      'Recall bias',
    ],
    correctAnswer: 'Ecological fallacy',
    explanation:
      'This ecologic study uses aggregated data at the country level. The ecological fallacy occurs when associations at the group level do not reflect individual-level relationships. National-level correlations may not apply to individuals.',
    difficulty: 'advanced',
    category: 'Study Design',
  },
];

// Bias Questions
const biasQuestions: Question[] = [
  {
    id: 'bias-1',
    type: 'multiple-choice',
    question:
      'In a case-control study of birth defects, mothers of affected infants recall medication use during pregnancy more thoroughly than mothers of healthy infants. This is an example of:',
    options: [
      'Selection bias',
      'Recall bias',
      'Observer bias',
      'Confounding',
    ],
    correctAnswer: 'Recall bias',
    explanation:
      'Recall bias occurs when cases and controls differ in their ability or willingness to recall past exposures. Mothers of affected infants are more motivated to remember potential causes, leading to differential misclassification of exposure.',
    difficulty: 'beginner',
    category: 'Bias',
  },
  {
    id: 'bias-2',
    type: 'multiple-choice',
    question:
      'A study of occupational lung disease recruits participants from a hospital. Hospitalized workers are generally sicker than community workers. This introduces:',
    options: [
      'Recall bias',
      'Berkson bias (selection bias)',
      'Measurement bias',
      'Publication bias',
    ],
    correctAnswer: 'Berkson bias (selection bias)',
    explanation:
      'Berkson bias is a type of selection bias that occurs in hospital-based studies. Hospitalized individuals differ systematically from the general population, often being sicker or having multiple conditions, leading to non-representative samples.',
    difficulty: 'intermediate',
    category: 'Bias',
  },
  {
    id: 'bias-3',
    type: 'multiple-choice',
    question:
      'Non-differential misclassification of exposure in a cohort study typically biases the risk ratio:',
    options: [
      'Away from the null',
      'Toward the null',
      'Unpredictably',
      'Has no effect',
    ],
    correctAnswer: 'Toward the null',
    explanation:
      'Non-differential misclassification (same error rate in exposed and unexposed) typically dilutes the association, biasing estimates toward the null (RR=1). This is because exposure misclassification mixes the groups, reducing the apparent difference.',
    difficulty: 'advanced',
    category: 'Bias',
  },
  {
    id: 'bias-4',
    type: 'multiple-choice',
    question:
      'In a double-blind RCT, neither participants nor researchers know treatment allocation. This primarily prevents:',
    options: [
      'Selection bias',
      'Observer and performance bias',
      'Confounding',
      'Loss to follow-up bias',
    ],
    correctAnswer: 'Observer and performance bias',
    explanation:
      'Double-blinding prevents observer bias (differential assessment of outcomes) and performance bias (differential care based on treatment knowledge). It does not prevent confounding, which is addressed by randomization.',
    difficulty: 'intermediate',
    category: 'Bias',
  },
  {
    id: 'bias-5',
    type: 'multiple-choice',
    question:
      'Studies showing positive results are more likely to be published than null findings. This is:',
    options: [
      'Recall bias',
      'Selection bias',
      'Publication bias',
      'Measurement bias',
    ],
    correctAnswer: 'Publication bias',
    explanation:
      'Publication bias occurs when studies with statistically significant or positive results are preferentially published over null findings. This distorts the literature and can lead to overestimation of treatment effects in meta-analyses.',
    difficulty: 'beginner',
    category: 'Bias',
  },
];

// DAG and Confounding Questions
const dagQuestions: Question[] = [
  {
    id: 'dag-1',
    type: 'multiple-choice',
    question:
      'In a DAG, a variable with arrows pointing to both exposure and outcome is a:',
    options: ['Mediator', 'Collider', 'Confounder', 'Instrumental variable'],
    correctAnswer: 'Confounder',
    explanation:
      'A confounder is a variable that causally influences both exposure and outcome, creating a backdoor path. Confounders must be adjusted for to obtain unbiased causal estimates.',
    difficulty: 'beginner',
    category: 'DAG & Confounding',
  },
  {
    id: 'dag-2',
    type: 'multiple-choice',
    question:
      'A variable with arrows pointing INTO it from both exposure and outcome is a:',
    options: ['Mediator', 'Collider', 'Confounder', 'Effect modifier'],
    correctAnswer: 'Collider',
    explanation:
      'A collider is a variable that is causally influenced by both exposure and outcome. Conditioning on (adjusting for) a collider opens a non-causal path and introduces bias. Colliders should NOT be adjusted for.',
    difficulty: 'intermediate',
    category: 'DAG & Confounding',
  },
  {
    id: 'dag-3',
    type: 'multiple-choice',
    question:
      'A variable that lies on the causal pathway between exposure and outcome is a:',
    options: ['Confounder', 'Collider', 'Mediator', 'Instrumental variable'],
    correctAnswer: 'Mediator',
    explanation:
      'A mediator transmits the effect of exposure to outcome (Exposure → Mediator → Outcome). Adjusting for mediators blocks part of the causal pathway, preventing estimation of the total causal effect.',
    difficulty: 'intermediate',
    category: 'DAG & Confounding',
  },
  {
    id: 'dag-4',
    type: 'multiple-choice',
    question:
      'To estimate the causal effect of exposure on outcome, you should adjust for:',
    options: [
      'All measured variables',
      'Variables that open backdoor paths (confounders)',
      'Variables on the causal pathway (mediators)',
      'Variables caused by both exposure and outcome (colliders)',
    ],
    correctAnswer: 'Variables that open backdoor paths (confounders)',
    explanation:
      'The backdoor criterion requires blocking all backdoor paths from exposure to outcome by adjusting for confounders, while not adjusting for mediators (on the causal path) or colliders (which would introduce bias).',
    difficulty: 'advanced',
    category: 'DAG & Confounding',
  },
  {
    id: 'dag-5',
    type: 'multiple-choice',
    question:
      'If stratified analysis shows similar effect estimates across strata of a third variable, and the crude estimate differs from stratified estimates, this suggests:',
    options: [
      'Effect modification',
      'Confounding',
      'Selection bias',
      'Measurement error',
    ],
    correctAnswer: 'Confounding',
    explanation:
      'When stratified estimates are similar to each other but differ from the crude estimate, the third variable is a confounder. Effect modification occurs when stratified estimates differ meaningfully from each other, indicating the effect varies across strata.',
    difficulty: 'advanced',
    category: 'DAG & Confounding',
  },
];

// Effect Modification Questions
const effectModificationQuestions: Question[] = [
  {
    id: 'em-1',
    type: 'multiple-choice',
    question:
      'Aspirin reduces MI risk (RR=0.7) in men but has no effect (RR=1.0) in women. This is an example of:',
    options: [
      'Confounding by sex',
      'Effect modification by sex',
      'Selection bias',
      'Measurement error',
    ],
    correctAnswer: 'Effect modification by sex',
    explanation:
      'Effect modification occurs when the magnitude of an effect differs across levels of a third variable. Here, sex modifies the effect of aspirin on MI. When effect modification is present, stratified results should be reported separately.',
    difficulty: 'intermediate',
    category: 'Effect Modification',
  },
  {
    id: 'em-2',
    type: 'multiple-choice',
    question:
      'How should you report results when effect modification is present?',
    options: [
      'Report only the crude estimate',
      'Adjust for the effect modifier',
      'Report stratified estimates separately',
      'Exclude the effect modifier from analysis',
    ],
    correctAnswer: 'Report stratified estimates separately',
    explanation:
      'When effect modification exists, the effect genuinely differs across subgroups. Reporting stratified estimates preserves this important information. Adjusting away effect modification or reporting only crude estimates would obscure meaningful heterogeneity.',
    difficulty: 'intermediate',
    category: 'Effect Modification',
  },
];

// Create assessments
export const assessments: Assessment[] = [
  {
    id: 'study-design-basics',
    title: 'Study Design Fundamentals',
    description:
      'Test your understanding of different epidemiologic study designs',
    questions: studyDesignQuestions,
    passingScore: 80,
    timeLimit: 20,
  },
  {
    id: 'bias-identification',
    title: 'Bias Identification',
    description: 'Identify types of bias in research scenarios',
    questions: biasQuestions,
    passingScore: 80,
    timeLimit: 25,
  },
  {
    id: 'dag-interpretation',
    title: 'DAG Interpretation',
    description: 'Analyze causal diagrams and identify adjustment strategies',
    questions: dagQuestions,
    passingScore: 80,
    timeLimit: 30,
  },
  {
    id: 'effect-modification',
    title: 'Effect Modification vs Confounding',
    description: 'Distinguish between confounding and effect modification',
    questions: effectModificationQuestions,
    passingScore: 80,
    timeLimit: 15,
  },
];
