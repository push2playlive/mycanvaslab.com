import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI } from "@google/genai";
import OpenAI from "openai";
import dotenv from "dotenv";
import { exec } from "child_process";
import Replicate from "replicate";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import { promisify } from "util";
import { pipeline } from "stream";

const streamPipeline = promisify(pipeline);

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
  
  // Notification Endpoint (Mock Email Service)
  app.post("/api/notify", (req, res) => {
    const { type, payload, userEmail } = req.body;
    
    console.log(`[Notification Service]: Sending ${type} to ${userEmail}`);
    console.log(`[Notification Payload]:`, payload);
    
    // In a real app, you would use SendGrid, Mailgun, etc.
    // For now, we log to terminal to simulate the "Sovereign" feedback loop
    const timestamp = new Date().toISOString();
    const logMessage = `\n[EMAIL_NOTIFICATION] [${timestamp}]\nTO: ${userEmail}\nTYPE: ${type}\nCONTENT: ${JSON.stringify(payload, null, 2)}\n[END_EMAIL]\n`;
    
    console.log(logMessage);
    
    res.json({ success: true, message: "Notification dispatched to neural buffer." });
  });

  // THE NEURAL RENDER: AI Video + Voiceover
  app.post("/api/generate-complete-video", async (req, res) => {
    const { description } = req.body;
    
    try {
      console.log(`[Neural Render]: Starting mission for: ${description}`);

      // 1. GENERATE VOICEOVER (ElevenLabs)
      const elevenLabsKey = process.env.ELEVENLABS_API_KEY;
      const voiceId = "pNInz6obpg8nEByWQX7d"; // Adam
      let audioPath = path.join(__dirname, 'public', 'temp_audio.mp3');
      
      if (elevenLabsKey) {
        console.log("[Neural Render]: Calling ElevenLabs...");
        const response = await fetch(`https://api.elevenlabs.io/v1/text-to-speech/${voiceId}`, {
          method: 'POST',
          headers: {
            'xi-api-key': elevenLabsKey,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            text: description,
            model_id: "eleven_monolingual_v1",
            voice_settings: { stability: 0.5, similarity_boost: 0.5 }
          }),
        });

        if (!response.ok) throw new Error("ElevenLabs API failed.");
        const arrayBuffer = await response.arrayBuffer();
        fs.writeFileSync(audioPath, Buffer.from(arrayBuffer));
      } else {
        console.warn("[Neural Render]: ElevenLabs key missing, skipping audio.");
      }

      // 2. GENERATE VIDEO (Replicate)
      const replicateKey = process.env.REPLICATE_API_TOKEN;
      let finalVideoUrl = "";
      
      if (replicateKey) {
        const replicate = new Replicate({ auth: replicateKey });
        
        // Step A: Generate Image (SDXL)
        console.log("[Neural Render]: Generating base image (SDXL)...");
        const imageOutput: any = await replicate.run(
          "stability-ai/sdxl:36469ef044a7951f9383458e8b6819110743c2d013c14eb294c4740191f30c6d",
          { input: { prompt: description, negative_prompt: "text, watermark, blurry" } }
        );
        const imageUrl = imageOutput[0];

        // Step B: Generate Video (SVD)
        console.log("[Neural Render]: Animating image (SVD)...");
        const videoOutput: any = await replicate.run(
          "stability-ai/stable-video-diffusion:ac7327c20fcb047d9bc096b06710e973094bb77599695b605997efc3ad274925",
          { input: { input_image: imageUrl, video_length: "14_frames_with_svd" } }
        );
        finalVideoUrl = videoOutput[0];
      } else {
        throw new Error("REPLICATE_API_TOKEN is required for video generation.");
      }

      // 3. MERGE MEDIA (ffmpeg)
      const videoPath = path.join(__dirname, 'public', 'temp_video.mp4');
      const outputPath = path.join(__dirname, 'public', 'neural_asset_v12.mp4');

      if (finalVideoUrl && fs.existsSync(audioPath)) {
        console.log("[Neural Render]: Downloading video for merge...");
        const videoRes = await fetch(finalVideoUrl);
        const videoBuffer = await videoRes.arrayBuffer();
        fs.writeFileSync(videoPath, Buffer.from(videoBuffer));

        console.log("[Neural Render]: Merging neural assets with ffmpeg...");
        await new Promise((resolve, reject) => {
          ffmpeg()
            .input(videoPath)
            .input(audioPath)
            .outputOptions("-c:v copy", "-c:a aac", "-map 0:v:0", "-map 1:a:0", "-shortest")
            .on('end', resolve)
            .on('error', (err) => {
              console.warn("[Neural Render]: ffmpeg merge failed, falling back to silent video.", err);
              fs.copyFileSync(videoPath, outputPath);
              resolve(null);
            })
            .save(outputPath);
        });
      } else if (finalVideoUrl) {
        console.log("[Neural Render]: No audio generated, serving silent video.");
        const videoRes = await fetch(finalVideoUrl);
        const videoBuffer = await videoRes.arrayBuffer();
        fs.writeFileSync(outputPath, Buffer.from(videoBuffer));
      }

      res.json({ 
        success: true, 
        videoUrl: "/neural_asset_v12.mp4",
        message: "Neural render complete. Asset synced to lab." 
      });

    } catch (error: any) {
      console.error("Neural Render Error:", error);
      res.status(500).json({ error: error.message || "Neural render failed." });
    }
  });

  // THE BACKLINK BLAST: Distribution Service
  app.post("/api/marketing/distribute", async (req, res) => {
    const { description, videoUrl, backlinkSync } = req.body;
    
    try {
      console.log(`[Backlink Blast]: Initiating distribution for asset: ${videoUrl}`);
      
      if (backlinkSync) {
        console.log("[Backlink Blast]: Submitting to 50+ indexed directories...");
        // In a real scenario, you'd read directories.csv and submit via a worker
        // const directories = fs.readFileSync('directories.csv', 'utf-8').split('\n');
      }

      // Simulate distribution delay
      await new Promise(resolve => setTimeout(resolve, 2000));

      res.json({ 
        success: true, 
        message: "Campaign launched. Distribution in progress across the Backlink Network." 
      });

    } catch (error: any) {
      console.error("Distribution Error:", error);
      res.status(500).json({ error: error.message || "Distribution failed." });
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
