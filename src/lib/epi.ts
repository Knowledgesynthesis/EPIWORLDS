/**
 * Epidemiologic measures with standard large-sample intervals.
 *
 * 2×2 orientation used everywhere in EpiWorlds:
 *
 *                Outcome +   Outcome −
 *   Exposed         a           b        n1 = a + b
 *   Unexposed       c           d        n0 = c + d
 *                m1 = a + c  m0 = b + d   N
 *
 * References: Rothman, Lash, VanderWeele & Haneuse, Modern Epidemiology 4e (2021);
 * Katz et al. Biometrics 1978; Woolf, Ann Hum Genet 1955; Newcombe, Stat Med 1998;
 * Greenland & Robins, Biometrics 1985; Robins, Breslow & Greenland, Biometrics 1986;
 * Altman, BMJ 1998; VanderWeele & Ding, Ann Intern Med 2017; Fleiss, Levin & Paik 2003.
 */
import { Z95, chiSquareSf, normCdf, normInv, wilson } from './stats';

export interface Table2x2 {
  a: number;
  b: number;
  c: number;
  d: number;
}

export interface Interval {
  est: number;
  lo: number;
  hi: number;
}

export interface RatioEstimate extends Interval {
  /** Standard error on the log scale. */
  se: number;
  /** True when 0.5 was added to every cell because of a zero cell. */
  corrected: boolean;
}

const NA: RatioEstimate = { est: NaN, lo: NaN, hi: NaN, se: NaN, corrected: false };

export function totals(t: Table2x2) {
  const n1 = t.a + t.b;
  const n0 = t.c + t.d;
  return { n1, n0, m1: t.a + t.c, m0: t.b + t.d, N: n1 + n0 };
}

export function risks(t: Table2x2) {
  const { n1, n0 } = totals(t);
  return { r1: n1 > 0 ? t.a / n1 : NaN, r0: n0 > 0 ? t.c / n0 : NaN };
}

/** Risk ratio with the Katz log-based interval. */
export function riskRatio(t: Table2x2, z = Z95): RatioEstimate {
  let { a, b, c, d } = t;
  if (a + b === 0 || c + d === 0 || (a === 0 && c === 0)) return NA;
  const corrected = a === 0 || c === 0;
  if (corrected) {
    a += 0.5;
    b += 0.5;
    c += 0.5;
    d += 0.5;
  }
  const est = a / (a + b) / (c / (c + d));
  const se = Math.sqrt(1 / a - 1 / (a + b) + 1 / c - 1 / (c + d));
  return { est, lo: est * Math.exp(-z * se), hi: est * Math.exp(z * se), se, corrected };
}

/** Odds ratio with the Woolf (logit) interval. */
export function oddsRatio(t: Table2x2, z = Z95): RatioEstimate {
  let { a, b, c, d } = t;
  if ((a === 0 && c === 0) || (b === 0 && d === 0) || (a === 0 && b === 0) || (c === 0 && d === 0)) return NA;
  const corrected = a === 0 || b === 0 || c === 0 || d === 0;
  if (corrected) {
    a += 0.5;
    b += 0.5;
    c += 0.5;
    d += 0.5;
  }
  const est = (a * d) / (b * c);
  const se = Math.sqrt(1 / a + 1 / b + 1 / c + 1 / d);
  return { est, lo: est * Math.exp(-z * se), hi: est * Math.exp(z * se), se, corrected };
}

/** Risk difference (r1 − r0) with the Newcombe hybrid score interval (method 10). */
export function riskDifference(t: Table2x2, z = Z95): Interval {
  const { n1, n0 } = totals(t);
  if (n1 === 0 || n0 === 0) return { est: NaN, lo: NaN, hi: NaN };
  const p1 = t.a / n1;
  const p0 = t.c / n0;
  const [l1, u1] = wilson(t.a, n1, z);
  const [l0, u0] = wilson(t.c, n0, z);
  const est = p1 - p0;
  return {
    est,
    lo: est - Math.sqrt((p1 - l1) ** 2 + (u0 - p0) ** 2),
    hi: est + Math.sqrt((u1 - p1) ** 2 + (p0 - l0) ** 2),
  };
}

