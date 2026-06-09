export type GameId = 'tic-tac-toe' | 'snake' | 'number-duel' | 'sambung-kata';

export interface GameInfo {
  id: GameId;
  name: string;
  description: string;
  icon: string;
  players: string;
  path: string;
}

export type ThemeMode = 'light' | 'dark' | 'system';

export interface AppSettings {
  theme: ThemeMode;
  soundEnabled: boolean;
  hapticEnabled: boolean;
}

export interface GameStatistics {
  gameId: GameId;
  gamesPlayed: number;
  gamesWon: number;
  gamesLost: number;
  gamesDrawn: number;
  highScore: number;
  totalScore: number;
  bestTime?: number;
  lastPlayed?: string;
}

export interface GameHistoryEntry {
  id: string;
  gameId: GameId;
  result: 'win' | 'loss' | 'draw';
  score: number;
  timestamp: string;
  details?: string;
}

export type TicTacToeCell = 'X' | 'O' | null;
export type TicTacToeBoard = TicTacToeCell[];
export type TicTacToePlayer = 'X' | 'O';

export interface TicTacToeState {
  board: TicTacToeBoard;
  currentPlayer: TicTacToePlayer;
  winner: TicTacToePlayer | 'draw' | null;
  scores: {
    X: number;
    O: number;
    draws: number;
  };
  winningLine: number[] | null;
}

export type SnakeDirection = 'UP' | 'DOWN' | 'LEFT' | 'RIGHT';

export interface SnakeState {
  snake: { x: number; y: number }[];
  food: { x: number; y: number };
  direction: SnakeDirection;
  nextDirection: SnakeDirection;
  gameOver: boolean;
  score: number;
  highScore: number;
  isPaused: boolean;
  speed: number;
  gridSize: number;
}

export interface NumberDuelState {
  player1Secret: number | null;
  player2Secret: number | null;
  currentPlayer: 1 | 2;
  range: { min: number; max: number };
  guesses: NumberDuelGuess[];
  winner: 1 | 2 | null;
  gamePhase: 'setup' | 'playing' | 'finished';
  player1Name: string;
  player2Name: string;
}

export interface NumberDuelGuess {
  player: 1 | 2;
  number: number;
  result: 'correct' | 'too-high' | 'too-low';
  timestamp: number;
}

export type NumberDuelRange = { label: string; min: number; max: number };

export type SambungKataTimerOption = 30 | 60 | 120 | 300;

export interface SambungKataPlayer {
  id: number;
  name: string;
  lives: number;
  isEliminated: boolean;
  timeLeft: number;
}

export interface SambungKataState {
  players: SambungKataPlayer[];
  usedWords: string[];
  currentPlayerIndex: number;
  currentLetter: string;
  gamePhase: 'setup' | 'playing' | 'finished';
  winner: number | null;
  timerDuration: SambungKataTimerOption;
  totalPlayers: number;
}

export interface KBBIValidationResult {
  valid: boolean;
  message: string;
  word?: string;
}

export type IndexedDBStoreName = 'settings' | 'statistics' | 'gameHistory' | 'kbbi';
