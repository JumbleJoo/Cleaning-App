import { GoogleGenAI } from "@google/genai";
import { AspectRatio, ImageSize } from '../types';

export const checkApiKey = async (): Promise<boolean> => {
  if (window.aistudio && window.aistudio.hasSelectedApiKey) {
    return await window.aistudio.hasSelectedApiKey();
  }
  return false;
};

export const promptApiKeySelection = async () => {
  if (window.aistudio && window.aistudio.openSelectKey) {
    await window.aistudio.openSelectKey();
  } else {
    alert("API Key selection is not supported in this environment.");
  }
};

export const generateCustomImage = async (
  prompt: string,
  aspectRatio: AspectRatio,
  size: ImageSize
): Promise<string | null> => {
  try {
    // IMPORTANT: Create a new instance right before the call to ensure the latest key is used.
    // The prompt explicitly states checking window.aistudio.
    
    // We assume process.env.API_KEY is populated/injected correctly by the environment
    // after the user has selected their key via window.aistudio.
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: size,
        },
      },
    });

    if (response.candidates && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.data) {
          const base64EncodeString: string = part.inlineData.data;
          // Determine mime type if possible, defaulting to png if not provided in inlineData
          const mimeType = part.inlineData.mimeType || 'image/png';
          return `data:${mimeType};base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No image data found in response");

  } catch (error) {
    console.error("Gemini Image Gen Error:", error);
    throw error;
  }
};
