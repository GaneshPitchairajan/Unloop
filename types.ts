
export enum AppState {
  LOGIN = -1,
  LANDING = 0,
  ENTRY = 1,
  DISCOVERY = 2,
  INSIGHT = 3,
  MATCHING = 4,
  MARKETPLACE = 5,
  MENTOR_PROFILE = 6,
  CONNECTION = 7,
  BOOKING = 8,
  ETHICS = 9,
  API_KEY_SELECTION = 10,
  APPOINTMENT_DETAILS = 11,
  MENTOR_DASHBOARD = 12,
  USER_DASHBOARD = 13
}

export interface Message {
  id: string;
  role: 'user' | 'model' | 'system' | 'mentor';
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
  suggested_activities?: string[];
}

export interface Review {
  id: string;
  user: string;
  comment: string;
  rating: number;
}

export type MentorCategory = 
  | 'Career Guidance' 
  | 'Mental Health & Well-Being' 
  | 'Relationship Advice' 
  | 'Academic / Exam Stress' 
  | 'Workplace Issues' 
  | 'Life Coaching' 
  | 'Technical / Skill Mentorship' 
  | 'Financial Guidance' 
  | 'Startup / Entrepreneurship' 
  | 'General Listening / Peer Support'
  | 'Emotional' 
  | 'Practical' 
  | 'Strategic' 
  | 'Legal/Financial' 
  | 'Health';

export interface Mentor {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  socialLink?: string;
  type: 'Listener' | 'Domain Strategist' | 'Clarity Architect';
  category: MentorCategory;
  tagline: string;
  specialty: string;
  approach: string; 
  matchReason: string;
  rating: number;
  sessionsCount: number;
  similarCases: string[];
  reviews: Review[];
  availability: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  bio?: string;
  isMentor: boolean;
  mentorProfile?: Mentor;
}

export interface AnalysisResult {
  keywords: string[];
}

export type SessionStatus = 'open' | 'resolved' | 'archived';

export interface SessionData {
  id: string;
  timestamp: number;
  label: string; 
  history: Message[];
  collaborationHistory?: Message[]; // Chat between user and mentor
  snapshot: LifeSnapshot;
  editedSnapshot?: LifeSnapshot; 
  hiddenSnapshotFields?: string[]; 
  editedFields?: string[]; 
  selectedMentor?: Mentor;
  bookedTime?: string;
  userMood?: string;
  userPriority?: string;
  userNotes?: string;
  consentGiven?: boolean;
  status?: SessionStatus;
  userId?: string;
}
