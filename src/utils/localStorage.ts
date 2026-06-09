import type { AppSettings, GameStatistics, GameHistoryEntry } from '@/types';

const SETTINGS_KEY = 'paper-arcade-settings';
const STATS_KEY = 'paper-arcade-stats';
const HISTORY_KEY = 'paper-arcade-history';

function safeGet<T>(key: string, fallback: T): T {
  try {
    const raw = localStorage.getItem(key);
    if (!raw) return fallback;
    return JSON.parse(raw) as T;
  } catch {
    return fallback;
  }
}

function safeSet(key: string, value: unknown): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch {
    // Silently fail (e.g., storage full or private mode)
  }
}

export function getLocalSettings(): AppSettings {
  return safeGet<AppSettings>(SETTINGS_KEY, {
    theme: 'light',
    soundEnabled: true,
    hapticEnabled: false,
  });
}

export function setLocalSettings(settings: AppSettings): void {
  safeSet(SETTINGS_KEY, settings);
}

export function getLocalStats(): Record<string, GameStatistics> {
  return safeGet<Record<string, GameStatistics>>(STATS_KEY, {});
}

export function setLocalStats(stats: Record<string, GameStatistics>): void {
  safeSet(STATS_KEY, stats);
}

export function addLocalHistoryEntry(entry: GameHistoryEntry): void {
  const history = safeGet<GameHistoryEntry[]>(HISTORY_KEY, []);
  history.unshift(entry);
  // Keep last 500 entries
  if (history.length > 500) {
    history.length = 500;
  }
  safeSet(HISTORY_KEY, history);
}

export function getLocalHistory(): GameHistoryEntry[] {
  return safeGet<GameHistoryEntry[]>(HISTORY_KEY, []);
}

export function clearLocalData(): void {
  try {
    localStorage.removeItem(SETTINGS_KEY);
    localStorage.removeItem(STATS_KEY);
    localStorage.removeItem(HISTORY_KEY);
  } catch {
    // Silently fail
  }
}
