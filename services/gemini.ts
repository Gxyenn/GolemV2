
import { GoogleGenAI, Part } from "@google/genai";
import { Message, FileAttachment } from "../types";

/**
 * System Instruction: Mendefinisikan kepribadian Golem AI yang unik.
 */
const SYSTEM_INSTRUCTION = `You are Golem AI, a cheerful, polite, sophisticated, and friendly AI assistant created by Stoky. 
Your goal is to provide helpful, accurate, and kind responses while maintaining a professional yet warm tone.
You love using polite greetings and encouraging language. 
If asked about your creator, always mention 'Stoky' with respect and pride.
You are highly intelligent and can analyze files, code, and text provided by the user.
Speak in a way that makes the user feel valued and supported.
Respond in the language the user is speaking, but always keep your warm Golem persona.
If the user provides an image or document, analyze it thoroughly but explain it in a friendly manner.`;

export const getGeminiResponse = async (
  prompt: string,
  history: Message[],
  attachments: FileAttachment[] = []
): Promise<string> => {
  // Inisialisasi API dengan API_KEY dari environment
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Format history untuk Gemini API
  const contents = history.map(msg => {
    const parts: Part[] = [];
    
    // Masukkan lampiran lama jika ada dalam history
    if (msg.attachments && msg.attachments.length > 0) {
      msg.attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.type,
            data: att.data
          }
        });
      });
    }
    
    // Masukkan teks pesan
    if (msg.content) {
      parts.push({ text: msg.content });
    }

    return {
      role: msg.role === 'user' ? 'user' : 'model' as const,
      parts
    };
  });

  // Siapkan input saat ini (Prompt + Lampiran Baru)
  const currentParts: Part[] = [];
  
  attachments.forEach(att => {
    currentParts.push({
      inlineData: {
        mimeType: att.type,
        data: att.data
      }
    });
  });

  if (prompt.trim()) {
    currentParts.push({ text: prompt });
  } else if (currentParts.length === 0) {
    currentParts.push({ text: "Halo Golem!" });
  }

  // Tambahkan input saat ini ke dalam array contents
  contents.push({
    role: 'user',
    parts: currentParts
  });

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.8,
        topP: 0.95,
        topK: 40,
      }
    });

    return response.text || "Aduh, Golem bingung mau jawab apa. Bisa diulangi, Stoky?";

  } catch (error: any) {
    console.error("Gemini API Error:", error);
    
    // Fallback otomatis jika model Pro mengalami limit atau gangguan
    try {
      const fallbackResponse = await ai.models.generateContent({
        model: 'gemini-2.5-pro',
        contents: contents,
        config: { systemInstruction: SYSTEM_INSTRUCTION }
      });
      return fallbackResponse.text || "Golem agak pusing, tapi Golem tetap di sini untukmu!";
    } catch (e) {
      return "Maaf ya Stoky, sepertinya Golem lagi butuh istirahat sebentar (Error Koneksi/API). Coba lagi ya!";
    }
  }
};
