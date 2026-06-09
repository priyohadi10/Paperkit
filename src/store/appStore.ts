import { create } from 'zustand';
import type { AppSettings, ThemeMode } from '@/types';
import { getLocalSettings, setLocalSettings } from '@/utils/localStorage';
import { getSetting, setSetting } from '@/utils/indexedDB';

interface AppState {
  settings: AppSettings;
  isLoaded: boolean;
  isInstallable: boolean;
  deferredPrompt: Event | null;
  updateSettings: (settings: Partial<AppSettings>) => void;
  setTheme: (theme: ThemeMode) => void;
  toggleSound: () => void;
  toggleHaptic: () => void;
  setInstallable: (value: boolean) => void;
  setDeferredPrompt: (event: Event | null) => void;
  init: () => Promise<void>;
}

function applyTheme(theme: ThemeMode) {
  const root = window.document.documentElement;
  const systemDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const isDark = theme === 'dark' || (theme === 'system' && systemDark);

  if (isDark) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export const useAppStore = create<AppState>((set, get) => ({
  settings: {
    theme: 'light',
    soundEnabled: true,
    hapticEnabled: false,
  },
  isLoaded: false,
  isInstallable: false,
  deferredPrompt: null,

  updateSettings: (newSettings) => {
    const current = get().settings;
    const updated = { ...current, ...newSettings };
    set({ settings: updated });
    setLocalSettings(updated);
    setSetting('app-settings', updated);

    if (newSettings.theme !== undefined) {
      applyTheme(newSettings.theme);
    }
  },

  setTheme: (theme) => {
    get().updateSettings({ theme });
  },

  toggleSound: () => {
    get().updateSettings({ soundEnabled: !get().settings.soundEnabled });
  },

  toggleHaptic: () => {
    get().updateSettings({ hapticEnabled: !get().settings.hapticEnabled });
  },

  setInstallable: (value) => set({ isInstallable: value }),
  setDeferredPrompt: (event) => set({ deferredPrompt: event }),

  init: async () => {
    let settings = getLocalSettings();

    // Try to get from IndexedDB if available
    try {
      const dbSettings = await getSetting<AppSettings>('app-settings');
      if (dbSettings) {
        settings = dbSettings;
      }
    } catch {
      // Use localStorage fallback
    }

    applyTheme(settings.theme);
    set({ settings, isLoaded: true });
  },
}));
