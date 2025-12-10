import { GoogleGenAI, Chat } from "@google/genai";

let chatSession: Chat | null = null;

const SYSTEM_INSTRUCTION = `
You are "CyberGuard AI", an expert cybersecurity consultant. 
Your goal is to educate users about cyber threats, prevention, and safety in the digital world.
The user is viewing a website about Cyber Attacks (Phishing, Malware, Ransomware, DDoS, etc.) based on 2025 trends.
Answer questions in Thai language.
Keep answers concise, easy to understand for general users, but technically accurate.
If asked about performing attacks, refuse politely and pivot to defense/prevention.
Format important keywords in bold.
`;

export const getChatSession = (): Chat => {
  if (chatSession) return chatSession;

  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.error("API_KEY is missing from environment variables.");
    throw new Error("API Key is missing.");
  }

  const ai = new GoogleGenAI({ apiKey });
  
  chatSession = ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      temperature: 0.7,
    },
  });

  return chatSession;
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  try {
    const session = getChatSession();
    const result = await session.sendMessage({ message });
    return result.text || "ขออภัย ระบบไม่สามารถประมวลผลคำตอบได้ในขณะนี้";
  } catch (error) {
    console.error("Gemini Error:", error);
    return "เกิดข้อผิดพลาดในการเชื่อมต่อกับ CyberGuard AI กรุณาลองใหม่อีกครั้ง";
  }
};