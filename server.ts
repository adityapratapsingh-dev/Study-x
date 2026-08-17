import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

let aiClient: GoogleGenAI | null = null;
function getGeminiClient(): GoogleGenAI {
  if (!aiClient) {
    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      throw new Error("GEMINI_API_KEY environment variable is missing.");
    }
    aiClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          "User-Agent": "aistudio-build",
        },
      },
    });
  }
  return aiClient;
}

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json({ limit: "10mb" }));

  // Health check
  app.get("/api/health", (_req, res) => {
    res.json({ status: "ok", timestamp: new Date().toISOString() });
  });

  // AI Quiz / Test Generator
  app.post("/api/ai/generate-quiz", async (req, res) => {
    try {
      const { topic, subject, noteContent, count = 5, difficulty = "Medium", questionTypes = ["mcq", "tf", "short"] } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are an expert academic tutor and exam creator for students.
Create a high-quality practice test based on the following criteria:
- Subject: ${subject || "General Academic"}
- Topic: ${topic || "Comprehensive Review"}
- Difficulty: ${difficulty}
- Number of Questions: ${count}
- Included Question Types: ${questionTypes.join(", ")}
${noteContent ? `\nReference Material / Student Note:\n"""\n${noteContent.slice(0, 8000)}\n"""` : ""}

Generate rigorous, clear questions with realistic distractor choices for multiple choice, accurate true/false statements with explanations, and concise rubric answers for short answer questions. Include helpful hints and thorough explanations.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          systemInstruction: "You create rigorous, educational quizzes and tests for students. Return structured JSON matching the requested schema.",
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING, description: "Test title" },
              description: { type: Type.STRING, description: "Brief description of the test" },
              estimatedMinutes: { type: Type.INTEGER, description: "Recommended time limit in minutes" },
              questions: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    id: { type: Type.STRING },
                    type: { type: Type.STRING, description: "'mcq' | 'tf' | 'short'" },
                    question: { type: Type.STRING },
                    options: {
                      type: Type.ARRAY,
                      items: { type: Type.STRING },
                      description: "4 options for mcq, 2 for tf ('True', 'False'), empty for short answer",
                    },
                    correctAnswer: { type: Type.STRING, description: "The exact matching text or short answer key" },
                    explanation: { type: Type.STRING, description: "Why this answer is correct and key learning point" },
                    hint: { type: Type.STRING, description: "A hint for the student" },
                    difficulty: { type: Type.STRING, description: "Easy | Medium | Hard" },
                    topicTag: { type: Type.STRING },
                  },
                  required: ["type", "question", "correctAnswer", "explanation"],
                },
              },
            },
            required: ["title", "questions"],
          },
        },
      });

      const text = response.text || "{}";
      const parsed = JSON.parse(text);
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("Error generating quiz:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate quiz." });
    }
  });

  // AI Flashcards Generator
  app.post("/api/ai/generate-flashcards", async (req, res) => {
    try {
      const { topic, subject, noteContent, count = 8 } = req.body;
      const ai = getGeminiClient();

      const prompt = `Create ${count} high-yield active recall flashcards for students.
Subject: ${subject || "General"}
Topic: ${topic || "General"}
${noteContent ? `\nContent:\n"""\n${noteContent.slice(0, 8000)}\n"""` : ""}

Make the front concise (a clear prompt, key question, equation name, or concept) and the back clear, memorable, and high-impact (definition, formula, core distinction, or example).`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              deckTitle: { type: Type.STRING },
              cards: {
                type: Type.ARRAY,
                items: {
                  type: Type.OBJECT,
                  properties: {
                    front: { type: Type.STRING, description: "Concept, question, or term" },
                    back: { type: Type.STRING, description: "Definition, formula, or breakdown" },
                    category: { type: Type.STRING, description: "Subtopic or tag" },
                  },
                  required: ["front", "back"],
                },
              },
            },
            required: ["deckTitle", "cards"],
          },
        },
      });

      const parsed = JSON.parse(response.text || "{}");
      res.json({ success: true, data: parsed });
    } catch (error: any) {
      console.error("Error generating flashcards:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to generate flashcards." });
    }
  });

  // AI Note Summarizer / Study Guide
  app.post("/api/ai/summarize-note", async (req, res) => {
    try {
      const { noteTitle, noteContent, style = "study-guide" } = req.body;
      const ai = getGeminiClient();

      const prompt = `You are a top academic tutor. Generate a comprehensive ${style} for the following student note:
Title: ${noteTitle}

Note Content:
"""
${noteContent.slice(0, 10000)}
"""

Provide:
1. Executive summary (2-3 sentences)
2. Key concepts & definitions
3. High-yield exam takeaways & common pitfalls
4. Practice questions / self-test prompts with brief solutions
Format the response in clean, beautiful Markdown with headers, bold text, bullet points, and code/formula styling where applicable.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ success: true, summary: response.text });
    } catch (error: any) {
      console.error("Error summarizing note:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to summarize note." });
    }
  });

  // AI Concept Explainer / Tutor Assistant
  app.post("/api/ai/explain", async (req, res) => {
    try {
      const { query, context, mode = "standard" } = req.body;
      const ai = getGeminiClient();

      let modeInstruction = "Explain clearly with academic rigor and intuitive clarity.";
      if (mode === "eli5") {
        modeInstruction = "Explain like I am 12 years old using simple everyday analogies, zero unnecessary jargon, and clear intuitive logic.";
      } else if (mode === "exam-prep") {
        modeInstruction = "Focus on what professors test on, high-yield tricks, common student mistakes, and memory mnemonics.";
      } else if (mode === "step-by-step") {
        modeInstruction = "Break down the solution or concept into numbered sequential steps with reasoning for each step.";
      }

      const prompt = `Mode: ${mode} (${modeInstruction})
Question / Concept: ${query}
${context ? `\nContext/Note:\n"""\n${context.slice(0, 6000)}\n"""` : ""}

Format your explanation in clear Markdown with formatting, bullet lists, math/code blocks when useful. Keep it engaging, encouraging, and highly instructional.`;

      const response = await ai.models.generateContent({
        model: "gemini-3.7-flash",
        contents: prompt,
      });

      res.json({ success: true, explanation: response.text });
    } catch (error: any) {
      console.error("Error explaining concept:", error);
      res.status(500).json({ success: false, error: error.message || "Failed to explain concept." });
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
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
