
import { GoogleGenAI, Schema, Type } from "@google/genai";
import { SYSTEM_INSTRUCTION, SNAPSHOT_SCHEMA } from "../constants";
import { LifeSnapshot } from "../types";

// Initialize the client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Models
const MODEL_FLASH = 'gemini-3-flash-preview'; 
const MODEL_PRO = 'gemini-3-pro-preview';
const MODEL_VEO = 'veo-3.1-fast-generate-preview';

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
      contents: `Extract 3-5 simple emotional keywords from this text. Return ONLY a comma-separated list. Text: "${text}"`,
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
      Keep language simple, human, and encouraging.
      
      Conversation:
      ${conversationHistory}`,
      config: {
        responseMimeType: "application/json",
        responseSchema: SNAPSHOT_SCHEMA as unknown as Schema, 
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

// Generate a visual "Vibe" video for the mentor
export const generateMentorVideo = async (mentorName: string, specialty: string): Promise<string | null> => {
  // Check for API Key selection for Veo
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    const hasKey = await window.aistudio.hasSelectedApiKey();
    if (!hasKey) {
      await window.aistudio.openSelectKey();
    }
    // Re-instantiate with potentially new key context if needed, though usually env var is handled.
  }

  try {
    let operation = await ai.models.generateVideos({
      model: MODEL_VEO,
      prompt: `A professional, calming, cinematic shot of a modern office space representing ${specialty}. Warm lighting, inviting atmosphere. 4k resolution.`,
      config: {
        numberOfVideos: 1,
        resolution: '720p',
        aspectRatio: '16:9'
      }
    });

    // Polling for video completion
    while (!operation.done) {
      await new Promise(resolve => setTimeout(resolve, 5000));
      operation = await ai.operations.getVideosOperation({operation: operation});
    }

    const videoUri = operation.response?.generatedVideos?.[0]?.video?.uri;
    if (videoUri) {
      return `${videoUri}&key=${process.env.API_KEY}`;
    }
    return null;
  } catch (e) {
    console.error("Video generation failed", e);
    return null;
  }
};
