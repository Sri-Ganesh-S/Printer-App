
import { GoogleGenAI, Type } from "@google/genai";

// FIX: The API key must be obtained exclusively from `process.env.API_KEY`.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface PdfDetails {
  pageCount: number;
  summary: string;
}

export const getPdfDetails = async (pdfBase64: string): Promise<PdfDetails> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          parts: [
            {
              inlineData: {
                mimeType: 'application/pdf',
                data: pdfBase64,
              },
            },
            {
              text: 'Analyze this PDF document. Provide a one-sentence summary of its content and count the total number of pages. Respond with only a JSON object.',
            },
          ],
        },
      ],
      config: {
        responseMimeType: 'application/json',
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            pageCount: {
              type: Type.INTEGER,
              description: 'The total number of pages in the document.',
            },
            summary: {
              type: Type.STRING,
              description: 'A concise, one-sentence summary of the document content.',
            },
          },
          required: ['pageCount', 'summary'],
        },
      },
    });

    const jsonString = response.text.trim();
    const parsedJson = JSON.parse(jsonString);
    return parsedJson as PdfDetails;

  } catch (error) {
    console.error("Error analyzing PDF with Gemini:", error);
    throw new Error("Failed to analyze PDF. Please try again with a different file.");
  }
};
