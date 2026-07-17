import type {
  Topic,
  DailyActivity,
  SubjectStat,
  SystemInfo,
  Subject,
  RevisionSystem,
  Difficulty,
  Status,
} from '../types';

// ──────────────────────────────────────────────────────
// REVISION SYSTEMS
// ──────────────────────────────────────────────────────
export const REVISION_SYSTEMS: SystemInfo[] = [
  {
    id: 'FSRS',
    name: 'FSRS',
    fullName: 'Free Spaced Repetition Scheduler',
    description:
      'State-of-the-art ML-powered algorithm that models memory stability & retrievability. Adapts intervals based on your real forgetting curve.',
    icon: '🧠',
    color: '#6366f1',
    bg: '#eef2ff',
    effectiveness: 98,
    retention: 95,
    difficulty: 3,
    tags: ['AI-powered', 'Adaptive', 'Optimal'],
    howItWorks:
      'Uses neural-network-inspired memory model with parameters: Stability (S), Difficulty (D), and Retrievability (R). Targets your chosen retention rate automatically.',
  },
  {
    id: 'SM2',
    name: 'SM-2',
    fullName: 'SuperMemo 2 Algorithm',
    description:
      'The classic gold-standard SRS algorithm by Piotr Wozniak (1987). Intervals grow multiplicatively based on an ease factor you adjust per card.',
    icon: '📐',
    color: '#8b5cf6',
    bg: '#f5f3ff',
    effectiveness: 92,
    retention: 89,
    difficulty: 2,
    tags: ['Classic', 'Proven', 'Ease-factor'],
    howItWorks:
      'Next interval = previous interval × EaseFactor. EF adjusts up/down based on response quality (0–5). Initial intervals: 1 day, 6 days, then exponential growth.',
  },
  {
    id: 'SRS',
    name: 'SRS',
    fullName: 'Spaced Repetition System',
    description:
      'The foundational concept behind all spacing algorithms. Review material at growing intervals timed just before you\'d forget it.',
    icon: '🔄',
    color: '#06b6d4',
    bg: '#ecfeff',
    effectiveness: 88,
    retention: 85,
    difficulty: 1,
    tags: ['Foundational', 'Universal', 'Beginner-friendly'],
    howItWorks:
      'Cards are shown at 1d → 3d → 7d → 14d → 30d → 90d intervals. Correct answer advances; wrong answer resets to the start.',
  },
  {
    id: 'Leitner',
    name: 'Leitner',
    fullName: 'Leitner Box System',
    description:
      'Physical card-box method by Sebastian Leitner (1972). Cards graduate through 5 boxes reviewed at fixed intervals.',
    icon: '📦',
    color: '#f59e0b',
    bg: '#fffbeb',
    effectiveness: 78,
    retention: 75,
    difficulty: 1,
    tags: ['Physical', 'Visual', 'Structured'],
    howItWorks:
      'Box 1: daily · Box 2: every 2 days · Box 3: every 4 days · Box 4: weekly · Box 5: monthly. Correct → advance; Wrong → back to Box 1.',
  },
  {
    id: 'Pomodoro',
    name: 'Pomodoro',
    fullName: 'Pomodoro Technique + Spaced Review',
    description:
      'Time-boxed 25-minute deep focus sessions with 5-minute breaks, combined with spaced review at session end.',
    icon: '🍅',
    color: '#ef4444',
    bg: '#fef2f2',
    effectiveness: 84,
    retention: 80,
    difficulty: 1,
    tags: ['Focus', 'Anti-distraction', 'Timed'],
    howItWorks:
      '25 min focused study → 5 min break → repeat 4× → 20-min long break. End each Pomodoro with a 2-min active recall quiz of material just studied.',
  },
  {
    id: 'Feynman',
    name: 'Feynman',
    fullName: 'Feynman Technique',
    description:
      'Nobel laureate Richard Feynman\'s method: explain any concept in simple language as if teaching a child to expose knowledge gaps.',
    icon: '🎓',
    color: '#10b981',
    bg: '#ecfdf5',
    effectiveness: 91,
    retention: 88,
    difficulty: 3,
    tags: ['Deep-learning', 'Explanation', 'Gap-finding'],
    howItWorks:
      '① Choose concept ② Explain in simple terms on paper ③ Identify gaps & return to source ④ Simplify & use analogies. Repeat until crystal-clear.',
  },
  {
    id: 'ActiveRecall',
    name: 'Active Recall',
    fullName: 'Active Recall Testing',
    description:
      'The most evidence-backed technique: retrieve information from memory without looking at notes, proven to outperform passive re-reading by 50%.',
    icon: '⚡',
    color: '#f97316',
    bg: '#fff7ed',
    effectiveness: 95,
    retention: 92,
    difficulty: 2,
    tags: ['Testing effect', 'High-yield', 'Evidence-based'],
    howItWorks:
      'Read → Close book → Write everything remembered → Check & correct → Repeat. Use self-testing, flashcards, practice problems, or blank-page recall.',
  },
  {
    id: 'MindMap',
    name: 'Mind Map',
    fullName: 'Mind Mapping + Spaced Review',
    description:
      'Visual knowledge organization with branching nodes reviewed at spaced intervals. Leverages dual-coding theory for superior recall.',
    icon: '🗺️',
    color: '#ec4899',
    bg: '#fdf2f8',
    effectiveness: 82,
    retention: 79,
    difficulty: 2,
    tags: ['Visual', 'Dual-coding', 'Creative'],
    howItWorks:
      'Create central concept → branch into main ideas → sub-branch details. Review by recreating the map from memory at 1d/3d/7d/21d/60d intervals.',
  },
  {
    id: 'Cornell',
    name: 'Cornell',
    fullName: 'Cornell Note System',
    description:
      'Structured note-taking dividing pages into cues, notes, and summary sections — optimized for review and active recall integration.',
    icon: '📝',
    color: '#84cc16',
    bg: '#f7fee7',
    effectiveness: 80,
    retention: 77,
    difficulty: 1,
    tags: ['Note-taking', 'Structured', 'Systematic'],
    howItWorks:
      'Divide page: Notes column (right) + Cue column (left) + Summary (bottom). After lecture: fill cues → cover notes → recite from cues → summarize in own words.',
  },
  {
    id: 'Interleaving',
    name: 'Interleaving',
    fullName: 'Interleaved Practice',
    description:
      'Mix different subjects/topics in a single session instead of blocking. Creates desirable difficulty that boosts long-term retention.',
    icon: '🔀',
    color: '#14b8a6',
    bg: '#f0fdfa',
    effectiveness: 87,
    retention: 84,
    difficulty: 3,
    tags: ['Desirable difficulty', 'Mixed practice', 'Transfer'],
    howItWorks:
      'Instead of A-A-A-B-B-B, practice A-B-C-A-B-C. Switch topics every 15–20 minutes. Feels harder but produces 43% better performance on transfer tests.',
  },
];

