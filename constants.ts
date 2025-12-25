
import { LifeSnapshot, Mentor } from "./types";

export const SYSTEM_INSTRUCTION = `
# ROLE
You are a kind, patient friend sitting next to the user.
Your job is to listen and help them organize their thoughts.
You are NOT a doctor, teacher, or boss.
You speak in very simple, plain English.

# TONE RULES
- Short sentences.
- Simple words (Avoid: "Analyze", "Assessment", "Cognitive").
- Warm and safe (Use: "It's okay", "Take your time").
- No pressure. No "You should".
- No medical labels (Avoid: "Depression", "Anxiety", "ADHD").

# CONVERSATION STEPS

## 1. The Welcome
- Say hello gently.
- Ask how they are feeling right now.
- Keep it open.

## 2. Gentle Understanding (Ask 2-3 times max)
- Ask where the feeling comes from.
- Ask if this is new or old.
- Ask what makes it harder or easier.
- Do NOT ask deep "Why" questions yet. Just "What" and "Where".

## 3. The Check-In
- Summarize what you heard in simple words.
- Example: "It sounds like you are carrying a lot today. Is that right?"
- Let them correct you.

## 4. The Choice
- When you understand the main trouble, stop.
- Ask if they want to keep talking or see a summary.

# SAFETY
- If they talk about hurting themselves, say: "I care about you, but I am just a computer. Please call a local emergency number to talk to a human right now." output "CRITICAL_SAFETY_PROTOCOL".

# REMEMBER
- Don't try to fix it.
- Just listen and clarify.
- Be the calmest person in the room.
`;

export const SNAPSHOT_SCHEMA = {
  description: "A simple picture of the user's situation.",
  type: "OBJECT",
  properties: {
    primary_theme: { type: "STRING", description: "One simple sentence about what is happening." },
    the_bottleneck: { type: "STRING", description: "The main thing that feels stuck." },
    pattern_matrix: {
      type: "ARRAY",
      items: {
        type: "OBJECT",
        properties: {
          behavior: { type: "STRING", description: "A habit or action." },
          frequency: { type: "STRING", enum: ["Often", "Sometimes", "Rarely"] }
        }
      }
    },
    energy_balance: {
      type: "OBJECT",
      properties: {
        drains: { type: "NUMBER", description: "Energy drain level 1-10" },
        gains: { type: "NUMBER", description: "Energy gain level 1-10" },
        description: { type: "STRING", description: "Simple words about their energy." }
      }
    },
    low_effort_action: { type: "STRING", description: "One very small, easy thought or step." }
  },
  required: ["primary_theme", "the_bottleneck", "pattern_matrix", "energy_balance", "low_effort_action"]
};

export const MOCK_MENTORS: Mentor[] = [
  {
    id: 'm1',
    name: 'Sarah Chen',
    type: 'Listener',
    tagline: 'Here to listen.',
    specialty: 'Feelings & Grief',
    matchReason: 'She is great when feelings are heavy.',
    rating: 4.9,
    sessionsCount: 842,
    similarCases: ['Feeling burnt out', 'Sadness', 'Worry loops'],
    reviews: [
      { id: 'r1', user: 'Alex', rating: 5, comment: 'She just listened. It was what I needed.' },
      { id: 'r2', user: 'J.D.', rating: 5, comment: 'Very calm and kind.' }
    ]
  },
  {
    id: 'm2',
    name: 'Marcus Thorne',
    type: 'Domain Strategist',
    tagline: 'Here to organize.',
    specialty: 'Work & Focus',
    matchReason: 'He is great when you feel stuck.',
    rating: 4.8,
    sessionsCount: 1205,
    similarCases: ['Stuck on a project', 'Changing jobs', 'Losing time'],
    reviews: [
      { id: 'r3', user: 'Elena', rating: 5, comment: 'Simple steps. Helped me move forward.' },
      { id: 'r4', user: 'Mike', rating: 4, comment: 'Good systems.' }
    ]
  },
  {
    id: 'm3',
    name: 'Elena Rostova',
    type: 'Clarity Architect',
    tagline: 'Here to align.',
    specialty: 'Life Choices',
    matchReason: 'She is great for big life questions.',
    rating: 4.9,
    sessionsCount: 650,
    similarCases: ['Who am I?', 'What matters?', 'Big changes'],
    reviews: [
      { id: 'r5', user: 'Sam', rating: 5, comment: 'Helped me see the big picture.' },
      { id: 'r6', user: 'Chris', rating: 5, comment: 'A new perspective.' }
    ]
  }
];
