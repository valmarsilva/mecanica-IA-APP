
import { GoogleGenAI, Type, Modality } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

/**
 * Clean Code: Lógica de Negócio Automotiva Isolada
 * Segue o padrão SAE J1979 para decodificação de PIDs Mode 01.
 */
export const decodeOBD2Response = (pid: string, hex: string): number => {
  // Sanitização e Preparação
  const cleanedHex = hex.replace(/[^0-9A-F]/gi, ' ').trim();
  const bytes = cleanedHex.split(/\s+/).map(h => parseInt(h, 16));

  // A resposta padrão de um PID Mode 01 retorna 41 [PID] [BYTES...]
  // Pulamos os 2 primeiros bytes (41 e o PID)
  const A = bytes[2] ?? 0;
  const B = bytes[3] ?? 0;

  switch(pid.toUpperCase()) {
    case '010C': // RPM: ((A*256)+B)/4
      return Math.floor(((A * 256) + B) / 4);
    
    case '0105': // Temp: A - 40
      return A - 40;
    
    case '010D': // Velocidade: A
      return A;
      
    case '0111': // Throttle (Borboleta): A * 100 / 255
      return Math.round((A * 100) / 255);

    default:
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
    if (base64Audio) {
      return decodeBase64(base64Audio);
    }
    return null;
  } catch (error) {
    console.error("Erro ao gerar voz:", error);
    return null;
  }
};

export const getMechanicalExplanation = async (code: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explique ${code} estilo FIXD/Torque: 1. Gravidade. 2. Causa comum. 3. O que medir. Curto. Finalize: Análise primária, não conclusiva.`,
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
    return null;
  }
};

export const analyzePartImage = async (base64Image: string, mimeType: string) => {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { inlineData: { data: base64Image, mimeType: mimeType } },
        { text: "Identifique a peça e falha. Direto. Finalize: Análise primária, não conclusiva." }
      ],
    },
  });
  return response.text;
};

export const getWorkshopTip = async (code: string, partName: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Como mestre mecânico, dê uma dica técnica curta (máximo 20 palavras) sobre como testar ou verificar o componente "${partName}" relacionado ao código de falha "${code}". Seja direto e técnico.`,
    });
    return response.text || "Verifique as conexões elétricas e a integridade do chicote.";
  } catch (error) {
    console.error("Erro ao obter dica técnica:", error);
    return "Erro ao obter dica técnica.";
  }
};

export const getDetailedLesson = async (subject: string) => {
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview',
      contents: `Crie uma aula técnica detalhada sobre "${subject}" para mecânicos automotivos profissionais. Inclua: 1. Funcionamento básico. 2. Sintomas de falha. 3. Procedimento de diagnóstico (uso de multímetro ou osciloscópio). 4. Dicas de reparo. Use Markdown. Finalize sempre com: "Esta é uma aula gerada por IA para fins educacionais."`,
    });
    return response.text || "Conteúdo não disponível no momento.";
  } catch (error) {
    console.error("Erro ao gerar aula técnica:", error);
    return "Erro ao gerar aula técnica.";
  }
};
