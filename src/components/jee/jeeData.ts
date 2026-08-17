import { Test, Question } from '../../types';

export const JEE_SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'jee-q1',
    type: 'mcq',
    subject: 'Physics',
    chapter: 'Modern Physics',
    pyqYear: 'JEE Main 2024 (27 Jan Shift 1)',
    difficulty: 'Medium',
    question: 'An electron of mass $m$ and a photon have the same energy $E$. The ratio of the de-Broglie wavelength of the electron to that of the photon is (where $c$ is speed of light):',
    options: [
      'c \\sqrt{\\frac{2m}{E}}',
      '\\frac{1}{c} \\sqrt{\\frac{E}{2m}}',
      'c \\sqrt{\\frac{E}{2m}}',
      '\\frac{1}{c} \\sqrt{\\frac{2m}{E}}'
    ],
    correctAnswer: '\\frac{1}{c} \\sqrt{\\frac{E}{2m}}',
    explanation: `**Step-by-step Solution:**
1. For an electron: $\\lambda_e = \\frac{h}{p} = \\frac{h}{\\sqrt{2mE}}$
2. For a photon: $E = \\frac{hc}{\\lambda_{ph}} \\implies \\lambda_{ph} = \\frac{hc}{E}$
3. Taking the ratio:
   $$\\frac{\\lambda_e}{\\lambda_{ph}} = \\frac{\\frac{h}{\\sqrt{2mE}}}{\\frac{hc}{E}} = \\frac{E}{c\\sqrt{2mE}} = \\frac{1}{c} \\sqrt{\\frac{E}{2m}}$$
**Correct Answer: Option (2)**`,
    hint: 'Relate wavelength of electron via kinetic energy formula and photon wavelength via E = hc/λ.',
  },
  {
    id: 'jee-q2',
    type: 'numerical',
    isNumerical: true,
    numericalRange: [12, 12],
    subject: 'Physics',
    chapter: 'Current Electricity',
    pyqYear: 'JEE Main 2023 (April Session)',
    difficulty: 'Medium',
    question: 'A wire of resistance $R = 48\\ \\Omega$ is cut into 4 equal parts. These 4 parts are then connected in parallel. The equivalent resistance of the parallel combination is _____ $\\Omega$.',
    correctAnswer: '3',
    explanation: `**Step-by-step Solution:**
1. Resistance of wire is directly proportional to length: $R \\propto L$.
2. When cut into 4 equal parts, resistance of each piece $R_i = \\frac{R}{4} = \\frac{48}{4} = 12\\ \\Omega$.
3. When 4 identical resistors each of $12\\ \\Omega$ are connected in parallel:
   $$\\frac{1}{R_{eq}} = \\frac{1}{12} + \\frac{1}{12} + \\frac{1}{12} + \\frac{1}{12} = \\frac{4}{12} = \\frac{1}{3}$$
   $$R_{eq} = 3\\ \\Omega$$
**Numerical Answer: 3**`,
    hint: 'Resistance of each piece is R/4. For n identical parallel resistors, R_eq = r/n.',
  },
  {
    id: 'jee-q3',
    type: 'mcq',
    subject: 'Chemistry',
    chapter: 'General Organic Chemistry (GOC)',
    pyqYear: 'JEE Main 2024 (29 Jan Shift 2)',
    difficulty: 'Hard',
    question: 'Which of the following carbocations is the MOST stable due to resonance and hyperconjugation?',
    options: [
      'Tropylium cation (Cycloheptatrienyl cation)',
      'Triphenylmethyl cation (Ph3C+)',
      'Benzyl cation (PhCH2+)',
      'tert-Butyl cation ((CH3)3C+)'
    ],
    correctAnswer: 'Tropylium cation (Cycloheptatrienyl cation)',
    explanation: `**Step-by-step Solution:**
1. **Tropylium cation** is planar, cyclic, completely conjugated with $(4n+2) = 6\\pi$ electrons ($n=1$).
2. By Hückel's Rule, it is **Aromatic** and possesses extraordinary thermodynamic stability higher than even triphenylmethyl carbocation.
3. Stability order: Tropylium cation > Triphenylmethyl cation > Benzyl > tert-Butyl.
**Correct Answer: Option (1)**`,
    hint: 'Check for aromaticity using Hückel’s 4n+2 rule.',
  },
  {
    id: 'jee-q4',
    type: 'numerical',
    isNumerical: true,
    numericalRange: [4, 4],
    subject: 'Chemistry',
    chapter: 'Coordination Compounds',
    pyqYear: 'JEE Main 2023',
    difficulty: 'Medium',
    question: 'The spin-only magnetic moment of $[\\text{Fe(H}_2\\text{O)}_6]^{2+}$ is $\\sqrt{x}\\text{ BM}$. What is the integer value of $x$ (where $x = n(n+2)$ and $n$ is number of unpaired electrons)?',
    correctAnswer: '24',
    explanation: `**Step-by-step Solution:**
1. In $[\\text{Fe(H}_2\\text{O)}_6]^{2+}$, iron is in $+2$ oxidation state: $\\text{Fe}^{2+} = [\\text{Ar}] 3d^6 4s^0$.
2. $\\text{H}_2\\text{O}$ is a weak field ligand (WFL), so pairing does not occur:
   $t_{2g}^4 e_g^2 \\implies 4$ unpaired electrons ($n = 4$).
3. Spin-only magnetic moment $\\mu = \\sqrt{n(n+2)} = \\sqrt{4(4+2)} = \\sqrt{24}\\text{ BM} \\approx 4.90\\text{ BM}$.
4. Therefore, $x = 24$.
**Numerical Answer: 24**`,
    hint: 'Fe2+ is 3d6. Water is a weak field ligand, so high spin complex with 4 unpaired electrons.',
  },
  {
    id: 'jee-q5',
    type: 'mcq',
    subject: 'Mathematics',
    chapter: 'Definite Integrals',
    pyqYear: 'JEE Main 2024 (30 Jan Shift 1)',
    difficulty: 'Hard',
    question: 'Evaluate the definite integral $I = \\int_{0}^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$:',
    options: [
      '\\frac{\\pi}{4}',
      '\\frac{\\pi}{2}',
      '\\pi',
      '\\frac{\\pi}{8}'
    ],
    correctAnswer: '\\frac{\\pi}{4}',
    explanation: `**Step-by-step Solution:**
1. Let $I = \\int_0^{\\pi/2} \\frac{\\sin^3 x}{\\sin^3 x + \\cos^3 x} dx$ ---- (1)
2. Applying King Property: $\\int_0^a f(x) dx = \\int_0^a f(a-x) dx$:
   $$I = \\int_0^{\\pi/2} \\frac{\\sin^3(\\pi/2 - x)}{\\sin^3(\\pi/2 - x) + \\cos^3(\\pi/2 - x)} dx = \\int_0^{\\pi/2} \\frac{\\cos^3 x}{\\cos^3 x + \\sin^3 x} dx$$ ---- (2)
3. Adding (1) and (2):
   $$2I = \\int_0^{\\pi/2} \\frac{\\sin^3 x + \\cos^3 x}{\\sin^3 x + \\cos^3 x} dx = \\int_0^{\\pi/2} 1 dx = \\left[ x \\right]_0^{\\pi/2} = \\frac{\\pi}{2}$$
   $$I = \\frac{\\pi}{4}$$
**Correct Answer: Option (1)**`,
    hint: 'Use the King Property ∫[0 to a] f(x) dx = ∫[0 to a] f(a-x) dx and add the two equations.',
  },
  {
    id: 'jee-q6',
    type: 'numerical',
    isNumerical: true,
    numericalRange: [1, 1],
    subject: 'Mathematics',
    chapter: 'Vectors & 3D Geometry',
    pyqYear: 'JEE Main 2023',
    difficulty: 'Hard',
    question: 'If the vectors $\\vec{a} = 2\\hat{i} - \\hat{j} + \\hat{k}$, $\\vec{b} = \\hat{i} + 2\\hat{j} - 3\\hat{k}$ and $\\vec{c} = 3\\hat{i} + \\lambda\\hat{j} + 5\\hat{k}$ are coplanar, then find the value of $-\\lambda$:',
    correctAnswer: '4',
    explanation: `**Step-by-step Solution:**
1. Three vectors are coplanar if their Scalar Triple Product is zero: $[\\vec{a}\\ \\vec{b}\\ \\vec{c}] = 0$.
2. Determinant equation:
   $$\\begin{vmatrix} 2 & -1 & 1 \\\\ 1 & 2 & -3 \\\\ 3 & \\lambda & 5 \\end{vmatrix} = 0$$
3. Expanding along row 1:
   $$2(10 + 3\\lambda) - (-1)(5 - (-9)) + 1(\\lambda - 6) = 0$$
   $$20 + 6\\lambda + 14 + \\lambda - 6 = 0$$
   $$7\\lambda + 28 = 0 \\implies \\lambda = -4$$
4. Therefore, $-\\lambda = -(-4) = 4$.
**Numerical Answer: 4**`,
    hint: 'Scalar triple product is zero for coplanar vectors. Evaluate the 3x3 determinant.',
  }
];

