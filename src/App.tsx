// src/App.tsx
import { useState } from "react";
import "./App.css";
import { Header } from "./components/Header";
import { GenerateButton } from "./components/PromptGenerator/GenerateButton";
import { PromptDisplay } from "./components/PromptGenerator/PromptDisplay";

const characterList = [
  "Um astronauta medroso",
  "Um cavaleiro feito de queijo",
  "Uma lula que é chef de cozinha",
  "Um robô jardineiro",
];
const scenarioList = [
  "Numa biblioteca em Marte",
  "No fundo de um vulcão de chocolate",
  "Numa cidade nas nuvens",
  "Dentro de um videogame antigo",
];

function App() {
  // Dados "falsos" por enquanto
  const [character, setCharacter] = useState<string>("");
  const [scenario, setScenario] = useState<string>();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleGenerateClick = () => {
    setIsLoading(true);

    setTimeout(() => {
      const randomCharacter =
        characterList[
          Math.floor(Math.random() * characterList.length)
        ];
      const randomScenario =
        scenarioList[Math.floor(Math.random() * scenarioList.length)];

      setCharacter(randomCharacter);
      setScenario(randomScenario);

      setIsLoading(false);
    }, 500);
  };

  return (
    <main>
      <Header />
      <section className="generator-body">
        <PromptDisplay label="Personagem" value={character} />
        <PromptDisplay label="Cenário" value={scenario ?? ""} />
        <GenerateButton onGenerateClick={handleGenerateClick} isLoading={isLoading} />
      </section>
    </main>
  );
}

export default App;
