/**
 * Reproducible teaching simulations. Every function takes an explicit seed so the
 * same inputs always give the same output (no Math.random during render).
 */
import { riskRatio, type RatioEstimate } from './epi';
import { binomial, exponential, mulberry32 } from './stats';

export interface RepeatedStudy extends RatioEstimate {
  index: number;
  covers: boolean;
}

export interface RepeatedSamplingParams {
  nPerGroup: number;
  baselineRisk: number;
  trueRR: number;
  /**
   * Uncontrolled confounding: the exposed group's baseline (untreated) risk is
   * this many times the unexposed group's. 1 = exchangeable groups (e.g. randomized).
   */
  confoundingFactor: number;
  studies: number;
  seed: number;
}

/** Run many identical studies and record each risk ratio and its 95% CI. */
export function repeatedStudies(p: RepeatedSamplingParams): RepeatedStudy[] {
  const rng = mulberry32(p.seed);
  const r0 = p.baselineRisk;
  const r1 = Math.min(1, p.baselineRisk * p.confoundingFactor * p.trueRR);
  const out: RepeatedStudy[] = [];
  for (let i = 0; i < p.studies; i++) {
    const a = binomial(rng, p.nPerGroup, r1);
    const c = binomial(rng, p.nPerGroup, r0);
    const est = riskRatio({ a, b: p.nPerGroup - a, c, d: p.nPerGroup - c });
    out.push({ ...est, index: i, covers: est.lo <= p.trueRR && est.hi >= p.trueRR });
  }
  return out;
}

export interface ImmortalTimeParams {
  n: number;
  /** Death rate per person-year among non-users. */
  deathRate: number;
  /** Fraction of patients who would start the drug if they live long enough. */
  intendToStart: number;
  /** Start times are uniform on [0, maxDelay] years after cohort entry. */
  maxDelay: number;
  followUp: number;
  /** True hazard ratio once on the drug (1 = no effect). */
  trueHR: number;
  seed: number;
}

export interface RateSummary {
  deaths: number;
  personTime: number;
  rate: number;
}

export interface ImmortalTimeResult {
  everUsers: number;
  naive: { exposed: RateSummary; unexposed: RateSummary; rateRatio: number };
  timeVarying: { exposed: RateSummary; unexposed: RateSummary; rateRatio: number };
  immortalPersonTime: number;
}

const summary = (deaths: number, personTime: number): RateSummary => ({ deaths, personTime, rate: deaths / personTime });

/**
 * Simulates the classic immortal-time error (Suissa 2008): classifying patients as
 * "users" from cohort entry although they had to survive until their first
 * prescription to be counted as users.
 */
export function simulateImmortalTime(p: ImmortalTimeParams): ImmortalTimeResult {
  const rng = mulberry32(p.seed);
  let usersN = 0;
  let dUser = 0; // deaths after starting (all user deaths)
  let ptUserBefore = 0; // person-time users spent before starting (immortal)
  let ptUserAfter = 0;
  let dNever = 0;
  let ptNever = 0;
  for (let i = 0; i < p.n; i++) {
    const intends = rng() < p.intendToStart;
    const startAt = rng() * p.maxDelay;
    const tDeathUntreated = exponential(rng, p.deathRate);
    if (intends && startAt < p.followUp && tDeathUntreated > startAt) {
      usersN++;
      ptUserBefore += startAt;
      // Memoryless hazard: residual survival after starting uses the treated rate.
      const tDeath = startAt + exponential(rng, p.deathRate * p.trueHR);
      if (tDeath <= p.followUp) {
        dUser++;
        ptUserAfter += tDeath - startAt;
      } else {
        ptUserAfter += p.followUp - startAt;
      }
    } else if (tDeathUntreated <= p.followUp) {
      dNever++;
      ptNever += tDeathUntreated;
    } else {
      ptNever += p.followUp;
    }
  }
  const naiveExp = summary(dUser, ptUserBefore + ptUserAfter);
  const naiveUnexp = summary(dNever, ptNever);
  const tvExp = summary(dUser, ptUserAfter);
  const tvUnexp = summary(dNever, ptNever + ptUserBefore);
  return {
    everUsers: usersN,
    naive: { exposed: naiveExp, unexposed: naiveUnexp, rateRatio: naiveExp.rate / naiveUnexp.rate },
    timeVarying: { exposed: tvExp, unexposed: tvUnexp, rateRatio: tvExp.rate / tvUnexp.rate },
    immortalPersonTime: ptUserBefore,
  };
}
