/**
 * Numerical building blocks: normal & chi-square distributions, score
 * intervals for proportions, and a seeded PRNG for reproducible simulation.
 * Accuracy targets are well beyond what is displayed (2–3 decimals).
 */

/** z for a two-sided 95% interval. */
export const Z95 = 1.959963984540054;

/** Complementary error function; fractional error < 1.2e-7 (Numerical Recipes erfcc). */
function erfc(x: number): number {
  const z = Math.abs(x);
  const t = 1 / (1 + 0.5 * z);
  const r =
    t *
    Math.exp(
      -z * z -
        1.26551223 +
        t *
          (1.00002368 +
            t *
              (0.37409196 +
                t *
                  (0.09678418 +
                    t *
                      (-0.18628806 +
                        t *
                          (0.27886807 +
                            t * (-1.13520398 + t * (1.48851587 + t * (-0.82215223 + t * 0.17087277))))))))
    );
  return x >= 0 ? r : 2 - r;
}

/** Standard normal cumulative distribution function Φ(x). */
export function normCdf(x: number): number {
  return 0.5 * erfc(-x / Math.SQRT2);
}

/** Inverse standard normal CDF (Acklam's algorithm, relative error < 1.2e-9). */
export function normInv(p: number): number {
  if (!(p > 0 && p < 1)) {
    if (p === 0) return -Infinity;
    if (p === 1) return Infinity;
    return NaN;
  }
  const a = [-39.69683028665376, 220.9460984245205, -275.9285104469687, 138.357751867269, -30.66479806614716, 2.506628277459239];
  const b = [-54.47609879822406, 161.5858368580409, -155.6989798598866, 66.80131188771972, -13.28068155288572];
  const c = [-0.007784894002430293, -0.3223964580411365, -2.400758277161838, -2.549732539343734, 4.374664141464968, 2.938163982698783];
  const d = [0.007784695709041462, 0.3224671290700398, 2.445134137142996, 3.754408661907416];
  const pLow = 0.02425;
  if (p < pLow) {
    const q = Math.sqrt(-2 * Math.log(p));
    return (((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
  }
  if (p <= 1 - pLow) {
    const q = p - 0.5;
    const r = q * q;
    return ((((((a[0] * r + a[1]) * r + a[2]) * r + a[3]) * r + a[4]) * r + a[5]) * q) / (((((b[0] * r + b[1]) * r + b[2]) * r + b[3]) * r + b[4]) * r + 1);
  }
  const q = Math.sqrt(-2 * Math.log(1 - p));
  return -(((((c[0] * q + c[1]) * q + c[2]) * q + c[3]) * q + c[4]) * q + c[5]) / ((((d[0] * q + d[1]) * q + d[2]) * q + d[3]) * q + 1);
}

/** ln Γ(x) via the Lanczos approximation (g = 7). */
export function lnGamma(x: number): number {
  const g = [
    0.99999999999980993, 676.5203681218851, -1259.1392167224028, 771.32342877765313, -176.61502916214059,
    12.507343278686905, -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
  ];
  if (x < 0.5) return Math.log(Math.PI / Math.sin(Math.PI * x)) - lnGamma(1 - x);
  const xx = x - 1;
  let s = g[0];
  for (let i = 1; i < 9; i++) s += g[i] / (xx + i);
  const t = xx + 7.5;
  return 0.5 * Math.log(2 * Math.PI) + (xx + 0.5) * Math.log(t) - t + Math.log(s);
}

/** Regularized upper incomplete gamma Q(s, x) = 1 − P(s, x). */
function gammaQ(s: number, x: number): number {
  if (x <= 0) return 1;
  const lnPrefix = -x + s * Math.log(x) - lnGamma(s);
  if (x < s + 1) {
    // Series for P, then complement.
    let term = 1 / s;
    let sum = term;
    for (let n = 1; n < 500; n++) {
      term *= x / (s + n);
      sum += term;
      if (Math.abs(term) < Math.abs(sum) * 1e-15) break;
    }
    return 1 - sum * Math.exp(lnPrefix);
  }
  // Continued fraction for Q (modified Lentz).
  const tiny = 1e-300;
  let bb = x + 1 - s;
  let cc = 1 / tiny;
  let dd = 1 / bb;
  let h = dd;
  for (let i = 1; i < 500; i++) {
    const an = -i * (i - s);
    bb += 2;
    dd = an * dd + bb;
    if (Math.abs(dd) < tiny) dd = tiny;
    cc = bb + an / cc;
    if (Math.abs(cc) < tiny) cc = tiny;
    dd = 1 / dd;
    const delta = dd * cc;
    h *= delta;
    if (Math.abs(delta - 1) < 1e-15) break;
  }
  return Math.exp(lnPrefix) * h;
}

/** Upper-tail probability of a chi-square statistic with `df` degrees of freedom. */
export function chiSquareSf(x: number, df: number): number {
  if (!Number.isFinite(x) || df <= 0) return NaN;
  return Math.min(1, Math.max(0, gammaQ(df / 2, x / 2)));
}

/** Wilson score interval for a binomial proportion x/n. */
export function wilson(x: number, n: number, z = Z95): [number, number] {
  if (n <= 0) return [NaN, NaN];
  const p = x / n;
  const z2 = z * z;
  const denom = 1 + z2 / n;
  const center = (p + z2 / (2 * n)) / denom;
  const half = (z * Math.sqrt((p * (1 - p)) / n + z2 / (4 * n * n))) / denom;
  return [Math.max(0, center - half), Math.min(1, center + half)];
}

/** Seeded PRNG (mulberry32): fast, 32-bit state, good statistical quality for teaching simulations. */
export function mulberry32(seed: number): () => number {
  let a = seed >>> 0;
  return () => {
    a = (a + 0x6d2b79f5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** Number of successes in n Bernoulli(p) trials. */
export function binomial(rng: () => number, n: number, p: number): number {
  let k = 0;
  for (let i = 0; i < n; i++) if (rng() < p) k++;
  return k;
}

/** Exponential waiting time with the given rate. */
export function exponential(rng: () => number, rate: number): number {
  return -Math.log(1 - rng()) / rate;
}

export function clamp(x: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, x));
}
