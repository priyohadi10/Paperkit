import React, { useState, useEffect, useRef } from 'react';
import { Users, Clock, ArrowRight, Send, RotateCcw, Trophy, Heart, AlertCircle, BookOpen, Skull } from 'lucide-react';
import { useSambungKataStore } from '@/store/sambungKataStore';
import type { SambungKataTimerOption } from '@/types';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperInput } from '@/components/paper/PaperInput';
import { PaperTitle } from '@/components/paper/PaperTitle';

const TIMER_OPTIONS: { value: SambungKataTimerOption; label: string }[] = [
  { value: 30, label: '30 detik' },
  { value: 60, label: '1 menit' },
  { value: 120, label: '2 menit' },
  { value: 300, label: '5 menit' },
];

const SambungKataGame: React.FC = () => {
  const store = useSambungKataStore();
  const {
    players, usedWords, currentPlayerIndex, currentLetter, gamePhase, winner,
    timerDuration, totalPlayers,
    addPlayer, removePlayer, setTimerDuration, setTotalPlayers, startGame,
    submitWord, tickTimer, resetGame, getCurrentPlayer,
    getLastWord, getWinner, isGameOver,
  } = store;

  const [wordInput, setWordInput] = useState('');
  const [playerNameInput, setPlayerNameInput] = useState('');
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Timer effect
  useEffect(() => {
    if (gamePhase === 'playing' && !isGameOver()) {
      timerRef.current = setInterval(() => {
        tickTimer();
      }, 1000);
    }

    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current);
      }
    };
  }, [gamePhase, isGameOver, tickTimer]);

  // Auto-focus input
  useEffect(() => {
    if (gamePhase === 'playing') {
      inputRef.current?.focus();
    }
  }, [gamePhase, currentPlayerIndex]);

  const handleAddPlayer = () => {
    if (!playerNameInput.trim()) return;
    if (players.length >= totalPlayers) return;
    addPlayer(playerNameInput.trim());
    setPlayerNameInput('');
  };

  const handleSubmitWord = () => {
    if (!wordInput.trim()) return;
    const result = submitWord(wordInput.trim());

    if (result.success) {
      setFeedback({ type: 'success', message: result.message });
      setWordInput('');
    } else {
      setFeedback({ type: 'error', message: result.message });
    }

    // Clear feedback after 2 seconds
    setTimeout(() => setFeedback(null), 2000);
  };

  const currentPlayer = getCurrentPlayer();
  const lastWord = getLastWord();
  const winnerPlayer = getWinner();

  // Setup Phase
  if (gamePhase === 'setup') {
    return (
      <div className="w-full max-w-lg mx-auto px-4">
        <PaperTitle as="h2" align="center" className="mb-6">
          Sambung Kata KBBI
        </PaperTitle>

        {/* Player Count */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <Users className="w-5 h-5" />
            Jumlah Pemain
          </h3>
          <div className="flex gap-2 flex-wrap">
            {[2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
              <PaperButton
                key={n}
                variant={totalPlayers === n ? 'primary' : 'default'}
                onClick={() => setTotalPlayers(n)}
                size="sm"
              >
                {n}
              </PaperButton>
            ))}
          </div>
        </PaperCard>

        {/* Timer Selection */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3 flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Waktu per Giliran
          </h3>
          <div className="flex gap-2 flex-wrap">
            {TIMER_OPTIONS.map((opt) => (
              <PaperButton
                key={opt.value}
                variant={timerDuration === opt.value ? 'primary' : 'default'}
                onClick={() => setTimerDuration(opt.value)}
                size="sm"
              >
                {opt.label}
              </PaperButton>
            ))}
          </div>
        </PaperCard>

        {/* Add Players */}
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-3">Daftar Pemain ({players.length}/{totalPlayers})</h3>

          {players.length < totalPlayers && (
            <div className="flex gap-2 mb-3">
              <PaperInput
                value={playerNameInput}
                onChange={setPlayerNameInput}
                placeholder={`Nama Pemain ${players.length + 1}`}
                className="flex-1"
                onKeyDown={(e) => e.key === 'Enter' && handleAddPlayer()}
              />
              <PaperButton onClick={handleAddPlayer} variant="primary" size="sm">
                <ArrowRight className="w-4 h-4" />
              </PaperButton>
            </div>
          )}

          {/* Player List */}
          <div className="space-y-2">
            {players.map((p) => (
              <div
                key={p.id}
                className="flex items-center justify-between p-2 bg-[var(--paper-bg)] rounded-lg"
              >
                <span className="font-medium">{p.name}</span>
                <PaperButton
                  onClick={() => removePlayer(p.id)}
                  variant="ghost"
                  size="sm"
                  className="!min-h-[32px] !px-2"
                >
                  <Skull className="w-4 h-4 text-red-500" />
                </PaperButton>
              </div>
            ))}
          </div>

          {players.length === 0 && (
            <p className="text-center text-sm text-[var(--paper-muted)] py-4">
              Tambahkan minimal 2 pemain untuk mulai
            </p>
          )}
        </PaperCard>

        <PaperButton
          onClick={startGame}
          disabled={players.length < 2}
          variant="primary"
          className="w-full"
        >
          <BookOpen className="w-5 h-5 mr-2" />
          Mulai Permainan!
        </PaperButton>
      </div>
    );
  }

  // Playing or Finished Phase
  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <PaperTitle as="h2" align="center" className="mb-4">
        Sambung Kata
      </PaperTitle>

      {/* Players Status */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mb-4">
        {players.map((p) => (
          <PaperCard
            key={p.id}
            className={`p-2 ${
              p.isEliminated
                ? 'opacity-50'
                : players[currentPlayerIndex]?.id === p.id
                  ? 'ring-2 ring-[var(--paper-text)]'
                  : ''
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`font-display text-sm font-bold ${p.isEliminated ? 'line-through' : ''}`}>
                {p.name}
              </span>
              {!p.isEliminated && (
                <span className="font-display text-xs">
                  {Math.floor(p.timeLeft / 60)}:{(p.timeLeft % 60).toString().padStart(2, '0')}
                </span>
              )}
            </div>
            <div className="flex gap-0.5 mt-1">
              {[...Array(3)].map((_, i) => (
                <Heart
                  key={i}
                  className={`w-3 h-3 ${i < p.lives ? 'text-red-500 fill-red-500' : 'text-[var(--paper-muted)]'}`}
                />
              ))}
            </div>
          </PaperCard>
        ))}
      </div>

      {/* Current Letter & Turn */}
      {!winner && (
        <PaperCard className="mb-4 text-center">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <p className="text-sm text-[var(--paper-muted)]">Huruf yang diminta</p>
              <p className="font-display text-4xl font-bold text-[var(--paper-text)]">
                {currentLetter.toUpperCase()}
              </p>
            </div>
            <div className="w-px h-16 bg-[var(--paper-border)]" />
            <div className="flex-1">
              <p className="text-sm text-[var(--paper-muted)]">Giliran</p>
              <p className="font-display text-xl font-bold text-[var(--paper-text)] truncate px-2">
                {currentPlayer?.name || '?'}
              </p>
              {currentPlayer && (
                <p className="font-display text-lg text-[var(--paper-text)]">
                  {Math.floor(currentPlayer.timeLeft / 60)}:{(currentPlayer.timeLeft % 60).toString().padStart(2, '0')}
                </p>
              )}
            </div>
          </div>
        </PaperCard>
      )}

      {/* Last Word */}
      {lastWord && (
        <PaperCard className="mb-4 text-center">
          <p className="text-sm text-[var(--paper-muted)]">Kata terakhir</p>
          <p className="font-display text-2xl font-bold text-[var(--paper-text)]">
            {lastWord}
          </p>
        </PaperCard>
      )}

      {/* Winner */}
      {winner && winnerPlayer && (
        <PaperCard className="mb-4 text-center bg-[var(--paper-text)] text-[var(--paper-bg)]">
          <Trophy className="w-8 h-8 mx-auto mb-2" />
          <p className="font-display text-2xl font-bold">{winnerPlayer.name} Menang!</p>
          <p className="text-sm opacity-80 mt-1">
            Total kata: {usedWords.length}
          </p>
        </PaperCard>
      )}

      {/* Word Input */}
      {!winner && (
        <PaperCard className="mb-4">
          {/* Feedback */}
          {feedback && (
            <div className={`flex items-center gap-2 p-2 rounded-lg mb-3 ${
              feedback.type === 'success'
                ? 'bg-green-100 dark:bg-green-900/30 text-green-700'
                : 'bg-red-100 dark:bg-red-900/30 text-red-700'
            }`}>
              {feedback.type === 'error' ? (
                <AlertCircle className="w-4 h-4 shrink-0" />
              ) : (
                <CheckIcon className="w-4 h-4 shrink-0" />
              )}
              <span className="text-sm">{feedback.message}</span>
            </div>
          )}

          <p className="text-sm text-[var(--paper-muted)] mb-2">
            Masukkan kata yang dimulai dengan &quot;{currentLetter.toUpperCase()}&quot;
          </p>
          <div className="flex gap-2">
            <PaperInput
              ref={inputRef}
              value={wordInput}
              onChange={setWordInput}
              placeholder={`Kata dengan huruf ${currentLetter.toUpperCase()}...`}
              className="flex-1"
              onKeyDown={(e) => e.key === 'Enter' && handleSubmitWord()}
            />
            <PaperButton onClick={handleSubmitWord} variant="primary">
              <Send className="w-5 h-5" />
            </PaperButton>
          </div>
        </PaperCard>
      )}

      {/* Used Words */}
      {usedWords.length > 0 && (
        <PaperCard className="mb-4">
          <h3 className="font-display text-lg font-bold mb-2">
            Kata yang Sudah Digunakan ({usedWords.length})
          </h3>
          <div className="flex flex-wrap gap-2 max-h-32 overflow-y-auto">
            {usedWords.map((word, i) => (
              <span
                key={i}
                className="px-2 py-1 bg-[var(--paper-bg)] rounded-md text-sm font-medium"
              >
                {word}
              </span>
            ))}
          </div>
        </PaperCard>
      )}

      <PaperButton onClick={resetGame} variant="default" className="w-full">
        <RotateCcw className="w-4 h-4 mr-2" />
        Main Lagi
      </PaperButton>
    </div>
  );
};

function CheckIcon({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12" />
    </svg>
  );
}

export default SambungKataGame;
