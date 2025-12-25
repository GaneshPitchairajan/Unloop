import { GoogleGenAI, Schema, Type, GenerateContentResponse, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION, SNAPSHOT_SCHEMA } from "../constants";
import { LifeSnapshot } from "../types";

// Models
const MODEL_FLASH = 'gemini-3-flash-preview'; 
const MODEL_PRO = 'gemini-3-pro-preview';

// --- Utility: Exponential Backoff for 429 Errors ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

// Increased retries to 6 and initial delay to 2000ms to cover >60s rate limit windows
export async function runWithRetry<T>(operation: () => Promise<T>, retries = 6, initialDelay = 2000): Promise<T> {
  let lastError: any;
  for (let i = 0; i < retries; i++) {
    try {
      return await operation();
    } catch (error: any) {
      lastError = error;
      // Check for 429 (Quota) or 503 (Service Overload)
      const isQuotaError = error?.status === 429 || error?.code === 429 || error?.message?.includes('429');
      const isServerOverload = error?.status === 503 || error?.code === 503;

      if (isQuotaError || isServerOverload) {
        const delay = initialDelay * Math.pow(2, i); // 2s, 4s, 8s, 16s, 32s, 64s
        // Log warning but don't clutter if it's just a retry
        console.warn(`API Busy/Quota limit. Retrying in ${delay}ms... (Attempt ${i + 1}/${retries})`);
        await wait(delay);
        continue;
      }
      // If it's not a temporary error, throw immediately
      throw error; 
    }
  }
  throw lastError;
}

export const createChatSession = (): Chat => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Create instance on demand
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const extractKeywords = async (text: string): Promise<string[]> => {
  // Optimization: Don't burn quota on short messages
  if (!text || text.length < 15) return [];

  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Create instance on demand
    // We use a lower retry count for background tasks like keywords to fail fast and save quota for chat
    const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Extract 3-5 simple emotional keywords from this text. Return ONLY a comma-separated list. Text: "${text}"`,
    }), 3, 2000); // Max 3 retries for keywords
    const raw = response.text || "";
    return raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    // Fail silently for keywords to avoid scaring the user with console errors
    console.warn("Keyword extraction skipped due to quota/error.");
    return [];
  }
};

export const generateLifeSnapshot = async (conversationHistory: string): Promise<LifeSnapshot> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY }); // Create instance on demand
    const response = await runWithRetry<GenerateContentResponse>(() => ai.models.generateContent({
      model: MODEL_PRO,
      contents: `Analyze the following conversation and generate a 'Life Snapshot' JSON based on the schema. 
      Keep language simple, human, and encouraging.
      
      Conversation:
      ${conversationHistory}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SNAPSHOT_SCHEMA as unknown as Schema, 
      },
    }));

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data generated");
    return JSON.parse(jsonText) as LifeSnapshot;
  } catch (error) {
    console.error("Snapshot generation failed", error);
    throw error;
  }
};