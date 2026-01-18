
import { GoogleGenAI, Part } from "@google/genai";
import { Message, FileAttachment } from "../types";

const SYSTEM_INSTRUCTION = `You are Golem AI, a cheerful, polite, sophisticated, and friendly AI assistant created by Stoky. 
Your goal is to provide helpful, accurate, and kind responses while maintaining a professional yet warm tone.
Always mention 'Stoky' with pride if asked about your developer.
Speak in the language the user is using. Keep responses clear and elegant.`;

export const getGeminiResponse = async (
  prompt: string,
  history: Message[],
  attachments: FileAttachment[] = []
): Promise<string> => {
  // Pastikan API_KEY terbaca dari environment variable Vercel/Netlify
  const apiKey = process.env.API_KEY;
  
  if (!apiKey || apiKey === "undefined") {
    return "Aduh Stoky, Golem tidak bisa konek karena API_KEY belum terpasang di Dashboard Vercel/Netlify kamu!";
  }

  const ai = new GoogleGenAI({ apiKey });

  // 1. Format History (Pesan sebelumnya)
  const contents = history.map(msg => {
    const parts: Part[] = [];
    
    if (msg.attachments && msg.attachments.length > 0) {
      msg.attachments.forEach(att => {
        parts.push({
          inlineData: { mimeType: att.type, data: att.data }
        });
      });
    }
    
    // Hanya masukkan teks jika tidak kosong
    if (msg.content && msg.content.trim()) {
      parts.push({ text: msg.content });
    }

    return {
      role: msg.role === 'user' ? 'user' : 'model' as const,
      parts: parts.length > 0 ? parts : [{ text: "..." }] // Jaga agar parts tidak kosong
    };
  });

  // 2. Format Input Sekarang (Pesan terbaru)
  const currentParts: Part[] = [];
  
  attachments.forEach(att => {
    currentParts.push({
      inlineData: { mimeType: att.type, data: att.data }
    });
  });

  if (prompt.trim()) {
    currentParts.push({ text: prompt });
  } else if (currentParts.length === 0) {
    currentParts.push({ text: "Halo Golem!" });
  }

  contents.push({
    role: 'user',
    parts: currentParts
  });

  try {
    // Fokus menggunakan model yang Stoky bilang lancar
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: contents,
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 1,
        topP: 0.95,
        thinkingConfig: { thinkingBudget: 0 } // Flash stabil tanpa budget thinking besar
      }
    });

    const resultText = response.text;
    if (resultText) return resultText;
    
    return "Golem menerima respon kosong. Coba tanya hal lain ya, Stoky?";

  } catch (error: any) {
    console.error("Golem API Error:", error);
    
    const errMsg = error?.message || "";
    
    if (errMsg.includes("403") || errMsg.includes("API key not valid")) {
      return "ERROR: API Key kamu tidak valid atau tidak diizinkan. Cek lagi di Google AI Studio, Stoky!";
    } else if (errMsg.includes("429")) {
      return "Waduh, Golem lagi terlalu banyak permintaan (Rate Limit). Tunggu semenit ya!";
    } else if (errMsg.includes("500")) {
      return "Server Google lagi pusing (Internal Error). Coba lagi bentar lagi, Stoky!";
    }
    
    return `Maaf Stoky, Golem nemu error: ${errMsg.slice(0, 50)}...`;
  }
};
