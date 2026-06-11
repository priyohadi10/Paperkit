import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Grid3X3,
  Apple,
  Hash,
  BookOpen,
  BarChart3,
  Settings,
  Sparkles,
  Gamepad2,
  Dices,
  BookText,
  Grid2x2,
  Dice,
} from 'lucide-react';
import { PaperCard } from '@/components/paper/PaperCard';
import { DoodleDecoration } from '@/components/paper/DoodleDecoration';
import type { GameId } from '@/types';

interface GameCard {
  id: GameId;
  name: string;
  description: string;
  icon: React.ReactNode;
  players: string;
  path: string;
  color: string;
}

const games: GameCard[] = [
  {
    id: 'tic-tac-toe',
    name: 'Tic Tac Toe',
    description: 'Dua pemain, satu papan, siapa cepat dia dapat!',
    icon: <Grid3X3 className="w-8 h-8" />,
    players: '2 Pemain',
    path: '/tic-tac-toe',
    color: 'bg-amber-100 dark:bg-amber-900/30',
  },
  {
    id: 'snake',
    name: 'Ular',
    description: 'Makan, tumbuh, jangan sampai nabrak!',
    icon: <Apple className="w-8 h-8" />,
    players: '1 Pemain',
    path: '/snake',
    color: 'bg-green-100 dark:bg-green-900/30',
  },
  {
    id: 'number-duel',
    name: 'Number Duel',
    description: 'Tebak angka rahasia lawan!',
    icon: <Hash className="w-8 h-8" />,
    players: '2 Pemain',
    path: '/number-duel',
    color: 'bg-blue-100 dark:bg-blue-900/30',
  },
  {
    id: 'sambung-kata',
    name: 'Sambung Kata',
    description: 'Sambung kata sesuai KBBI!',
    icon: <BookOpen className="w-8 h-8" />,
    players: '2-10 Pemain',
    path: '/sambung-kata',
    color: 'bg-purple-100 dark:bg-purple-900/30',
  },
];

const Home: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-[100dvh] bg-[var(--paper-bg)]">
      {/* Header */}
      <header className="px-4 pt-6 pb-4">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl border-[3px] border-[var(--paper-border)] bg-[var(--paper-text)] flex items-center justify-center shadow-paper">
                <Gamepad2 className="w-6 h-6 text-[var(--paper-bg)]" />
              </div>
              <div>
                <h1 className="font-display text-2xl font-bold text-[var(--paper-text)] leading-tight">
                  Paper Arcade
                </h1>
                <p className="text-xs text-[var(--paper-muted)] font-body">
                  Koleksi Game Offline
                </p>
              </div>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => navigate('/statistics')}
                className="w-10 h-10 rounded-xl border-[3px] border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center justify-center shadow-paper-sm hover:shadow-paper-hover active:shadow-paper-active transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                aria-label="Statistik"
              >
                <BarChart3 className="w-5 h-5" />
              </button>
              <button
                onClick={() => navigate('/settings')}
                className="w-10 h-10 rounded-xl border-[3px] border-[var(--paper-border)] bg-[var(--paper-card)] flex items-center justify-center shadow-paper-sm hover:shadow-paper-hover active:shadow-paper-active transition-all hover:translate-x-[2px] hover:translate-y-[2px]"
                aria-label="Pengaturan"
              >
                <Settings className="w-5 h-5" />
              </button>
            </div>
          </div>
          <DoodleDecoration variant="zigzag" className="mt-2" />
        </div>
      </header>

      {/* Hero */}
      <section className="px-4 py-4">
        <div className="max-w-lg mx-auto">
          <PaperCard className="relative overflow-hidden">
            <div className="absolute top-0 right-0 w-24 h-24 opacity-10">
              <Dices className="w-full h-full" />
            </div>
            <div className="relative">
              <div className="flex items-center gap-2 mb-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                <span className="font-display text-sm font-bold text-[var(--paper-muted)]">
                  Selamat Datang!
                </span>
              </div>
              <h2 className="font-display text-xl font-bold text-[var(--paper-text)] mb-1">
                Pilih Game Favoritmu
              </h2>
              <p className="text-sm text-[var(--paper-muted)]">
                Semua game dapat dimainkan secara offline. Tanpa iklan, tanpa gangguan!
              </p>
            </div>
          </PaperCard>
        </div>
      </section>

      {/* Game Grid */}
      <section className="px-4 pb-8">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-2 mb-4">
            <Grid2x2 className="w-5 h-5 text-[var(--paper-muted)]" />
            <h3 className="font-display text-lg font-bold text-[var(--paper-text)]">
              Daftar Game
            </h3>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {games.map((game) => (
              <PaperCard
                key={game.id}
                hover
                className="cursor-pointer group"
                onClick={() => navigate(game.path)}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-14 h-14 rounded-xl ${game.color} border-[3px] border-[var(--paper-border)] flex items-center justify-center shrink-0 shadow-paper-sm group-hover:shadow-none transition-shadow`}>
                    {game.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-lg font-bold text-[var(--paper-text)] mb-0.5">
                      {game.name}
                    </h4>
                    <p className="text-xs text-[var(--paper-muted)] mb-2">
                      {game.players}
                    </p>
                    <p className="text-sm text-[var(--paper-text)] leading-snug">
                      {game.description}
                    </p>
                  </div>
                </div>
              </PaperCard>
            ))}

            {/* ⬇️ ABC LIMA DASAR - Game Baru */}
            <a href="/abc-lima-dasar" className="block">
              <PaperCard hover className="cursor-pointer group h-full">
                <div className="flex items-start gap-4">
                  <div className="w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-900/30 border-[3px] border-[var(--paper-border)] flex items-center justify-center shrink-0 shadow-paper-sm group-hover:shadow-none transition-shadow">
                    <Dice className="w-8 h-8" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-display text-lg font-bold text-[var(--paper-text)] mb-0.5">
                      ABC Lima Dasar
                    </h4>
                    <p className="text-xs text-[var(--paper-muted)] mb-2">
                      2-10 Pemain
                    </p>
                    <p className="text-sm text-[var(--paper-text)] leading-snug">
                      Ketik kata sesuai huruf & kategori sebelum waktu habis!
                    </p>
                  </div>
                </div>
              </PaperCard>
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-4 py-6 border-t-2 border-[var(--paper-border)]">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <BookText className="w-4 h-4 text-[var(--paper-muted)]" />
            <span className="font-display text-sm text-[var(--paper-muted)]">
              Paper Arcade v1.0
            </span>
          </div>
          <p className="text-xs text-[var(--paper-muted)]">
            Dibuat dengan ❤ untuk semua orang
          </p>
          <p className="text-xs text-[var(--paper-muted)] mt-1">
            100% Offline • Tanpa Iklan • Open Source
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Home;
