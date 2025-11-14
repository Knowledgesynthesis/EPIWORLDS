import type { SyntheticDataset, Variable } from '../types';

// Seeded random number generator for reproducibility
class SeededRandom {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  next(): number {
    this.seed = (this.seed * 9301 + 49297) % 233280;
    return this.seed / 233280;
  }

  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min + 1)) + min;
  }

  nextGaussian(mean: number = 0, stdDev: number = 1): number {
    // Box-Muller transform
    const u1 = this.next();
    const u2 = this.next();
    const z0 = Math.sqrt(-2.0 * Math.log(u1)) * Math.cos(2.0 * Math.PI * u2);
    return z0 * stdDev + mean;
  }
}

export interface DataGenerationParams {
  sampleSize: number;
  exposurePrevalence: number;
  outcomeBaselineRisk: number;
  relativeRisk: number;
  confounders?: {
    name: string;
    prevalence: number;
    exposureEffect: number;
    outcomeEffect: number;
  }[];
  seed?: number;
}

export function generateSyntheticDataset(
  params: DataGenerationParams
): SyntheticDataset {
  const {
    sampleSize,
    exposurePrevalence,
    outcomeBaselineRisk,
    relativeRisk,
    confounders = [],
    seed = 12345,
  } = params;

  const rng = new SeededRandom(seed);
  const data: Record<string, any>[] = [];

  // Define variables
  const variables: Variable[] = [
    {
      id: 'id',
      name: 'Subject ID',
      type: 'continuous',
      role: 'independent',
    },
    {
      id: 'exposure',
      name: 'Exposure',
      type: 'binary',
      role: 'exposure',
    },
    {
      id: 'outcome',
      name: 'Outcome',
      type: 'binary',
      role: 'outcome',
    },
    {
      id: 'age',
      name: 'Age (years)',
      type: 'continuous',
      role: 'confounder',
    },
    ...confounders.map((c) => ({
      id: c.name.toLowerCase().replace(/\s+/g, '_'),
      name: c.name,
      type: 'binary' as const,
      role: 'confounder' as const,
    })),
  ];

  // Generate data
  for (let i = 0; i < sampleSize; i++) {
    const row: Record<string, any> = {
      id: i + 1,
      age: Math.max(18, Math.min(90, rng.nextGaussian(50, 15))),
    };

    // Generate confounder values
    const confoundersValues: Record<string, number> = {};
    for (const confounder of confounders) {
      const confId = confounder.name.toLowerCase().replace(/\s+/g, '_');
      confoundersValues[confId] = rng.next() < confounder.prevalence ? 1 : 0;
      row[confId] = confoundersValues[confId];
    }

    // Generate exposure (influenced by confounders)
    let exposureProb = exposurePrevalence;
    for (const confounder of confounders) {
      const confId = confounder.name.toLowerCase().replace(/\s+/g, '_');
      if (confoundersValues[confId] === 1) {
        exposureProb *= confounder.exposureEffect;
      }
    }
    exposureProb = Math.min(0.95, Math.max(0.05, exposureProb));
    row.exposure = rng.next() < exposureProb ? 1 : 0;

    // Generate outcome (influenced by exposure and confounders)
    let outcomeProb = outcomeBaselineRisk;
    if (row.exposure === 1) {
      outcomeProb *= relativeRisk;
    }
    for (const confounder of confounders) {
      const confId = confounder.name.toLowerCase().replace(/\s+/g, '_');
      if (confoundersValues[confId] === 1) {
        outcomeProb *= confounder.outcomeEffect;
      }
    }
    outcomeProb = Math.min(0.95, Math.max(0.05, outcomeProb));
    row.outcome = rng.next() < outcomeProb ? 1 : 0;

    data.push(row);
  }

  return {
    id: `synthetic-${seed}`,
    name: 'Synthetic Epidemiologic Dataset',
    description: `Generated with ${sampleSize} observations, RR=${relativeRisk.toFixed(
      2
    )}`,
    variables,
    sampleSize,
    data,
    studyType: 'cohort',
  };
}

export function calculateRiskRatio(data: Record<string, any>[]): {
  riskExposed: number;
  riskUnexposed: number;
  riskRatio: number;
  exposedCount: number;
  unexposedCount: number;
} {
  const exposed = data.filter((d) => d.exposure === 1);
  const unexposed = data.filter((d) => d.exposure === 0);

  const exposedWithOutcome = exposed.filter((d) => d.outcome === 1).length;
  const unexposedWithOutcome = unexposed.filter((d) => d.outcome === 1).length;

  const riskExposed = exposed.length > 0 ? exposedWithOutcome / exposed.length : 0;
  const riskUnexposed =
    unexposed.length > 0 ? unexposedWithOutcome / unexposed.length : 0;

  return {
    riskExposed,
    riskUnexposed,
    riskRatio: riskUnexposed > 0 ? riskExposed / riskUnexposed : 0,
    exposedCount: exposed.length,
    unexposedCount: unexposed.length,
  };
}

export function calculateStratifiedRiskRatio(
  data: Record<string, any>[],
  stratifyBy: string
): Record<
  string,
  {
    riskExposed: number;
    riskUnexposed: number;
    riskRatio: number;
    exposedCount: number;
    unexposedCount: number;
  }
> {
  const strata = new Set(data.map((d) => d[stratifyBy]));
  const results: Record<string, any> = {};

  for (const stratum of strata) {
    const stratumData = data.filter((d) => d[stratifyBy] === stratum);
    results[String(stratum)] = calculateRiskRatio(stratumData);
  }

  return results;
}

export function calculateMantelHaenszel(
  data: Record<string, any>[],
  stratifyBy: string
): {
  adjustedRR: number;
  crudeRR: number;
  strata: any[];
} {
  const strata = new Set(data.map((d) => d[stratifyBy]));
  let numerator = 0;
  let denominator = 0;
  const strataResults = [];

  for (const stratum of strata) {
    const stratumData = data.filter((d) => d[stratifyBy] === stratum);
    const exposed = stratumData.filter((d) => d.exposure === 1);
    const unexposed = stratumData.filter((d) => d.exposure === 0);

    const a = exposed.filter((d) => d.outcome === 1).length; // Exposed with outcome
    const b = exposed.filter((d) => d.outcome === 0).length; // Exposed without outcome
    const c = unexposed.filter((d) => d.outcome === 1).length; // Unexposed with outcome
    const d = unexposed.filter((d) => d.outcome === 0).length; // Unexposed without outcome

    const n = a + b + c + d;
    if (n > 0) {
      numerator += (a * (c + d)) / n;
      denominator += (c * (a + b)) / n;

      strataResults.push({
        stratum: String(stratum),
        a,
        b,
        c,
        d,
        n,
        rr: c > 0 ? (a / (a + b)) / (c / (c + d)) : 0,
      });
    }
  }

  const adjustedRR = denominator > 0 ? numerator / denominator : 0;
  const crudeRR = calculateRiskRatio(data).riskRatio;

  return {
    adjustedRR,
    crudeRR,
    strata: strataResults,
  };
}
