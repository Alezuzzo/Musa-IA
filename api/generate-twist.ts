// api/generate-twist.ts
import type { VercelRequest, VercelResponse } from '@vercel/node';

// A função principal que será executada
export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  // 1. Apenas permite requisições do tipo POST
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Only POST requests allowed' });
  }

  try {
    // 2. Pega o personagem e o cenário enviados pelo nosso App React
    const { character, scenario } = request.body;

    // 3. Pega a nossa chave de API secreta do ambiente do servidor
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error('API key not found');
    }

    // 4. Monta o prompt que enviaremos para o Gemini
    const prompt = `Como um gerador de ideias criativas para artistas, crie um "twist" ou detalhe inusitado para a seguinte cena: Personagem: '${character}', Cenário: '${scenario}'. Retorne apenas o detalhe criativo em uma única frase.`;

    // 5. Faz a chamada para a API do Gemini
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

    // 6. Extrai o texto da resposta do Gemini
    const twist = geminiData.candidates[0].content.parts[0].text;

    // 7. Envia o twist de volta para o nosso App React
    return response.status(200).json({ twist });

  } catch (error) {
    console.error(error);
    return response.status(500).json({ message: 'Internal Server Error' });
  }
}