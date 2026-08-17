import { Subject, Note, Test, FlashcardDeck, StudyTask, TestAttempt } from '../types';

export const INITIAL_SUBJECTS: Subject[] = [
  {
    id: 'cs-algo',
    name: 'Computer Science & Algorithms',
    code: 'CS 301',
    color: '#3B82F6', // Blue
    description: 'Data structures, asymptotic complexity, graph traversal, and dynamic programming.',
    iconName: 'Code2',
  },
  {
    id: 'chem-org',
    name: 'Organic & Bio Chemistry',
    code: 'CHEM 204',
    color: '#10B981', // Emerald
    description: 'Reaction mechanisms, functional groups, stereochemistry, and thermodynamics.',
    iconName: 'FlaskConical',
  },
  {
    id: 'math-calc',
    name: 'Calculus & Linear Algebra',
    code: 'MATH 220',
    color: '#8B5CF6', // Purple
    description: 'Multivariable calculus, eigenvectors, matrices, and partial derivatives.',
    iconName: 'Sigma',
  },
  {
    id: 'bio-neuro',
    name: 'Neuroscience & Cellular Biology',
    code: 'BIO 115',
    color: '#F59E0B', // Amber
    description: 'Action potentials, synaptic transmission, cell membranes, and genetics.',
    iconName: 'Dna',
  },
];

