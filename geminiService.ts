
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Initialize the Google GenAI SDK
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Decodificador OBD2 Robusto
 */
export const decodeOBD2Response = (pid: string, hex: string): number => {
  try {
    const cleanedHex = hex.replace(/[^0-9A-F]/gi, ' ').trim();
    const bytes = cleanedHex.split(/\s+/).map(h => parseInt(h, 16));

    if (bytes.length < 3) return 0;

    const A = bytes[2] ?? 0;
    const B = bytes[3] ?? 0;

    switch(pid.toUpperCase()) {
      case '010C': return Math.floor(((A * 256) + B) / 4);
      case '0105': return A - 40;
      case '010D': return A;
      case '0111': return Math.round((A * 100) / 255);
      default: return 0;
    }
  } catch (e) {
    console.error("Erro na decodificação OBD2:", e);
    return 0;
  }
};

/**
 * Decodes raw PCM audio data for browser playback
 */
export async function decodeAudioData(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number,
  numChannels: number,
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}

/**
 * Internal base64 decoder
 */
function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

/**
 * Analisa imagem de uma peça física
 * FIX: Added missing exported function to resolve import error in DiagnosisScreen.tsx
 */
export const analyzePartImage = async (base64Image: string, mimeType: string = 'image/jpeg') => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: {
        parts: [
          {
            inlineData: {
              data: base64Image,
              mimeType: mimeType,
            },
          },
          {
            text: 'Identifique esta peça automotiva e descreva sua função técnica principal. Seja breve e preciso.',
          },
        ],
      },
    });
    return response.text;
  } catch (error) {
    console.error("Erro na análise de imagem:", error);
    return "Não foi possível identificar a peça.";
  }
};

/**
 * Generates text-to-speech audio for technical analysis
 */
export const generateSpeech = async (text: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash-preview-tts",
      contents: [{ parts: [{ text: `Diga de forma curta, técnica e direta: ${text}. Encerre com: "Esta é uma análise primária."` }] }],
      config: {
        responseModalities: [Modality.AUDIO],
        speechConfig: {
          voiceConfig: {
            prebuiltVoiceConfig: { voiceName: 'Puck' },
          },
        },
      },
    });

    const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
    return base64Audio ? decodeBase64(base64Audio) : null;
  } catch (error) {
    return null;
  }
};

/**
 * Get detailed mechanical explanation using structured JSON schema
 */
export const getMechanicalExplanation = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique ${code} estilo FIXD/Torque: 1. Gravidade. 2. Causa comum. 3. O que medir. Curto.`,
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
                tool: { type: Type.STRING },
                referenceValue: { type: Type.STRING },
                procedure: { type: Type.STRING }
              }
            },
            causes: { type: Type.ARRAY, items: { type: Type.OBJECT, properties: { part: { type: Type.STRING }, probability: { type: Type.NUMBER } } } },
            repairSteps: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["code", "explanation", "technicalSpecs", "causes", "repairSteps"]
        }
      }
    });
    return JSON.parse(response.text || '{}');
  } catch (error) {
    return { code, explanation: "Erro na consulta. Verifique fisicamente.", causes: [], technicalSpecs: {} };
  }
};

/**
 * ENGINE GPT 5.2 - Gerador Multimodal Avançado
 * Cria manuais técnicos (PDF sim) e busca indicações de vídeos de canais autorizados.
 */
export const generateMultimodalModule = async (topic: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Gere um conteúdo técnico multimodal avançado sobre "${topic}" para mecânicos profissionais.
      Fontes de referência autorizadas: Doutor IE, Revista O Mecânico, Mecânica Online.
      
      Retorne um JSON seguindo esta estrutura:
      - description: Manual técnico detalhado em Markdown (Mínimo 500 palavras, com tabelas de valores).
      - videoUrl: URL real ou simulada de um vídeo de alta qualidade de um dos canais citados.
      - category: Uma das seguintes: MECANICA, ELETRICA, ELETRONICA.
      - keyLearningPoints: Lista de 3 pontos fundamentais.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            description: { type: Type.STRING },
            videoUrl: { type: Type.STRING },
            category: { type: Type.STRING },
            keyLearningPoints: { type: Type.ARRAY, items: { type: Type.STRING } }
          },
          required: ["description", "videoUrl", "category", "keyLearningPoints"]
        }
      }
    });
    
    return JSON.parse(response.text || '{}');
  } catch (e) {
    console.error("Erro na geração multimodal:", e);
    return null;
  }
};

/**
 * Get technical workshop tips for specific components
 */
export const getWorkshopTip = async (code: string, part: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um mecânico master. O veículo tem o código de falha ${code}. O usuário clicou no componente ${part}. Dê uma dica curta, técnica e prática.`,
    });
    return response.text || "Verifique as conexões físicas.";
  } catch (error) {
    return "Analise o chicote do componente.";
  }
};

/**
 * Get detailed Markdown lessons for car components
 */
export const getDetailedLesson = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Gere um manual técnico profissional sobre: ${title}. Use Markdown.`,
    });
    return response.text || "Conteúdo técnico indisponível.";
  } catch (error) {
    return "Erro ao carregar manual.";
  }
};
