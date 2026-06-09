import React, { useState } from 'react';
import { ArrowRight, RotateCcw, Target, TrendingUp, TrendingDown, Check } from 'lucide-react';
import { useDuelStore, NUMBER_DUEL_RANGES } from '@/store/duelStore';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperInput } from '@/components/paper/PaperInput';
import { PaperTitle } from '@/components/paper/PaperTitle';

const NumberDuelGame: React.FC = () => {
  const {
    player1Secret, player2Secret, currentPlayer, range, guesses,
    winner, gamePhase, player1Name, player2Name,
    setPlayerSecret, makeGuess, setRange, setPlayerNames, startGame, resetGame,
  } = useDuelStore();

  const [secretInput, setSecretInput] = useState('');
  const [guessInput, setGuessInput] = useState('');
  const [name1Input, setName1Input] = useState(player1Name);
  const [name2Input, setName2Input] = useState(player2Name);

  const handleSetSecret = (player: 1 | 2) => {
    const num = parseInt(secretInput, 10);
    if (isNaN(num) || num < range.min || num > range.max) return;
    setPlayerSecret(player, num);
    setSecretInput('');
  };

  const handleGuess = (player: 1 | 2) => {
    const num = parseInt(guessInput, 10);
    if (isNaN(num) || num < range.min || num > range.max) return;
    makeGuess(player, num);
    setGuessInput('');
  };

  const handleStart = () => {
    setPlayerNames(name1Input || 'Pemain 1', name2Input || 'Pemain 2');
    startGame();
  };

  const getGuessIcon = (result: string) => {
    switch (result) {
      case 'too-high': return <TrendingUp className="w-4 h-4 text-red-500" />;
      case 'too-low': return <TrendingDown className="w-4 h-4 text-blue-500" />;
      case 'correct': return <Check className="w-4 h-4 text-green-500" />;
      default: return null;
    }
  };

  const getGuessLabel = (result: string) => {
    switch (result) {
      case 'too-high': return 'Terlalu Tinggi';
      case 'too-low': return 'Terlalu Rendah';
      case 'correct': return 'Benar!';
      default: return '';
    }
  };

  // Setup Phase
  if (gamePhase === 'setup') {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <PaperTitle as="h2" align="center" className="mb-6">
          Number Duel
        </PaperTitle>

        {/* Player Names */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Nama Pemain</h3>
          <div className="space-y-3">
            <div>
              <label className="paper-label text-sm mb-1 block">Pemain 1</label>
              <PaperInput
                value={name1Input}
                onChange={setName1Input}
                placeholder="Nama Pemain 1"
              />
            </div>
            <div>
              <label className="paper-label text-sm mb-1 block">Pemain 2</label>
              <PaperInput
                value={name2Input}
                onChange={setName2Input}
                placeholder="Nama Pemain 2"
              />
            </div>
          </div>
        </PaperCard>

        {/* Range Selection */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Rentang Angka</h3>
          <div className="flex gap-2 flex-wrap">
            {NUMBER_DUEL_RANGES.map((r) => (
              <PaperButton
                key={r.label}
                variant={range.min === r.min && range.max === r.max ? 'primary' : 'default'}
                onClick={() => setRange({ min: r.min, max: r.max })}
                size="sm"
              >
                {r.label}
              </PaperButton>
            ))}
          </div>
        </PaperCard>

        {/* Set Secrets */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">
            <Target className="inline w-5 h-5 mr-2" />
            Atur Angka Rahasia
          </h3>
          <p className="text-sm text-[var(--paper-muted)] mb-4">
            Masukkan angka rahasia untuk masing-masing pemain ({range.min} - {range.max})
          </p>

          {/* Player 1 Secret */}
          <div className="mb-4 p-3 border-2 border-[var(--paper-border)] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold">{name1Input || 'Pemain 1'}</span>
              {player1Secret !== null ? (
                <span className="text-green-500 font-bold text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Sudah atur
                </span>
              ) : (
                <span className="text-[var(--paper-muted)] text-sm">Belum atur</span>
              )}
            </div>
            {player1Secret === null && (
              <div className="flex gap-2">
                <PaperInput
                  value={secretInput}
                  onChange={setSecretInput}
                  placeholder={`${range.min}-${range.max}`}
                  type="number"
                  min={range.min}
                  max={range.max}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetSecret(1)}
                />
                <PaperButton onClick={() => handleSetSecret(1)} variant="primary" size="sm">
                  Simpan
                </PaperButton>
              </div>
            )}
          </div>

          {/* Player 2 Secret */}
          <div className="p-3 border-2 border-[var(--paper-border)] rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <span className="font-display font-bold">{name2Input || 'Pemain 2'}</span>
              {player2Secret !== null ? (
                <span className="text-green-500 font-bold text-sm flex items-center gap-1">
                  <Check className="w-4 h-4" /> Sudah atur
                </span>
              ) : (
                <span className="text-[var(--paper-muted)] text-sm">Belum atur</span>
              )}
            </div>
            {player2Secret === null && (
              <div className="flex gap-2">
                <PaperInput
                  value={secretInput}
                  onChange={setSecretInput}
                  placeholder={`${range.min}-${range.max}`}
                  type="number"
                  min={range.min}
                  max={range.max}
                  className="flex-1"
                  onKeyDown={(e) => e.key === 'Enter' && handleSetSecret(2)}
                />
                <PaperButton onClick={() => handleSetSecret(2)} variant="primary" size="sm">
                  Simpan
                </PaperButton>
              </div>
            )}
          </div>
        </PaperCard>

        <PaperButton
          onClick={handleStart}
          disabled={player1Secret === null || player2Secret === null}
          variant="primary"
          className="w-full"
        >
          <PlayIcon className="w-5 h-5 mr-2" />
          Mulai Permainan!
        </PaperButton>
      </div>
    );
  }

  // Playing or Finished Phase
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <PaperTitle as="h2" align="center" className="mb-4">
        Number Duel
      </PaperTitle>

      {/* Current Turn Indicator */}
      {!winner && (
        <PaperCard className="mb-4 text-center">
          <p className="text-sm text-[var(--paper-muted)]">Giliran menebak:</p>
          <p className="font-display text-xl font-bold">
            {currentPlayer === 1 ? (player1Name || 'Pemain 1') : (player2Name || 'Pemain 2')}
          </p>
        </PaperCard>
      )}

      {/* Winner */}
      {winner && (
        <PaperCard className="mb-4 text-center bg-[var(--paper-text)] text-[var(--paper-bg)]">
          <Check className="w-8 h-8 mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">
            {winner === 1 ? (player1Name || 'Pemain 1') : (player2Name || 'Pemain 2')} Menang!
          </p>
        </PaperCard>
      )}

      {/* Guess Input */}
      {!winner && (
        <PaperCard className="mb-4">
          <p className="text-sm text-[var(--paper-muted)] mb-2">
            Tebak angka lawan ({range.min} - {range.max})
          </p>
          <div className="flex gap-2">
            <PaperInput
              value={guessInput}
              onChange={setGuessInput}
              placeholder={`${range.min}-${range.max}`}
              type="number"
              min={range.min}
              max={range.max}
              className="flex-1"
              autoFocus
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleGuess(currentPlayer);
                }
              }}
            />
            <PaperButton onClick={() => handleGuess(currentPlayer)} variant="primary">
              <ArrowRight className="w-5 h-5" />
            </PaperButton>
          </div>
        </PaperCard>
      )}

      {/* Guess History */}
      {guesses.length > 0 && (
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Riwayat Tebakan</h3>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {[...guesses].reverse().map((guess, i) => (
              <div
                key={i}
                className={`flex items-center justify-between p-2 rounded-lg ${
                  guess.result === 'correct'
                    ? 'bg-green-100 dark:bg-green-900/30'
                    : 'bg-[var(--paper-bg)]'
                }`}
              >
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium">
                    {guess.player === 1 ? (player1Name || 'P1') : (player2Name || 'P2')}
                  </span>
                  <ArrowRight className="w-3 h-3 text-[var(--paper-muted)]" />
                  <span className="font-display font-bold text-lg">{guess.number}</span>
                </div>
                <div className="flex items-center gap-1">
                  {getGuessIcon(guess.result)}
                  <span className={`text-sm font-medium ${
                    guess.result === 'correct' ? 'text-green-600' :
                    guess.result === 'too-high' ? 'text-red-500' : 'text-blue-500'
                  }`}>
                    {getGuessLabel(guess.result)}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </PaperCard>
      )}

      {/* Reset */}
      <PaperButton onClick={resetGame} variant="default" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Main Lagi
      </PaperButton>
    </div>
  );
};

function PlayIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="currentColor">
      <polygon points="5 3 19 12 5 21 5 3" />
    </svg>
  );
}

export default NumberDuelGame;
