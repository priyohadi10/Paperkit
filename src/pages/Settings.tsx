import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Moon,
  Sun,
  Monitor,
  Volume2,
  VolumeX,
  Smartphone,
  Trash2,
  AlertTriangle,
  RotateCcw,
  Info,
} from 'lucide-react';
import { useAppStore } from '@/store/appStore';
import { clearLocalData } from '@/utils/localStorage';
import { clearAllData } from '@/utils/indexedDB';
import { useStatsStore } from '@/store/statsStore';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperTitle } from '@/components/paper/PaperTitle';
import { DoodleDecoration } from '@/components/paper/DoodleDecoration';
import type { ThemeMode } from '@/types';

const Settings: React.FC = () => {
  const navigate = useNavigate();
  const { settings, setTheme, toggleSound, toggleHaptic } = useAppStore();
  const { resetAll } = useStatsStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);
  const [resetDone, setResetDone] = useState(false);

  const handleResetData = async () => {
    clearLocalData();
    await clearAllData();
    resetAll();
    setShowResetConfirm(false);
    setResetDone(true);
    setTimeout(() => setResetDone(false), 3000);
  };

  const themeOptions: { value: ThemeMode; label: string; icon: React.ReactNode }[] = [
    { value: 'light', label: 'Terang', icon: <Sun className="w-5 h-5" /> },
    { value: 'dark', label: 'Gelap', icon: <Moon className="w-5 h-5" /> },
    { value: 'system', label: 'Sistem', icon: <Monitor className="w-5 h-5" /> },
  ];

  return (
    <div className="min-h-[100dvh] bg-[var(--paper-bg)]">
      {/* Header */}
      <header className="px-4 pt-6 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3 mb-2">
            <PaperButton
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="!min-h-[36px] !px-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </PaperButton>
            <PaperTitle as="h1" className="!text-2xl">
              Pengaturan
            </PaperTitle>
          </div>
          <DoodleDecoration variant="zigzag" />
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Theme */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Tema</h3>
          <div className="flex gap-2">
            {themeOptions.map((opt) => (
              <PaperButton
                key={opt.value}
                variant={settings.theme === opt.value ? 'primary' : 'default'}
                onClick={() => setTheme(opt.value)}
                className="flex-1"
                size="sm"
              >
                {opt.icon}
                <span className="ml-2">{opt.label}</span>
              </PaperButton>
            ))}
          </div>
        </PaperCard>

        {/* Sound */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Suara</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {settings.soundEnabled ? (
                <Volume2 className="w-5 h-5 text-green-500" />
              ) : (
                <VolumeX className="w-5 h-5 text-[var(--paper-muted)]" />
              )}
              <span className="font-medium">Efek Suara</span>
            </div>
            <button
              onClick={toggleSound}
              className={`relative w-12 h-7 rounded-full border-[3px] border-[var(--paper-border)] transition-colors ${
                settings.soundEnabled ? 'bg-green-500' : 'bg-[var(--paper-muted)]'
              }`}
              aria-label={settings.soundEnabled ? 'Matikan suara' : 'Nyalakan suara'}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 border-[var(--paper-border)] transition-transform ${
                  settings.soundEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </PaperCard>

        {/* Haptic */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Haptic</h3>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Smartphone className="w-5 h-5 text-[var(--paper-muted)]" />
              <span className="font-medium">Getaran</span>
            </div>
            <button
              onClick={toggleHaptic}
              className={`relative w-12 h-7 rounded-full border-[3px] border-[var(--paper-border)] transition-colors ${
                settings.hapticEnabled ? 'bg-green-500' : 'bg-[var(--paper-muted)]'
              }`}
              aria-label={settings.hapticEnabled ? 'Matikan getaran' : 'Nyalakan getaran'}
            >
              <div
                className={`absolute top-0.5 w-5 h-5 rounded-full bg-white border-2 border-[var(--paper-border)] transition-transform ${
                  settings.hapticEnabled ? 'translate-x-5' : 'translate-x-0.5'
                }`}
              />
            </button>
          </div>
        </PaperCard>

        {/* Reset Data */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3 text-red-500 flex items-center gap-2">
            <Trash2 className="w-5 h-5" />
            Hapus Data
          </h3>
          <p className="text-sm text-[var(--paper-muted)] mb-3">
            Hapus semua statistik dan riwayat permainan. Pengaturan tetap tersimpan.
          </p>

          {!showResetConfirm ? (
            <PaperButton
              onClick={() => setShowResetConfirm(true)}
              variant="danger"
              size="sm"
            >
              <Trash2 className="w-4 h-4 mr-2" />
              Hapus Semua Data
            </PaperButton>
          ) : (
            <div className="space-y-3">
              <div className="flex items-center gap-2 p-3 bg-red-100 dark:bg-red-900/30 rounded-xl">
                <AlertTriangle className="w-5 h-5 text-red-500 shrink-0" />
                <p className="text-sm text-red-700 dark:text-red-300">
                  Yakin ingin menghapus semua data? Tindakan ini tidak dapat dibatalkan.
                </p>
              </div>
              <div className="flex gap-2">
                <PaperButton
                  onClick={handleResetData}
                  variant="danger"
                  size="sm"
                >
                  <Trash2 className="w-4 h-4 mr-2" />
                  Ya, Hapus
                </PaperButton>
                <PaperButton
                  onClick={() => setShowResetConfirm(false)}
                  variant="ghost"
                  size="sm"
                >
                  <RotateCcw className="w-4 h-4 mr-2" />
                  Batal
                </PaperButton>
              </div>
            </div>
          )}

          {resetDone && (
            <p className="text-sm text-green-600 mt-2 flex items-center gap-1">
              <AlertTriangle className="w-4 h-4" />
              Semua data berhasil dihapus!
            </p>
          )}
        </PaperCard>

        {/* About */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <Info className="w-5 h-5" />
            Tentang
          </h3>
          <div className="space-y-2 text-sm text-[var(--paper-muted)]">
            <p><strong className="text-[var(--paper-text)]">Paper Arcade</strong> v1.0.0</p>
            <p>Koleksi game offline dengan desain Paper Kit yang menyenangkan.</p>
            <p>Semua game dapat dimainkan tanpa koneksi internet.</p>
            <p className="pt-2 border-t border-[var(--paper-border)]">
              <strong className="text-[var(--paper-text)]">Fitur:</strong>
            </p>
            <ul className="list-disc list-inside space-y-1">
              <li>100% Offline - tanpa internet</li>
              <li>Installable PWA</li>
              <li>Dark Mode</li>
              <li>Statistik permanen</li>
              <li>Tanpa iklan</li>
            </ul>
          </div>
        </PaperCard>
      </div>
    </div>
  );
};

export default Settings;