// ──────────────────────────────────────────────────────
// HELPERS
// ──────────────────────────────────────────────────────
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function rndFloat(min: number, max: number, dp = 1) {
  return parseFloat((Math.random() * (max - min) + min).toFixed(dp));
}
function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + days);
  return d.toISOString().split('T')[0];
}
function subtractDays(days: number) {
  const d = new Date();
  d.setDate(d.getDate() - days);
  return d.toISOString().split('T')[0];
}

const SUBJECTS: Subject[] = [
  'Mathematics',
  'Physics',
  'Chemistry',
  'Biology',
  'History',
  'English',
  'Computer Science',
  'Economics',
];

const SYSTEMS: RevisionSystem[] = [
  'FSRS',
  'SM2',
  'SRS',
  'Leitner',
  'Pomodoro',
  'Feynman',
  'ActiveRecall',
  'MindMap',
  'Cornell',
  'Interleaving',
];

const DIFFICULTIES: Difficulty[] = ['Easy', 'Medium', 'Hard'];
const STATUSES: Status[] = ['Mastered', 'Learning', 'Due', 'New'];

const TOPIC_NAMES: Record<Subject, string[]> = {
  Mathematics: [
    'Calculus Derivatives',
    'Integration by Parts',
    'Linear Algebra',
    'Differential Equations',
    'Probability Theory',
    'Number Theory',
    'Trigonometry',
    'Complex Numbers',
    'Statistics',
    'Fourier Series',
  ],
  Physics: [
    'Quantum Mechanics',
    'Thermodynamics',
    'Electromagnetism',
    'Special Relativity',
    'Wave Optics',
    'Nuclear Physics',
    'Fluid Dynamics',
    'Classical Mechanics',
    'Atomic Structure',
    'Semiconductor Physics',
  ],
  Chemistry: [
    'Organic Reactions',
    'Electrochemistry',
    'Chemical Bonding',
    'Thermochemistry',
    'Coordination Compounds',
    'Polymers',
    'Analytical Chemistry',
    'Spectroscopy',
    'Reaction Kinetics',
    'Acid-Base Equilibria',
  ],
  Biology: [
    'Cell Division',
    'Genetics & DNA',
    'Ecology Systems',
    'Human Physiology',
    'Evolution Theory',
    'Photosynthesis',
    'Nervous System',
    'Immunology',
    'Molecular Biology',
    'Biotechnology',
  ],
  History: [
    'World War I',
    'Industrial Revolution',
    'French Revolution',
    'Cold War Era',
    'Ancient Civilizations',
    'Renaissance Period',
    'Colonialism',
    'Modern Democracy',
    'Scientific Revolution',
    'Decolonization',
  ],
  English: [
    'Shakespeare Sonnets',
    'Literary Analysis',
    'Essay Writing',
    'Grammar Mastery',
    'Poetry Techniques',
    'Narrative Structure',
    'Critical Reading',
    'Rhetoric',
    'Vocabulary Building',
    'Discourse Analysis',
  ],
  'Computer Science': [
    'Data Structures',
    'Algorithm Design',
    'Machine Learning',
    'Database Systems',
    'Operating Systems',
    'Computer Networks',
    'Cryptography',
    'Compiler Design',
    'Software Engineering',
    'Graph Theory',
  ],
  Economics: [
    'Microeconomics',
    'Macroeconomics',
    'Game Theory',
    'Behavioral Economics',
    'International Trade',
    'Monetary Policy',
    'Market Structures',
    'Econometrics',
    'Development Economics',
    'Public Finance',
  ],
};

