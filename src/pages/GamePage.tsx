import React, { Suspense } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { PaperButton } from '@/components/paper/PaperButton';

const gameComponents: Record<string, React.LazyExoticComponent<React.FC>> = {
  'tic-tac-toe': React.lazy(() => import('@/games/tic-tac-toe/TicTacToeGame')),
  'snake': React.lazy(() => import('@/games/snake/SnakeGame')),
  'number-duel': React.lazy(() => import('@/games/number-duel/NumberDuelGame')),
  'sambung-kata': React.lazy(() => import('@/games/sambung-kata/SambungKataGame')),
};

const gameNames: Record<string, string> = {
  'tic-tac-toe': 'Tic Tac Toe',
  'snake': 'Ular',
  'number-duel': 'Number Duel',
  'sambung-kata': 'Sambung Kata',
};

const GamePage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract game ID from pathname (e.g., /tic-tac-toe -> tic-tac-toe)
  const pathParts = location.pathname.split('/').filter(Boolean);
  const gameId = pathParts.length > 0 ? pathParts[pathParts.length - 1] : '';

  const GameComponent = gameId ? gameComponents[gameId] : null;
  const gameName = gameId ? gameNames[gameId] : 'Game';

  if (!GameComponent) {
    return (
      <div className="min-h-[100dvh] flex items-center justify-center px-4">
        <div className="text-center">
          <p className="font-display text-xl mb-4">Game tidak ditemukan</p>
          <PaperButton onClick={() => navigate('/')} variant="primary">
            Kembali ke Beranda
          </PaperButton>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-[var(--paper-bg)]">
      {/* Header */}
      <header className="px-4 pt-4 pb-2">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center gap-3">
            <PaperButton
              onClick={() => navigate('/')}
              variant="ghost"
              size="sm"
              className="!min-h-[36px] !px-2"
            >
              <ArrowLeft className="w-5 h-5" />
            </PaperButton>
            <h1 className="font-display text-xl font-bold text-[var(--paper-text)]">
              {gameName}
            </h1>
          </div>
        </div>
      </header>

      {/* Game Content */}
      <main className="px-4 py-4">
        <Suspense
          fallback={
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-[var(--paper-muted)]" />
              <span className="ml-3 font-display text-lg text-[var(--paper-muted)]">
                Memuat game...
              </span>
            </div>
          }
        >
          <GameComponent />
        </Suspense>
      </main>
    </div>
  );
};

export default GamePage;
