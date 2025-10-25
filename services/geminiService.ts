import { GoogleGenAI, Chat } from '@google/genai';
import { Language, UserRole, HospitalData, ChatMode } from '../types';

if (!process.env.API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const getSystemInstruction = (lang: Language, role: UserRole, mode: ChatMode): string => {
  const langInstruction = lang === 'hi' ? 'You must respond only in Hindi.' : 'You must respond only in English.';

  if (mode === ChatMode.Help) {
    return `You are a first-response AI guide for disaster situations. Your goal is to provide clear, calm, and actionable advice. You are not a medical professional, so you must always preface medical advice with 'I am not a medical professional, but here is some general first-aid guidance you can consider:' and recommend contacting emergency services. Ask clarifying questions to understand the user's situation. You can analyze images of injuries or scenes. Keep your responses concise and easy to follow. Your primary goal is to help the user stay safe and manage the immediate situation until professional help arrives. Do not ask for personal identifying information like name or age unless it's critical for the immediate advice (e.g., child vs adult first aid). Do not attempt to summarize information into a JSON object. ${langInstruction}`;
  }

  // Default to ChatMode.QR
  if (role === UserRole.Volunteer) {
    return `You are a support bot for disaster relief volunteers. Your goal is to help them report issues or request assistance efficiently. Speak in simple, clear language. Ask one question at a time. ${langInstruction} First, ask for their name and current location. Then, ask what they need help with: reporting an incident, requesting supplies, or getting a situation update. Based on their answer, gather more details. Finally, you MUST summarize the information in a single JSON object with the following structure and nothing else: \`\`\`json\n{"volunteerName": "...", "location": "...", "issueType": "...", "details": "...", "urgency": "..."}\n\`\`\` 'issueType' must be one of 'Incident Report', 'Supply Request', or 'Information Request'. 'urgency' must be one of 'Low', 'Medium', or 'High'. Do not add any text before or after this JSON object.`;
  }
  
  return `You are 'ReliefBot', a calm and efficient AI assistant for disaster relief. Your goal is to quickly gather essential information from a person in distress. Speak in simple, clear language. Ask one question at a time. ${langInstruction} First, ask for their name, approximate age, and current location. Then, ask about their immediate needs (water, food, shelter). Then, ask if they are injured. If they are, ask them to describe the injury or say "UPLOAD_PHOTO" for them to upload a photo. After gathering all information, you MUST summarize it in a single JSON object with the following structure and nothing else: \`\`\`json\n{"name": "...", "age": ..., "location": "...", "needs": ["..."], "injuryDetails": "...", "photoAnalysis": ""}\n\`\`\` Do not add any text before or after this JSON object.`;
};

export const startChat = (lang: Language, role: UserRole, mode: ChatMode): Chat => {
  return ai.chats.create({
    model: 'gemini-2.5-flash',
    config: {
      systemInstruction: getSystemInstruction(lang, role, mode),
    },
  });
};

export const sendMessage = async (chat: Chat, message: string): Promise<string> => {
  try {
    const response = await chat.sendMessage({ message });
    return response.text;
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    throw new Error("Failed to get response from AI.");
  }
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: {
            parts: [
                {
                    inlineData: {
                        mimeType,
                        data: base64Image,
                    },
                },
                {
                    text: "Analyze this image from a disaster zone. Concisely describe any visible injuries (e.g., 'deep cut on forearm', 'burns on leg') or environmental hazards (e.g., 'collapsed structure', 'flooding'). Focus on facts. Maximum 50 words.",
                }
            ]
        }
    });
    return response.text;
  } catch (error) {
    console.error("Error analyzing image with Gemini:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const findNearbyHospitals = async (lat: number, lng: number): Promise<HospitalData[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: "Find the 5 nearest hospitals",
      config: {
        tools: [{googleMaps: {}}],
        toolConfig: {
          retrievalConfig: {
            latLng: {
              latitude: lat,
              longitude: lng,
            }
          }
        }
      },
    });

    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const hospitals: HospitalData[] = chunks
      .filter(chunk => chunk.maps && chunk.maps.uri && chunk.maps.title)
      .map(chunk => ({
        name: chunk.maps.title,
        mapsUri: chunk.maps.uri,
      }))
      .slice(0, 5); // Ensure we only ever return a maximum of 5 hospitals

    return hospitals;
  } catch (error) {
    console.error("Error finding hospitals with Gemini:", error);
    throw new Error("Failed to find nearby hospitals.");
  }
};