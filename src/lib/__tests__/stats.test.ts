import { describe, expect, it } from 'vitest';
import { Z95, binomial, chiSquareSf, mulberry32, normCdf, normInv, wilson } from '../stats';

describe('normal distribution', () => {
  it('matches standard quantiles', () => {
    expect(normInv(0.975)).toBeCloseTo(Z95, 6);
    expect(normInv(0.8)).toBeCloseTo(0.8416212, 6);
    expect(normInv(0.5)).toBeCloseTo(0, 9);
    expect(normInv(0.001)).toBeCloseTo(-3.090232, 5);
  });
  it('CDF inverts the quantile', () => {
    for (const p of [0.01, 0.1, 0.33, 0.5, 0.9, 0.995]) expect(normCdf(normInv(p))).toBeCloseTo(p, 6);
    expect(normCdf(1.96)).toBeCloseTo(0.9750021, 6);
  });
});

describe('chi-square tail', () => {
  it('gives 0.05 at the critical values', () => {
    expect(chiSquareSf(3.841459, 1)).toBeCloseTo(0.05, 5);
    expect(chiSquareSf(5.991465, 2)).toBeCloseTo(0.05, 5);
    expect(chiSquareSf(16.91898, 9)).toBeCloseTo(0.05, 5);
    expect(chiSquareSf(0, 3)).toBe(1);
  });
});

describe('Wilson interval', () => {
  it('reproduces Newcombe (1998) 81/263', () => {
    const [lo, hi] = wilson(81, 263);
    expect(lo).toBeCloseTo(0.2553, 4);
    expect(hi).toBeCloseTo(0.3662, 4);
  });
  it('stays inside [0,1] at the boundary', () => {
    const [lo, hi] = wilson(0, 10);
    expect(lo).toBe(0);
    expect(hi).toBeCloseTo(0.2775, 4);
  });
});

describe('seeded PRNG', () => {
  it('is reproducible and roughly uniform', () => {
    const a = mulberry32(42);
    const b = mulberry32(42);
    for (let i = 0; i < 5; i++) expect(a()).toBe(b());
    const r = mulberry32(7);
    let sum = 0;
    for (let i = 0; i < 100000; i++) sum += r();
    expect(sum / 100000).toBeCloseTo(0.5, 2);
  });
  it('binomial mean is n·p', () => {
    const r = mulberry32(1);
    let total = 0;
    for (let i = 0; i < 400; i++) total += binomial(r, 500, 0.2);
    expect(total / 400).toBeGreaterThan(97);
    expect(total / 400).toBeLessThan(103);
  });
});
