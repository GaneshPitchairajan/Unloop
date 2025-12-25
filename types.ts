
export enum AppState {
  ENTRY = 1,
  DISCOVERY = 2,
  INSIGHT = 3,
  MARKETPLACE = 4,
  CONNECTION = 5,
  BOOKING = 6,
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
    drains: number;
    gains: number;
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

export interface AnalysisResult {
  keywords: string[];
}

// New Interface for a saved "Problem/Session"
export interface SessionData {
  id: string;
  timestamp: number;
  label: string; // usually the bottleneck or theme
  history: Message[];
  snapshot: LifeSnapshot;
  selectedMentor?: Mentor;
  bookedTime?: string;
}
