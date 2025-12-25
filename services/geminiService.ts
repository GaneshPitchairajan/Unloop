import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, SNAPSHOT_SCHEMA } from "../constants";
import { LifeSnapshot, BriefingDoc } from "../types";

// Initialize the client
// NOTE: Process.env.API_KEY is injected by the environment.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_FLASH = 'gemini-3-flash-preview'; // Fast, for chat and keywords
const MODEL_PRO = 'gemini-3-pro-preview'; // Smarter, for deep analysis

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
    const response = await ai.models.generateContent({
      model: MODEL_FLASH,
      contents: `Extract 3-5 abstract themes or emotional keywords from this text. Return ONLY a comma-separated list. Text: "${text}"`,
    });
    const raw = response.text || "";
    return raw.split(',').map(s => s.trim()).filter(s => s.length > 0);
  } catch (error) {
    console.error("Keyword extraction failed", error);
    return [];
  }
};

export const generateLifeSnapshot = async (conversationHistory: string): Promise<LifeSnapshot> => {
  try {
    const response = await ai.models.generateContent({
      model: MODEL_PRO,
      contents: `Analyze the following conversation and generate a 'Life Snapshot' JSON based on the schema. 
      
      Conversation:
      ${conversationHistory}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SNAPSHOT_SCHEMA as unknown as Schema, // Type casting for compatibility
      },
    });

    const jsonText = response.text;
    if (!jsonText) throw new Error("No data generated");
    return JSON.parse(jsonText) as LifeSnapshot;
  } catch (error) {
    console.error("Snapshot generation failed", error);
    throw error;
  }
};

export const generateBriefingDoc = async (snapshot: LifeSnapshot): Promise<BriefingDoc> => {
  const schema = {
    type: Type.OBJECT,
    properties: {
      seeker_context: { type: Type.STRING },
      current_blockers: { type: Type.STRING },
      attempted_solutions: { type: Type.STRING },
      recommended_start_point: { type: Type.STRING }
    }
  };

  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Act as a Scribe. Create a professional Briefing Document for a Mentor based on this user snapshot.
    The goal is to save the Mentor time.
    
    Snapshot: ${JSON.stringify(snapshot)}`,
    config: {
      responseMimeType: "application/json",
      responseSchema: schema,
    }
  });

  return JSON.parse(response.text || "{}");
};

export const analyzeDocument = async (docText: string, snapshot: LifeSnapshot): Promise<string> => {
  const response = await ai.models.generateContent({
    model: MODEL_PRO,
    contents: `Compare the User's Life Snapshot with the uploaded document content.
    Identify 1 alignment and 1 contradiction or gap.
    
    Snapshot: ${JSON.stringify(snapshot)}
    Document Content: ${docText.substring(0, 10000)}... (truncated)`,
  });
  return response.text || "Analysis failed.";
};