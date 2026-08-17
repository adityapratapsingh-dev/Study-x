import { Subject, Note, Test, FlashcardDeck, StudyTask, TestAttempt } from '../types';
import { COMPETITIVE_SUBJECTS, INITIAL_STUDY_TASKS } from './competitiveData';
import { JEE_SAMPLE_QUESTIONS, JEE_FULL_MOCK_TEST } from '../components/jee/jeeData';
import { NEET_SAMPLE_QUESTIONS, NEET_FULL_MOCK_TEST } from '../components/neet/neetData';

export const INITIAL_SUBJECTS: Subject[] = COMPETITIVE_SUBJECTS;

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Current Electricity: Kirchhoff Laws, Wheatstone & RC Circuits',
    subjectId: 'subj-phy',
    chapter: 'Current Electricity',
    examTag: 'BOTH',
    tags: ['Physics', 'Kirchhoff', 'Wheatstone', 'RC Circuits', 'Class 12'],
    createdAt: '2026-08-12T10:00:00.000Z',
    updatedAt: '2026-08-16T14:30:00.000Z',
    isFavorite: true,
    aiSummary: `**Key Summary**: Current electricity contributes 2-3 questions per exam shift in JEE and 3 questions in NEET.
- **Kirchhoff's Junction Law**: $\\sum I_{in} = \\sum I_{out}$ (Conservation of Charge).
- **Kirchhoff's Loop Law**: $\\sum \\Delta V = 0$ around closed loop (Conservation of Energy).
- **Wheatstone Bridge**: Balanced when $\\frac{R_1}{R_2} = \\frac{R_3}{R_4} \\implies I_G = 0$.
- **RC Charging Circuit**: $q(t) = Q_{max}(1 - e^{-t/RC})$, Time constant $\\tau = RC$. At $t = \\tau$, $q = 0.63 Q_{max}$.`,
    content: `# Current Electricity: High-Yield Revision Notes

## 1. Electric Current & Drift Velocity ($v_d$)
The relation between current ($I$) and drift velocity ($v_d$) is:
$$I = n e A v_d$$
Where:
- $n = \\text{free electron density}$
- $e = 1.6 \\times 10^{-19}\\text{ C}$
- $A = \\text{cross-sectional area}$
- $v_d = \\frac{e E \\tau}{m}$ ($\\tau = \\text{relaxation time}$)

### Current Density ($\\vec{J}$) and Microscopic Ohm's Law
$$\\vec{J} = \\sigma \\vec{E} = \\frac{1}{\\rho} \\vec{E}$$
$$\\rho = \\frac{m}{n e^2 \\tau}$$

---

## 2. Kirchhoff's Laws
1. **Kirchhoff's Current Law (KCL)**: At any junction, $\\sum I = 0$. **Physical basis:** Law of Conservation of Electric Charge.
2. **Kirchhoff's Voltage Law (KVL)**: Around any closed electrical loop, $\\sum \\Delta V = 0$. **Physical basis:** Law of Conservation of Energy.

---

## 3. Cells in Series, Parallel & Mixed Grouping
- **$n$ Identical cells in series**: $E_{eq} = nE, \\quad r_{eq} = nr, \\quad I = \\frac{nE}{R + nr}$
- **$m$ Identical cells in parallel**: $E_{eq} = E, \\quad r_{eq} = \\frac{r}{m}, \\quad I = \\frac{E}{R + r/m}$
- **Maximum Power Transfer Theorem**: Maximum power is transferred to external load when $R = r_{internal}$.
$$P_{max} = \\frac{E^2}{4r}$$

---

## 4. RC Charging & Discharging Circuits
- **Charging**:
  $$q(t) = Q_0 (1 - e^{-t/RC})$$
  $$I(t) = I_0 e^{-t/RC}$$
- **Discharging**:
  $$q(t) = Q_0 e^{-t/RC}$$
- **Energy Stored in Capacitor at Steady State**: $U = \\frac{1}{2} C V^2$. Total work done by battery is $W = Q V = C V^2$. Half of the energy ($50\\%$) is always dissipated as heat in resistor!
`,
  },
  {
    id: 'note-2',
    title: 'General Organic Chemistry (GOC): Intermediates, Inductive & Resonance',
    subjectId: 'subj-chem',
    chapter: 'General Organic Chemistry',
    examTag: 'BOTH',
    tags: ['Chemistry', 'GOC', 'Carbocation', 'Resonance', 'Acidity', 'Class 11'],
    createdAt: '2026-08-13T09:15:00.000Z',
    updatedAt: '2026-08-15T16:20:00.000Z',
    isFavorite: true,
    aiSummary: `**Executive Summary**: GOC is the backbone of 15+ questions across Organic Chemistry in JEE & NEET.
- **Carbocation Stability**: Aromatic (Tropylium) > Substituted Cyclopropylmethyl (CPM) > Resonance/Mesomeric (+M) > Hyperconjugation ($\\alpha$-H) > Inductive (+I).
- **Aromaticity (Hückel's Rule)**: Planar, cyclic, continuous resonance with $(4n+2)\\pi$ electrons ($n=0, 1, 2, \\dots$).
- **Acidic Strength**: Directly proportional to stability of conjugate base anion ($-M > -I$). Orthonitrophenol is stronger acid than para/meta due to ortho effect in benzoic acids.`,
    content: `# General Organic Chemistry (GOC): Complete Blueprint

## 1. Electronic Effects Hierarchy
When comparing stability or acidity, always apply effects in this strict priority order:
$$\\text{Aromaticity} > \\text{Mesomeric (+M/-M)} > \\text{Hyperconjugation} > \\text{Inductive (+I/-I)}$$

---

## 2. Carbocation ($C^+$) Stability Order
Carbocations are electron deficient ($6e^-$ in valence shell, $sp^2$ hybridized, planar):
1. **Tropylium Cation**: $6\\pi e^-$, aromatic, extraordinary stability.
2. **Cyclopropylmethyl Cation (CPM)**: Dancing resonance with bent $\\sigma$-orbitals.
3. **Triphenylmethyl $\\text{Ph}_3C^+$**: Extensive resonance across 3 phenyl rings.
4. **Aliphatic $3^\\circ > 2^\\circ > 1^\\circ > \\text{CH}_3^+$**: Governed by hyperconjugation number of $\\alpha$-hydrogens ($9\\alpha\\text{-H} > 6\\alpha\\text{-H} > 3\\alpha\\text{-H}$).

---

## 3. Acidic Strength of Organic Acids
$$\\text{Acidic Strength} \\propto K_a \\propto \\frac{1}{pK_a} \\propto \\text{Stability of Conjugate Base Anion}$$
- **Carboxylic Acids**: Substituted with electron-withdrawing groups (EWG, e.g. $-NO_2, -CN, -F$) stabilize $-COO^-$ via $-I$ and $-M$.
- **Ortho Effect in Benzoic Acid**: Any ortho-substituted benzoic acid is stronger than benzoic acid due to steric inhibition of resonance (SIR).
- **Phenols**: Picric acid ($2,4,6\\text{-trinitrophenol}$) has $pK_a \\approx 0.38$ (stronger than carboxylic acid!).
`,
  },
  {
    id: 'note-3',
    title: 'Definite Integrals: King Property, Leibniz Rule & Periodic Integrals',
    subjectId: 'subj-math',
    chapter: 'Definite Integrals',
    examTag: 'JEE',
    tags: ['Mathematics', 'Calculus', 'King Property', 'Leibniz', 'Class 12'],
    createdAt: '2026-08-14T11:00:00.000Z',
    updatedAt: '2026-08-15T18:00:00.000Z',
    isFavorite: false,
    content: `# Definite Integrals: King Property & Scoring Rules

## 1. King Property (Most Tested in JEE Main)
$$\\int_a^b f(x) dx = \\int_a^b f(a + b - x) dx$$
Special case ($a = 0$):
$$\\int_0^a f(x) dx = \\int_0^a f(a - x) dx$$

### Standard JEE Result
$$\\int_0^{\\pi/2} \\frac{\\sin^n x}{\\sin^n x + \\cos^n x} dx = \\frac{\\pi}{4} \\quad (\\forall n \\in \\mathbb{R})$$
$$\\int_0^{\\pi/2} \\ln(\\sin x) dx = -\\frac{\\pi}{2} \\ln 2$$

---

## 2. Leibniz Rule for Differentiating Integrals
If $I(x) = \\int_{u(x)}^{v(x)} f(x, t) dt$, then:
$$\\frac{dI}{dx} = f(x, v(x)) \\cdot v'(x) - f(x, u(x)) \\cdot u'(x) + \\int_{u(x)}^{v(x)} \\frac{\\partial}{\\partial x} f(x, t) dt$$
`,
  },
  {
    id: 'note-4',
    title: 'Molecular Basis of Inheritance: Lac Operon, Genetic Code & DNA Replication',
    subjectId: 'subj-botany',
    chapter: 'Genetics & Molecular Biology',
    examTag: 'NEET',
    tags: ['Biology', 'Genetics', 'Lac Operon', 'NCERT Class 12'],
    createdAt: '2026-08-11T13:45:00.000Z',
    updatedAt: '2026-08-14T10:10:00.000Z',
    isFavorite: true,
    content: `# Molecular Basis of Inheritance: NCERT Direct Points

## 1. Structure of DNA (Watson-Crick Double Helix)
- Pitch of double helix: **3.4 nm** ($34\\text{ Å}$).
- Number of base pairs per turn: **10 bp**; Distance between adjacent base pairs: **0.34 nm**.
- Diameter of double helix: **2.0 nm**.
- Purines: **Adenine (A)** & **Guanine (G)**. Pyrimidines: **Cytosine (C)**, **Thymine (T)** (5-methyluracil), and **Uracil (U)** (in RNA only).

---

## 2. The Lac Operon (Jacob & Monod)
- **$i$ Gene**: Synthesizes the **Repressor protein** constitutively.
- **Promoter ($p$)**: Binding site for RNA Polymerase.
- **Operator ($o$)**: Binding site for Repressor protein.
- **Structural Genes**:
  - $z$ gene $\\rightarrow$ **$\\beta$-galactosidase** (hydrolyzes lactose into glucose + galactose).
  - $y$ gene $\\rightarrow$ **Permease** (increases cell membrane permeability to $\\beta$-galactosides).
  - $a$ gene $\\rightarrow$ **Transacetylase**.
- **Inducer**: Allolactose (binds to repressor and inactivates it).
`,
  },
];

