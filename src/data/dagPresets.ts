import type { DagWorkspace } from '../stores/useDagStore';

export interface DagPreset {
  id: string;
  name: string;
  /** What the learner should try. */
  task: string;
  /** Revealed after checking. */
  lesson: string;
  workspace: DagWorkspace;
  refs?: string[];
}

const n = (id: string, label: string, x: number, y: number, latent = false) => ({ id, label, x, y, latent });
const e = (from: string, to: string) => ({ from, to });

export const dagPresets: DagPreset[] = [
  {
    id: 'confounding',
    name: 'Confounding',
    task: 'Coffee drinkers have more MIs. Which variable(s) must you adjust for to estimate the effect of coffee on MI?',
    lesson: 'Smoking causes both coffee drinking and MI, opening the backdoor path Coffee ← Smoking → MI. Adjusting for Smoking blocks it.',
    workspace: {
      dag: { nodes: [n('Smoking', 'Smoking', 50, 5), n('Coffee', 'Coffee', 8, 90), n('MI', 'MI', 92, 90)], edges: [e('Smoking', 'Coffee'), e('Smoking', 'MI'), e('Coffee', 'MI')] },
      exposure: 'Coffee', outcome: 'MI', adjusted: [],
    },
  },
  {
    id: 'mediator',
    name: 'Mediator',
    task: 'Estimate the total effect of exercise on diabetes. Should you adjust for weight? For age?',
    lesson: 'Age is a common cause — adjust. Weight is a mediator (Exercise → Weight → Diabetes); adjusting for it removes part of the effect you want and is forbidden by the backdoor criterion for the total effect.',
    workspace: {
      dag: {
        nodes: [n('Age', 'Age', 50, 0), n('Exercise', 'Exercise', 5, 85), n('Weight', 'Weight', 50, 55), n('Diabetes', 'Diabetes', 95, 85)],
        edges: [e('Age', 'Exercise'), e('Age', 'Diabetes'), e('Exercise', 'Weight'), e('Weight', 'Diabetes'), e('Exercise', 'Diabetes')],
      },
      exposure: 'Exercise', outcome: 'Diabetes', adjusted: [],
    },
  },
  {
    id: 'berkson',
    name: "Collider (Berkson's bias)",
    task: 'Diabetes and gallbladder disease are independent. Restrict to hospitalised patients by adjusting for "Hospitalised" and watch the path.',
    lesson: 'Hospitalised is a collider (Diabetes → Hospitalised ← Gallbladder). Conditioning on it opens a non-causal path and creates an association that does not exist in the population.',
    workspace: {
      dag: { nodes: [n('Diabetes', 'Diabetes', 5, 15), n('Gallbladder', 'Gallbladder', 95, 15), n('Hospitalised', 'Hospitalised', 50, 90)], edges: [e('Diabetes', 'Hospitalised'), e('Gallbladder', 'Hospitalised')] },
      exposure: 'Diabetes', outcome: 'Gallbladder', adjusted: [],
    },
    refs: ['berkson1946'],
  },
  {
    id: 'birthweight',
    name: 'Birth-weight paradox',
    task: 'Among low-birth-weight infants, maternal smoking appears protective. Adjust for LBW and see why.',
    lesson: 'LBW is a mediator and a collider (Smoking → LBW ← Defects). Conditioning on LBW opens Smoking → LBW ← Defects → Mortality, producing the paradox (Hernández-Díaz et al. 2006). For the total effect, no adjustment is needed here.',
    workspace: {
      dag: {
        nodes: [n('Smoking', 'Maternal smoking', 5, 20), n('LBW', 'LBW', 50, 55), n('Defects', 'Birth defects', 50, 100, true), n('Mortality', 'Infant death', 95, 20)],
        edges: [e('Smoking', 'LBW'), e('LBW', 'Mortality'), e('Smoking', 'Mortality'), e('Defects', 'LBW'), e('Defects', 'Mortality')],
      },
      exposure: 'Smoking', outcome: 'Mortality', adjusted: [],
    },
    refs: ['hernandezdiaz2006'],
  },
  {
    id: 'mbias',
    name: 'M-bias',
    task: 'M is measured before exposure and is associated with both X and Y. Is it a confounder?',
    lesson: 'No. M is a collider on X ← U1 → M ← U2 → Y. The path is blocked unless you adjust for M. Pre-exposure status and association with both variables do not make a confounder.',
    workspace: {
      dag: {
        nodes: [n('U1', 'U1', 15, 0, true), n('U2', 'U2', 85, 0, true), n('M', 'M', 50, 40), n('X', 'X', 5, 95), n('Y', 'Y', 95, 95)],
        edges: [e('U1', 'X'), e('U1', 'M'), e('U2', 'M'), e('U2', 'Y'), e('X', 'Y')],
      },
      exposure: 'X', outcome: 'Y', adjusted: [],
    },
    refs: ['greenland1999dag'],
  },
  {
    id: 'butterfly',
    name: 'Butterfly bias',
    task: 'M is both a confounder and a collider. Mark U1 or U2 as measured (toggle "unmeasured") and find a valid set.',
    lesson: 'Adjusting for M blocks X ← M → Y but opens X ← U1 → M ← U2 → Y. You need M plus U1 or U2. If both U are unmeasured, no adjustment set is sufficient — consider sensitivity analysis.',
    workspace: {
      dag: {
        nodes: [n('U1', 'U1', 10, 0, true), n('U2', 'U2', 90, 0, true), n('M', 'M', 50, 35), n('X', 'X', 5, 95), n('Y', 'Y', 95, 95)],
        edges: [e('U1', 'X'), e('U1', 'M'), e('U2', 'M'), e('U2', 'Y'), e('M', 'X'), e('M', 'Y'), e('X', 'Y')],
      },
      exposure: 'X', outcome: 'Y', adjusted: [],
    },
  },
  {
    id: 'two-sets',
    name: 'Several valid sets',
    task: 'Find two different minimal sufficient adjustment sets.',
    lesson: 'The backdoor path Supplement ← Diet ← SES → Fracture can be blocked at Diet or at SES. Pick whichever is measured better.',
    workspace: {
      dag: {
        nodes: [n('SES', 'SES', 50, 0), n('Diet', 'Diet', 15, 45), n('Supplement', 'Supplement', 10, 95), n('Fracture', 'Fracture', 92, 95)],
        edges: [e('SES', 'Diet'), e('Diet', 'Supplement'), e('SES', 'Fracture'), e('Supplement', 'Fracture')],
      },
      exposure: 'Supplement', outcome: 'Fracture', adjusted: [],
    },
  },
  {
    id: 'indication',
    name: 'Unmeasured confounding',
    task: 'Severity is measured; frailty is not. Is the effect of the new drug on death identifiable by adjustment?',
    lesson: 'Adjusting for Severity blocks one backdoor path, but Drug ← Frailty → Death stays open and Frailty is unmeasured. No sufficient set exists: use design (active comparator, new users), better data, or a sensitivity analysis such as the E-value.',
    workspace: {
      dag: {
        nodes: [n('Severity', 'Severity', 30, 0), n('Frailty', 'Frailty', 75, 0, true), n('Drug', 'New drug', 5, 95), n('Death', 'Death', 95, 95)],
        edges: [e('Severity', 'Drug'), e('Severity', 'Death'), e('Frailty', 'Drug'), e('Frailty', 'Death'), e('Frailty', 'Severity'), e('Drug', 'Death')],
      },
      exposure: 'Drug', outcome: 'Death', adjusted: [],
    },
  },
];

export const emptyWorkspace: DagWorkspace = { dag: { nodes: [], edges: [] }, exposure: null, outcome: null, adjusted: [] };