export interface NNT {
  /** 'benefit' when exposure (treatment) lowers the risk of the (undesirable) outcome. */
  kind: 'benefit' | 'harm' | 'none';
  value: number;
  text: string;
  ciText: string;
}

/** Number needed to treat/harm from a risk difference, with Altman's interval convention. */
export function numberNeeded(rd: Interval): NNT {
  if (!Number.isFinite(rd.est)) return { kind: 'none', value: NaN, text: '—', ciText: '—' };
  if (rd.est === 0) return { kind: 'none', value: Infinity, text: 'No difference (NNT = ∞)', ciText: '—' };
  const fmt = (x: number) => (x >= 100 ? Math.round(x).toString() : x.toFixed(1));
  const kind = rd.est < 0 ? 'benefit' : 'harm';
  const value = 1 / Math.abs(rd.est);
  const label = kind === 'benefit' ? 'NNTB' : 'NNTH';
  let ciText: string;
  if (rd.lo > 0 || rd.hi < 0) {
    const x = 1 / Math.abs(rd.lo);
    const y = 1 / Math.abs(rd.hi);
    ciText = `${label} ${fmt(Math.min(x, y))} to ${fmt(Math.max(x, y))}`;
  } else {
    // Interval includes no effect: report NNTB x to ∞ to NNTH y (Altman 1998).
    const nntb = rd.lo < 0 ? fmt(1 / Math.abs(rd.lo)) : '—';
    const nnth = rd.hi > 0 ? fmt(1 / rd.hi) : '—';
    ciText = `NNTB ${nntb} to ∞ to NNTH ${nnth}`;
  }
  return { kind, value, text: `${label} = ${fmt(value)}`, ciText };
}

/** Pearson chi-square test of independence (no continuity correction). */
export function chiSquare2x2(t: Table2x2): { chi2: number; p: number } {
  const { n1, n0, m1, m0, N } = totals(t);
  const denom = n1 * n0 * m1 * m0;
  if (denom === 0) return { chi2: NaN, p: NaN };
  const chi2 = (N * (t.a * t.d - t.b * t.c) ** 2) / denom;
  return { chi2, p: chiSquareSf(chi2, 1) };
}

/** Mantel–Haenszel pooled risk ratio with the Greenland–Robins (1985) variance. */
export function mhRiskRatio(strata: Table2x2[], z = Z95): RatioEstimate {
  let num = 0;
  let den = 0;
  let v = 0;
  for (const s of strata) {
    const { n1, n0, m1, N } = totals(s);
    if (N === 0) continue;
    num += (s.a * n0) / N;
    den += (s.c * n1) / N;
    v += (m1 * n1 * n0 - s.a * s.c * N) / (N * N);
  }
  if (num === 0 || den === 0) return NA;
  const est = num / den;
  const se = Math.sqrt(v / (num * den));
  return { est, lo: est * Math.exp(-z * se), hi: est * Math.exp(z * se), se, corrected: false };
}

/** Mantel–Haenszel pooled odds ratio with the Robins–Breslow–Greenland (1986) variance. */
export function mhOddsRatio(strata: Table2x2[], z = Z95): RatioEstimate {
  let sR = 0;
  let sS = 0;
  let sPR = 0;
  let sPSQR = 0;
  let sQS = 0;
  for (const s of strata) {
    const N = s.a + s.b + s.c + s.d;
    if (N === 0) continue;
    const R = (s.a * s.d) / N;
    const S = (s.b * s.c) / N;
    const P = (s.a + s.d) / N;
    const Q = (s.b + s.c) / N;
    sR += R;
    sS += S;
    sPR += P * R;
    sPSQR += P * S + Q * R;
    sQS += Q * S;
  }
  if (sR === 0 || sS === 0) return NA;
  const est = sR / sS;
  const se = Math.sqrt(sPR / (2 * sR * sR) + sPSQR / (2 * sR * sS) + sQS / (2 * sS * sS));
  return { est, lo: est * Math.exp(-z * se), hi: est * Math.exp(z * se), se, corrected: false };
}

