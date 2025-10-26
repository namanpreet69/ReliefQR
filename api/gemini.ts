
import type { VercelRequest, VercelResponse } from '@vercel/node';
import { GoogleGenAI, Content } from '@google/genai';

const API_KEY = process.env.GEMINI_API_KEY;

if (!API_KEY) {
    throw new Error("GEMINI_API_KEY environment variable not set.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const runChat = async (history: Content[], newMessage: string, systemInstruction: string) => {
    const chat = ai.chats.create({
        model: 'gemini-2.5-flash',
        config: { systemInstruction },
        history,
    });
    const result = await chat.sendMessage({ message: newMessage });
    return result.text;
};

export default async function handler(req: VercelRequest, res: VercelResponse) {
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Method Not Allowed' });
    }

    try {
        const { action, payload } = req.body;

        switch (action) {
            case 'chat': {
                const { history, message, systemInstruction } = payload;
                const responseText = await runChat(history, message, systemInstruction);
                return res.status(200).json({ text: responseText });
            }

            case 'analyzeImage': {
                const { base64Image, mimeType } = payload;
                const response = await ai.models.generateContent({
                    model: 'gemini-2.5-flash',
                    contents: {
                        parts: [
                            { inlineData: { mimeType, data: base64Image } },
                            { text: "Analyze this image from a disaster zone. Concisely describe any visible injuries (e.g., 'deep cut on forearm', 'burns on leg') or environmental hazards (e.g., 'collapsed structure', 'flooding'). Focus on facts. Maximum 50 words." }
                        ]
                    }
                });
                return res.status(200).json({ text: response.text });
            }

            case 'findNearbyHospitals': {
                const { lat, lng } = payload;
                const response = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: "Find the 5 nearest hospitals",
                    config: {
                        tools: [{ googleMaps: {} }],
                        toolConfig: {
                            retrievalConfig: {
                                latLng: { latitude: lat, longitude: lng }
                            }
                        }
                    },
                });
                
                const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
                const hospitals = chunks
                    .filter(chunk => chunk.maps && chunk.maps.uri && chunk.maps.title)
                    .map(chunk => ({
                        name: chunk.maps.title,
                        mapsUri: chunk.maps.uri,
                    }))
                    .slice(0, 5);
                
                return res.status(200).json({ hospitals });
            }

            default:
                return res.status(400).json({ error: 'Invalid action' });
        }
    } catch (error) {
        console.error('Error processing Gemini request:', error);
        const errorMessage = error instanceof Error ? error.message : 'An internal server error occurred.';
        return res.status(500).json({ error: errorMessage });
    }
}
