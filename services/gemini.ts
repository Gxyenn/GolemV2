import { Message, FileAttachment } from "../types";

export async function getGeminiResponse(
  prompt: string,
  history: Message[],
  attachments: FileAttachment[] = []
): Promise<string> {

  const contents = history.map(msg => ({
    role: msg.role === "user" ? "user" : "model",
    parts: [{ text: msg.content }]
  }));

  contents.push({
    role: "user",
    parts: [{ text: prompt }]
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