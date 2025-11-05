import { GoogleGenAI, Type } from "@google/genai";

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY is not defined in environment variables");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function generateMemeContent(base64Data: string, mimeType: string): Promise<{ topText: string; bottomText: string; post: string }> {
  try {
    const imagePart = {
      inlineData: {
        data: base64Data,
        mimeType: mimeType,
      },
    };

    const textPart = {
        text: `Analise esta imagem e gere conteúdo para um meme e um post de rede social.
        Seu objetivo é ser criativo, engraçado e gerar engajamento.
        Responda com um objeto JSON.
        
        O JSON deve ter EXATAMENTE a seguinte estrutura:
        {
          "topText": "Um texto curto e impactante para a parte de cima do meme.",
          "bottomText": "Um texto curto e impactante para a parte de baixo do meme.",
          "post": "Um texto para post de rede social (Instagram, Facebook) sobre a imagem, com um tom divertido, que chame a atenção e inclua 2 a 4 hashtags relevantes. O post deve ser coerente com o texto do meme."
        }`
    };

    const response = await ai.models.generateContent({
      model: 'gemini-flash-latest',
      contents: [{ parts: [imagePart, textPart] }],
      config: {
          responseMimeType: "application/json",
          responseSchema: {
              type: Type.OBJECT,
              properties: {
                  topText: { type: Type.STRING, description: "Texto para a parte superior do meme." },
                  bottomText: { type: Type.STRING, description: "Texto para a parte inferior do meme." },
                  post: { type: Type.STRING, description: "Legenda para rede social com hashtags." }
              },
              required: ["topText", "bottomText", "post"]
          }
      }
    });
    
    const jsonText = response.text.trim();
    const result = JSON.parse(jsonText);
    return result;

  } catch (error) {
    console.error("Error generating content with Gemini API:", error);
    throw new Error("Falha ao gerar conteúdo. Verifique sua conexão e a imagem enviada.");
  }
}
