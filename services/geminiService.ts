
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, SNAPSHOT_SCHEMA } from "../constants";
import { LifeSnapshot } from "../types";

// Initialize the client for standard operations
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_FLASH = 'gemini-3-flash-preview'; 
const MODEL_PRO = 'gemini-3-pro-preview';

// --- Utility: Exponential Backoff for 429 Errors ---
const wait = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export async function runWithRetry<T>(operation: () => Promise<T>, retries = 3, initialDelay = 2000): Promise<T> {
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
        const delay = initialDelay * Math.pow(2, i); // 2s, 4s, 8s
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

export const createChatSession = () => {
  return ai.chats.create({
    model: MODEL_FLASH,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });
};

export const extractKeywords = async (text: string): Promise<string[]> => {
  try {
    const response = await runWithRetry(() => ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Extract 3-5 simple emotional keywords from this text. Return ONLY a comma-separated list. Text: "${text}"`,
    }));
    const raw = response.text || "";
    return raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Keyword extraction failed", error);
    return [];
  }
};

export const generateLifeSnapshot = async (conversationHistory: string): Promise<LifeSnapshot> => {
  try {
    const response = await runWithRetry(() => ai.models.generateContent({
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
