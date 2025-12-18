
import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const getVehicleSpecs = async (make: string, model: string, year: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um Agente Autônomo de Busca Técnica Automotiva. 
      Com base na Marca: ${make}, Modelo: ${model} e Ano: ${year}, retorne uma lista de variantes de motorização e combustíveis que realmente existiram no mercado para este carro.
      Retorne as variantes de forma concisa.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            engines: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exemplos: 1.0 8v, 1.6 MSI, 2.0 Turbo, 1.4 TSI"
            },
            fuels: {
              type: Type.ARRAY,
              items: { type: Type.STRING },
              description: "Exemplos: Flex, Gasolina, GNV, Diesel, Álcool"
            }
          },
          required: ["engines", "fuels"]
        }
      }
    });

    return JSON.parse(response.text || '{"engines":[], "fuels":[]}');
  } catch (error) {
    console.error("Erro ao buscar especificações do veículo:", error);
    return { engines: ["1.0", "1.6", "2.0"], fuels: ["Flex", "Gasolina", "Diesel", "GNV", "Álcool"] };
  }
};

export const getMechanicalExplanation = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Você é um mestre mecânico sênior. Explique o código OBD2 ${code}. 
      Além da explicação básica, forneça especificações técnicas de referência (voltagens, resistências, pressões) para teste com multímetro ou ferramentas, e um passo a passo para confirmar se a peça está realmente com defeito.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            code: { type: Type.STRING },
            explanation: { type: Type.STRING },
            technicalSpecs: {
              type: Type.OBJECT,
              properties: {
                tool: { type: Type.STRING, description: "Ferramenta recomendada (ex: Multímetro)" },
                referenceValue: { type: Type.STRING, description: "Valor esperado se a peça estiver boa" },
                procedure: { type: Type.STRING, description: "Onde colocar as pontas de prova" }
              }
            },
            causes: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  part: { type: Type.STRING },
                  probability: { type: Type.NUMBER },
                  reason: { type: Type.STRING }
                }
              }
            },
            repairSteps: {
              type: Type.ARRAY,
              items: { type: Type.STRING }
            }
          },
          required: ["code", "explanation", "technicalSpecs", "causes", "repairSteps"]
        }
      }
    });

    return JSON.parse(response.text || '{}');
  } catch (error) {
    console.error("Error fetching AI explanation:", error);
    return null;
  }
};

export const getWorkshopTip = async (code: string, partName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `O carro apresenta o erro ${code}. O aluno clicou na peça "${partName}". 
      Dê uma dica curta e direta de mestre (máximo 2 frases) sobre como inspecionar ou por que essa peça pode ser a culpada. 
      Use uma linguagem de oficina, mas profissional.`,
    });
    return response.text;
  } catch (error) {
    console.error("Error fetching workshop tip:", error);
    return "Verifique as conexões e o estado físico da peça em busca de danos visíveis.";
  }
};

export const analyzePartImage = async (base64Image: string, mimeType: string, vehicleInfo?: string) => {
  try {
    const vehicleContext = vehicleInfo ? `O veículo analisado é um ${vehicleInfo}.` : 'O veículo não foi especificado.';
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: `Você é o "Mestre Olho Vivo", um mecânico especialista. ${vehicleContext} 
            Analise esta imagem de uma peça automotiva. 
            1. Identifique a peça ou componente.
            2. Descreva o estado (desgaste, vazamento, oxidação, carbonização ou OK).
            3. Dê uma recomendação técnica curta. 
            Seja direto e use termos de oficina.`,
          },
        ],
      },
    });
    
    let text = "";
    for (const part of response.candidates[0].content.parts) {
      if (part.text) {
        text += part.text;
      }
    }
    return text;
  } catch (error) {
    console.error("Error analyzing image:", error);
    return "Não foi possível analisar a imagem. Certifique-se de que a peça está bem iluminada e visível.";
  }
};
