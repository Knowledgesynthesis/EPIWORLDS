import { lazy, type ComponentType, type LazyExoticComponent } from 'react';
import type { ModuleId } from '../../data/curriculum';

export const lessons: Record<ModuleId, LazyExoticComponent<ComponentType>> = {
  measures: lazy(() => import('./Measures')),
  'study-designs': lazy(() => import('./StudyDesigns')),
  'random-error': lazy(() => import('./RandomError')),
  'causal-dags': lazy(() => import('./CausalDags')),
  confounding: lazy(() => import('./Confounding')),
  'selection-bias': lazy(() => import('./SelectionBias')),
  'information-bias': lazy(() => import('./InformationBias')),
  'effect-modification': lazy(() => import('./EffectModification')),
  'clinical-biases': lazy(() => import('./ClinicalBiases')),
  appraisal: lazy(() => import('./Appraisal')),
  ethics: lazy(() => import('./Ethics')),
};
