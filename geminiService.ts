
import { GoogleGenAI, Type, Modality } from "@google/genai";

// Proteção contra erro de referência se process não estiver definido no navegador
const getApiKey = () => {
  try {
    return process.env.API_KEY || "";
  } catch (e) {
    return "";
  }
};

const ai = new GoogleGenAI({ apiKey: getApiKey() });

/**
 * Decodificador OBD2 Robusto
 * Segue o padrão SAE J1979 com tratamento de erros de string HEX.
 */
export const decodeOBD2Response = (pid: string, hex: string): number => {
  try {
    const cleanedHex = hex.replace(/[^0-9A-F]/gi, ' ').trim();
    const bytes = cleanedHex.split(/\s+/).map(h => parseInt(h, 16));

    if (bytes.length < 3) return 0;

    const A = bytes[2] ?? 0;
    const B = bytes[3] ?? 0;

    switch(pid.toUpperCase()) {
      case '010C': // RPM: ((A*256)+B)/4
        return Math.floor(((A * 256) + B) / 4);
      case '0105': // Temp: A - 40
        return A - 40;
      case '010D': // Velocidade: A
        return A;
      case '0111': // Throttle: A * 100 / 255
        return Math.round((A * 100) / 255);
      default:
        return 0;
    }
  } catch (e) {
    console.error("Erro na decodificação OBD2:", e);
    return 0;
  }
};

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

function decodeBase64(base64: string) {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

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

export const analyzePartImage = async (base64Image: string, mimeType: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          { inlineData: { data: base64Image, mimeType: mimeType } },
          { text: "Identifique a peça e falha. Direto." }
        ],
      },
    });
    return response.text;
  } catch (e) {
    return "Falha na análise visual. Verifique a iluminação.";
  }
};

export const getWorkshopTip = async (code: string, part: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Você é um mecânico master. O veículo tem o código de falha ${code}. O usuário clicou no componente ${part}. Dê uma dica curta, técnica e prática (máximo 2 frases) de como testar ou o que observar especificamente neste componente para este código.`,
    });
    return response.text || "Verifique as conexões e integridade física do componente.";
  } catch (error) {
    return "Analise o chicote e conectores do componente.";
  }
};

export const getDetailedLesson = async (title: string): Promise<string> => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Gere um manual técnico profissional e detalhado sobre: ${title}. 
      O público são mecânicos automotivos. 
      Estrutura: 
      1. Funcionamento Técnico.
      2. Principais Sintomas de Falha.
      3. Procedimentos de Diagnóstico e Teste (valores de referência).
      4. Dicas de Reparo.
      Use Markdown.`,
    });
    return response.text || "Conteúdo técnico indisponível no momento.";
  } catch (error) {
    return "Erro ao carregar o manual técnico. Verifique sua conexão.";
  }
};
