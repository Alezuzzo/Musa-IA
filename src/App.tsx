import { useState } from 'react';
import { Header } from './components/Header';
import { PromptDisplay } from './components/PromptGenerator/PromptDisplay';
import { GenerateButton } from './components/PromptGenerator/GenerateButton';
import './App.css';

const characterList = ["Um astronauta medroso", "Um cavaleiro feito de queijo", "Uma lula que é chef de cozinha", "Um robô jardineiro", "Uma gata detetive"];
const scenarioList = ["Numa biblioteca em Marte", "No fundo de um vulcão de chocolate", "Numa cidade nas nuvens", "Dentro de um videogame antigo", "Num navio pirata fantasma"];

function App() {
  const [character, setCharacter] = useState<string>('');
  const [scenario, setScenario] = useState<string>('');
  const [creativeTwist, setCreativeTwist] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);


  const handleGenerateClick = async () => {
    setIsLoading(true);
    setError(null);
    setCreativeTwist(''); 

    const randomCharacter = characterList[Math.floor(Math.random() * characterList.length)];
    const randomScenario = scenarioList[Math.floor(Math.random() * scenarioList.length)];
    setCharacter(randomCharacter);
    setScenario(randomScenario);

    try {
      const response = await fetch('/api/generate-twist', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ character: randomCharacter, scenario: randomScenario }),
      });

      if (!response.ok) {
        throw new Error('A Musa-IA está com dor de cabeça. Tente novamente.');
      }
      
      const data = await response.json();
      

      setCreativeTwist(data.twist);

    } catch (err: unknown) {
      console.error("Erro ao chamar a API:", err);
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError("Algo deu muito errado. Verifique o console.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleCopyClick = () => {
    if (!character) return; 
    
    const fullPrompt = `Personagem: ${character}\nCenário: ${scenario}\nTwist: ${creativeTwist}`;
    navigator.clipboard.writeText(fullPrompt);
    alert("Ideia copiada para a área de transferência!");
  };


  return (
    <main className="app-container">
      <Header />
      
      <section className="generator-body">
        {character && (
          <>
            <PromptDisplay label="Personagem" value={character} />
            <PromptDisplay label="Cenário" value={scenario} />
          </>
        )}

        {isLoading && (
          <PromptDisplay label="✨ O Twist Criativo (IA)" value="Musa-IA está buscando inspiração..." />
        )}

        {error && (
          <div className="error-message">{error}</div>
        )}

        {creativeTwist && !isLoading && (
          <PromptDisplay label="✨ O Twist Criativo (IA)" value={creativeTwist} />
        )}
        
        {!character && !isLoading && !error && (
          <p className="welcome-message">Clique no botão abaixo para invocar a Musa-IA e gerar sua primeira ideia!</p>
        )}
      </section>

      <div className="actions-container">
        <GenerateButton 
          onGenerateClick={handleGenerateClick} 
          isLoading={isLoading} 
        />

        {character && !isLoading && (
          <button onClick={handleCopyClick} className="copy-button">
            Copiar Ideia
          </button>
        )}
      </div>
    </main>
  );
}

export default App;