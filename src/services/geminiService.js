import {GoogleGenerativeAI} from '@google/generative-ai';

const genAI = new GoogleGenerativeAI('AIzaSyCicBlxOcd7ALi2PIBntpufcGhtYAAahdA');

export const getExpenseAdvice = async expenses => {
  try {
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash-lite-001',
    });

    const prompt = `Kullanıcının harcama verilerine göre finansal tavsiyeler ver. Harcamalar: ${JSON.stringify(
      expenses,
    )}. Türkçe olarak yanıt ver.`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text();

    // "*" karakterlerini kaldır
    text = text.replace(/\*/g, '');

    return text;
  } catch (error) {
    console.error('Gemini API hatası:', error);
    return 'Tavsiye alınamadı.';
  }
};
