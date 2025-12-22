export interface Window {
    getCurrentUser?: () => string | null;
    setCurrentUser?: (val: string) => void;
    clearCurrentUser?: () => void;
    getScoreboard?: () => any[];
    renderScoreboardRow?: (name: string, score: number, idx: number, icon: string) => HTMLTableRowElement;
    startGame?: (target: string) => void;
    checkCurrentUser?: (e?: Event) => boolean;
    logout?: () => void;
}

export enum GamePath {
    NumberGuessing = './games/number_guessing.html',
    Clicker = './games/clicker.html',
    RockPaperScissors = './games/rock_paper_scissors.html'
}