/**
 * Inverse-variance (Woolf-type) chi-square test of homogeneity of stratum-specific
 * ratios. Low power with few or small strata — absence of evidence ≠ homogeneity.
 */
export function homogeneityTest(strata: Table2x2[], measure: 'RR' | 'OR'): { chi2: number; df: number; p: number } {
  const ests = strata.map((s) => (measure === 'RR' ? riskRatio(s) : oddsRatio(s))).filter((e) => Number.isFinite(e.se) && e.se > 0);
  if (ests.length < 2) return { chi2: NaN, df: 0, p: NaN };
  const w = ests.map((e) => 1 / (e.se * e.se));
  const lns = ests.map((e) => Math.log(e.est));
  const sw = w.reduce((x, y) => x + y, 0);
  const pooled = lns.reduce((acc, l, i) => acc + w[i] * l, 0) / sw;
  const chi2 = lns.reduce((acc, l, i) => acc + w[i] * (l - pooled) ** 2, 0);
  const df = ests.length - 1;
  return { chi2, df, p: chiSquareSf(chi2, df) };
}

/** Relative excess risk due to interaction (additive-scale interaction from risks). */
export function interactionContrasts(r00: number, r10: number, r01: number, r11: number) {
  const rr10 = r10 / r00;
  const rr01 = r01 / r00;
  const rr11 = r11 / r00;
  return {
    rr10,
    rr01,
    rr11,
    /** Interaction contrast on the risk-difference scale. */
    ic: r11 - r10 - r01 + r00,
    reri: rr11 - rr10 - rr01 + 1,
    /** Ratio of ratios: multiplicative interaction. */
    multiplicative: rr11 / (rr10 * rr01),
  };
}

// ---------------------------------------------------------------- E-values

/** E-value for a risk ratio (VanderWeele & Ding 2017). */
export function eValueForRR(rr: number): number {
  if (!(rr > 0)) return NaN;
  const r = rr < 1 ? 1 / rr : rr;
  return r + Math.sqrt(r * (r - 1));
}

export type EffectMeasure = 'RR' | 'OR' | 'HR';

/**
 * Approximate conversion to the RR scale used for E-values. For a rare outcome
 * (<~15% at end of follow-up) OR ≈ HR ≈ RR. For a common outcome:
 * RR ≈ √OR, and RR ≈ (1 − 0.5^√HR)/(1 − 0.5^√(1/HR)) (VanderWeele 2017, 2020).
 */
export function toApproxRR(value: number, measure: EffectMeasure, commonOutcome: boolean): number {
  if (!commonOutcome || measure === 'RR') return value;
  if (measure === 'OR') return Math.sqrt(value);
  return (1 - 0.5 ** Math.sqrt(value)) / (1 - 0.5 ** Math.sqrt(1 / value));
}

export function eValues(est: number, lo: number, hi: number, measure: EffectMeasure, commonOutcome: boolean) {
  const rr = toApproxRR(est, measure, commonOutcome);
  const rrLo = toApproxRR(lo, measure, commonOutcome);
  const rrHi = toApproxRR(hi, measure, commonOutcome);
  let ci = NaN;
  if (Number.isFinite(lo) && Number.isFinite(hi)) {
    if (rr >= 1) ci = rrLo <= 1 ? 1 : eValueForRR(rrLo);
    else ci = rrHi >= 1 ? 1 : eValueForRR(rrHi);
  }
  return { rr, point: eValueForRR(rr), ci };
}

// ----------------------------------------------------- sample size & power

