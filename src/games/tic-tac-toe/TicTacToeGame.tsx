import React, { useCallback } from 'react';
import { RotateCcw, Trophy, Minus } from 'lucide-react';
import { useTicTacToeStore } from '@/store/ticTacToeStore';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperTitle } from '@/components/paper/PaperTitle';

const TicTacToeGame: React.FC = () => {
  const { board, currentPlayer, winner, scores, winningLine, makeMove, resetBoard, resetScores } = useTicTacToeStore();

  const getCellStyle = useCallback((index: number) => {
    const isWinningCell = winningLine?.includes(index);
    const value = board[index];

    let base = 'w-full aspect-square flex items-center justify-center text-4xl md:text-5xl font-display font-bold rounded-xl transition-all duration-200 cursor-pointer cell-hover border-2 border-[var(--paper-border)]';

    if (isWinningCell) {
      base += ' bg-[var(--paper-text)] text-[var(--paper-bg)] animate-pop-in';
    } else if (value) {
      base += ' bg-[var(--paper-card)] text-[var(--paper-text)]';
    } else {
      base += ' bg-[var(--paper-card)] text-[var(--paper-text)]';
    }

    return base;
  }, [board, winningLine]);

  const getStatusMessage = () => {
    if (winner === 'draw') return 'Seri!';
    if (winner) return `Pemenang: ${winner}!`;
    return `Giliran: ${currentPlayer}`;
  };

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <PaperTitle as="h2" align="center" className="mb-6">
        Tic Tac Toe
      </PaperTitle>

      {/* Score Board */}
      <div className="grid grid-cols-3 gap-3 mb-6">
        <PaperCard className="text-center">
          <div className="font-display text-2xl font-bold text-[var(--paper-text)]">{scores.X}</div>
          <div className="text-xs text-[var(--paper-muted)] uppercase tracking-wide">Pemain X</div>
        </PaperCard>
        <PaperCard className="text-center">
          <div className="font-display text-2xl font-bold text-[var(--paper-muted)]">{scores.draws}</div>
          <div className="text-xs text-[var(--paper-muted)] uppercase tracking-wide flex items-center justify-center gap-1">
            <Minus className="w-3 h-3" /> Seri
          </div>
        </PaperCard>
        <PaperCard className="text-center">
          <div className="font-display text-2xl font-bold text-[var(--paper-text)]">{scores.O}</div>
          <div className="text-xs text-[var(--paper-muted)] uppercase tracking-wide">Pemain O</div>
        </PaperCard>
      </div>

      {/* Status */}
      <div className={`text-center mb-4 py-2 px-4 rounded-xl border-2 border-[var(--paper-border)] font-display text-lg ${
        winner && winner !== 'draw'
          ? 'bg-[var(--paper-text)] text-[var(--paper-bg)]'
          : winner === 'draw'
            ? 'bg-[var(--paper-muted)] text-[var(--paper-bg)]'
            : 'bg-[var(--paper-card)] text-[var(--paper-text)]'
      }`}>
        {winner && winner !== 'draw' && <Trophy className="inline w-5 h-5 mr-2" />}
        {getStatusMessage()}
      </div>

      {/* Game Board */}
      <div className="game-board p-3 mb-4">
        <div className="grid grid-cols-3 gap-2">
          {board.map((cell, index) => (
            <button
              key={index}
              className={getCellStyle(index)}
              onClick={() => makeMove(index)}
              disabled={!!cell || !!winner}
              aria-label={`Kotak ${index + 1}${cell ? `, isi ${cell}` : ''}`}
            >
              {cell && (
                <span className={winningLine?.includes(index) ? 'animate-pop-in' : ''}>
                  {cell}
                </span>
              )}
            </button>
          ))}
        </div>
      </div>

      {/* Controls */}
      <div className="flex gap-3 justify-center">
        <PaperButton onClick={resetBoard} variant="default" size="md">
          <RotateCcw className="w-4 h-4 mr-2" />
          Ronda Baru
        </PaperButton>
        <PaperButton onClick={resetScores} variant="ghost" size="md">
          Reset Skor
        </PaperButton>
      </div>

      {/* Instructions */}
      <p className="text-center text-sm text-[var(--paper-muted)] mt-6 font-body">
        Dua pemain bergantian mengisi kotak. Pertama mendapat 3 berbaris menang!
      </p>
    </div>
  );
};

export default TicTacToeGame;
