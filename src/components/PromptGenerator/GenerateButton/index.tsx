interface GenerateButtonProps{
    onGenerateClick: ()=> void;
    isLoading: boolean;
}

export function GenerateButton({onGenerateClick, isLoading}: GenerateButtonProps){
    return(
        <div><button onClick={onGenerateClick} disabled={isLoading}>{isLoading ? 'Gerando...' : 'Gerar Ideia'}</button></div>
    );
}