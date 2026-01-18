import { Message, FileAttachment } from "../types";

export async function getGeminiResponse(
  prompt: string,
  history: Message[],
  attachments: FileAttachment[] = []
): Promise<string> {

  const contents = history.map(msg => {
    const parts: any[] = [];

    if (msg.attachments?.length) {
      msg.attachments.forEach(att => {
        parts.push({
          inlineData: {
            mimeType: att.type,
            data: att.data
          }
        });
      });
    }

    if (msg.content?.trim()) {
      parts.push({ text: msg.content });
    }

    return {
      role: msg.role === "user" ? "user" : "model",
      parts: parts.length ? parts : [{ text: "..." }]
    };
  });

  // pesan baru
  const currentParts: any[] = [];

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
  }

  contents.push({
    role: "user",
    parts: currentParts
  });

  const res = await fetch("/api/chat", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ contents })
  });

  const data = await res.json();

  if (!res.ok || data.error) {
    throw new Error(data.error || "Failed to get Gemini response");
  }

  return data.text;
}