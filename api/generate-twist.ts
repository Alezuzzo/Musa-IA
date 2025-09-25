import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    const { character, scenario } = request.body;

    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found');
    }

    const prompt = `Como um gerador de ideias criativas para artistas, crie um "twist" ou detalhe inusitado para a seguinte cena: Personagem: '${character}', Cenário: '${scenario}'. Retorne apenas o detalhe criativo em uma única frase.`;


    const geminiResponse = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      throw new Error('Failed to fetch from Gemini API');
    }

    const geminiData = await geminiResponse.json();

    const twist = geminiData.candidates[0].content.parts[0].text;


    return response.status(200).json({ twist });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}