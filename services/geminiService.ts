
import { GoogleGenAI } from "@google/genai";

// API-ключ должен быть установлен как переменная окружения
const API_KEY = process.env.API_KEY;

let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API_KEY для Gemini не установлен. Функция забавных фактов будет отключена.");
}

export const getSnakeFunFact = async (): Promise<string> => {
  if (!ai) {
    return "API-ключ Gemini не настроен, поэтому я не могу сейчас получить забавный факт. Но змеи классные!";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: "Расскажи один короткий и удивительный забавный факт о змеях. В одном предложении.",
    });

    return response.text;
  } catch (error) {
    console.error("Ошибка при получении забавного факта от Gemini:", error);
    return "Не удалось получить забавный факт. Возможно, змеи слишком загадочны даже для ИИ!";
  }
};