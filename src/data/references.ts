export interface Reference {
  id: string;
  citation: string;
  /** Short label for inline citations; defaults to first-author surname + year. */
  short?: string;
  /** DOI (preferred) or a stable URL. */
  doi?: string;
  url?: string;
  /** What the source is used for in EpiWorlds. */
  note?: string;
  kind: 'textbook' | 'methods' | 'guideline' | 'example' | 'ethics';
}

export const references: Reference[] = [
  // Textbooks
  { id: 'rothman2021', short: 'Modern Epidemiology 4e', kind: 'textbook', citation: 'Rothman KJ, Lash TL, VanderWeele TJ, Haneuse S. Modern Epidemiology. 4th ed. Wolters Kluwer; 2021.', note: 'Measures, designs, bias, interaction, stratified analysis.' },
  { id: 'hernanrobins2020', short: 'Hernán & Robins, What If', kind: 'textbook', citation: 'Hernán MA, Robins JM. Causal Inference: What If. Chapman & Hall/CRC; 2020 (free online edition, updated regularly).', url: 'https://miguelhernan.org/whatifbook', note: 'Potential outcomes, identifiability, structural definitions of bias.' },
  { id: 'pearl2009', kind: 'textbook', citation: 'Pearl J. Causality: Models, Reasoning, and Inference. 2nd ed. Cambridge University Press; 2009.', note: 'd-separation and the backdoor criterion.' },
  { id: 'fleiss2003', kind: 'textbook', citation: 'Fleiss JL, Levin B, Paik MC. Statistical Methods for Rates and Proportions. 3rd ed. Wiley; 2003.', note: 'Sample size for two proportions.' },
  { id: 'lash2021', kind: 'textbook', citation: 'Fox MP, MacLehose RF, Lash TL. Applying Quantitative Bias Analysis to Epidemiologic Data. 2nd ed. Springer; 2021.', note: 'Misclassification correction.' },

  // Measures & statistics
  { id: 'katz1978', kind: 'methods', citation: 'Katz D, Baptista J, Azen SP, Pike MC. Obtaining confidence intervals for the risk ratio in cohort studies. Biometrics. 1978;34(3):469-474.', doi: '10.2307/2530610' },
  { id: 'woolf1955', kind: 'methods', citation: 'Woolf B. On estimating the relation between blood group and disease. Ann Hum Genet. 1955;19(4):251-253.', doi: '10.1111/j.1469-1809.1955.tb01348.x' },
  { id: 'newcombe1998', kind: 'methods', citation: 'Newcombe RG. Interval estimation for the difference between independent proportions: comparison of eleven methods. Stat Med. 1998;17(8):873-890.', note: 'Hybrid score interval for the risk difference.' },
  { id: 'altman1998', kind: 'methods', citation: 'Altman DG. Confidence intervals for the number needed to treat. BMJ. 1998;317(7168):1309-1312.', doi: '10.1136/bmj.317.7168.1309' },
  { id: 'knol2008', kind: 'methods', citation: 'Knol MJ, Vandenbroucke JP, Scott P, Egger M. What do case-control studies estimate? Survey of methods and assumptions in published case-control research. Am J Epidemiol. 2008;168(9):1073-1081.', doi: '10.1093/aje/kwn217' },
  { id: 'hernan2010hr', kind: 'methods', citation: 'Hernán MA. The hazards of hazard ratios. Epidemiology. 2010;21(1):13-15.', doi: '10.1097/EDE.0b013e3181c1ea43' },
  { id: 'wasserstein2016', kind: 'methods', citation: 'Wasserstein RL, Lazar NA. The ASA statement on p-values: context, process, and purpose. Am Stat. 2016;70(2):129-133.', doi: '10.1080/00031305.2016.1154108' },
  { id: 'greenland2016', kind: 'methods', citation: 'Greenland S, Senn SJ, Rothman KJ, et al. Statistical tests, P values, confidence intervals, and power: a guide to misinterpretations. Eur J Epidemiol. 2016;31(4):337-350.', doi: '10.1007/s10654-016-0149-3' },
  { id: 'mantel1959', kind: 'methods', citation: 'Mantel N, Haenszel W. Statistical aspects of the analysis of data from retrospective studies of disease. J Natl Cancer Inst. 1959;22(4):719-748.', doi: '10.1093/jnci/22.4.719' },
  { id: 'greenland1985', kind: 'methods', citation: 'Greenland S, Robins JM. Estimation of a common effect parameter from sparse follow-up data. Biometrics. 1985;41(1):55-68.', doi: '10.2307/2530643' },
  { id: 'rgb1986', kind: 'methods', citation: 'Robins J, Breslow N, Greenland S. Estimators of the Mantel-Haenszel variance consistent in both sparse data and large-strata limiting models. Biometrics. 1986;42(2):311-323.', doi: '10.2307/2531052' },

  // Designs & causal inference
  { id: 'hernanrobins2016', kind: 'methods', citation: 'Hernán MA, Robins JM. Using big data to emulate a target trial when a randomized trial is not available. Am J Epidemiol. 2016;183(8):758-764.', doi: '10.1093/aje/kwv254' },
  { id: 'hernan2022tte', kind: 'methods', citation: 'Hernán MA, Wang W, Leaf DE. Target trial emulation: a framework for causal inference from observational data. JAMA. 2022;328(24):2446-2447.', doi: '10.1001/jama.2022.21383' },
  { id: 'hernan2016timezero', kind: 'methods', citation: 'Hernán MA, Sauer BC, Hernández-Díaz S, Platt R, Shrier I. Specifying a target trial prevents immortal time bias and other self-inflicted injuries in observational analyses. J Clin Epidemiol. 2016;79:70-75.', doi: '10.1016/j.jclinepi.2016.04.014' },
  { id: 'maclure1991', kind: 'methods', citation: 'Maclure M. The case-crossover design: a method for studying transient effects on the risk of acute events. Am J Epidemiol. 1991;133(2):144-153.', doi: '10.1093/oxfordjournals.aje.a115853' },
  { id: 'whitaker2006', kind: 'methods', citation: 'Whitaker HJ, Farrington CP, Spiessens B, Musonda P. Tutorial in biostatistics: the self-controlled case series method. Stat Med. 2006;25(10):1768-1797.', doi: '10.1002/sim.2302' },
  { id: 'schulz2002', kind: 'methods', citation: 'Schulz KF, Grimes DA. Allocation concealment in randomised trials: defending against deciphering. Lancet. 2002;359(9306):614-618.', doi: '10.1016/S0140-6736(02)07750-4' },
  { id: 'devereaux2001', kind: 'methods', citation: 'Devereaux PJ, Manns BJ, Ghali WA, et al. Physician interpretations and textbook definitions of blinding terminology in randomized controlled trials. JAMA. 2001;285(15):2000-2003.', doi: '10.1001/jama.285.15.2000' },
  { id: 'robinson1950', kind: 'methods', citation: 'Robinson WS. Ecological correlations and the behavior of individuals. Am Sociol Rev. 1950;15(3):351-357.', doi: '10.2307/2087176' },
  { id: 'greenland1999dag', kind: 'methods', citation: 'Greenland S, Pearl J, Robins JM. Causal diagrams for epidemiologic research. Epidemiology. 1999;10(1):37-48.', doi: '10.1097/00001648-199901000-00008' },
  { id: 'greenland1999collapse', kind: 'methods', citation: 'Greenland S, Robins JM, Pearl J. Confounding and collapsibility in causal inference. Stat Sci. 1999;14(1):29-46.', doi: '10.1214/ss/1009211805' },
  { id: 'shrier2008', kind: 'methods', citation: 'Shrier I, Platt RW. Reducing bias through directed acyclic graphs. BMC Med Res Methodol. 2008;8:70.', doi: '10.1186/1471-2288-8-70' },
  { id: 'textor2016', kind: 'methods', citation: "Textor J, van der Zander B, Gilthorpe MS, Liśkiewicz M, Ellison GT. Robust causal inference using directed acyclic graphs: the R package 'dagitty'. Int J Epidemiol. 2016;45(6):1887-1894.", doi: '10.1093/ije/dyw341' },
  { id: 'tennant2021', kind: 'methods', citation: 'Tennant PWG, Murray EJ, Arnold KF, et al. Use of directed acyclic graphs (DAGs) to identify confounders in applied health research: review and recommendations. Int J Epidemiol. 2021;50(2):620-632.', doi: '10.1093/ije/dyaa213' },
  { id: 'westreich2013', kind: 'methods', citation: 'Westreich D, Greenland S. The Table 2 fallacy: presenting and interpreting confounder and modifier coefficients. Am J Epidemiol. 2013;177(4):292-298.', doi: '10.1093/aje/kws412' },
  { id: 'rosenbaum1983', kind: 'methods', citation: 'Rosenbaum PR, Rubin DB. The central role of the propensity score in observational studies for causal effects. Biometrika. 1983;70(1):41-55.', doi: '10.1093/biomet/70.1.41' },

  // Bias
  { id: 'hernan2004', kind: 'methods', citation: 'Hernán MA, Hernández-Díaz S, Robins JM. A structural approach to selection bias. Epidemiology. 2004;15(5):615-625.', doi: '10.1097/01.ede.0000135174.63482.43' },
  { id: 'berkson1946', kind: 'methods', citation: 'Berkson J. Limitations of the application of fourfold table analysis to hospital data. Biometrics Bull. 1946;2(3):47-53.' },
  { id: 'cole2010', kind: 'methods', citation: 'Cole SR, Platt RW, Schisterman EF, et al. Illustrating bias due to conditioning on a collider. Int J Epidemiol. 2010;39(2):417-420.', doi: '10.1093/ije/dyp334' },
  { id: 'hernandezdiaz2006', kind: 'example', citation: 'Hernández-Díaz S, Schisterman EF, Hernán MA. The birth weight "paradox" uncovered? Am J Epidemiol. 2006;164(11):1115-1120.', doi: '10.1093/aje/kwj275' },
  { id: 'jurek2005', kind: 'methods', citation: 'Jurek AM, Greenland S, Maldonado G, Church TR. Proper interpretation of non-differential misclassification effects: expectations vs observations. Int J Epidemiol. 2005;34(3):680-687.', doi: '10.1093/ije/dyi060' },
  { id: 'lash2014', kind: 'methods', citation: 'Lash TL, Fox MP, MacLehose RF, Maldonado G, McCandless LC, Greenland S. Good practices for quantitative bias analysis. Int J Epidemiol. 2014;43(6):1969-1985.', doi: '10.1093/ije/dyu149' },
  { id: 'suissa2008', kind: 'methods', citation: 'Suissa S. Immortal time bias in pharmaco-epidemiology. Am J Epidemiol. 2008;167(4):492-499.', doi: '10.1093/aje/kwm324' },
  { id: 'levesque2010', kind: 'example', citation: 'Lévesque LE, Hanley JA, Kezouh A, Suissa S. Problem of immortal time bias in cohort studies: example using statins for preventing progression of diabetes. BMJ. 2010;340:b5087.', doi: '10.1136/bmj.b5087' },
  { id: 'ray2003', kind: 'methods', citation: 'Ray WA. Evaluating medication effects outside of clinical trials: new-user designs. Am J Epidemiol. 2003;158(9):915-920.', doi: '10.1093/aje/kwg231' },
  { id: 'hernan2008whi', kind: 'example', citation: "Hernán MA, Alonso A, Logan R, et al. Observational studies analyzed like randomized experiments: an application to postmenopausal hormone therapy and coronary heart disease. Epidemiology. 2008;19(6):766-779.", doi: '10.1097/EDE.0b013e3181875e61' },
  { id: 'welch2010', kind: 'methods', citation: 'Welch HG, Black WC. Overdiagnosis in cancer. J Natl Cancer Inst. 2010;102(9):605-613.', doi: '10.1093/jnci/djq099' },
  { id: 'barnett2005', kind: 'methods', citation: 'Barnett AG, van der Pols JC, Dobson AJ. Regression to the mean: what it is and how to deal with it. Int J Epidemiol. 2005;34(1):215-220.', doi: '10.1093/ije/dyh299' },

  // Interaction
  { id: 'knol2012', kind: 'methods', citation: 'Knol MJ, VanderWeele TJ. Recommendations for presenting analyses of effect modification and interaction. Int J Epidemiol. 2012;41(2):514-520.', doi: '10.1093/ije/dyr218' },
  { id: 'vanderweele2014', kind: 'methods', citation: 'VanderWeele TJ, Knol MJ. A tutorial on interaction. Epidemiol Methods. 2014;3(1):33-72.', doi: '10.1515/em-2013-0005' },
  { id: 'schandelmaier2020', kind: 'methods', citation: 'Schandelmaier S, Briel M, Varadhan R, et al. Development of the Instrument to assess the Credibility of Effect Modification Analyses (ICEMAN) in randomized controlled trials and meta-analyses. CMAJ. 2020;192(32):E901-E906.', doi: '10.1503/cmaj.200077' },
  { id: 'hammond1979', kind: 'example', citation: 'Hammond EC, Selikoff IJ, Seidman H. Asbestos exposure, cigarette smoking and death rates. Ann N Y Acad Sci. 1979;330:473-490.' },
  { id: 'ridker2005', kind: 'example', citation: "Ridker PM, Cook NR, Lee IM, et al. A randomized trial of low-dose aspirin in the primary prevention of cardiovascular disease in women. N Engl J Med. 2005;352(13):1293-1304.", doi: '10.1056/NEJMoa050613' },

  // Causation & appraisal
  { id: 'hill1965', kind: 'methods', citation: 'Hill AB. The environment and disease: association or causation? Proc R Soc Med. 1965;58(5):295-300.' },
  { id: 'fedak2015', kind: 'methods', citation: 'Fedak KM, Bernal A, Capshaw ZA, Gross S. Applying the Bradford Hill criteria in the 21st century: how data integration has changed causal inference in molecular epidemiology. Emerg Themes Epidemiol. 2015;12:14.', doi: '10.1186/s12982-015-0037-4' },
  { id: 'vanderweele2017', kind: 'methods', citation: 'VanderWeele TJ, Ding P. Sensitivity analysis in observational research: introducing the E-value. Ann Intern Med. 2017;167(4):268-274.', doi: '10.7326/M16-2607' },
  { id: 'vanderweele2020', kind: 'methods', citation: 'VanderWeele TJ. Optimal approximate conversions of odds ratios and hazard ratios to risk ratios. Biometrics. 2020;76(3):746-752.', doi: '10.1111/biom.13197' },
  { id: 'lawlor2016', kind: 'methods', citation: 'Lawlor DA, Tilling K, Davey Smith G. Triangulation in aetiological epidemiology. Int J Epidemiol. 2016;45(6):1866-1886.', doi: '10.1093/ije/dyw314' },
  { id: 'doll1950', kind: 'example', citation: 'Doll R, Hill AB. Smoking and carcinoma of the lung: preliminary report. BMJ. 1950;2(4682):739-748.', doi: '10.1136/bmj.2.4682.739' },
  { id: 'guyatt2008', kind: 'guideline', citation: 'Guyatt GH, Oxman AD, Vist GE, et al. GRADE: an emerging consensus on rating quality of evidence and strength of recommendations. BMJ. 2008;336(7650):924-926.', doi: '10.1136/bmj.39489.470347.AD' },
  { id: 'schunemann2019', kind: 'guideline', citation: 'Schünemann HJ, Cuello C, Akl EA, et al. GRADE guidelines: 18. How ROBINS-I and other tools to assess risk of bias in nonrandomized studies should be used to rate the certainty of a body of evidence. J Clin Epidemiol. 2019;111:105-114.', doi: '10.1016/j.jclinepi.2018.01.012' },
  { id: 'sterne2019', short: 'RoB 2 (Sterne 2019)', kind: 'guideline', citation: 'Sterne JAC, Savović J, Page MJ, et al. RoB 2: a revised tool for assessing risk of bias in randomised trials. BMJ. 2019;366:l4898.', doi: '10.1136/bmj.l4898' },
  { id: 'robinsi2024', short: 'ROBINS-I V2', kind: 'guideline', citation: 'Sterne JAC, Higgins JPT, et al. ROBINS-I V2: Risk Of Bias In Non-randomized Studies of Interventions, version 2 (launched November 2024; adds algorithms, a triage section and immortal-time items). Original: BMJ. 2016;355:i4919.', url: 'https://www.riskofbias.info/welcome/robins-i-v2' },

  // Reporting guidelines
  { id: 'consort2025', short: 'CONSORT 2025', kind: 'guideline', citation: 'Hopewell S, Chan AW, Collins GS, et al. CONSORT 2025 statement: updated guideline for reporting randomised trials. BMJ. 2025;389:e081123.', doi: '10.1136/bmj-2024-081123', note: '30-item checklist; new open-science section.' },
  { id: 'spirit2025', short: 'SPIRIT 2025', kind: 'guideline', citation: 'Chan AW, Boutron I, Hopewell S, et al. SPIRIT 2025 statement: updated guideline for protocols of randomised trials. BMJ. 2025;389:e081477.', doi: '10.1136/bmj-2024-081477', note: '34-item protocol checklist.' },
  { id: 'strobe2007', short: 'STROBE 2007', kind: 'guideline', citation: 'von Elm E, Altman DG, Egger M, et al. The Strengthening the Reporting of Observational Studies in Epidemiology (STROBE) statement. Lancet. 2007;370(9596):1453-1457.', doi: '10.1016/S0140-6736(07)61602-X', note: 'Still the base STROBE checklist; extensions include STROBE-Equity (2025).' },
  { id: 'target2025', short: 'TARGET 2025', kind: 'guideline', citation: 'Cashin AG, Hansford HJ, Hernán MA, et al. Transparent reporting of observational studies emulating a target trial — the TARGET statement. BMJ. 2025;390:e087179 (also JAMA. 2025;334(12):1084-1093).', url: 'https://www.target-guideline.org', note: '21-item checklist.' },
  { id: 'prisma2020', short: 'PRISMA 2020', kind: 'guideline', citation: 'Page MJ, McKenzie JE, Bossuyt PM, et al. The PRISMA 2020 statement: an updated guideline for reporting systematic reviews. BMJ. 2021;372:n71.', doi: '10.1136/bmj.n71' },
  { id: 'stard2015', short: 'STARD 2015', kind: 'guideline', citation: 'Bossuyt PM, Reitsma JB, Bruns DE, et al. STARD 2015: an updated list of essential items for reporting diagnostic accuracy studies. BMJ. 2015;351:h5527.', doi: '10.1136/bmj.h5527', note: 'STARD-AI (2025) extends it for AI tests.' },
  { id: 'tripodai2024', short: 'TRIPOD+AI 2024', kind: 'guideline', citation: 'Collins GS, Moons KGM, Dhiman P, et al. TRIPOD+AI statement: updated guidance for reporting clinical prediction models that use regression or machine learning methods. BMJ. 2024;385:e078378.', doi: '10.1136/bmj-2023-078378' },

  // Ethics
  { id: 'belmont1979', short: 'Belmont Report 1979', kind: 'ethics', citation: 'National Commission for the Protection of Human Subjects of Biomedical and Behavioral Research. The Belmont Report. 1979.', url: 'https://www.hhs.gov/ohrp/regulations-and-policy/belmont-report/index.html' },
  { id: 'helsinki2024', short: 'Declaration of Helsinki 2024', kind: 'ethics', citation: 'World Medical Association. Declaration of Helsinki: ethical principles for medical research involving human participants (revised October 2024). JAMA. 2025;333(1):71-74.', doi: '10.1001/jama.2024.21972' },
  { id: 'ich2025', short: 'ICH E6(R3) 2025', kind: 'ethics', citation: 'International Council for Harmonisation. ICH E6(R3) Guideline for Good Clinical Practice. Step 4, 6 January 2025 (EU effective 23 July 2025).', url: 'https://www.ich.org/page/efficacy-guidelines' },
  { id: 'commonrule2018', short: 'Common Rule 45 CFR 46', kind: 'ethics', citation: 'U.S. Federal Policy for the Protection of Human Subjects ("Common Rule"), 45 CFR 46, 2018 Requirements.', url: 'https://www.ecfr.gov/current/title-45/subtitle-A/subchapter-A/part-46' },
  { id: 'cioms2016', short: 'CIOMS 2016', kind: 'ethics', citation: 'Council for International Organizations of Medical Sciences (CIOMS). International Ethical Guidelines for Health-related Research Involving Humans. Geneva; 2016.', url: 'https://cioms.ch/publications/product/international-ethical-guidelines-for-health-related-research-involving-humans/' },
  { id: 'freedman1987', kind: 'ethics', citation: 'Freedman B. Equipoise and the ethics of clinical research. N Engl J Med. 1987;317(3):141-145.', doi: '10.1056/NEJM198707163170304' },
  { id: 'weijer2012', kind: 'ethics', citation: 'Weijer C, Grimshaw JM, Eccles MP, et al. The Ottawa Statement on the ethical design and conduct of cluster randomized trials. PLoS Med. 2012;9(11):e1001346.', doi: '10.1371/journal.pmed.1001346' },
  { id: 'bassler2010', kind: 'ethics', citation: 'Bassler D, Briel M, Montori VM, et al. Stopping randomized trials early for benefit and estimation of treatment effects: systematic review and meta-regression analysis. JAMA. 2010;303(12):1180-1187.', doi: '10.1001/jama.2010.310' },
  { id: 'icmje', short: 'ICMJE Recommendations', kind: 'ethics', citation: 'International Committee of Medical Journal Editors. Recommendations for the Conduct, Reporting, Editing, and Publication of Scholarly Work in Medical Journals (current edition).', url: 'https://www.icmje.org/recommendations/' },
];

export const referenceById = Object.fromEntries(references.map((r) => [r.id, r]));

export function referenceShort(r: Reference): string {
  if (r.short) return r.short;
  const surname = r.citation.split(/[ ,]/)[0];
  const year = r.citation.match(/(19|20)\d{2}/)?.[0] ?? '';
  return `${surname} ${year}`.trim();
}

export function referenceHref(r: Reference): string {
  if (r.doi) return `https://doi.org/${r.doi}`;
  if (r.url) return r.url;
  return `https://pubmed.ncbi.nlm.nih.gov/?term=${encodeURIComponent(r.citation.split('. ').slice(1, 2).join(' '))}`;
}