export const JEE_FULL_MOCK_TEST: Test = {
  id: 'jee-mock-full-1',
  title: 'JEE Main 2025 All India Ranker Mock Test 1 (PCM)',
  description: 'Authentic 300-marks NTA pattern test covering Physics, Chemistry, and Mathematics with Single Choice MCQs (+4/-1) and Numerical Integer Questions.',
  subjectId: 'subj-phy',
  examType: 'JEE_MAIN',
  targetExam: 'JEE',
  estimatedMinutes: 180,
  totalMarks: 300,
  positiveMarks: 4,
  negativeMarks: 1,
  difficulty: 'Hard',
  questions: JEE_SAMPLE_QUESTIONS,
  createdAt: '2026-08-15T08:00:00.000Z',
  tags: ['JEE Main', 'Full Syllabus', 'PCM', 'NTA Mock'],
};

export const JEE_PERCENTILE_MATRIX = [
  { scoreRange: '260 - 300', percentile: '99.9+ %ile', rankEst: 'Top 100 - 1,000', colleges: 'Top IITs CSE / NIT Trichy CSE' },
  { scoreRange: '220 - 259', percentile: '99.5 - 99.8 %ile', rankEst: '1,000 - 5,000', colleges: 'NIT Surathkal, Warangal, IIIT Hyderabad' },
  { scoreRange: '180 - 219', percentile: '99.0 - 99.4 %ile', rankEst: '5,000 - 11,000', colleges: 'Top NITs Core / MNIT Jaipur / VNIT Nagpur' },
  { scoreRange: '150 - 179', percentile: '97.5 - 98.9 %ile', rankEst: '11,000 - 28,000', colleges: 'Top State Govt Colleges / Mid NITs' },
  { scoreRange: '120 - 149', percentile: '94.0 - 97.4 %ile', rankEst: '28,000 - 65,000', colleges: 'NITs (Other branches) / Top Private Universities' },
  { scoreRange: '90 - 119', percentile: '88.0 - 93.9 %ile', rankEst: '65,000 - 1,30,000', colleges: 'JEE Advanced Qualifier cutoff zone' },
];

export const JEE_STRATEGY_TIPS = [
  {
    title: 'NTA Section B Integer Mastery',
    tip: 'Numerical questions have NO negative marking in some sessions or -1 in current format. Work through rough sheets systematically to prevent rounding and unit conversion blunders (SI vs CGS).',
  },
  {
    title: 'Order of Attempting Subjects',
    tip: 'Recommended strategy by 99.9%ilers: Chemistry (35-40 mins) -> Physics (45-50 mins) -> Mathematics (80-90 mins). Chemistry frees up critical time for heavy math calculations.',
  },
  {
    title: 'The 2-Round Test Strategy',
    tip: 'Round 1 (First 90 mins): Solve all direct formula & memory questions (approx 35-40 questions). Round 2 (Next 70 mins): Tackle multi-step and calculus problems. Last 20 mins: Recheck flagged & calculation-heavy integers.',
  },
];
