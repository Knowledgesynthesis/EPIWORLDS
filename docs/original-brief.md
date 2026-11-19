# **EPIWORLDS — OPTIMIZED MASTER PROMPT FOR EDUCATIONAL APP GENERATION**  
A clinically rigorous, evidence-based, domain-specific master prompt for generating a **mobile-first, offline-capable, dark-mode educational app** that teaches clinicians the entire ecosystem of modern epidemiology—from study design → bias → confounding → effect modification → causal diagrams → causation.

---

# **MASTER PROMPT — EpiWorlds Educational App Generator (SPECIALIZED VERSION)**

## **Role & Mission**
You are a cross-functional product team (PM + Staff Engineer + Senior Instructional Designer + Epidemiology SME + Biostatistics SME + Research Ethics Specialist + UX Writer + QA).  
Your mission is to design an **interactive epidemiology learning environment** that teaches:

**EpiWorlds: From Study Design to Causation**  
—A dynamic sandbox where learners build studies, manipulate design choices, visualize how bias propagates, and understand how causal inference works.

The app must:
- Support **all learner levels:** MS2 → MS4 → residents → fellows → attending clinicians → public health professionals  
- Cover **all clinical contexts:** reading research papers, designing studies, interpreting causal claims, evaluating bias, ethical considerations  
- Maintain **statistical rigor** and avoid any mathematical or epidemiologic contradictions  
- Use **synthetic data only**, with safety, accuracy, and reproducibility built in  
- Be mobile-first, offline-ready, and dark-mode optimized  
- Avoid hallucinated statistical formulas or non-existent DAG principles  
- Teach causal inference clearly with proper prerequisites  

Your output must be **coherent, evidence-based, and logic-tight** across epidemiology, biostatistics, and research ethics.

---

## **Inputs (Fill These)**
- **Primary Topic(s):**  
  Always centered on **clinical epidemiology**, including:  
  - Observational vs experimental study designs  
  - RCT essentials (allocation, concealment, blinding)  
  - Cohort, case-control, cross-sectional, ecologic studies  
  - Confounding, bias types, effect modification  
  - Causal inference principles  
  - Directed Acyclic Graphs (DAGs): structure, prerequisites, rules, interpretation  
  - Validity (internal/external)  
  - Error sources: misclassification, selection bias, measurement error  
  - Ethics of research design  
- **Target Learner Levels:** {{LEVELS}}  
  - e.g., “Medical students, residents, clinicians, clinical researchers”
- **Learner Context:** {{CONTEXT}}  
  - e.g., “Exam prep; journal club interpretation; designing clinical research; evaluating evidence”
- **Learning Outcomes (SMART + Bloom):** {{LEARNING_OBJECTIVES}}  
  - e.g., “Classify study designs; detect bias; build and interpret DAGs; determine confounding vs effect modification; evaluate causality”
- **Constraints/Preferences:**  
  Always include:  
  - *Mobile-first; dark mode; offline-ready; reproducible examples; synthetic datasets; no real patient data; clinically applicable*  
- **References/Standards:** {{REFERENCES}}  
  - e.g., “STROBE, CONSORT, EQUATOR Network, Rothman’s Epidemiology, Hernán & Robins Causal Inference”
- **Brand/Voice:** {{VOICE_TONE}}  
  - e.g., “Clear, intuitive, visually rich, clinically grounded”
- **Localization/Regional Considerations:** {{LOCALE}}

---

# **Required Deliverables (Produce All)**

---

## **1. Executive Summary**
- Explain why clinicians often struggle to understand bias, confounding, and causal inference.  
- Introduce EpiWorlds as a **Study Design Simulator + Bias Visualizer + Causal DAG Builder**.  
- Provide 2–3 app name alternatives + value propositions.

---

## **2. Learner Personas & Use Cases**
Examples:
- Resident interpreting clinical trials during rounds  
- Fellow designing a study for a QI project  
- Clinician reading literature to guide practice  
- Public health trainee exploring observational biases  
Use cases: journal club, board prep, study design practice, bias troubleshooting.

---

## **3. Curriculum Map & Knowledge Graph**
Everything must connect **Epidemiology ↔ Biostatistics ↔ Ethics ↔ Causal Reasoning**.

### **Prerequisites**
- Probability & basic statistics  
- Study design fundamentals  
- Variables & measurement  
- Risk ratios, odds ratios, incidence/prevalence  
- Intro to graphical models (before DAGs)

### **Modules**
1. **Foundations of Epidemiologic Thinking**  
   - Populations vs samples  
   - Associations vs causation  
   - Determinants, exposures, outcomes  

2. **Study Design Architecture**  
   - Experimental vs observational  
   - Cohort, case–control, cross-sectional, RCT designs  
   - Selection of sampling frames  
   - Internal vs external validity  

3. **Bias & Error**  
   - Selection bias  
   - Information bias  
   - Misclassification (differential vs non-differential)  
   - Confounding vs effect modification  

4. **Causal Inference Basics**  
   - Counterfactual logic  
   - Potential outcomes framework  
   - Assumptions (exchangeability, positivity, consistency)  

5. **DAG Foundations & Builder Module**  
   - What is a node?  
   - What is a directed edge?  
   - Why “acyclic”?  
   - Pathways (causal, backdoor, collider, mediator)  
   - Reading DAGs  
   - Designing DAGs for common clinical questions  
   - Identifying confounding using backdoor criterion  
   - What adjusting solves vs worsens (collider bias)  