export const INITIAL_TESTS: Test[] = [
  JEE_FULL_MOCK_TEST,
  NEET_FULL_MOCK_TEST,
  {
    id: 'test-phy-drill',
    title: 'Physics High-Yield Practice Drill (Mechanics & Electrodynamics)',
    description: 'Targeted +4 / -1 practice questions with step-by-step solutions.',
    subjectId: 'subj-phy',
    examType: 'CHAPTER_WISE',
    targetExam: 'JEE',
    estimatedMinutes: 45,
    totalMarks: 40,
    positiveMarks: 4,
    negativeMarks: 1,
    difficulty: 'Medium',
    questions: JEE_SAMPLE_QUESTIONS.slice(0, 4),
    createdAt: '2026-08-14T09:00:00.000Z',
    tags: ['Physics', 'PYQ', 'NTA Pattern'],
  },
  {
    id: 'test-bio-drill',
    title: 'NEET Biology 360 NCERT Line-by-Line Sprint',
    description: 'Rapid-fire NCERT biology questions covering Cell Biology, Genetics, and Human Physiology.',
    subjectId: 'subj-botany',
    examType: 'CHAPTER_WISE',
    targetExam: 'NEET',
    estimatedMinutes: 30,
    totalMarks: 40,
    positiveMarks: 4,
    negativeMarks: 1,
    difficulty: 'Medium',
    questions: NEET_SAMPLE_QUESTIONS.slice(0, 4),
    createdAt: '2026-08-15T11:00:00.000Z',
    tags: ['NEET', 'Botany', 'Zoology', 'NCERT Sprint'],
  }
];

