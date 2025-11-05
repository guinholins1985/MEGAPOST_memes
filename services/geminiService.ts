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
        text: `Imagine que você é um roteirista de comédia genial, com um prazo apertado e três xícaras de café a mais na conta. Sua especialidade é o humor surreal, a quebra da quarta parede e piadas que fazem a pessoa rir e pensar 'de onde ele tirou isso?'.
        
        Analise esta imagem com esse olhar caótico e genial. Crie um meme que fuja do óbvio. Esqueça os clichês. Queremos algo que faria um roteirista de 'Rick and Morty' ou 'Monty Python' aplaudir.
        
        Sua missão:
        1.  Texto do Meme (topText/bottomText): Precisa ser curto, absurdamente engraçado e parecer uma revelação cósmica sobre uma situação cotidiana. Pense em diálogos inesperados, pensamentos internos bizarros ou legendas que ressignificam a imagem completamente.
        2.  Post para Redes Sociais (post): Elabore uma legenda que continue a piada do meme, como se fosse o bastidor da cena. Use um tom conspiratório ou exageradamente dramático. Inclua 2-4 hashtags que sejam tão estranhas e específicas quanto o meme (#RealidadeAlternativaDaSegundaFeira, #MeuEuInteriorDisseIsso, #FritandoNeurônios).
        
        Responda com um objeto JSON que tenha EXATAMENTE a seguinte estrutura:
        {
          "topText": "O texto mais bizarro e genial para o topo.",
          "bottomText": "O complemento perfeito e igualmente maluco para o fundo.",
          "post": "A legenda para a rede social, com 2-4 hashtags únicas e hilárias."
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