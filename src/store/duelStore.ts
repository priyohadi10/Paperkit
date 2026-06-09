import { create } from 'zustand';
import type { NumberDuelState, NumberDuelGuess, NumberDuelRange } from '@/types';
import { useStatsStore } from './statsStore';

export const NUMBER_DUEL_RANGES: NumberDuelRange[] = [
  { label: '1 - 100', min: 1, max: 100 },
  { label: '1 - 500', min: 1, max: 500 },
  { label: '1 - 1000', min: 1, max: 1000 },
];

interface NumberDuelStore extends NumberDuelState {
  setPlayerSecret: (player: 1 | 2, secret: number) => void;
  makeGuess: (player: 1 | 2, number: number) => void;
  setRange: (range: { min: number; max: number }) => void;
  setPlayerNames: (p1: string, p2: string) => void;
  startGame: () => void;
  resetGame: () => void;
  getOpponentSecret: (player: 1 | 2) => number | null;
}

export const useDuelStore = create<NumberDuelStore>((set, get) => ({
  player1Secret: null,
  player2Secret: null,
  currentPlayer: 1,
  range: { min: 1, max: 100 },
  guesses: [],
  winner: null,
  gamePhase: 'setup',
  player1Name: 'Pemain 1',
  player2Name: 'Pemain 2',

  setPlayerSecret: (player, secret) => {
    if (player === 1) {
      set({ player1Secret: secret });
    } else {
      set({ player2Secret: secret });
    }
  },

  makeGuess: (player, number) => {
    const { player1Secret, player2Secret, guesses, gamePhase, winner, currentPlayer } = get();
    if (gamePhase !== 'playing' || winner || player !== currentPlayer) return;

    const opponentSecret = player === 1 ? player2Secret : player1Secret;
    if (opponentSecret === null) return;

    let result: NumberDuelGuess['result'];
    if (number === opponentSecret) result = 'correct';
    else if (number > opponentSecret) result = 'too-high';
    else result = 'too-low';

    const guess: NumberDuelGuess = {
      player,
      number,
      result,
      timestamp: Date.now(),
    };

    const newGuesses = [...guesses, guess];

    if (result === 'correct') {
      const gameWinner = player;
      set({
        guesses: newGuesses,
        winner: gameWinner,
        gamePhase: 'finished',
        currentPlayer: player,
      });

      useStatsStore.getState().recordGame(
        'number-duel',
        'win',
        1,
        `Winner: ${player === 1 ? get().player1Name : get().player2Name}`
      );
    } else {
      // Fair final turn: if player 2 guessed wrong and it's their turn, check if they should get another chance
      // Only switch turns if guess was wrong
      const nextPlayer: 1 | 2 = player === 1 ? 2 : 1;

      set({
        guesses: newGuesses,
        currentPlayer: nextPlayer,
      });
    }
  },

  setRange: (range) => set({ range }),

  setPlayerNames: (p1, p2) => set({ player1Name: p1, player2Name: p2 }),

  startGame: () => {
    const { player1Secret, player2Secret } = get();
    if (player1Secret !== null && player2Secret !== null) {
      set({ gamePhase: 'playing', currentPlayer: 1, guesses: [], winner: null });
    }
  },

  resetGame: () => {
    set({
      player1Secret: null,
      player2Secret: null,
      currentPlayer: 1,
      guesses: [],
      winner: null,
      gamePhase: 'setup',
    });
  },

  getOpponentSecret: (player) => {
    return player === 1 ? get().player2Secret : get().player1Secret;
  },
}));
