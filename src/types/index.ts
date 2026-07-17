export type RevisionSystem =
  | 'SRS'
  | 'SM2'
  | 'FSRS'
  | 'Leitner'
  | 'Pomodoro'
  | 'Feynman'
  | 'ActiveRecall'
  | 'MindMap'
  | 'Cornell'
  | 'Interleaving';

export type Subject =
  | 'Mathematics'
  | 'Physics'
  | 'Chemistry'
  | 'Biology'
  | 'History'
  | 'English'
  | 'Computer Science'
  | 'Economics';

export type Difficulty = 'Easy' | 'Medium' | 'Hard';
export type Status = 'Mastered' | 'Learning' | 'Due' | 'New';

export interface Topic {
  id: string;
  name: string;
  subject: Subject;
  system: RevisionSystem;
  difficulty: Difficulty;
  status: Status;
  retention: number; // 0–100
  lastRevised: string; // ISO date
  nextDue: string; // ISO date
  totalSessions: number;
  avgScore: number;
  streak: number;
  timeSpent: number; // minutes
  ease: number; // SM2 ease factor
  interval: number; // days until next review
  repetitions: number;
}

export interface DailyActivity {
  date: string;
  cardsReviewed: number;
  minutesStudied: number;
  retention: number;
  newCards: number;
  score: number;
}

export interface SubjectStat {
  subject: Subject;
  topics: number;
  mastered: number;
  retention: number;
  timeSpent: number;
  score: number;
  color: string;
}

export interface KPI {
  label: string;
  value: string | number;
  sub: string;
  trend: number; // % change
  icon: string;
  color: string;
  bg: string;
}

export interface SystemInfo {
  id: RevisionSystem;
  name: string;
  fullName: string;
  description: string;
  icon: string;
  color: string;
  bg: string;
  effectiveness: number;
  retention: number;
  difficulty: number;
  tags: string[];
  howItWorks: string;
}

export type Tab = 'dashboard' | 'topics' | 'stats' | 'systems' | 'schedule';

export interface FilterState {
  subject: string;
  system: string;
  status: string;
  difficulty: string;
  dateFrom: string;
  dateTo: string;
  search: string;
  sortBy: string;
  sortDir: 'asc' | 'desc';
}