export const INITIAL_NOTES: Note[] = [
  {
    id: 'note-1',
    title: 'Graph Traversal: BFS vs DFS & Shortest Path Algorithms',
    subjectId: 'cs-algo',
    tags: ['Graphs', 'BFS', 'DFS', 'Dijkstra', 'Complexity'],
    createdAt: '2026-08-10T10:00:00.000Z',
    updatedAt: '2026-08-16T14:30:00.000Z',
    isFavorite: true,
    aiSummary: `**Executive Summary**: Graph traversal algorithms systematically explore vertices and edges. Breadth-First Search (BFS) uses a FIFO queue and finds the unweighted shortest path ($O(V+E)$). Depth-First Search (DFS) uses a LIFO stack/recursion and is optimal for topological sorting, cycle detection, and connected components.

**Key Formulas & Complexities**:
- Time Complexity: $\\mathcal{O}(V + E)$ where $V$ is vertices and $E$ is edges.
- Space Complexity: $\\mathcal{O}(V)$ to store visited array and queue/stack state.
- Dijkstra's Algorithm (Weighted graphs without negative weights): $\\mathcal{O}((V + E) \\log V)$ using a Min-Heap.`,
    content: `# Graph Traversal: BFS vs DFS & Shortest Path

## 1. Breadth-First Search (BFS)
Breadth-First Search explores graph nodes level-by-level starting from a root node. It uses a **FIFO Queue** data structure.

### Core Properties
- **Guaranteed Shortest Path** in unweighted graphs.
- **Time Complexity**: $\\mathcal{O}(V + E)$
- **Space Complexity**: $\\mathcal{O}(V)$ for the queue and visited set.

\`\`\`python
from collections import deque

def bfs(graph, start):
    visited = set([start])
    queue = deque([start])
    traversal_order = []
    
    while queue:
        vertex = queue.popleft()
        traversal_order.append(vertex)
        
        for neighbor in graph[vertex]:
            if neighbor not in visited:
                visited.add(neighbor)
                queue.append(neighbor)
                
    return traversal_order
\`\`\`

---

## 2. Depth-First Search (DFS)
Depth-First Search plunges deep into branch nodes before backtracking. It relies on recursion or an explicit **LIFO Stack**.

### Primary Use Cases
1. **Topological Sorting** for Directed Acyclic Graphs (DAGs).
2. **Cycle Detection**: Using 3-color state tracking (White/Gray/Black).
3. **Maze Solving** & Connected Components discovery.

---

## 3. Dijkstra's Algorithm (Shortest Path with Non-Negative Weights)
- Employs a **Priority Queue (Min-Heap)** to greedily expand the minimum known distance vertex.
- **Time Complexity**: $\\mathcal{O}((V + E) \\log V)$ with binary heap.
- *Caution*: Does not work with negative edge weights (use Bellman-Ford for negative weights).

### Quick Comparison Matrix
| Algorithm | Data Structure | Unweighted Shortest Path | Cycle Detection |
| :--- | :--- | :--- | :--- |
| **BFS** | Queue (FIFO) | Yes | Yes (Bipartite check) |
| **DFS** | Stack (LIFO) | No | Yes (Back edges) |
| **Dijkstra** | Min-Heap | Weighted (non-neg) | N/A |
`,
  },
  {
    id: 'note-2',
    title: 'Nucleophilic Substitution: SN1 vs SN2 Mechanisms',
    subjectId: 'chem-org',
    tags: ['SN1', 'SN2', 'Kinetics', 'Stereochemistry', 'Organic'],
    createdAt: '2026-08-12T09:15:00.000Z',
    updatedAt: '2026-08-15T16:20:00.000Z',
    isFavorite: true,
    aiSummary: `**Core Distinction**: SN1 is a stepwise unimolecular reaction favored by tertiary substrates and polar protic solvents, leading to carbocation intermediate and racemization. SN2 is a concerted bimolecular reaction favored by primary substrates and polar aprotic solvents, resulting in complete inversion of stereochemistry (Walden Inversion).`,
    content: `# Nucleophilic Substitution: SN1 vs SN2

## 1. SN1 (Substitution Nucleophilic Unimolecular)
- **Stepwise Mechanism**:
  1. *Rate-Determining Step (RDS)*: Leaving group departs, generating a planar $sp^2$ carbocation intermediate.
  2. *Nucleophilic Attack*: Nucleophile attacks from either side with equal probability.
- **Kinetics**: Rate $= k[Substrate]$ (First-order).
- **Substrate Preference**: $3^\\circ > 2^\\circ \\gg 1^\\circ$ (stabilized by hyperconjugation and inductive effect).
- **Stereochemistry**: **Racemization** (mixture of enantiomers).
- **Solvent**: Polar Protic ($H_2O, EtOH, MeOH$) to stabilize carbocation and leaving group.

---

## 2. SN2 (Substitution Nucleophilic Bimolecular)
- **Concerted Mechanism**: One-step backside attack simultaneous with leaving group departure via pentacoordinate transition state.
- **Kinetics**: Rate $= k[Substrate][Nucleophile]$ (Second-order).
- **Substrate Preference**: $Methyl > 1^\\circ > 2^\\circ \\gg 3^\\circ$ (Steric hindrance inhibits backside attack).
- **Stereochemistry**: **Complete Inversion of Configuration** (Walden Inversion, R to S or vice versa).
- **Solvent**: Polar Aprotic ($DMSO, DMF, Acetone$) which solvates cations while leaving anions naked and reactive.
`,
  },
  {
    id: 'note-3',
    title: 'Eigenvalues, Eigenvectors & Diagonalization Matrix Theory',
    subjectId: 'math-calc',
    tags: ['LinearAlgebra', 'Eigenvalues', 'Diagonalization', 'Matrices'],
    createdAt: '2026-08-14T11:00:00.000Z',
    updatedAt: '2026-08-15T18:00:00.000Z',
    isFavorite: false,
    content: `# Eigenvalues and Eigenvectors

## 1. Definition
For a square matrix $A \\in \\mathbb{R}^{n \\times n}$, a non-zero vector $v$ is an **eigenvector** with associated **eigenvalue** $\\lambda$ if:
$$A v = \\lambda v$$
$$(A - \\lambda I) v = 0$$

Since $v \\neq 0$, the characteristic equation must satisfy:
$$\\det(A - \\lambda I) = 0$$

## 2. Diagonalization Conditions
A matrix $A$ of size $n \\times n$ is diagonalizable if and only if it has $n$ linearly independent eigenvectors.
$$A = P D P^{-1}$$
Where $P$ has eigenvectors as columns and $D$ is a diagonal matrix containing the corresponding eigenvalues.
`,
  },
  {
    id: 'note-4',
    title: 'Action Potential Genesis & Hodgkin-Huxley Model',
    subjectId: 'bio-neuro',
    tags: ['Neuroscience', 'ActionPotential', 'IonChannels', 'MembranePotential'],
    createdAt: '2026-08-11T13:45:00.000Z',
    updatedAt: '2026-08-14T10:10:00.000Z',
    isFavorite: false,
    content: `# Action Potential Dynamics

## 1. Resting Membrane Potential
- Maintained at roughly **-70 mV** by the $Na^+/K^+$ ATPase pump ($3\\, Na^+$ pumped out for every $2\\, K^+$ pumped in).
- High intracellular $K^+$ concentration and high extracellular $Na^+$ and $Cl^-$ concentrations.

## 2. Phases of the Action Potential
1. **Resting Phase**: Leak potassium channels predominate.
2. **Threshold of Excitation**: Membrane depolarizes past approx **-55 mV**.
3. **Depolarization Phase**: Voltage-gated $Na^+$ channels snap open, influx of $Na^+$ drives potential up to **+40 mV**.
4. **Repolarization Phase**: Inactivation gates of $Na^+$ channels close; voltage-gated $K^+$ channels open, causing massive $K^+$ efflux.
5. **Hyperpolarization (Undershoot)**: $K^+$ channels close slowly, membrane drops briefly to **-80 mV**.
6. **Refractory Period**: Absolute vs Relative refractory periods limit maximum firing frequency.
`,
  },
];

