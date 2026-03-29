import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { exec } from "child_process";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // THE BASH ENDPOINT (Sovereign Dispatch)
  app.post("/api/dispatch", (req, res) => {
    const { mode, commitMessage } = req.body;
    
    // Decide which "Bash" to run based on Public/Private toggle
    // We execute in the current directory as it's the root of the project in this environment
    const command = mode === 'PUBLIC' 
      ? `git add . && git commit -m "${commitMessage || 'Sovereign Dispatch'}" && git push origin main`
      : `git add . && git commit -m "Private Save: ${commitMessage || 'Vault Save'}"`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Dispatch Error:", stderr);
        return res.status(500).json({ success: false, error: stderr || error.message });
      }
      res.json({ success: true, output: stdout });
    });
  });

  // THE MASTER COMMAND: Add, Commit, and Push to GitHub
  app.post('/api/bash-up', (req, res) => {
    const { message } = req.body;
    
    // THE MASTER COMMAND: Add, Commit, and Push to GitHub
    // We use the current directory as it's the root of the project
    const command = `git add . && git commit -m "${message || 'V12 Master Bash'}" && git push origin main`;

    exec(command, (error, stdout, stderr) => {
      if (error) {
        console.error("Bash-Up Error:", stderr);
        return res.status(500).json({ success: false, error: stderr || error.message });
      }
      res.json({ success: true, output: stdout });
    });
  });

  // AI Proxy Endpoint
  app.post("/api/ai/chat", async (req, res) => {
    const { provider, model, prompt, history, systemInstruction, userApiKey } = req.body;

    try {
      if (provider === "gemini") {
        const apiKey = userApiKey || process.env.GEMINI_API_KEY || "";
        const ai = new GoogleGenAI({ apiKey });
        const response = await ai.models.generateContent({
          model: model || "gemini-3-flash-preview",
          contents: [
            ...history.map((h: any) => ({
              role: h.role === "assistant" ? "model" : "user",
              parts: [{ text: h.content }]
            })),
            { role: "user", parts: [{ text: prompt }] }
          ],
          config: {
            systemInstruction: systemInstruction
          }
        });

        const responseText = response.text;
        return res.json({ text: responseText });
      } 
      
      if (provider === "openai" || provider === "kimi") {
        const apiKey = userApiKey || (provider === "openai" ? process.env.OPENAI_API_KEY : process.env.KIMI_API_KEY);
        const baseURL = provider === "kimi" ? (process.env.KIMI_BASE_URL || "https://api.moonshot.cn/v1") : undefined;

        if (!apiKey) {
          return res.status(400).json({ error: `${provider.toUpperCase()}_API_KEY is not configured.` });
        }

        const openai = new OpenAI({ apiKey, baseURL });
        const messages = [
          { role: "system", content: systemInstruction },
          ...history.map((h: any) => ({
            role: h.role,
            content: h.content
          })),
          { role: "user", content: prompt }
        ];

        const completion = await openai.chat.completions.create({
          model: model || (provider === "openai" ? "gpt-4o" : "moonshot-v1-8k"),
          messages: messages as any,
        });

        return res.json({ text: completion.choices[0].message.content });
      }

      return res.status(400).json({ error: "Invalid provider" });
    } catch (error: any) {
      console.error("AI Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Dedicated Command Endpoint for MyCanvasLab V12 Commander
  app.post("/api/command", async (req, res) => {
    const { prompt } = req.body;
    
    try {
      const apiKey = process.env.GEMINI_API_KEY || "";
      if (!apiKey) {
        return res.status(500).json({ error: "GEMINI_API_KEY is not configured on the server." });
      }

      const ai = new GoogleGenAI({ apiKey });
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: [{ role: "user", parts: [{ text: prompt }] }],
        config: {
          systemInstruction: "You are the MyCanvasLab AI Commander. Your mission is to assist the Architect in building high-performance, income-generating web applications. You are technical, noble, and direct. You value the 'V12' power of the Hetzner mainframe. You do not make excuses; you provide solutions. You speak with the confidence of a Diamond."
        }
      });

      return res.json({ text: response.text });
    } catch (error: any) {
      console.error("Command Error:", error);
      res.status(500).json({ error: error.message || "Internal Server Error" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