// ──────────────────────────────────────────────────────
// GENERATE TOPICS (80 topics)
// ──────────────────────────────────────────────────────
export const TOPICS: Topic[] = (() => {
  const topics: Topic[] = [];
  let id = 1;

  SUBJECTS.forEach((subject) => {
    const names = TOPIC_NAMES[subject];
    names.forEach((name) => {
      const status = STATUSES[rnd(0, 3)] as Status;
      const difficulty = DIFFICULTIES[rnd(0, 2)] as Difficulty;
      const system = SYSTEMS[rnd(0, 9)] as RevisionSystem;
      const retention =
        status === 'Mastered'
          ? rnd(85, 100)
          : status === 'Learning'
          ? rnd(55, 84)
          : status === 'Due'
          ? rnd(30, 60)
          : rnd(0, 30);

      const lastRevised = subtractDays(rnd(0, 30));
      const interval = rnd(1, 30);
      const nextDue = addDays(lastRevised, interval);

      topics.push({
        id: String(id++),
        name,
        subject,
        system,
        difficulty,
        status,
        retention,
        lastRevised,
        nextDue,
        totalSessions: rnd(3, 40),
        avgScore: rndFloat(55, 99),
        streak: rnd(0, 21),
        timeSpent: rnd(20, 480),
        ease: rndFloat(1.3, 3.5),
        interval,
        repetitions: rnd(1, 15),
      });
    });
  });

  return topics;
})();

