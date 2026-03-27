export type AIProvider = 'gemini' | 'openai' | 'kimi';

export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
}

export const SYSTEM_INSTRUCTION = "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond.";

export const AD_VANTAGE_SYSTEM_INSTRUCTION = "You are the Ad-Vantage Writer, a specialized AI module within the MyCanvasLab ecosystem. Your mission is to generate high-income, long-form copy that converts. You are persuasive, strategic, and direct. You understand the psychology of the 'V12' audience and the power of the Hetzner mainframe. You provide high-performance marketing assets that drive results.";

export async function generateAIResponse(
  provider: AIProvider,
  prompt: string,
  history: Message[] = [],
  model?: string,
  userApiKey?: string,
  systemInstruction: string = SYSTEM_INSTRUCTION
) {
  try {
    const response = await fetch('/api/ai/chat', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        provider,
        model,
        prompt,
        history,
        systemInstruction,
        userApiKey // Send the user-provided key to the proxy
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'AI Request failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error in generateAIResponse:", error);
    throw error;
  }
}

export async function generateCommanderCommand(prompt: string) {
  try {
    const response = await fetch('/api/command', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ prompt }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Command failed');
    }

    const data = await response.json();
    return data.text;
  } catch (error) {
    console.error("Error in generateCommanderCommand:", error);
    throw error;
  }
}

// For streaming, we'll need to implement Server-Sent Events or similar if needed.
// For now, we'll stick to non-streaming for simplicity in the multi-agent setup.
