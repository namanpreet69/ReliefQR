
import { Language, UserRole, HospitalData, ChatMode, ChatMessage } from '../types';

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


export const sendMessage = async (messages: ChatMessage[], lang: Language, role: UserRole, mode: ChatMode): Promise<string> => {
    const lastMessage = messages[messages.length - 1];
    if (!lastMessage || lastMessage.sender !== 'user') {
        throw new Error("Last message must be from the user.");
    }
    
    // Convert ChatMessage[] to the format the Gemini API expects for history.
    const history = messages.slice(0, -1).map(msg => ({
        role: msg.sender === 'user' ? 'user' : 'model',
        parts: [{ text: msg.text }]
    }));

    try {
        const res = await fetch('/api/gemini', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                action: 'chat',
                payload: {
                    history,
                    message: lastMessage.text,
                    systemInstruction: getSystemInstruction(lang, role, mode)
                }
            })
        });

        if (!res.ok) {
            const errorData = await res.json();
            throw new Error(errorData.error || "API request failed");
        }

        const data = await res.json();
        return data.text;
    } catch (error) {
        console.error("Error sending message via proxy:", error);
        throw new Error("Failed to get response from AI.");
    }
};

export const analyzeImage = async (base64Image: string, mimeType: string): Promise<string> => {
  try {
    const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'analyzeImage',
            payload: { base64Image, mimeType }
        })
    });
    if (!res.ok) { 
      const errorData = await res.json();
      throw new Error(errorData.error || 'API request failed');
    }
    const data = await res.json();
    return data.text;
  } catch (error) {
    console.error("Error analyzing image with proxy:", error);
    throw new Error("Failed to analyze image.");
  }
};

export const findNearbyHospitals = async (lat: number, lng: number): Promise<HospitalData[]> => {
  try {
    const res = await fetch('/api/gemini', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            action: 'findNearbyHospitals',
            payload: { lat, lng }
        })
    });
    if (!res.ok) { 
      const errorData = await res.json();
      throw new Error(errorData.error || 'API request failed');
    }
    const data = await res.json();
    return data.hospitals;
  } catch (error) {
    console.error("Error finding hospitals with proxy:", error);
    throw new Error("Failed to find nearby hospitals.");
  }
};
