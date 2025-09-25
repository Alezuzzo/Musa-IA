
interface PromptDisplayProps {
  label: string;
  value: string;
}

export function PromptDisplay({ label, value }: PromptDisplayProps) {
  return (
    <div>
      <strong>{label}:</strong>
      <p>{value || "Aguardando geração..."}</p> 
    </div>
  );
}