export const INITIAL_TESTS: Test[] = [
  {
    id: 'test-1',
    title: 'Graph Traversal & Dijkstra Mastery Exam',
    description: 'Comprehensive test evaluating your understanding of BFS, DFS, shortest path algorithms, and complexity analysis.',
    subjectId: 'cs-algo',
    estimatedMinutes: 10,
    difficulty: 'Medium',
    noteIdRef: 'note-1',
    tags: ['Graphs', 'BFS', 'Dijkstra', 'Algorithms'],
    createdAt: '2026-08-15T10:00:00.000Z',
    questions: [
      {
        id: 'q1',
        type: 'mcq',
        question: 'Which data structure is primarily utilized in Breadth-First Search (BFS) to preserve exploration order?',
        options: ['Stack (LIFO)', 'Queue (FIFO)', 'Binary Search Tree', 'Priority Max-Heap'],
        correctAnswer: 'Queue (FIFO)',
        explanation: 'BFS systematically explores nodes layer by layer using a First-In-First-Out (FIFO) queue.',
        hint: 'Think about how vertices at distance 1 are processed before vertices at distance 2.',
        difficulty: 'Easy',
        topicTag: 'BFS',
      },
      {
        id: 'q2',
        type: 'mcq',
        question: "What is the time complexity of Dijkstra's algorithm implemented with a binary min-heap for a graph with V vertices and E edges?",
        options: ['O(V^2)', 'O((V + E) log V)', 'O(V * E)', 'O(V log E)'],
        correctAnswer: 'O((V + E) log V)',
        explanation: 'Each vertex is extracted from the min-heap in O(log V) time, and each edge relaxation takes O(log V) to decrease key, yielding O((V + E) log V).',
        hint: 'Consider the cost of extracting min and updating the heap for each edge.',
        difficulty: 'Medium',
        topicTag: 'Dijkstra',
      },
      {
        id: 'q3',
        type: 'tf',
        question: "Dijkstra's algorithm guarantees the correct shortest path on graphs containing negative edge weights.",
        options: ['True', 'False'],
        correctAnswer: 'False',
        explanation: "False! Dijkstra's greedy choice assumption fails with negative weights because a previously finalized vertex distance could be decreased later. Bellman-Ford must be used instead.",
        hint: 'Greedy algorithms assume adding a non-negative edge will never decrease distance.',
        difficulty: 'Medium',
        topicTag: 'Shortest Path',
      },
      {
        id: 'q4',
        type: 'mcq',
        question: 'Which traversal algorithm is best suited for producing a Topological Sort of a Directed Acyclic Graph (DAG)?',
        options: ['Depth-First Search (DFS)', 'Breadth-First Search without in-degree array', 'Prim’s Algorithm', 'Kruskal’s Algorithm'],
        correctAnswer: 'Depth-First Search (DFS)',
        explanation: 'In DFS, nodes are pushed to an output stack upon finishing their subtree (post-order traversal), producing a topological order when reversed.',
        hint: 'Think about finishing times and post-order traversal.',
        difficulty: 'Medium',
        topicTag: 'DFS',
      },
      {
        id: 'q5',
        type: 'short',
        question: 'What is the worst-case space complexity of BFS on a tree with branching factor b and depth d?',
        correctAnswer: 'O(b^d)',
        explanation: 'In the worst case, the last level of the search tree must be held in the queue, requiring O(b^d) memory.',
        hint: 'Count the number of leaf nodes at depth d.',
        difficulty: 'Hard',
        topicTag: 'Complexity',
      },
    ],
  },
  {
    id: 'test-2',
    title: 'Organic Mechanisms: SN1 vs SN2 Diagnostic Quiz',
    description: 'Test your understanding of nucleophilic substitution kinetics, transition states, solvents, and stereochemistry.',
    subjectId: 'chem-org',
    estimatedMinutes: 8,
    difficulty: 'Medium',
    noteIdRef: 'note-2',
    tags: ['Organic', 'Mechanisms', 'Stereochemistry'],
    createdAt: '2026-08-16T11:00:00.000Z',
    questions: [
      {
        id: 'cq1',
        type: 'mcq',
        question: 'Which reaction condition strongly favors an SN2 mechanism over an SN1 mechanism?',
        options: [
          'Tertiary alkyl halide in polar protic solvent',
          'Primary alkyl halide with strong nucleophile in polar aprotic solvent',
          'Tertiary alkyl halide with weak nucleophile',
          'Secondary alkyl halide in boiling water',
        ],
        correctAnswer: 'Primary alkyl halide with strong nucleophile in polar aprotic solvent',
        explanation: 'Primary substrates minimize steric hindrance for backside attack, strong nucleophiles accelerate bimolecular kinetics, and polar aprotic solvents leave nucleophiles unencumbered.',
        hint: 'Look for low steric hindrance and naked nucleophiles.',
        difficulty: 'Medium',
        topicTag: 'SN2 Conditions',
      },
      {
        id: 'cq2',
        type: 'tf',
        question: 'An SN2 reaction at a chiral carbon center results in complete inversion of configuration (Walden Inversion).',
        options: ['True', 'False'],
        correctAnswer: 'True',
        explanation: 'True! Because the nucleophile must attack from the exact opposite side (180 degrees) of the leaving group, the umbrella flips, yielding 100% inversion.',
        hint: 'Think about backside attack mechanism.',
        difficulty: 'Easy',
        topicTag: 'Stereochemistry',
      },
      {
        id: 'cq3',
        type: 'mcq',
        question: 'What is the rate law for an SN1 substitution reaction?',
        options: ['Rate = k[Substrate][Nucleophile]', 'Rate = k[Substrate]', 'Rate = k[Nucleophile]^2', 'Rate = k[Substrate]^2'],
        correctAnswer: 'Rate = k[Substrate]',
        explanation: 'SN1 stands for Substitution Nucleophilic Unimolecular. The rate-determining step only involves the unimolecular ionization of the substrate to form a carbocation.',
        hint: 'Unimolecular indicates first-order kinetics with respect to the substrate.',
        difficulty: 'Easy',
        topicTag: 'Kinetics',
      },
      {
        id: 'cq4',
        type: 'short',
        question: 'Name the planar intermediate formed during the rate-determining step of an SN1 reaction.',
        correctAnswer: 'Carbocation',
        explanation: 'A sp2-hybridized planar carbocation intermediate is formed upon loss of the leaving group.',
        hint: 'A positively charged carbon species.',
        difficulty: 'Easy',
        topicTag: 'Intermediates',
      },
    ],
  },
];

