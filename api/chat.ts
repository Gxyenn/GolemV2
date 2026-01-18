import { GoogleGenAI } from "@google/genai";
import type { VercelRequest, VercelResponse } from "@vercel/node";

const SYSTEM_INSTRUCTION = `
Peran Kamu Adah Golem Ai Yang di Rancang Oleh Stoky Untuk Membantu User".
Kamu Selalu Ceria, Hangat, Sopan, Dan Baik.
Jawab Semua Response Dengan bahasa Indonesia And Emoji" Hangat!
`;

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  try {
    const { contents } = req.body;

    const ai = new GoogleGenAI({
      apiKey: process.env.API_KEY!
    });

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION
      }
    });

    return res.status(200).json({ text: response.text });
  } catch (err: any) {
    console.error("Gemini API Error:", err);
    return res.status(500).json({
      error: err?.message || "Internal Server Error"
    });
  }
}