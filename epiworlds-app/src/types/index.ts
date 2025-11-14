// Study Design Types
export type StudyDesignType =
  | 'rct'
  | 'cohort'
  | 'case-control'
  | 'cross-sectional'
  | 'ecologic';

export interface StudyDesign {
  id: string;
  name: string;
  type: StudyDesignType;
  description: string;
  strengths: string[];
  limitations: string[];
  examples: string[];
  prerequisites: string[];
}

// Bias Types
export type BiasType =
  | 'selection'
  | 'information'
  | 'confounding'
  | 'measurement'
  | 'recall'
  | 'observer'
  | 'publication'
  | 'loss-to-followup';

export interface BiasDefinition {
  id: string;
  name: string;
  type: BiasType;
  description: string;
  examples: string[];
  prevention: string[];
  direction: 'towards-null' | 'away-from-null' | 'unpredictable';
}

// DAG (Directed Acyclic Graph) Types
export interface DAGNode {
  id: string;
  label: string;
  x: number;
  y: number;
  type: 'exposure' | 'outcome' | 'confounder' | 'mediator' | 'collider' | 'other';
}

export interface DAGEdge {
  id: string;
  source: string;
  target: string;
  type: 'causal' | 'associational';
}

export interface DAG {
  id: string;
  name: string;
  description: string;
  nodes: DAGNode[];
  edges: DAGEdge[];
  backdoorPaths?: string[][];
  adjustmentSet?: string[];
}

// Effect Modification & Confounding
export interface Variable {
  id: string;
  name: string;
  type: 'continuous' | 'categorical' | 'binary';
  role: 'exposure' | 'outcome' | 'confounder' | 'effect-modifier' | 'independent';
}

export interface StratificationResult {
  stratum: string;
  riskRatio: number;
  oddsRatio: number;
  sampleSize: number;
}

// Assessment Types
export type QuestionType =
  | 'multiple-choice'
  | 'true-false'
  | 'matching'
  | 'case-study';

export interface Question {
  id: string;
  type: QuestionType;
  question: string;
  options?: string[];
  correctAnswer: string | string[];
  explanation: string;
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  references?: string[];
}

export interface Assessment {
  id: string;
  title: string;
  description: string;
  questions: Question[];
  passingScore: number;
  timeLimit?: number;
}

// Glossary Types
export interface GlossaryTerm {
  id: string;
  term: string;
  definition: string;
  synonyms?: string[];
  relatedTerms?: string[];
  examples?: string[];
  category: string;
}

// Module/Lesson Types
export interface LearningObjective {
  id: string;
  description: string;
  bloomLevel: 'remember' | 'understand' | 'apply' | 'analyze' | 'evaluate' | 'create';
  achieved?: boolean;
}

export interface Module {
  id: string;
  title: string;
  description: string;
  order: number;
  prerequisites: string[];
  objectives: LearningObjective[];
  estimatedTime: number;
  content: ContentBlock[];
  completed?: boolean;
}

export type ContentBlockType =
  | 'text'
  | 'interactive'
  | 'video'
  | 'quiz'
  | 'case-study';

export interface ContentBlock {
  id: string;
  type: ContentBlockType;
  title?: string;
  content: any;
  order: number;
}

// Synthetic Data Types
export interface SyntheticDataset {
  id: string;
  name: string;
  description: string;
  variables: Variable[];
  sampleSize: number;
  data: Record<string, any>[];
  studyType: StudyDesignType;
}

// Ethics Types
export interface EthicsScenario {
  id: string;
  title: string;
  description: string;
  studyDesign: StudyDesignType;
  ethicalIssues: string[];
  considerations: string[];
  recommendations: string[];
  references?: string[];
}

// User Progress Types
export interface UserProgress {
  userId: string;
  modulesCompleted: string[];
  assessmentScores: Record<string, number>;
  currentModule?: string;
  lastActive: Date;
  totalTimeSpent: number;
}

// Navigation Types
export interface NavigationItem {
  id: string;
  label: string;
  path: string;
  icon?: string;
  children?: NavigationItem[];
}
