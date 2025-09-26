// DENTRO DE: /api/generate-twist.ts

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  request: VercelRequest,
  response: VercelResponse,
) {
  if (request.method !== 'POST') {
    return response.status(405).json({ message: 'Apenas requisições POST são permitidas' });
  }

  try {
    const { character, scenario } = request.body;

    if (!character || !scenario) {
      return response.status(400).json({ error: 'Parâmetros "character" e "scenario" são obrigatórios' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      // Este log aparecerá nos logs da Vercel se a chave não for encontrada
      console.error("ERRO CRÍTICO: GEMINI_API_KEY não foi encontrada no ambiente.");
      throw new Error("Configuração do servidor incompleta.");
    }
    
    // Usaremos o modelo estável 'gemini-1.0-pro'. A versão 'v1' é mais estável que a 'v1beta'.
    const GOOGLE_API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.0-pro:generateContent?key=${apiKey}`;

    const prompt = `Como um gerador de ideias criativas para artistas, crie um "twist" ou detalhe inusitado para a seguinte cena: Personagem: '${character}', Cenário: '${scenario}'. Retorne apenas o detalhe criativo em uma única frase.`;

    // Fazendo a chamada direta para a API do Google com fetch
    const geminiResponse = await fetch(GOOGLE_API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        contents: [{ parts: [{ text: prompt }] }],
      }),
    });

    if (!geminiResponse.ok) {
      // Se a resposta do Google não for OK, vamos logar o erro exato
      const errorBody = await geminiResponse.json();
      console.error("Erro retornado pela API do Google:", errorBody);
      throw new Error("A API do Google retornou um erro.");
    }

    const data = await geminiResponse.json();
    
    // Extraindo o texto da resposta
    const twist = data.candidates[0].content.parts[0].text;
    
    return response.status(200).json({ twist });

  } catch (error) {
    console.error("Erro geral na função da API:", error);
    return response.status(500).json({ message: "Erro interno no servidor." });
  }
}