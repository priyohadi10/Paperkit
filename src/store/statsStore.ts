import { create } from 'zustand';
import type { GameId, GameStatistics, GameHistoryEntry } from '@/types';
import { getLocalStats, setLocalStats, addLocalHistoryEntry, getLocalHistory } from '@/utils/localStorage';
import { getAllStatistics, setStatistics, addGameHistory, getGameHistory } from '@/utils/indexedDB';

interface StatsState {
  statistics: Record<string, GameStatistics>;
  history: GameHistoryEntry[];
  isLoaded: boolean;
  init: () => Promise<void>;
  recordGame: (gameId: GameId, result: 'win' | 'loss' | 'draw', score?: number, details?: string) => void;
  getStats: (gameId: GameId) => GameStatistics | undefined;
  getTotalStats: () => { totalPlayed: number; totalWon: number; totalLost: number; totalDrawn: number; totalHighScore: number };
  resetAll: () => void;
}

const defaultStats = (gameId: GameId): GameStatistics => ({
  gameId,
  gamesPlayed: 0,
  gamesWon: 0,
  gamesLost: 0,
  gamesDrawn: 0,
  highScore: 0,
  totalScore: 0,
  lastPlayed: undefined,
});

export const useStatsStore = create<StatsState>((set, get) => ({
  statistics: {},
  history: [],
  isLoaded: false,

  init: async () => {
    let stats = getLocalStats();
    let history = getLocalHistory();

    try {
      const dbStats = await getAllStatistics();
      if (dbStats.length > 0) {
        const dbStatsRecord: Record<string, GameStatistics> = {};
        dbStats.forEach(s => { dbStatsRecord[s.gameId] = s; });
        stats = { ...stats, ...dbStatsRecord };
      }

      const dbHistory = await getGameHistory(undefined, 100);
      if (dbHistory.length > 0) {
        history = dbHistory;
      }
    } catch {
      // Use localStorage fallback
    }

    set({ statistics: stats, history, isLoaded: true });
  },

  recordGame: (gameId, result, score = 0, details) => {
    const stats = get().statistics;
    const gameStats = stats[gameId] || defaultStats(gameId);

    gameStats.gamesPlayed += 1;
    gameStats.totalScore += score;
    gameStats.lastPlayed = new Date().toISOString();

    if (result === 'win') gameStats.gamesWon += 1;
    else if (result === 'loss') gameStats.gamesLost += 1;
    else if (result === 'draw') gameStats.gamesDrawn += 1;

    if (score > gameStats.highScore) {
      gameStats.highScore = score;
    }

    const updatedStats = { ...stats, [gameId]: gameStats };

    const entry: GameHistoryEntry = {
      id: `${gameId}-${Date.now()}`,
      gameId,
      result,
      score,
      timestamp: new Date().toISOString(),
      details,
    };

    const updatedHistory = [entry, ...get().history].slice(0, 500);

    set({ statistics: updatedStats, history: updatedHistory });

    // Persist
    setLocalStats(updatedStats);
    addLocalHistoryEntry(entry);
    setStatistics(gameId, gameStats);
    addGameHistory(entry);
  },

  getStats: (gameId) => {
    return get().statistics[gameId];
  },

  getTotalStats: () => {
    const stats = Object.values(get().statistics);
    return {
      totalPlayed: stats.reduce((s, g) => s + g.gamesPlayed, 0),
      totalWon: stats.reduce((s, g) => s + g.gamesWon, 0),
      totalLost: stats.reduce((s, g) => s + g.gamesLost, 0),
      totalDrawn: stats.reduce((s, g) => s + g.gamesDrawn, 0),
      totalHighScore: stats.reduce((s, g) => Math.max(s, g.highScore), 0),
    };
  },

  resetAll: () => {
    set({ statistics: {}, history: [] });
  },
}));
