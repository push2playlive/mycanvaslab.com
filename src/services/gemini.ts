import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  console.error("GEMINI_API_KEY is not defined in the environment.");
}

export const ai = new GoogleGenAI({ apiKey: apiKey || "" });

export const model = "gemini-flash-latest";

export const SYSTEM_INSTRUCTION = "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond.";

export async function generateResponse(prompt: string, history: { role: string; parts: { text: string }[] }[] = [], systemInstruction: string = SYSTEM_INSTRUCTION) {
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history,
    });

    const result = await chat.sendMessage({ message: prompt });
    return result.text;
  } catch (error) {
    console.error("Error in generateResponse:", error);
    throw error;
  }
}

export async function* generateStreamResponse(prompt: string, history: any[] = [], attachments: { data: string, mimeType: string }[] = [], systemInstruction: string = SYSTEM_INSTRUCTION) {
  try {
    const chat = ai.chats.create({
      model,
      config: {
        systemInstruction,
      },
      history,
    });

    const parts: any[] = [{ text: prompt }];
    attachments.forEach(att => {
      parts.push({
        inlineData: {
          data: att.data,
          mimeType: att.mimeType
        }
      });
    });

    const result = await chat.sendMessageStream({ message: parts });
    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Error in generateStreamResponse:", error);
    throw error;
  }
}