export const INITIAL_DECKS: FlashcardDeck[] = [
  {
    id: 'deck-1',
    title: 'Graph Theory & Complexity Flashcards',
    subjectId: 'cs-algo',
    noteIdRef: 'note-1',
    lastReviewedAt: '2026-08-16T18:00:00.000Z',
    cards: [
      {
        id: 'c1',
        front: 'What is the time complexity of Breadth-First Search on an adjacency list?',
        back: 'O(V + E)\nWhere V is the number of vertices and E is the number of edges.',
        category: 'Complexity',
        state: 'mastered',
      },
      {
        id: 'c2',
        front: 'Why cannot Dijkstra handle negative edge weights?',
        back: 'Dijkstra assumes that once a vertex is removed from the priority queue, its distance is finalized. Negative weights can create a cheaper path later, violating this greedy assumption.',
        category: 'Dijkstra',
        state: 'learning',
      },
      {
        id: 'c3',
        front: 'What data structure is used to optimize Prim’s or Dijkstra’s algorithm?',
        back: 'A Min-Priority Queue / Binary Min-Heap (or Fibonacci Heap).',
        category: 'Data Structures',
        state: 'review',
      },
      {
        id: 'c4',
        front: 'What is a Topological Sort and on what graph type is it valid?',
        back: 'A linear ordering of vertices such that for every directed edge u -> v, u comes before v. Only valid on Directed Acyclic Graphs (DAGs).',
        category: 'Topological Sort',
        state: 'review',
      },
      {
        id: 'c5',
        front: 'Difference between Tree and Graph?',
        back: 'A tree is a connected, undirected graph with no cycles. A tree with N vertices always has exactly N-1 edges.',
        category: 'Definitions',
        state: 'mastered',
      },
    ],
  },
  {
    id: 'deck-2',
    title: 'Organic Chemistry: Reagents & Mechanisms',
    subjectId: 'chem-org',
    noteIdRef: 'note-2',
    lastReviewedAt: '2026-08-15T12:00:00.000Z',
    cards: [
      {
        id: 'c6',
        front: 'What solvent category maximizes SN2 reaction rate?',
        back: 'Polar Aprotic Solvents (e.g., DMSO, DMF, Acetone, Acetonitrile).\nThey solvate cations without hydrogen-bonding to anions, leaving the nucleophile highly reactive.',
        category: 'Solvents',
        state: 'learning',
      },
      {
        id: 'c7',
        front: 'Stereochemical outcome of an SN1 reaction on a chiral center?',
        back: 'Racemization (formation of a 1:1 mixture of enantiomers) because the nucleophile can attack the planar carbocation from the top or bottom face.',
        category: 'Stereochemistry',
        state: 'mastered',
      },
      {
        id: 'c8',
        front: 'Why are tertiary alkyl halides unreactive in SN2 reactions?',
        back: 'Severe steric hindrance prevents the nucleophile from attacking the backside of the carbon-leaving group bond.',
        category: 'Kinetics',
        state: 'mastered',
      },
    ],
  },
];

