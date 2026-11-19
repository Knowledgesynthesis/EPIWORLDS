/**
 * End-to-end smoke and stress test.
 *
 *   npm run build && npm run test:e2e
 *
 * Serves dist/ with `vite preview`, then for every route, on a desktop and a
 * phone viewport, in light and dark mode: fails on console errors, uncaught
 * exceptions, missing <h1>, or horizontal overflow. Also exercises the main
 * interactions and checks that the app works offline after one visit.
 * Requires Playwright with a Chromium build available to Node.
 * Set SHOTS=dir to save screenshots.
 */
import { spawn } from 'node:child_process';
import { mkdirSync } from 'node:fs';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);
let chromium;
try {
  ({ chromium } = require('playwright'));
} catch {
  console.error('Playwright is not installed. Install it (npm i -D playwright && npx playwright install chromium) to run e2e tests.');
  process.exit(2);
}

const PORT = 4179;
const BASE = `http://localhost:${PORT}`;
const SHOTS = process.env.SHOTS;
if (SHOTS) mkdirSync(SHOTS, { recursive: true });

const modules = ['measures', 'study-designs', 'random-error', 'causal-dags', 'confounding', 'selection-bias', 'information-bias', 'effect-modification', 'clinical-biases', 'appraisal', 'ethics'];
const routes = [
  '/', '/learn', ...modules.map((m) => `/learn/${m}`),
  '/dag-builder', '/confounding-lab', '/confounding-lab?tab=em',
  '/bias-lab', '/bias-lab?tab=misclassification', '/bias-lab?tab=time', '/bias-lab?tab=map',
  '/study-sandbox', '/calculators', '/calculators?tab=or-rr', '/calculators?tab=evalue', '/calculators?tab=power',
  '/study-designs', '/ethics', '/assessments', '/glossary', '/reference', '/does-not-exist',
];

const server = spawn(process.execPath, ['node_modules/vite/bin/vite.js', 'preview', '--port', String(PORT), '--strictPort'], { stdio: 'pipe' });
const failures = [];
const fail = (msg) => {
  failures.push(msg);
  console.log('  ✗', msg);
};

async function waitForServer() {
  for (let i = 0; i < 60; i++) {
    try {
      const r = await fetch(BASE);
      if (r.ok) return;
    } catch {
      /* not up yet */
    }
    await new Promise((r) => setTimeout(r, 250));
  }
  throw new Error('preview server did not start');
}

function watch(page, label) {
  const errors = [];
  page.on('console', (m) => m.type() === 'error' && errors.push(`${label}: console: ${m.text()}`));
  page.on('pageerror', (e) => errors.push(`${label}: pageerror: ${e.message}`));
  return errors;
}

