import { Test, Question } from '../../types';

export const NEET_SAMPLE_QUESTIONS: Question[] = [
  {
    id: 'neet-q1',
    type: 'mcq',
    subject: 'Botany (Biology)',
    chapter: 'Cell: The Unit of Life',
    pyqYear: 'NEET 2024 (Re-exam / May)',
    difficulty: 'Medium',
    question: 'Which of the following cellular structures is NOT bounded by a membrane?',
    options: [
      'Ribosomes',
      'Lysosomes',
      'Peroxisomes',
      'Vacuoles'
    ],
    correctAnswer: 'Ribosomes',
    explanation: `**NCERT Reference (Class 11, Chapter 8):**
- **Ribosomes** are non-membrane bound organelles found in both prokaryotic and eukaryotic cells (70S in prokaryotes/chloroplast/mitochondria, 80S in eukaryotic cytoplasm).
- Centrosome/centrioles are also non-membrane bound.
- Lysosomes, peroxisomes, and vacuoles are single-membrane bound organelle structures belonging to the endomembrane system.
**Correct Answer: Option (1) Ribosomes**`,
    hint: 'Think about organelles that are present in both bacteria (prokaryotes) and humans (eukaryotes).',
  },
  {
    id: 'neet-q2',
    type: 'assertion_reason',
    subject: 'Botany (Biology)',
    chapter: 'Molecular Basis of Inheritance',
    pyqYear: 'NEET 2023 (Manipur / Main)',
    difficulty: 'Hard',
    question: `**Assertion (A):** In eukaryotic transcription, the primary transcript (hnRNA) contains both exons and introns and is non-functional until spliced.
**Reason (R):** Splicing removes introns and joins exons in a defined order by spliceosomes.`,
    options: [
      'Both (A) and (R) are true and (R) is the correct explanation of (A)',
      'Both (A) and (R) are true but (R) is NOT the correct explanation of (A)',
      '(A) is true but (R) is false',
      '(A) is false but (R) is true'
    ],
    correctAnswer: 'Both (A) and (R) are true and (R) is the correct explanation of (A)',
    explanation: `**NCERT Reference (Class 12, Chapter 6):**
- In eukaryotes, the initial RNA transcript synthesized by RNA Polymerase II is heterogeneous nuclear RNA (hnRNA), which contains non-coding introns interrupted between coding exons.
- Introns are removed by spliceosome ribonucleoprotein complexes and exons are ligated together to yield mature mRNA ready for translation.
- Thus, both statements are true and Reason directly explains why splicing is required to make the transcript functional.
**Correct Answer: Option (1)**`,
    hint: 'Check if introns are intervening sequences that must be spliced out before translation.',
  },
  {
    id: 'neet-q3',
    type: 'mcq',
    subject: 'Zoology (Biology)',
    chapter: 'Human Reproduction & Embryology',
    pyqYear: 'NEET 2024',
    difficulty: 'Medium',
    question: 'During human ovulation, the LH surge triggers the release of the secondary oocyte from which mature ovarian structure?',
    options: [
      'Graafian Follicle',
      'Corpus Luteum',
      'Corpus Albicans',
      'Primary Follicle'
    ],
    correctAnswer: 'Graafian Follicle',
    explanation: `**NCERT Reference (Class 12, Chapter 3):**
- A rapid secretion of Luteinizing Hormone (LH) leading to its maximum level during the mid-cycle (around 14th day) is called **LH surge**.
- It induces the rupture of the mature **Graafian follicle** and thereby the release of an ovum (secondary oocyte) — a process called **ovulation**.
- The remaining empty Graafian follicle transforms into the **Corpus Luteum**, which secretes progesterone.
**Correct Answer: Option (1) Graafian Follicle**`,
    hint: 'The mature follicle that ruptures during mid-cycle under LH surge.',
  },
  {
    id: 'neet-q4',
    type: 'mcq',
    subject: 'Zoology (Biology)',
    chapter: 'Body Fluids and Circulation',
    pyqYear: 'NEET 2023',
    difficulty: 'Medium',
    question: 'In a standard Electrocardiogram (ECG), the QRS complex represents:',
    options: [
      'Depolarization of Ventricles',
      'Depolarization of Atria',
      'Repolarization of Ventricles',
      'Repolarization of Atria'
    ],
    correctAnswer: 'Depolarization of Ventricles',
    explanation: `**NCERT Reference (Class 11, Chapter 18):**
- **P-wave**: Represents depolarization of atria, leading to atrial contraction.
- **QRS complex**: Represents the depolarization of the ventricles, which initiates ventricular contraction (systole).
- **T-wave**: Represents the repolarization of ventricles (return from excited to normal state).
**Correct Answer: Option (1) Depolarization of Ventricles**`,
    hint: 'The tall sharp spike initiates the ventricular contraction.',
  },
  {
    id: 'neet-q5',
    type: 'mcq',
    subject: 'Physics',
    chapter: 'Ray Optics & Optical Instruments',
    pyqYear: 'NEET 2024',
    difficulty: 'Medium',
    question: 'An astronomical telescope has an objective lens of focal length $f_o = 100\\text{ cm}$ and eyepiece of focal length $f_e = 5\\text{ cm}$. In normal adjustment, what is the magnifying power and length of the telescope tube?',
    options: [
      'Magnifying Power = 20, Length = 105 cm',
      'Magnifying Power = 25, Length = 95 cm',
      'Magnifying Power = 20, Length = 95 cm',
      'Magnifying Power = 500, Length = 105 cm'
    ],
    correctAnswer: 'Magnifying Power = 20, Length = 105 cm',
    explanation: `**Step-by-step Solution:**
1. In normal adjustment (image at infinity):
   $$\\text{Magnifying Power } m = \\frac{f_o}{f_e} = \\frac{100}{5} = 20$$
2. Length of the telescope tube in normal adjustment:
   $$L = f_o + f_e = 100 + 5 = 105\\text{ cm}$$
**Correct Answer: Option (1)**`,
    hint: 'For astronomical telescope in normal adjustment: m = fo / fe and L = fo + fe.',
  },
  {
    id: 'neet-q6',
    type: 'mcq',
    subject: 'Chemistry',
    chapter: 'Biomolecules & Organic Chemistry',
    pyqYear: 'NEET 2024',
    difficulty: 'Easy',
    question: 'Which of the following nitrogenous bases is found ONLY in RNA and NOT in DNA?',
    options: [
      'Uracil',
      'Thymine',
      'Adenine',
      'Guanine'
    ],
    correctAnswer: 'Uracil',
    explanation: `**NCERT Chemistry (Class 12 Chapter 14) & Biology:**
- DNA contains: Adenine (A), Guanine (G), Cytosine (C), and **Thymine (T)** (5-methyluracil).
- RNA contains: Adenine (A), Guanine (G), Cytosine (C), and **Uracil (U)** instead of Thymine.
**Correct Answer: Option (1) Uracil**`,
    hint: 'Thymine is replaced by this pyrimidine base in RNA.',
  }
];

