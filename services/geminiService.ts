
import { GoogleGenAI, Type } from "@google/genai";
import type { DrugInfo } from "../types";

const SYSTEM_INSTRUCTION = `Tum ek medical helper ho jo user ko simple Hinglish me dawa ke baare me batata hai. 
User dawa ka naam likhega (jaise "paracitemol", "crocin", "montair LC", "amoxycillin") — vo English me likhega lekin bolne wali Hinglish style me. 

Tumhara kaam hai:
1. Dawa ka sahi naam pahchano (agar spelling galat ho to correct karo).
2. Batao ki ye dawa kis kaam ke liye hoti hai — lekin English ke bajaye Hinglish me samjhao (jaise “bukhar ke liye”, “dard kam karne ke liye”, “infection ke liye”, “allergy ke liye”).
3. Agar brand name ho to uska generic name bhi batao.
4. Ek line me safety ya dhyan dene wali baat likho (jaise “zyaada mat lo, liver ko nuksan ho sakta hai”).
5. Har jawab simple, short aur easy Hinglish me likho taaki aam aadmi samajh sake.
6. Agar dawa samajh nahi aaye to likho “mujhe ye dawa ka exact use confirm nahi hai” aur ek line batao “shayad ye galat spelling ya rare brand ho sakta hai”.

Output format:
{
  "input": "<user ne jo likha>",
  "dawa_ka_sahi_naam": "<correct name>",
  "brand_ya_generic": "<Brand ya Generic>",
  "use": "<kis kaam me aati hai - Hinglish me>",
  "safety_note": "<chhoti warning ya note - Hinglish me>",
  "confidence": "<0 se 1 tak kitna sure ho>"
}`;

const DRUG_INFO_SCHEMA = {
  type: Type.OBJECT,
  properties: {
    input: { type: Type.STRING },
    dawa_ka_sahi_naam: { type: Type.STRING },
    brand_ya_generic: { type: Type.STRING, enum: ["Brand", "Generic"] },
    use: { type: Type.STRING },
    safety_note: { type: Type.STRING },
    confidence: { type: Type.NUMBER },
  },
  required: ["input", "dawa_ka_sahi_naam", "brand_ya_generic", "use", "safety_note", "confidence"],
};

export const getDrugInfo = async (drugName: string): Promise<DrugInfo> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-2.5-pro",
    contents: drugName,
    config: {
      systemInstruction: SYSTEM_INSTRUCTION,
      responseMimeType: "application/json",
      responseSchema: DRUG_INFO_SCHEMA,
    },
  });
  
  try {
    const text = response.text.trim();
    // A simple check to handle cases where the model might return a non-JSON string
    if (text.startsWith("{") && text.endsWith("}")) {
      return JSON.parse(text) as DrugInfo;
    }
    // Handle model returning a plain string for "I don't know" cases
    return {
        input: drugName,
        dawa_ka_sahi_naam: "Unknown",
        brand_ya_generic: "Generic", // Default value
        use: text,
        safety_note: "Shayad ye galat spelling ya rare brand ho sakta hai.",
        confidence: 0.1,
    }
  } catch (e) {
    console.error("Failed to parse Gemini response:", response.text);
    throw new Error("Received an invalid response from the AI model.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const response = await ai.models.generateImages({
    model: 'imagen-4.0-generate-001',
    prompt: prompt,
    config: {
      numberOfImages: 1,
      outputMimeType: 'image/jpeg',
      aspectRatio: '1:1',
    },
  });

  if (response.generatedImages && response.generatedImages.length > 0) {
    const base64ImageBytes = response.generatedImages[0].image.imageBytes;
    return `data:image/jpeg;base64,${base64ImageBytes}`;
  }
  throw new Error("Image generation failed.");
};

export const generateVideo = async (
  prompt: string,
  image: { data: string; mimeType: string },
  aspectRatio: '16:9' | '9:16',
  updateStatus: (status: string) => void
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  updateStatus("Initializing video generation...");
  let operation = await ai.models.generateVideos({
    model: 'veo-3.1-fast-generate-preview',
    prompt: prompt,
    image: { imageBytes: image.data, mimeType: image.mimeType },
    config: {
      numberOfVideos: 1,
      resolution: '720p',
      aspectRatio: aspectRatio,
    }
  });

  updateStatus("Video generation started. This may take a few minutes...");

  const pollMessages = ["Processing request...", "Analyzing image...", "Composing video frames...", "Rendering video...", "Applying final touches...", "Almost there..."];
  let messageIndex = 0;

  while (!operation.done) {
    await new Promise(resolve => setTimeout(resolve, 10000));
    updateStatus(pollMessages[messageIndex % pollMessages.length]);
    messageIndex++;
    const pollingAi = new GoogleGenAI({ apiKey: process.env.API_KEY });
    operation = await pollingAi.operations.getVideosOperation({ operation: operation });
  }
  
  updateStatus("Video is ready! Fetching file...");

  const downloadLink = operation.response?.generatedVideos?.[0]?.video?.uri;
  if (!downloadLink) throw new Error("Video generation completed, but no download link was found.");

  const videoResponse = await fetch(`${downloadLink}&key=${process.env.API_KEY}`);
  if (!videoResponse.ok) throw new Error("Failed to download the generated video.");

  const videoBlob = await videoResponse.blob();
  return URL.createObjectURL(videoBlob);
};

export const fileToBase64 = (file: File): Promise<string> =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        const result = reader.result as string;
        resolve(result.split(',')[1]);
    }
    reader.onerror = (error) => reject(error);
  });