6. **Bias Visualization Engine**  
   - Animate flow: population → sample → exposure/outcome → error propagation  
   - Show how missing data, selection, and measurement errors distort estimates  

7. **Study Design Sandbox**  
   - Build synthetic RCTs and observational studies  
   - Manipulate allocation, sampling, measurement → see validity change  

8. **Research Ethics & Integrity**  
   - Equipoise  
   - Informed consent  
   - Data monitoring  
   - Conflicts of interest  
   - Ethical use of observational designs  
   - Reporting standards  

Each module: micro-concepts, Bloom levels, prerequisites, knowledge graph links.

---

## **4. Interactives (EpiWorlds-Specific)**

### **Examples**
- **Study Builder Sandbox**  
  - Choose design → choose exposure/outcome → define measurement → view resulting biases  
- **Bias Propagation Visualizer**  
  - Step-by-step animation of how selection bias or measurement error appears  
- **Confounding & Effect Modification Lab**  
  - Drag variables → toggle relationships → watch risk estimates change  
- **Causal DAG Builder**  
  - Add/remove nodes  
  - Draw arrows  
  - Highlight colliders, backdoor paths, mediators  
  - Check for adjustment validity  
- **Ethics Scenario Engine**  
  - Evaluate study prototypes against basic ethical criteria  
- **Sampling Simulator**  
  - Show differences between random sampling, convenience sampling, stratification  
- **Misclassification Simulator**  
  - Adjust sensitivity/specificity of exposure/outcome measurement  
  - Observe bias direction toward/away from null  

For each interactive:
- purpose  
- inputs & controls  
- outputs  
- visuals (graphs, DAG overlays, flows)  
- preset cases  
- guardrails for statistical correctness  

---

## **5. Assessment & Mastery**
Item types:
- Identify proper study design  
- Classify bias from short vignettes  
- DAG interpretation questions  
- “Should we adjust for this variable?” exercises  
- Confounding vs effect modification  
- Ethical scenario evaluations  
- Calculation-based items (risk ratios, odds ratios—basic)  
Provide **10–20 items** with rationales.

---

## **6. Epidemiologic Reasoning Framework**
Teach learners stepwise reasoning:
1. Define research question  
2. Identify exposure/outcome  
3. Choose appropriate study design  
4. Identify potential confounders  
5. Draw preliminary DAG  
6. Determine adjustment set  
7. Assess bias risks  
8. Evaluate ethical considerations  
9. Interpret effect estimates  
10. Assess causality using frameworks (e.g., Bradford Hill, DAG-informed logic)

Include pitfalls:
- Adjusting for colliders  
- Mistaking effect modification for confounding  
- Inferring causation from association  
- Over-interpreting p-values  
- Mis-understanding DAG arrows as showing “strength”  

---

## **7. Accessibility & Safety**
- WCAG 2.2 AA  
- No real patient-level data  
- Synthetic data only  
- Clear disclaimers: educational, not IRB guidance  
- Prevent mathematically impossible DAG structures  
- Avoid incorrect statistical formulas  

---

## **8. Tech Architecture (Mobile-First, Offline)**
- React/TypeScript  
- Tailwind + shadcn/ui  
- DAG rendering via SVG/Canvas  
- Charting via Recharts/D3  
- IndexedDB + Service Worker for offline mode  
- State management: Zustand/Redux  
- Consistency validators for designs & DAGs  

---

## **9. Data Schemas (JSON)**
Schemas for:
- Study designs  
- Bias types  
- DAG structures (nodes, edges)  
- Sample populations  
- Synthetic datasets  
- Ethics evaluation templates  
- Glossary terms  
Include representative examples.

---

## **10. Screen Specs & Text Wireframes**
Screens:
- Home  
- Study Design Explorer  
- Bias Visualization Lab  
- Confounding & Effect Modification Lab  
- Causal DAG Builder  
- Ethics Module  
- Study Sandbox  
- Assessment Hub  
- Glossary  
- Settings  

Provide text-based wireframes.

---

## **11. Copy & Content Kit**
Include:
- Microcopy (tooltips, “Why this matters”, “Check for colliders”)  
- Glossary (exposure, outcome, DAG, collider, confounder, bias, effect modification)  
- Diagram labels  
- Two full example lessons + one integrated study-design case

---

## **12. Analytics & A/B Plan**
UI-only:
- DAG builder controls  
- Case navigation  
- Bias visualizer interaction modes  
**No statistical hypothesis testing experiments.**

---

## **13. QA Checklist**
- Validity of DAG logic (acyclic, proper causal structure)  
- Bias directionality accuracy  
- Correct epidemiologic definitions  
- No contradictory or impossible formulas  
- Ethics content aligned with standards  
- Consistent presentation of study designs  

---

## **14. Roadmap**
Prototype → Pilot → Advanced DAG Module → Observational Study Expansion → Personalized Learning Paths  
Include milestones, risks, acceptance criteria.

---

# **Style & Rigor Requirements**
- Clear, intuitive, research-oriented  
- Causation explained with proper DAG rules and epidemiologic evidence  
- Avoid oversimplification  
- All content clinically appropriate and evidence-based  
- Pathoma-like clarity but for epidemiology & causal inference  

---

# **Acceptance Criteria**
- Learner can design studies, detect bias, interpret DAGs, and reason causally  
- No contradictions across epidemiology, biostatistics, and ethics  
- The app reinforces a cohesive **EpiWorlds Research Systems Map**

---

# **Now Generate**
Using the inputs above, produce all deliverables in the required order.  
If any inputs are missing, make epidemiology-sound assumptions and label them as defaults.
