import { describe, expect, it } from 'vitest';
import {
  chiSquare2x2,
  correctExposureMisclassification,
  eValues,
  homogeneityTest,
  interactionContrasts,
  mhOddsRatio,
  mhRiskRatio,
  misclassifiedRisk,
  misclassifyExposure,
  numberNeeded,
  oddsRatio,
  powerTwoProportions,
  riskDifference,
  riskRatio,
  sampleSizeTwoProportions,
  selectTable,
  selectionOddsFactor,
} from '../epi';

const t = { a: 20, b: 80, c: 10, d: 90 };

describe('2×2 measures', () => {
  it('risk ratio with Katz interval', () => {
    const rr = riskRatio(t);
    expect(rr.est).toBeCloseTo(2, 10);
    expect(rr.se).toBeCloseTo(Math.sqrt(0.13), 10);
    expect(rr.lo).toBeCloseTo(0.9866, 3);
    expect(rr.hi).toBeCloseTo(4.0544, 3);
  });
  it('odds ratio with Woolf interval', () => {
    const or = oddsRatio(t);
    expect(or.est).toBeCloseTo(2.25, 10);
    expect(or.lo).toBeCloseTo(0.9944, 3);
    expect(or.hi).toBeCloseTo(5.0915, 3);
  });
  it('risk difference with Newcombe hybrid score interval (Newcombe 1998: 56/70 vs 48/80)', () => {
    const rd = riskDifference({ a: 56, b: 14, c: 48, d: 32 });
    expect(rd.est).toBeCloseTo(0.2, 10);
    expect(rd.lo).toBeCloseTo(0.0524, 4);
    expect(rd.hi).toBeCloseTo(0.3339, 4);
  });
  it('applies 0.5 correction only when a zero cell is present', () => {
    expect(riskRatio(t).corrected).toBe(false);
    const z = riskRatio({ a: 0, b: 50, c: 5, d: 45 });
    expect(z.corrected).toBe(true);
    expect(Number.isFinite(z.hi)).toBe(true);
    expect(Number.isNaN(riskRatio({ a: 0, b: 10, c: 0, d: 10 }).est)).toBe(true);
  });
  it('Pearson chi-square', () => {
    const { chi2, p } = chiSquare2x2(t);
    expect(chi2).toBeCloseTo(3.9216, 3);
    expect(p).toBeCloseTo(0.0477, 3);
  });
});

describe('number needed to treat', () => {
  it('benefit with interval excluding zero', () => {
    const n = numberNeeded({ est: -0.1, lo: -0.15, hi: -0.05 });
    expect(n.kind).toBe('benefit');
    expect(n.value).toBeCloseTo(10, 10);
    expect(n.ciText).toBe('NNTB 6.7 to 20.0');
  });
  it('interval spanning zero uses Altman notation', () => {
    const n = numberNeeded({ est: -0.05, lo: -0.12, hi: 0.02 });
    expect(n.ciText).toBe('NNTB 8.3 to ∞ to NNTH 50.0');
  });
});

describe('Mantel–Haenszel', () => {
  const s1 = { a: 30, b: 70, c: 15, d: 85 }; // RR 2
  const s2 = { a: 8, b: 192, c: 2, d: 98 }; // RR 2
  it('pooled RR equals common stratum RR', () => {
    expect(mhRiskRatio([s1, s2]).est).toBeCloseTo(2, 10);
  });
  it('single stratum reduces to Katz (RR) and Woolf (OR) variances', () => {
    expect(mhRiskRatio([t]).se).toBeCloseTo(riskRatio(t).se, 10);
    expect(mhOddsRatio([t]).se).toBeCloseTo(oddsRatio(t).se, 10);
    expect(mhOddsRatio([t]).est).toBeCloseTo(2.25, 10);
  });
  it('homogeneity test does not reject identical stratum RRs', () => {
    const h = homogeneityTest([s1, s2], 'RR');
    expect(h.chi2).toBeCloseTo(0, 8);
    expect(h.p).toBeCloseTo(1, 6);
    expect(h.df).toBe(1);
  });
  it('removes confounding in a Simpson-type example', () => {
    // Within each stratum RR = 1, but exposure concentrates in the high-risk stratum.
    const hi = { a: 160, b: 40, c: 40, d: 10 };
    const lo = { a: 5, b: 45, c: 20, d: 180 };
    const crude = riskRatio({ a: hi.a + lo.a, b: hi.b + lo.b, c: hi.c + lo.c, d: hi.d + lo.d });
    expect(crude.est).toBeGreaterThan(2);
    expect(mhRiskRatio([hi, lo]).est).toBeCloseTo(1, 10);
  });
});

