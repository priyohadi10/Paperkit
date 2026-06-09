import { create } from 'zustand';
import type { SambungKataState, SambungKataPlayer, SambungKataTimerOption } from '@/types';
import { isValidKBBIWord, isWordUsed, getLastLetter, doesWordStartWith } from '@/utils/kbbiData';
import { useStatsStore } from './statsStore';

interface SambungKataStore extends SambungKataState {
  addPlayer: (name: string) => void;
  removePlayer: (id: number) => void;
  setTimerDuration: (duration: SambungKataTimerOption) => void;
  setTotalPlayers: (count: number) => void;
  startGame: () => void;
  submitWord: (word: string) => { success: boolean; message: string };
  nextPlayer: () => void;
  eliminateCurrentPlayer: () => void;
  tickTimer: () => void;
  resetGame: () => void;
  getCurrentPlayer: () => SambungKataPlayer | null;
  getActivePlayers: () => SambungKataPlayer[];
  getLastWord: () => string | null;
  getRequiredLetter: () => string;
  isGameOver: () => boolean;
  getWinner: () => SambungKataPlayer | null;
}

function generateId(players: SambungKataPlayer[]): number {
  return players.length > 0 ? Math.max(...players.map(p => p.id)) + 1 : 1;
}

export const useSambungKataStore = create<SambungKataStore>((set, get) => ({
  players: [],
  usedWords: [],
  currentPlayerIndex: 0,
  currentLetter: '',
  gamePhase: 'setup',
  winner: null,
  timerDuration: 60,
  totalPlayers: 2,

  addPlayer: (name) => {
    const { players, totalPlayers } = get();
    if (players.length >= totalPlayers) return;

    const newPlayer: SambungKataPlayer = {
      id: generateId(players),
      name: name || `Pemain ${players.length + 1}`,
      lives: 3,
      isEliminated: false,
      timeLeft: get().timerDuration,
    };
    set({ players: [...players, newPlayer] });
  },

  removePlayer: (id) => {
    set({ players: get().players.filter(p => p.id !== id) });
  },

  setTimerDuration: (duration) => set({ timerDuration: duration }),

  setTotalPlayers: (count) => set({ totalPlayers: count, players: [] }),

  startGame: () => {
    const { players, timerDuration } = get();
    if (players.length < 2) {
      return;
    }

    // First letter is random
    const letters = 'abcdefghijklmnopqrstuvwxyz';
    const firstLetter = letters[Math.floor(Math.random() * letters.length)];

    const initializedPlayers = players.map(p => ({
      ...p,
      lives: 3,
      isEliminated: false,
      timeLeft: timerDuration,
    }));

    set({
      players: initializedPlayers,
      usedWords: [],
      currentPlayerIndex: 0,
      currentLetter: firstLetter,
      gamePhase: 'playing',
      winner: null,
    });
  },

  submitWord: (word) => {
    const { usedWords, currentLetter, players, currentPlayerIndex, gamePhase } = get();

    if (gamePhase !== 'playing') {
      return { success: false, message: 'Permainan belum dimulai' };
    }

    const trimmedWord = word.trim().toLowerCase();

    if (!trimmedWord) {
      return { success: false, message: 'Kata tidak boleh kosong' };
    }

    // Check if word starts with required letter
    if (!doesWordStartWith(trimmedWord, currentLetter)) {
      return { success: false, message: `Kata harus dimulai dengan huruf "${currentLetter.toUpperCase()}"` };
    }

    // Check if word was already used
    if (isWordUsed(trimmedWord, usedWords)) {
      return { success: false, message: `Kata "${trimmedWord}" sudah pernah digunakan` };
    }

    // Check KBBI validity
    if (!isValidKBBIWord(trimmedWord)) {
      return { success: false, message: `Kata "${trimmedWord}" tidak ditemukan dalam KBBI` };
    }

    // Word is valid - add it and move to next player
    const newUsedWords = [...usedWords, trimmedWord];
    const newLetter = getLastLetter(trimmedWord);

    // Update timer for current player
    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex
        ? { ...p, timeLeft: get().timerDuration }
        : p
    );

    // Find next active player
    let nextIndex = (currentPlayerIndex + 1) % updatedPlayers.length;
    let loopCount = 0;
    while (updatedPlayers[nextIndex]?.isEliminated && loopCount < updatedPlayers.length) {
      nextIndex = (nextIndex + 1) % updatedPlayers.length;
      loopCount++;
    }

    // Check if only one player remains
    const activePlayers = updatedPlayers.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      set({
        usedWords: newUsedWords,
        currentLetter: newLetter,
        players: updatedPlayers,
        gamePhase: 'finished',
        winner: winner.id,
        currentPlayerIndex: players.findIndex(p => p.id === winner.id),
      });

      useStatsStore.getState().recordGame(
        'sambung-kata',
        'win',
        newUsedWords.length,
        `Winner: ${winner.name}, Words: ${newUsedWords.length}`
      );

      return { success: true, message: 'Kata valid!' };
    }

    set({
      usedWords: newUsedWords,
      currentLetter: newLetter,
      players: updatedPlayers,
      currentPlayerIndex: nextIndex,
    });

    return { success: true, message: 'Kata valid!' };
  },

  nextPlayer: () => {
    const { players, currentPlayerIndex } = get();
    let nextIndex = (currentPlayerIndex + 1) % players.length;
    let loopCount = 0;
    while (players[nextIndex]?.isEliminated && loopCount < players.length) {
      nextIndex = (nextIndex + 1) % players.length;
      loopCount++;
    }
    set({ currentPlayerIndex: nextIndex });
  },

  eliminateCurrentPlayer: () => {
    const { players, currentPlayerIndex } = get();
    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex
        ? { ...p, isEliminated: true, lives: 0 }
        : p
    );

    // Check remaining players
    const activePlayers = updatedPlayers.filter(p => !p.isEliminated);
    if (activePlayers.length === 1) {
      const winner = activePlayers[0];
      set({
        players: updatedPlayers,
        gamePhase: 'finished',
        winner: winner.id,
        currentPlayerIndex: updatedPlayers.findIndex(p => p.id === winner.id),
      });

      useStatsStore.getState().recordGame(
        'sambung-kata',
        'win',
        get().usedWords.length,
        `Winner: ${winner.name}`
      );
      return;
    }

    // Move to next active player
    let nextIndex = (currentPlayerIndex + 1) % updatedPlayers.length;
    while (updatedPlayers[nextIndex]?.isEliminated) {
      nextIndex = (nextIndex + 1) % updatedPlayers.length;
    }

    set({
      players: updatedPlayers,
      currentPlayerIndex: nextIndex,
    });
  },

  tickTimer: () => {
    const { players, currentPlayerIndex, gamePhase } = get();
    if (gamePhase !== 'playing') return;

    const currentPlayer = players[currentPlayerIndex];
    if (!currentPlayer || currentPlayer.isEliminated) return;

    const newTimeLeft = currentPlayer.timeLeft - 1;

    if (newTimeLeft <= 0) {
      // Player ran out of time - eliminate
      get().eliminateCurrentPlayer();
      return;
    }

    const updatedPlayers = players.map((p, i) =>
      i === currentPlayerIndex ? { ...p, timeLeft: newTimeLeft } : p
    );

    set({ players: updatedPlayers });
  },

  resetGame: () => {
    set({
      players: [],
      usedWords: [],
      currentPlayerIndex: 0,
      currentLetter: '',
      gamePhase: 'setup',
      winner: null,
    });
  },

  getCurrentPlayer: () => {
    const { players, currentPlayerIndex } = get();
    return players[currentPlayerIndex] || null;
  },

  getActivePlayers: () => {
    return get().players.filter(p => !p.isEliminated);
  },

  getLastWord: () => {
    const { usedWords } = get();
    return usedWords.length > 0 ? usedWords[usedWords.length - 1] : null;
  },

  getRequiredLetter: () => {
    return get().currentLetter;
  },

  isGameOver: () => {
    return get().gamePhase === 'finished' || get().getActivePlayers().length <= 1;
  },

  getWinner: () => {
    const { players, winner } = get();
    if (winner === null) return null;
    return players.find(p => p.id === winner) || null;
  },
}));