export const INITIAL_TASKS: StudyTask[] = [
  {
    id: 'task-1',
    title: 'Complete Algorithms Problem Set 4 (Dynamic Programming)',
    subjectId: 'cs-algo',
    dueDate: '2026-08-20',
    priority: 'high',
    status: 'in_progress',
  },
  {
    id: 'task-2',
    title: 'Review Organic Reaction Mechanisms for Midterm Exam',
    subjectId: 'chem-org',
    dueDate: '2026-08-22',
    priority: 'high',
    status: 'todo',
    noteIdRef: 'note-2',
  },
  {
    id: 'task-3',
    title: 'Practice Multivariable Calculus Chain Rule drill',
    subjectId: 'math-calc',
    dueDate: '2026-08-24',
    priority: 'medium',
    status: 'todo',
  },
  {
    id: 'task-4',
    title: 'Review Synaptic Transmission Flashcard deck',
    subjectId: 'bio-neuro',
    dueDate: '2026-08-18',
    priority: 'low',
    status: 'completed',
  },
];

export const INITIAL_ATTEMPTS: TestAttempt[] = [
  {
    id: 'attempt-1',
    testId: 'test-1',
    testTitle: 'Graph Traversal & Dijkstra Mastery Exam',
    subjectId: 'cs-algo',
    startedAt: '2026-08-16T15:00:00.000Z',
    completedAt: '2026-08-16T15:08:42.000Z',
    durationSeconds: 522,
    answers: {
      q1: 'Queue (FIFO)',
      q2: 'O((V + E) log V)',
      q3: 'False',
      q4: 'Depth-First Search (DFS)',
      q5: 'O(b^d)',
    },
    score: 5,
    totalQuestions: 5,
    percentage: 100,
    flaggedQuestions: [],
  },
  {
    id: 'attempt-2',
    testId: 'test-2',
    testTitle: 'Organic Mechanisms: SN1 vs SN2 Diagnostic Quiz',
    subjectId: 'chem-org',
    startedAt: '2026-08-15T11:00:00.000Z',
    completedAt: '2026-08-15T11:06:15.000Z',
    durationSeconds: 375,
    answers: {
      cq1: 'Primary alkyl halide with strong nucleophile in polar aprotic solvent',
      cq2: 'True',
      cq3: 'Rate = k[Substrate]',
      cq4: 'Carbocation',
    },
    score: 4,
    totalQuestions: 4,
    percentage: 100,
    flaggedQuestions: [],
  },
];