// ──────────────────────────────────────────────────────
// DAILY ACTIVITY (last 90 days)
// ──────────────────────────────────────────────────────
export const DAILY_ACTIVITY: DailyActivity[] = (() => {
  const data: DailyActivity[] = [];
  for (let i = 89; i >= 0; i--) {
    const date = subtractDays(i);
    const isWeekend = [0, 6].includes(new Date(date).getDay());
    const baseCards = isWeekend ? rnd(20, 60) : rnd(40, 120);
    const noStudy = Math.random() < 0.06; // 6% chance of no study

    data.push({
      date,
      cardsReviewed: noStudy ? 0 : baseCards,
      minutesStudied: noStudy ? 0 : rnd(20, 180),
      retention: noStudy ? 0 : rndFloat(68, 97),
      newCards: noStudy ? 0 : rnd(5, 25),
      score: noStudy ? 0 : rndFloat(65, 99),
    });
  }
  return data;
})();

// ──────────────────────────────────────────────────────
// SUBJECT STATS
// ──────────────────────────────────────────────────────
export const SUBJECT_COLORS: Record<Subject, string> = {
  Mathematics: '#6366f1',
  Physics: '#8b5cf6',
  Chemistry: '#06b6d4',
  Biology: '#10b981',
  History: '#f59e0b',
  English: '#ec4899',
  'Computer Science': '#f97316',
  Economics: '#84cc16',
};

export const SUBJECT_STATS: SubjectStat[] = SUBJECTS.map((subject) => {
  const subjectTopics = TOPICS.filter((t) => t.subject === subject);
  const mastered = subjectTopics.filter((t) => t.status === 'Mastered').length;
  const totalTime = subjectTopics.reduce((a, t) => a + t.timeSpent, 0);
  const avgRetention =
    subjectTopics.reduce((a, t) => a + t.retention, 0) / subjectTopics.length;
  const avgScore =
    subjectTopics.reduce((a, t) => a + t.avgScore, 0) / subjectTopics.length;

  return {
    subject,
    topics: subjectTopics.length,
    mastered,
    retention: parseFloat(avgRetention.toFixed(1)),
    timeSpent: totalTime,
    score: parseFloat(avgScore.toFixed(1)),
    color: SUBJECT_COLORS[subject],
  };
});

// ──────────────────────────────────────────────────────
// WEEKLY COMPARISON DATA
// ──────────────────────────────────────────────────────
export const WEEKLY_DATA = (() => {
  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  return days.map((day) => ({
    day,
    thisWeek: rnd(30, 130),
    lastWeek: rnd(20, 110),
    target: 80,
  }));
})();

// ──────────────────────────────────────────────────────
// HEATMAP DATA (last 52 weeks)
// ──────────────────────────────────────────────────────
export const HEATMAP_DATA = (() => {
  const data: { date: string; value: number; week: number; day: number }[] = [];
  for (let w = 51; w >= 0; w--) {
    for (let d = 0; d < 7; d++) {
      const daysAgo = w * 7 + d;
      const date = subtractDays(daysAgo);
      const isFuture = new Date(date) > new Date();
      data.push({
        date,
        value: isFuture ? 0 : Math.random() < 0.15 ? 0 : rnd(10, 100),
        week: 51 - w,
        day: d,
      });
    }
  }
  return data;
})();

// ──────────────────────────────────────────────────────
// RETENTION CURVE DATA (Ebbinghaus)
// ──────────────────────────────────────────────────────
export const RETENTION_CURVE = (() => {
  const points = [0, 1, 2, 4, 7, 14, 21, 30, 60, 90];
  return points.map((day) => ({
    day,
    noReview: parseFloat((100 * Math.exp(-0.056 * day)).toFixed(1)),
    withSRS: parseFloat(
      (100 * Math.exp(-0.010 * day) + (day > 0 ? rnd(-3, 3) : 0)).toFixed(1)
    ),
    withFSRS: parseFloat(
      (100 * Math.exp(-0.006 * day) + (day > 0 ? rnd(-2, 2) : 0)).toFixed(1)
    ),
  }));
})();

