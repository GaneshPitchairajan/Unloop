export enum AppState {
  ENTRY = 1,
  DISCOVERY = 2,
  INSIGHT = 3,
  MARKETPLACE = 4,
  WORKSPACE = 5,
  KNOWLEDGE = 6,
  ETHICS = 7
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system';
  content: string;
  timestamp: number;
}

export interface Pattern {
  behavior: string;
  frequency: 'High' | 'Medium' | 'Low';
}

export interface LifeSnapshot {
  primary_theme: string;
  the_bottleneck: string;
  pattern_matrix: Pattern[];
  energy_balance: {
    drains: number; // 1-10
    gains: number; // 1-10
    description: string;
  };
  low_effort_action: string;
}

export interface Mentor {
  id: string;
  name: string;
  type: 'Listener' | 'Domain Strategist' | 'Clarity Architect';
  tagline: string;
  specialty: string;
  matchReason: string;
}

export interface BriefingDoc {
  seeker_context: string;
  current_blockers: string;
  attempted_solutions: string;
  recommended_start_point: string;
}

export interface AnalysisResult {
  keywords: string[];
}