export const NEET_FULL_MOCK_TEST: Test = {
  id: 'neet-mock-full-1',
  title: 'NEET UG 2025 All India Grand Mock Test (720 Marks)',
  description: 'Complete 720-marks NTA NEET UG simulation covering Physics (45 Qs), Chemistry (45 Qs), Botany (45 Qs), and Zoology (45 Qs) with strict +4 / -1 negative marking.',
  subjectId: 'subj-botany',
  examType: 'NEET_UG',
  targetExam: 'NEET',
  estimatedMinutes: 200,
  totalMarks: 720,
  positiveMarks: 4,
  negativeMarks: 1,
  difficulty: 'Medium',
  questions: NEET_SAMPLE_QUESTIONS,
  createdAt: '2026-08-16T10:00:00.000Z',
  tags: ['NEET UG', '720 Marks', 'Biology 360', 'NCERT Full Mock'],
};

export const NEET_TARGET_COLLEGE_CUTOFFS = [
  { college: 'AIIMS New Delhi', targetScore: '705 - 720', safeRank: 'Top 50 AIR', category: 'Premier Institute' },
  { college: 'JIPMER Puducherry / VMMC New Delhi', targetScore: '685 - 700', safeRank: 'AIR 50 - 300', category: 'Central Govt' },
  { college: 'KGMU Lucknow / MAMC New Delhi', targetScore: '670 - 685', safeRank: 'AIR 300 - 1,200', category: 'Top State & Delhi' },
  { college: 'Top State Government Medical Colleges (GMC)', targetScore: '620 - 660', safeRank: 'AIR 1,500 - 12,000', category: 'State Quota MBBS' },
  { college: 'General Category MBBS Cutoff Zone', targetScore: '600 - 615', safeRank: 'AIR 18,000 - 24,000', category: 'All India Quota' },
];

export const NEET_NCERT_LINES_DRILL = [
  {
    chapter: 'Human Physiology',
    ncertFact: 'Each hemoglobin molecule can carry a maximum of FOUR oxygen molecules ($O_2$). Binding of oxygen with Hb is primarily related to partial pressure of $O_2$ ($pO_2$).',
    highYieldQuestion: 'How many O2 molecules bind to one Hemoglobin molecule at full saturation?',
    answer: '4 molecules (8 oxygen atoms)',
  },
  {
    chapter: 'Morphology of Flowering Plants',
    ncertFact: 'Pneumatophores (respiratory roots) grow vertically upwards from halophytes in marshy areas to get oxygen for respiration. Example: Rhizophora.',
    highYieldQuestion: 'In which plant are pneumatophores found?',
    answer: 'Rhizophora (Mangroves / swamp plants)',
  },
  {
    chapter: 'Biotechnology: Principles and Processes',
    ncertFact: 'EcoRI cuts DNA between bases G and A when the sequence GAATTC is present: 5\'-G↓AATTC-3\' and 3\'-CTTAA↑G-5\', producing sticky ends.',
    highYieldQuestion: 'What is the recognition sequence of EcoRI restriction endonuclease?',
    answer: '5\'-GAATTC-3\' palindromic sequence',
  },
];