// ──────────────────────────────────────────────────────
// SCORE DISTRIBUTION
// ──────────────────────────────────────────────────────
export const SCORE_DISTRIBUTION = [
  { range: '0–20', count: rnd(2, 8) },
  { range: '21–40', count: rnd(5, 15) },
  { range: '41–60', count: rnd(15, 30) },
  { range: '61–80', count: rnd(25, 45) },
  { range: '81–100', count: rnd(30, 55) },
];

// ──────────────────────────────────────────────────────
// SYSTEM PERFORMANCE RADAR
// ──────────────────────────────────────────────────────
export const RADAR_DATA = [
  { metric: 'Retention', FSRS: 95, SM2: 89, SRS: 85, Leitner: 75 },
  { metric: 'Speed', FSRS: 88, SM2: 80, SRS: 90, Leitner: 70 },
  { metric: 'Ease', FSRS: 85, SM2: 70, SRS: 92, Leitner: 95 },
  { metric: 'Adaptability', FSRS: 98, SM2: 85, SRS: 60, Leitner: 40 },
  { metric: 'Scientific Backing', FSRS: 96, SM2: 92, SRS: 80, Leitner: 65 },
  { metric: 'Flexibility', FSRS: 90, SM2: 75, SRS: 70, Leitner: 50 },
];

// ──────────────────────────────────────────────────────
// UPCOMING REVIEWS
// ──────────────────────────────────────────────────────
export const UPCOMING_REVIEWS = TOPICS.filter(
  (t) => t.status === 'Due' || t.status === 'Learning'
)
  .sort((a, b) => new Date(a.nextDue).getTime() - new Date(b.nextDue).getTime())
  .slice(0, 10);

// ──────────────────────────────────────────────────────
// KPI CALCULATIONS
// ──────────────────────────────────────────────────────
export function computeKPIs() {
  const totalTopics = TOPICS.length;
  const mastered = TOPICS.filter((t) => t.status === 'Mastered').length;
  const due = TOPICS.filter((t) => t.status === 'Due').length;
  const avgRetention =
    TOPICS.reduce((a, t) => a + t.retention, 0) / totalTopics;
  const totalTime = TOPICS.reduce((a, t) => a + t.timeSpent, 0);

  const recent = DAILY_ACTIVITY.slice(-14);
  const prev = DAILY_ACTIVITY.slice(-28, -14);

  const recentCards = recent.reduce((a, d) => a + d.cardsReviewed, 0);
  const prevCards = prev.reduce((a, d) => a + d.cardsReviewed, 0);
  const cardsTrend =
    prevCards > 0 ? ((recentCards - prevCards) / prevCards) * 100 : 0;

  const recentRetention =
    recent.filter((d) => d.retention > 0).reduce((a, d) => a + d.retention, 0) /
    (recent.filter((d) => d.retention > 0).length || 1);
  const prevRetention =
    prev.filter((d) => d.retention > 0).reduce((a, d) => a + d.retention, 0) /
    (prev.filter((d) => d.retention > 0).length || 1);
  const retentionTrend = recentRetention - prevRetention;

  const streak = (() => {
    let s = 0;
    for (let i = DAILY_ACTIVITY.length - 1; i >= 0; i--) {
      if (DAILY_ACTIVITY[i].cardsReviewed > 0) s++;
      else break;
    }
    return s;
  })();

  return {
    totalTopics,
    mastered,
    due,
    avgRetention: parseFloat(avgRetention.toFixed(1)),
    totalTime,
    recentCards,
    cardsTrend: parseFloat(cardsTrend.toFixed(1)),
    recentRetention: parseFloat(recentRetention.toFixed(1)),
    retentionTrend: parseFloat(retentionTrend.toFixed(1)),
    streak,
    masteredPercent: parseFloat(((mastered / totalTopics) * 100).toFixed(1)),
    masteredTrend: parseFloat((Math.random() * 10 - 2).toFixed(1)),
  };
}
