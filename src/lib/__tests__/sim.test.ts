import { describe, expect, it } from 'vitest';
import { repeatedStudies, simulateImmortalTime } from '../sim';

describe('repeated sampling', () => {
  it('95% CIs cover the truth about 95% of the time without bias', () => {
    const res = repeatedStudies({ nPerGroup: 400, baselineRisk: 0.1, trueRR: 2, confoundingFactor: 1, studies: 2000, seed: 3 });
    const coverage = res.filter((r) => r.covers).length / res.length;
    expect(coverage).toBeGreaterThan(0.93);
    expect(coverage).toBeLessThan(0.97);
  });
  it('confounding drives coverage toward zero as n grows', () => {
    const big = repeatedStudies({ nPerGroup: 5000, baselineRisk: 0.1, trueRR: 1, confoundingFactor: 1.5, studies: 200, seed: 5 });
    expect(big.filter((r) => r.covers).length / big.length).toBeLessThan(0.05);
  });
  it('is deterministic for a seed', () => {
    const p = { nPerGroup: 100, baselineRisk: 0.2, trueRR: 1.5, confoundingFactor: 1, studies: 10, seed: 9 };
    expect(repeatedStudies(p)).toEqual(repeatedStudies(p));
  });
});

describe('immortal time', () => {
  const base = { n: 40000, deathRate: 0.3, intendToStart: 0.5, maxDelay: 1, followUp: 3, seed: 11 };
  it('a useless drug looks protective in the naive analysis but not when time-varying', () => {
    const r = simulateImmortalTime({ ...base, trueHR: 1 });
    expect(r.naive.rateRatio).toBeLessThan(0.85);
    expect(r.timeVarying.rateRatio).toBeGreaterThan(0.9);
    expect(r.timeVarying.rateRatio).toBeLessThan(1.1);
  });
  it('time-varying analysis recovers a true harmful effect', () => {
    const r = simulateImmortalTime({ ...base, trueHR: 1.5 });
    expect(r.timeVarying.rateRatio).toBeGreaterThan(1.35);
    expect(r.timeVarying.rateRatio).toBeLessThan(1.65);
  });
});