async function sweep(browser, name, contextOpts, scheme) {
  console.log(`\n▶ ${name} · ${scheme}`);
  const ctx = await browser.newContext({ ...contextOpts, colorScheme: scheme, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = watch(page, name);
  for (const r of routes) {
    await page.goto(BASE + r, { waitUntil: 'networkidle' });
    await page.waitForSelector('h1', { timeout: 10000 }).catch(() => fail(`${name} ${r}: no <h1>`));
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth);
    if (overflow > 1) fail(`${name} ${scheme} ${r}: horizontal overflow ${overflow}px`);
    const dark = await page.evaluate(() => document.documentElement.classList.contains('dark'));
    if (dark !== (scheme === 'dark')) fail(`${name} ${r}: theme class mismatch`);
    if (SHOTS && (scheme === 'light' || ['/', '/dag-builder', '/learn/confounding'].includes(r))) {
      const file = `${SHOTS}/${name}-${scheme}${r.replace(/[/?=]/g, '_') || '_home'}.png`;
      await page.screenshot({ path: file, fullPage: r === '/' });
    }
  }
  errors.forEach(fail);
  console.log(`  ${routes.length} routes checked`);
  await ctx.close();
}

async function interactions(browser) {
  console.log('\n▶ interactions');
  const ctx = await browser.newContext({ viewport: { width: 1280, height: 900 }, serviceWorkers: 'block' });
  const page = await ctx.newPage();
  const errors = watch(page, 'interactions');

  // DAG Lab: load the confounding example, adjust for Smoking, check.
  await page.goto(`${BASE}/dag-builder`);
  await page.selectOption('#dag-preset', 'confounding');
  await page.getByRole('button', { name: 'Check my adjustment set' }).click();
  if (!(await page.getByText('Not sufficient').isVisible())) fail('DAG: empty set should be insufficient for confounding');
  await page.locator('details summary').click();
  await page.locator('details').getByRole('button', { name: 'Smoking', exact: true }).click();
  await page.getByRole('button', { name: 'Adjust for it' }).click();
  await page.getByRole('button', { name: 'Check my adjustment set' }).click();
  if (!(await page.getByText('Valid and minimal').isVisible())) fail('DAG: {Smoking} should be valid and minimal');

  // Cycle prevention through the list-view form.
  await page.selectOption('#dag-preset', 'two-sets');
  await page.locator('details').evaluate((d) => (d.open = true));
  const form = page.locator('details form');
  await form.locator('select').nth(0).selectOption('Fracture');
  await form.locator('select').nth(1).selectOption('Diet');
  await form.getByRole('button', { name: 'Add arrow' }).click();
  if (!(await page.getByText(/would create a cycle/).isVisible())) fail('DAG: cycle was not refused');

  // DAG persistence across reloads.
  await page.reload();
  if ((await page.locator('#dag-preset').inputValue()) !== 'two-sets') fail('DAG: workspace not persisted');

  // 2×2 calculator responds to edits.
  await page.goto(`${BASE}/calculators`);
  await page.getByLabel('Cell a').fill('40'); // 40/120 vs 10/100
  if (!(await page.getByText('3.33', { exact: true }).first().isVisible())) fail('Calculator: RR did not update to 3.33');

  // Module checkpoint records progress and completion shows in the sidebar.
  await page.goto(`${BASE}/learn/measures`);
  const numeric = page.getByPlaceholder('e.g. 2.5').first();
  await numeric.fill('3');
  await page.getByRole('button', { name: 'Check answer' }).first().click();
  if (!(await page.getByText('Correct', { exact: true }).first().isVisible())) fail('Checkpoint: correct numeric answer not accepted');
  await page.getByRole('button', { name: 'Mark module complete' }).click();
  if (!(await page.locator('aside').getByText('(completed)').count())) fail('Progress: completion not shown in sidebar');

  // Practice session in exam mode.
  await page.goto(`${BASE}/assessments`);
  await page.getByRole('radio', { name: 'Exam' }).click();
  await page.getByRole('button', { name: /^Start/ }).click();
  for (let i = 0; i < 10; i++) {
    const radios = page.getByRole('radiogroup', { name: 'Answer options' }).getByRole('radio');
    if (await radios.count()) await radios.first().click();
    else await page.getByPlaceholder('e.g. 2.5').fill('1');
    await page.getByRole('button', { name: 'Save answer' }).click();
    await page.getByRole('button', { name: /Next|See results/ }).click();
  }
  if (!(await page.getByRole('heading', { level: 1 }).textContent())?.includes('of 10 correct')) fail('Practice: results page not shown');

  // Glossary search.
  await page.goto(`${BASE}/glossary`);
  await page.getByLabel('Search glossary').fill('collider');
  if (!(await page.getByText('M-bias').first().isVisible())) fail('Glossary: search did not find M-bias');

  // Mobile drawer opens and closes on navigation.
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/`);
  await page.getByRole('button', { name: 'Open menu' }).click();
  await page.getByRole('dialog').getByRole('link', { name: 'Glossary' }).click();
  await page.waitForURL('**/glossary');
  if (await page.getByRole('dialog').count()) fail('Drawer did not close after navigation');

  errors.forEach(fail);
  await ctx.close();
}

async function offline(browser) {
  console.log('\n▶ offline');
  const ctx = await browser.newContext();
  const page = await ctx.newPage();
  await page.goto(`${BASE}/`);
  await page.evaluate(() => navigator.serviceWorker.ready);
  await page.reload({ waitUntil: 'networkidle' });
  await ctx.setOffline(true);
  await page.goto(`${BASE}/learn/confounding`, { waitUntil: 'load' }).catch(() => undefined);
  const h1 = await page.locator('h1').textContent({ timeout: 10000 }).catch(() => null);
  if (h1 !== 'Confounding') fail(`Offline: expected lesson heading, got ${h1}`);
  await ctx.close();
}

try {
  await waitForServer();
  const browser = await chromium.launch();
  await sweep(browser, 'desktop', { viewport: { width: 1280, height: 860 } }, 'light');
  await sweep(browser, 'desktop', { viewport: { width: 1280, height: 860 } }, 'dark');
  await sweep(browser, 'phone', { viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true }, 'light');
  await sweep(browser, 'phone', { viewport: { width: 375, height: 740 }, isMobile: true, hasTouch: true }, 'dark');
  await interactions(browser);
  await offline(browser);
  await browser.close();
} catch (e) {
  fail(`harness: ${e.message}`);
} finally {
  server.kill();
}

console.log(failures.length ? `\n${failures.length} failure(s)` : '\nAll e2e checks passed');
process.exit(failures.length ? 1 : 0);
