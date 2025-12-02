import { GoogleGenAI } from "@google/genai";
import { UploadedImage } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const SYSTEM_INSTRUCTION = `
You are an expert Social Media Manager for 'ACC Furniture', a high-quality furniture factory based in China.
Your goal is to write professional, engaging, and trustworthy Facebook posts targeting international B2B clients (wholesalers, retailers, interior designers, and distributors).

Key Information to Include:
- Factory location: China
- Business Type: Factory Direct / Manufacturer
- Contact Phone: +86 13515886669
- Email: accfurniture@163.com

Style Guidelines:
- Tone: Professional, confident, industrial yet stylish.
- Focus: Manufacturing quality, capacity, design details, and export readiness.
- Structure: Catchy headline, body text explaining the furniture shown, and a clear Call to Action (CTA) with contact info.
- Hashtags: Use relevant tags like #FurnitureFactory #ChinaExport #InteriorDesign #B2B #CustomFurniture #ACCFurniture.
`;

export const generateFacebookPost = async (images: UploadedImage[]): Promise<string> => {
  try {
    // Prepare image parts for Gemini
    const imageParts = images.map(img => ({
      inlineData: {
        mimeType: img.mimeType,
        data: img.base64
      }
    }));

    // Construct the prompt
    const prompt = `
      Analyze these ${images.length} images of our furniture products.
      Write a compelling Facebook post to attract foreign buyers.
      
      Specific instructions:
      1. Describe the style and material quality seen in the images.
      2. Emphasize that we are a direct factory offering competitive prices.
      3. End clearly with the provided contact details.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: {
        parts: [
          ...imageParts,
          { text: prompt }
        ]
      },
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
        temperature: 0.7, // Slightly creative but professional
      }
    });

    return response.text || "Failed to generate content. Please try again.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("Failed to connect to AI service.");
  }
};
