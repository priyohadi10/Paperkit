import { openDB, type DBSchema, type IDBPDatabase } from 'idb';
import type { AppSettings, GameStatistics, GameHistoryEntry } from '@/types';

interface PaperArcadeDB extends DBSchema {
  settings: {
    key: string;
    value: AppSettings;
  };
  statistics: {
    key: string;
    value: GameStatistics;
  };
  gameHistory: {
    key: string;
    value: GameHistoryEntry;
    indexes: {
      'by-game': string;
      'by-date': string;
    };
  };
}

const DB_NAME = 'paper-arcade-db';
const DB_VERSION = 1;

let dbPromise: Promise<IDBPDatabase<PaperArcadeDB>> | null = null;

function getDB(): Promise<IDBPDatabase<PaperArcadeDB>> {
  if (!dbPromise) {
    dbPromise = openDB<PaperArcadeDB>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings');
        }
        if (!db.objectStoreNames.contains('statistics')) {
          db.createObjectStore('statistics');
        }
        if (!db.objectStoreNames.contains('gameHistory')) {
          const historyStore = db.createObjectStore('gameHistory', { keyPath: 'id' });
          historyStore.createIndex('by-game', 'gameId');
          historyStore.createIndex('by-date', 'timestamp');
        }
      },
    });
  }
  return dbPromise;
}

export async function getSetting<T>(key: string): Promise<T | undefined> {
  try {
    const db = await getDB();
    return await db.get('settings', key) as T | undefined;
  } catch {
    return undefined;
  }
}

export async function setSetting<T>(key: string, value: T): Promise<void> {
  try {
    const db = await getDB();
    await db.put('settings', value as unknown as AppSettings, key);
  } catch {
    // Silently fail - IndexedDB not available
  }
}

export async function getStatistics(gameId: string): Promise<GameStatistics | undefined> {
  try {
    const db = await getDB();
    return await db.get('statistics', gameId);
  } catch {
    return undefined;
  }
}

export async function setStatistics(gameId: string, stats: GameStatistics): Promise<void> {
  try {
    const db = await getDB();
    await db.put('statistics', stats, gameId);
  } catch {
    // Silently fail
  }
}

export async function getAllStatistics(): Promise<GameStatistics[]> {
  try {
    const db = await getDB();
    return await db.getAll('statistics');
  } catch {
    return [];
  }
}

export async function addGameHistory(entry: GameHistoryEntry): Promise<void> {
  try {
    const db = await getDB();
    await db.add('gameHistory', entry);
  } catch {
    // Silently fail
  }
}

export async function getGameHistory(gameId?: string, limit?: number): Promise<GameHistoryEntry[]> {
  try {
    const db = await getDB();
    let entries: GameHistoryEntry[];

    if (gameId) {
      entries = await db.getAllFromIndex('gameHistory', 'by-game', gameId);
    } else {
      entries = await db.getAll('gameHistory');
    }

    entries.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    if (limit) {
      return entries.slice(0, limit);
    }
    return entries;
  } catch {
    return [];
  }
}

export async function clearAllData(): Promise<void> {
  try {
    const db = await getDB();
    const tx = db.transaction(['settings', 'statistics', 'gameHistory'], 'readwrite');
    await Promise.all([
      tx.objectStore('settings').clear(),
      tx.objectStore('statistics').clear(),
      tx.objectStore('gameHistory').clear(),
    ]);
    await tx.done;
    dbPromise = null;
  } catch {
    // Silently fail
  }
}