export const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Organic Chemistry Named Reactions & Reagents',
    subjectId: 'subj-chem',
    examTag: 'BOTH',
    cards: [
      {
        id: 'c1',
        front: 'What are the reagents and products of Aldol Condensation?',
        back: 'Reagents: Aldehyde/Ketone having at least one α-hydrogen with dilute alkali (NaOH/KOH).\nProduct: β-hydroxy aldehyde (aldol) or β-hydroxy ketone (ketol), which on heating loses H2O to form α,β-unsaturated carbonyl.',
        category: 'Organic Reactions',
        state: 'review',
      },
      {
        id: 'c2',
        front: 'What is Cannizzaro Reaction and which carbonyls undergo it?',
        back: 'Disproportionation (redox) of aldehydes with NO α-hydrogen (e.g. Formaldehyde HCHO, Benzaldehyde PhCHO) when treated with concentrated (50%) NaOH.\nProducts: One molecule reduced to Alcohol (CH3OH/PhCH2OH), one oxidized to Carboxylate salt (HCOONa/PhCOONa).',
        category: 'Organic Reactions',
        state: 'mastered',
      },
      {
        id: 'c3',
        front: 'What reagent is used in Reimer-Tiemann Reaction and what is the intermediate?',
        back: 'Reagents: Phenol + CHCl3 + aqueous NaOH at 340 K.\nElectrophilic Intermediate: Dichlorocarbene (:CCl2) [neutral electrophile with 6 valence electrons].\nMajor Product: Salicylaldehyde (2-hydroxybenzaldehyde).',
        category: 'Organic Reactions',
        state: 'learning',
      },
    ],
  },
  {
    id: 'deck-2',
    title: 'Physics Constants, Dimensions & Formula Speed Cards',
    subjectId: 'subj-phy',
    examTag: 'BOTH',
    cards: [
      {
        id: 'c4',
        front: 'What is the De Broglie wavelength of an electron accelerated through potential V volts?',
        back: 'λ = 12.27 / √V Å (or 1.227 / √V nm).\nDerived from λ = h / √(2m e V).',
        category: 'Modern Physics',
        state: 'mastered',
      },
      {
        id: 'c5',
        front: 'What is the relation between Permittivity (ε0), Permeability (μ0), and Speed of light (c)?',
        back: 'c = 1 / √(μ0 ε0)\nDimensions of 1 / √(μ0 ε0) is [L T^-1] (velocity).',
        category: 'Electrodynamics',
        state: 'review',
      },
    ],
  },
  {
    id: 'deck-3',
    title: 'NEET Biology NCERT Exceptions & Numbers',
    subjectId: 'subj-botany',
    examTag: 'NEET',
    cards: [
      {
        id: 'c6',
        front: 'What is the RQ (Respiratory Quotient) value of Tripalmitin fat?',
        back: 'RQ = 0.7\nFormula: 2(C51H98O6) + 145 O2 -> 102 CO2 + 98 H2O. RQ = 102 / 145 = 0.7.',
        category: 'Plant Physiology',
        state: 'learning',
      },
      {
        id: 'c7',
        front: 'In human female menstrual cycle, on which day does LH surge and ovulation occur?',
        back: 'Day 14 (Mid-cycle of standard 28-day cycle) induces rupture of mature Graafian follicle and release of secondary oocyte.',
        category: 'Human Reproduction',
        state: 'mastered',
      },
    ],
  },
];

export const INITIAL_TASKS: StudyTask[] = INITIAL_STUDY_TASKS;

export const INITIAL_ATTEMPTS: TestAttempt[] = [
  {
    id: 'att-1',
    testId: JEE_FULL_MOCK_TEST.id,
    testTitle: JEE_FULL_MOCK_TEST.title,
    subjectId: 'subj-phy',
    examType: 'JEE_MAIN',
    startedAt: '2026-08-16T08:00:00.000Z',
    completedAt: '2026-08-16T11:00:00.000Z',
    durationSeconds: 10450,
    answers: {
      'jee-q1': '\\frac{1}{c} \\sqrt{\\frac{E}{2m}}',
      'jee-q2': '3',
      'jee-q3': 'Tropylium cation (Cycloheptatrienyl cation)',
      'jee-q4': '24',
      'jee-q5': '\\frac{\\pi}{4}',
      'jee-q6': '4',
    },
    score: 24,
    totalMarks: 24,
    totalQuestions: 6,
    correctCount: 6,
    incorrectCount: 0,
    unattemptedCount: 0,
    percentage: 100,
  },
];
