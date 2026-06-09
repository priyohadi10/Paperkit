import React from 'react';
import { useNavigate } from 'react-router-dom';
import {
  ArrowLeft,
  Trophy,
  Gamepad2,
  TrendingUp,
  Award,
  Minus,
  Calendar,
  BarChart3,
} from 'lucide-react';
import { useStatsStore } from '@/store/statsStore';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperTitle } from '@/components/paper/PaperTitle';
import { StatCard } from '@/components/paper/StatCard';
import { DoodleDecoration } from '@/components/paper/DoodleDecoration';
import type { GameId } from '@/types';

const gameNames: Record<GameId, string> = {
  'tic-tac-toe': 'Tic Tac Toe',
  'snake': 'Ular',
  'number-duel': 'Number Duel',
  'sambung-kata': 'Sambung Kata',
};

const Statistics: React.FC = () => {
  const navigate = useNavigate();
  const { statistics, getTotalStats, isLoaded } = useStatsStore();
  const totals = getTotalStats();

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center">
        <div className="animate-pulse font-display text-xl">Memuat statistik...</div>
      </div>
    );
  }

  const hasData = totals.totalPlayed > 0;

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
              Statistik
            </PaperTitle>
          </div>
          <DoodleDecoration variant="zigzag" />
        </div>
      </header>

      <div className="px-4 py-4 max-w-lg mx-auto">
        {/* Overall Stats */}
        <PaperCard className="mb-6">
          <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Ringkasan
          </h3>
          <div className="grid grid-cols-2 gap-3">
            <StatCard
              value={totals.totalPlayed}
              label="Total Main"
              icon={<Gamepad2 className="w-5 h-5 text-[var(--paper-muted)]" />}
            />
            <StatCard
              value={totals.totalWon}
              label="Menang"
              icon={<Trophy className="w-5 h-5 text-amber-500" />}
            />
            <StatCard
              value={totals.totalLost}
              label="Kalah"
              icon={<TrendingUp className="w-5 h-5 text-red-500" />}
            />
            <StatCard
              value={totals.totalDrawn}
              label="Seri"
              icon={<Minus className="w-5 h-5 text-[var(--paper-muted)]" />}
            />
          </div>
        </PaperCard>

        {/* High Score */}
        {totals.totalHighScore > 0 && (
          <PaperCard className="mb-6 text-center">
            <Award className="w-8 h-8 mx-auto mb-2 text-amber-500" />
            <p className="font-display text-3xl font-bold text-[var(--paper-text)]">
              {totals.totalHighScore}
            </p>
            <p className="text-sm text-[var(--paper-muted)]">Skor Tertinggi</p>
          </PaperCard>
        )}

        {/* Per Game Stats */}
        <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
          <Calendar className="w-5 h-5" />
          Per Game
        </h3>

        {!hasData && (
          <PaperCard className="text-center py-8">
            <Gamepad2 className="w-12 h-12 mx-auto mb-3 text-[var(--paper-muted)]" />
            <p className="font-display text-lg text-[var(--paper-muted)]">
              Belum ada data permainan
            </p>
            <p className="text-sm text-[var(--paper-muted)] mt-1">
              Mainkan game untuk melihat statistik!
            </p>
          </PaperCard>
        )}

        <div className="space-y-3">
          {(Object.keys(statistics) as GameId[]).map((gameId) => {
            const stats = statistics[gameId];
            if (!stats || stats.gamesPlayed === 0) return null;

            return (
              <PaperCard key={gameId}>
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-display font-bold text-lg">{gameNames[gameId]}</h4>
                  <span className="text-xs text-[var(--paper-muted)]">
                    {stats.gamesPlayed} main
                  </span>
                </div>

                <div className="grid grid-cols-4 gap-2 mb-2">
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-green-600">{stats.gamesWon}</p>
                    <p className="text-[10px] text-[var(--paper-muted)] uppercase">Menang</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-red-500">{stats.gamesLost}</p>
                    <p className="text-[10px] text-[var(--paper-muted)] uppercase">Kalah</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-[var(--paper-muted)]">{stats.gamesDrawn}</p>
                    <p className="text-[10px] text-[var(--paper-muted)] uppercase">Seri</p>
                  </div>
                  <div className="text-center">
                    <p className="font-display text-lg font-bold text-amber-500">{stats.highScore}</p>
                    <p className="text-[10px] text-[var(--paper-muted)] uppercase">Tertinggi</p>
                  </div>
                </div>

                {stats.lastPlayed && (
                  <p className="text-xs text-[var(--paper-muted)]">
                    Terakhir main: {new Date(stats.lastPlayed).toLocaleDateString('id-ID', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                )}
              </PaperCard>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Statistics;
