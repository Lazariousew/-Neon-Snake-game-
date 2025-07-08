
import { GoogleGenAI } from "@google/genai";

// API-ключ должен быть получен из переменных окружения.
// В браузерной среде без системы сборки `process` не определен.
// Эта проверка предотвращает сбой приложения.
const API_KEY = (typeof process !== 'undefined' && process.env) ? process.env.API_KEY : undefined;


let ai: GoogleGenAI | null = null;
if (API_KEY) {
  ai = new GoogleGenAI({ apiKey: API_KEY });
} else {
  console.warn("API-ключ для Gemini не найден. Функция забавных фактов будет отключена. Этот проект не использует систему сборки, поэтому переменные окружения (process.env) недоступны.");
}

export const getSnakeFunFact = async (): Promise<string> => {
  if (!ai) {
    return "Ключ API для Gemini не настроен. Не могу получить забавный факт. Но змеи все равно крутые!";
  }
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-preview-04-17',
      contents: "Расскажи один короткий и удивительный забавный факт о змеях. В одном предложении.",
    });
    
    const text = response.text;
    if (!text) {
        return "Не удалось получить забавный факт. Ответ от API был пустым.";
    }
    return text;

  } catch (error) {
    console.error("Ошибка при получении забавного факта от Gemini:", error);
    return "Не удалось получить забавный факт. Возможно, змеи слишком загадочны даже для ИИ!";
  }
};
