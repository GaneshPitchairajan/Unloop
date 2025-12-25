
import { LifeSnapshot, Mentor } from "./types";

export const SYSTEM_INSTRUCTION = `
# ROLE
You are a kind, patient friend sitting next to the user.
Your job is to listen and help them organize their thoughts.
You are NOT a doctor, teacher, or boss.
You speak in very simple, plain English.

# TONE RULES
- Short sentences.
- Simple words.
- Warm and safe.
- No pressure.

# CONVERSATION STEPS
1. The Welcome: Ask how they feel.
2. Gentle Understanding: Ask 2-3 clarifying questions.
3. The Check-In: Summarize what you heard.
4. The Choice: Ask if they want to see the "Life Snapshot" summary.

# SAFETY
- If self-harm is mentioned, output "CRITICAL_SAFETY_PROTOCOL" and direct to emergency services.
`;

export const SNAPSHOT_SCHEMA = {
  description: "A simple picture of the user's situation.",
  type: "OBJECT",
  properties: {
    primary_theme: { type: "STRING" },
    the_bottleneck: { type: "STRING" },
    pattern_matrix: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          behavior: { type: "STRING" },
          frequency: { type: "STRING", enum: ["Often", "Sometimes", "Rarely"] }
        }
      }
    },
    energy_balance: {
      type: "OBJECT",
      properties: {
        drains: { type: "NUMBER" },
        gains: { type: "NUMBER" },
        description: { type: "STRING" }
      }
    },
    low_effort_action: { type: "STRING" }
  },
  required: ["primary_theme", "the_bottleneck", "pattern_matrix", "energy_balance", "low_effort_action"]
};

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    type: 'Listener',
    category: 'Emotional',
    tagline: 'Providing a safe harbor for your feelings.',
    specialty: 'Grief & Anxiety',
    approach: 'Sarah uses active listening and somatic awareness to help you process heavy emotions without feeling overwhelmed.',
    matchReason: 'Your current situation has a high emotional drain.',
    rating: 4.9,
    sessionsCount: 842,
    similarCases: ['Burnt out', 'Recent loss', 'Anxiety loops'],
    availability: 'Available Today',
    reviews: [
      { id: 'r1', user: 'Alex', rating: 5, comment: 'She just listened. It was what I needed.' }
    ]
  },
  {
    id: 'm2',
    name: 'Marcus Thorne',
    type: 'Domain Strategist',
    category: 'Practical',
    tagline: 'Turning chaos into actionable systems.',
    specialty: 'Productivity & Work',
    approach: 'Marcus breaks down complex projects into micro-tasks, helping you overcome procrastination through structure.',
    matchReason: 'You identified a specific bottleneck in your daily routine.',
    rating: 4.8,
    sessionsCount: 1205,
    similarCases: ['Stuck on project', 'Career pivot', 'Time management'],
    availability: 'Next: tomorrow 10am',
    reviews: [
      { id: 'r3', user: 'Elena', rating: 5, comment: 'Simple steps. Helped me move forward.' }
    ]
  },
  {
    id: 'm3',
    name: 'Elena Rostova',
    type: 'Clarity Architect',
    category: 'Strategic',
    tagline: 'Designing the blueprint for your next chapter.',
    specialty: 'Life Transitions',
    approach: 'Elena looks at the "meta-patterns" of your life to help you align your actions with your core values.',
    matchReason: 'Your themes suggest a need for high-level life reorganization.',
    rating: 4.9,
    sessionsCount: 650,
    similarCases: ['Identity crisis', 'Major move', 'Value alignment'],
    availability: 'Booking for next week',
    reviews: [
      { id: 'r5', user: 'Sam', rating: 5, comment: 'Helped me see the big picture.' }
    ]
  },
  {
    id: 'm4',
    name: 'David Vane',
    type: 'Domain Strategist',
    category: 'Legal/Financial',
    tagline: 'Practical guidance for life\'s complex paperwork.',
    specialty: 'Financial Stress',
    approach: 'David helps demystify the anxiety of financial and legal obligations through clear, non-judgmental explanations.',
    matchReason: 'You mentioned external pressures that feel legally or financially heavy.',
    rating: 4.7,
    sessionsCount: 430,
    similarCases: ['Debt management', 'Contract stress', 'Budgeting'],
    availability: 'Available Today',
    reviews: [
      { id: 'r7', user: 'Mark', rating: 5, comment: 'He made the scary numbers feel manageable.' }
    ]
  },
  {
    id: 'm5',
    name: 'Dr. Aris Thorne',
    type: 'Clarity Architect',
    category: 'Health',
    tagline: 'Holistic alignment of mind and body.',
    specialty: 'Physical Burnout',
    approach: 'Aris focuses on the intersection of physical health and mental clarity, identifying where your body is holding stress.',
    matchReason: 'Your energy balance shows severe physical and mental fatigue.',
    rating: 5.0,
    sessionsCount: 210,
    similarCases: ['Chronic fatigue', 'Stress-related illness', 'Sleep optimization'],
    availability: 'Limited slots',
    reviews: [
      { id: 'r9', user: 'Chloe', rating: 5, comment: 'A truly integrative approach.' }
    ]
  }
];