describe('interaction', () => {
  it('multiplicative homogeneity can coexist with additive interaction', () => {
    const r = interactionContrasts(0.05, 0.1, 0.2, 0.4);
    expect(r.multiplicative).toBeCloseTo(1, 10);
    expect(r.reri).toBeCloseTo(3, 10); // 8 − 2 − 4 + 1
    expect(r.ic).toBeCloseTo(0.15, 10);
  });
});

describe('E-values (VanderWeele & Ding 2017)', () => {
  it('reproduces the paper example RR 3.9 (1.8, 8.7)', () => {
    const e = eValues(3.9, 1.8, 8.7, 'RR', false);
    expect(e.point).toBeCloseTo(7.26, 2);
    expect(e.ci).toBeCloseTo(3.0, 2);
  });
  it('protective estimates use the reciprocal and the upper limit', () => {
    const e = eValues(0.5, 0.3, 0.8, 'RR', false);
    expect(e.point).toBeCloseTo(2 + Math.sqrt(2), 10);
    expect(e.ci).toBeCloseTo(1.25 + Math.sqrt(1.25 * 0.25), 10);
  });
  it('CI crossing the null gives E-value 1', () => {
    expect(eValues(1.4, 0.9, 2.1, 'RR', false).ci).toBe(1);
  });
  it('common-outcome OR uses the square-root conversion', () => {
    expect(eValues(4, 2, 8, 'OR', true).rr).toBeCloseTo(2, 10);
  });
});

describe('sample size and power', () => {
  it('10% vs 20%, α=0.05, power 80% → 199 per group (Fleiss, no correction)', () => {
    expect(sampleSizeTwoProportions(0.1, 0.2, 0.05, 0.8)).toBe(199);
  });
  it('power at that n is ≈ 80%', () => {
    expect(powerTwoProportions(0.1, 0.2, 199, 0.05)).toBeCloseTo(0.8, 2);
  });
});

describe('misclassification', () => {
  const truth = { a: 150, b: 100, c: 50, d: 100 }; // OR = 3
  it('non-differential exposure misclassification biases the OR toward the null', () => {
    const acc = { se: 0.8, sp: 0.9 };
    const obs = misclassifyExposure(truth, acc, acc);
    const or = oddsRatio(obs).est;
    expect(or).toBeGreaterThan(1);
    expect(or).toBeLessThan(3);
  });
  it('back-correction recovers the true table', () => {
    const cases = { se: 0.9, sp: 0.95 };
    const ctrls = { se: 0.7, sp: 0.85 };
    const obs = misclassifyExposure(truth, cases, ctrls);
    const fixed = correctExposureMisclassification(obs, cases, ctrls)!;
    expect(fixed.a).toBeCloseTo(150, 8);
    expect(fixed.b).toBeCloseTo(100, 8);
    expect(fixed.c).toBeCloseTo(50, 8);
    expect(fixed.d).toBeCloseTo(100, 8);
  });
  it('perfectly specific, non-differential outcome ascertainment leaves the RR unbiased', () => {
    const acc = { se: 0.6, sp: 1 };
    expect(misclassifiedRisk(0.2, acc) / misclassifiedRisk(0.1, acc)).toBeCloseTo(2, 10);
  });
});

describe('selection', () => {
  it('selected OR = true OR × selection odds factor', () => {
    const s = { a: 0.9, b: 0.5, c: 0.6, d: 0.5 };
    const sel = selectTable(t, s);
    expect(oddsRatio(sel).est).toBeCloseTo(2.25 * selectionOddsFactor(s), 10);
  });
  it('selection depending only on the outcome leaves the OR unbiased', () => {
    const s = { a: 0.9, b: 0.1, c: 0.9, d: 0.1 };
    expect(oddsRatio(selectTable(t, s)).est).toBeCloseTo(2.25, 10);
  });
});