/** Per-group sample size to compare two independent proportions (Fleiss, no continuity correction). */
export function sampleSizeTwoProportions(p0: number, p1: number, alpha = 0.05, power = 0.8): number {
  if (p0 === p1) return Infinity;
  const za = normInv(1 - alpha / 2);
  const zb = normInv(power);
  const pbar = (p0 + p1) / 2;
  const num = za * Math.sqrt(2 * pbar * (1 - pbar)) + zb * Math.sqrt(p1 * (1 - p1) + p0 * (1 - p0));
  return Math.ceil((num * num) / (p1 - p0) ** 2);
}

/** Power of a two-sided test comparing two proportions with n per group. */
export function powerTwoProportions(p0: number, p1: number, nPerGroup: number, alpha = 0.05): number {
  if (p0 === p1) return alpha;
  const za = normInv(1 - alpha / 2);
  const pbar = (p0 + p1) / 2;
  const zb = (Math.abs(p1 - p0) * Math.sqrt(nPerGroup) - za * Math.sqrt(2 * pbar * (1 - pbar))) / Math.sqrt(p1 * (1 - p1) + p0 * (1 - p0));
  return normCdf(zb);
}

// ----------------------------------------------- misclassification & selection

export interface ClassificationAccuracy {
  se: number;
  sp: number;
}

/**
 * Expected observed table when *exposure* is misclassified. Accuracy may differ
 * between outcome+ (cases) and outcome− (non-cases): that is differential misclassification.
 */
export function misclassifyExposure(t: Table2x2, cases: ClassificationAccuracy, nonCases: ClassificationAccuracy): Table2x2 {
  return {
    a: cases.se * t.a + (1 - cases.sp) * t.c,
    c: (1 - cases.se) * t.a + cases.sp * t.c,
    b: nonCases.se * t.b + (1 - nonCases.sp) * t.d,
    d: (1 - nonCases.se) * t.b + nonCases.sp * t.d,
  };
}

/**
 * Back-correct an observed table for exposure misclassification with known Se/Sp
 * (simple quantitative bias analysis; Lash, Fox & MacLehose). Returns null if the
 * inputs are incompatible (negative corrected cells).
 */
export function correctExposureMisclassification(obs: Table2x2, cases: ClassificationAccuracy, nonCases: ClassificationAccuracy): Table2x2 | null {
  const fix = (exposedObs: number, total: number, acc: ClassificationAccuracy) => {
    const denom = acc.se + acc.sp - 1;
    if (denom <= 0) return NaN;
    return (exposedObs - (1 - acc.sp) * total) / denom;
  };
  const m1 = obs.a + obs.c;
  const m0 = obs.b + obs.d;
  const a = fix(obs.a, m1, cases);
  const b = fix(obs.b, m0, nonCases);
  const res = { a, b, c: m1 - a, d: m0 - b };
  return Object.values(res).every((v) => Number.isFinite(v) && v >= -1e-9) ? res : null;
}

/** Observed risk when the *outcome* is classified with the given accuracy. */
export function misclassifiedRisk(trueRisk: number, acc: ClassificationAccuracy): number {
  return acc.se * trueRisk + (1 - acc.sp) * (1 - trueRisk);
}

export interface SelectionProbabilities {
  /** Probability each cell is included/retained (a: E+D+, b: E+D−, c: E−D+, d: E−D−). */
  a: number;
  b: number;
  c: number;
  d: number;
}

/** Expected table among those selected (or retained). */
export function selectTable(t: Table2x2, s: SelectionProbabilities): Table2x2 {
  return { a: t.a * s.a, b: t.b * s.b, c: t.c * s.c, d: t.d * s.d };
}

/** Selection-bias factor on the OR scale: OR_selected = OR_true × (s_a·s_d)/(s_b·s_c). */
export function selectionOddsFactor(s: SelectionProbabilities): number {
  return (s.a * s.d) / (s.b * s.c);
}

/** Expected 2×2 table for a cohort of n1 exposed and n0 unexposed with true risks r1, r0. */
export function expectedCohort(n1: number, n0: number, r1: number, r0: number): Table2x2 {
  return { a: n1 * r1, b: n1 * (1 - r1), c: n0 * r0, d: n0 * (1 - r0) };
}
