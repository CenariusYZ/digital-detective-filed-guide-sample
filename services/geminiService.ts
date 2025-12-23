
import { GoogleGenAI, Type } from "@google/genai";
import { AnalysisResult, SourceLink } from "../types";

export const analyzeNews = async (content: string): Promise<AnalysisResult> => {
  // Initialize AI right before the call to ensure it uses the current environment context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const response = await ai.models.generateContent({
    model: 'gemini-3-flash-preview',
    contents: `Act as a professional disinformation analyst. Apply the 'Tri-Lens Protocol' to evaluate this news text: "${content}". 
    
    Instructions:
    1. Atomization: Extract core factual claims.
    2. Lens A (Source): Evaluate credibility. Use Google Search to verify mentioned entities.
    3. Lens B (Fact): Evaluate verifiability against current web data.
    4. Lens C (Logic): Evaluate reasoning and fallacies.
    5. Red Flag System: If ANY lens has a major flaw, the verdict is RED. If there are minor warnings, YELLOW. Otherwise GREEN.
    
    IMPORTANT: You MUST return valid JSON.`,
    config: {
      tools: [{ googleSearch: {} }],
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          claims: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                text: { type: Type.STRING }
              },
              required: ["id", "text"]
            }
          },
          sourceLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: "One of: Verified, Anonymous, Fabricated" },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          factLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: "One of: Solid Evidence, Vague, Contradictory" },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          logicLens: {
            type: Type.OBJECT,
            properties: {
              status: { type: Type.STRING, description: "One of: Logical, Emotional, Fallacious" },
              details: { type: Type.STRING },
              isRedFlag: { type: Type.BOOLEAN }
            }
          },
          verdict: { type: Type.STRING, description: "One of: GREEN, YELLOW, RED" },
          summary: { type: Type.STRING }
        },
        required: ["claims", "sourceLens", "factLens", "logicLens", "verdict", "summary"]
      }
    }
  });

  const text = response.text || '{}';
  const result = JSON.parse(text) as AnalysisResult;
  
  const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
  if (groundingChunks) {
    const sources: SourceLink[] = groundingChunks
      .map((chunk: any) => chunk.web)
      .filter((web: any) => web && web.uri && web.title)
      .map((web: any) => ({
        uri: web.uri,
        title: web.title
      }));
    
    result.groundingSources = Array.from(new Map(sources.map(s => [s.uri, s])).values());
  }

  return result;
};
