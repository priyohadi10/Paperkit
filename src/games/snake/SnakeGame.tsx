import React, { useEffect, useRef, useCallback } from 'react';
import { Play, Pause, RotateCcw, ArrowUp, ArrowDown, ArrowLeft, ArrowRight } from 'lucide-react';
import { useSnakeStore } from '@/store/snakeStore';
import { PaperCard } from '@/components/paper/PaperCard';
import { PaperButton } from '@/components/paper/PaperButton';
import { PaperTitle } from '@/components/paper/PaperTitle';

const SnakeGame: React.FC = () => {
  const {
    snake, food, gameOver, score, highScore, isPaused, gridSize,
    startGame, changeDirection, togglePause, gameTick,
  } = useSnakeStore();

  const gameLoopRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const startedRef = useRef(false);

  // Game loop
  useEffect(() => {
    if (gameOver || isPaused) {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    gameLoopRef.current = setInterval(() => {
      gameTick();
    }, useSnakeStore.getState().speed);

    return () => {
      if (gameLoopRef.current) {
        clearInterval(gameLoopRef.current);
        gameLoopRef.current = null;
      }
    };
  }, [gameOver, isPaused]);

  // Keyboard controls
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (gameOver) return;

      switch (e.key) {
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          if (!startedRef.current) {
            startedRef.current = true;
            startGame();
          }
          changeDirection('UP');
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          if (!startedRef.current) {
            startedRef.current = true;
            startGame();
          }
          changeDirection('DOWN');
          break;
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          if (!startedRef.current) {
            startedRef.current = true;
            startGame();
          }
          changeDirection('LEFT');
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          if (!startedRef.current) {
            startedRef.current = true;
            startGame();
          }
          changeDirection('RIGHT');
          break;
        case ' ':
        case 'p':
        case 'P':
          e.preventDefault();
          if (!startedRef.current) {
            startedRef.current = true;
            startGame();
          } else {
            togglePause();
          }
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [gameOver, startGame, changeDirection, togglePause]);

  const handleDirectionClick = useCallback((dir: 'UP' | 'DOWN' | 'LEFT' | 'RIGHT') => {
    if (!startedRef.current) {
      startedRef.current = true;
      startGame();
    }
    changeDirection(dir);
  }, [startGame, changeDirection]);

  const getCellContent = useCallback((x: number, y: number) => {
    // Check food
    if (food.x === x && food.y === y) {
      return 'food';
    }

    // Check snake
    const snakeIndex = snake.findIndex(s => s.x === x && s.y === y);
    if (snakeIndex === -1) return 'empty';

    if (snakeIndex === 0) return 'head';
    return 'body';
  }, [snake, food]);

  const CELL_SIZE = Math.min(320 / gridSize, 18);

  return (
    <div className="w-full max-w-lg mx-auto px-4">
      <PaperTitle as="h2" align="center" className="mb-4">
        Ular Tangga
      </PaperTitle>

      {/* Score */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <PaperCard className="text-center">
          <div className="font-display text-2xl font-bold text-[var(--paper-text)]">{score}</div>
          <div className="text-xs text-[var(--paper-muted)] uppercase tracking-wide">Skor</div>
        </PaperCard>
        <PaperCard className="text-center">
          <div className="font-display text-2xl font-bold text-[var(--paper-text)]">{highScore}</div>
          <div className="text-xs text-[var(--paper-muted)] uppercase tracking-wide">Tertinggi</div>
        </PaperCard>
      </div>

      {/* Game Area */}
      <div className="game-board p-2 mb-4 relative">
        {/* Status overlay */}
        {!startedRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
            <div className="text-center text-white">
              <Play className="w-12 h-12 mx-auto mb-2" />
              <p className="font-display text-xl">Tekan tombol arah untuk mulai</p>
            </div>
          </div>
        )}

        {isPaused && startedRef.current && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-xl z-10">
            <div className="text-center text-white">
              <Pause className="w-12 h-12 mx-auto mb-2" />
              <p className="font-display text-xl">Dijeda</p>
              <p className="text-sm mt-1">Tekan P atau Spasi</p>
            </div>
          </div>
        )}

        {gameOver && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/70 rounded-xl z-10">
            <div className="text-center text-white">
              <p className="font-display text-3xl mb-2">Game Over!</p>
              <p className="text-lg mb-4">Skor: {score}</p>
              <PaperButton onClick={() => { startedRef.current = true; startGame(); }} variant="primary">
                <RotateCcw className="w-4 h-4 mr-2" />
                Main Lagi
              </PaperButton>
            </div>
          </div>
        )}

        {/* Grid */}
        <div
          className="grid mx-auto"
          style={{
            gridTemplateColumns: `repeat(${gridSize}, ${CELL_SIZE}px)`,
            gap: '1px',
            width: 'fit-content',
          }}
        >
          {Array.from({ length: gridSize * gridSize }).map((_, i) => {
            const x = i % gridSize;
            const y = Math.floor(i / gridSize);
            const content = getCellContent(x, y);

            return (
              <div
                key={i}
                className={`rounded-sm ${
                  content === 'head'
                    ? 'bg-[var(--paper-text)] animate-pulse-paper'
                    : content === 'body'
                      ? 'bg-[var(--paper-text)] opacity-80'
                      : content === 'food'
                        ? 'bg-red-500 rounded-full animate-bounce-slight'
                        : 'bg-[var(--paper-bg)] opacity-30'
                }`}
                style={{ width: CELL_SIZE, height: CELL_SIZE }}
              />
            );
          })}
        </div>
      </div>

      {/* Mobile Controls */}
      <div className="flex justify-center mb-4">
        <div className="grid grid-cols-3 gap-2 w-40">
          <div />
          <PaperButton
            onClick={() => handleDirectionClick('UP')}
            className="!p-2 !min-h-[44px]"
            ariaLabel="Atas"
          >
            <ArrowUp className="w-5 h-5" />
          </PaperButton>
          <div />
          <PaperButton
            onClick={() => handleDirectionClick('LEFT')}
            className="!p-2 !min-h-[44px]"
            ariaLabel="Kiri"
          >
            <ArrowLeft className="w-5 h-5" />
          </PaperButton>
          <PaperButton
            onClick={() => {
              if (!startedRef.current) {
                startedRef.current = true;
                startGame();
              } else {
                togglePause();
              }
            }}
            variant="primary"
            className="!p-2 !min-h-[44px]"
            ariaLabel={isPaused ? 'Lanjutkan' : 'Jeda'}
          >
            {isPaused ? <Play className="w-5 h-5" /> : <Pause className="w-5 h-5" />}
          </PaperButton>
          <PaperButton
            onClick={() => handleDirectionClick('RIGHT')}
            className="!p-2 !min-h-[44px]"
            ariaLabel="Kanan"
          >
            <ArrowRight className="w-5 h-5" />
          </PaperButton>
          <div />
          <PaperButton
            onClick={() => handleDirectionClick('DOWN')}
            className="!p-2 !min-h-[44px]"
            ariaLabel="Bawah"
          >
            <ArrowDown className="w-5 h-5" />
          </PaperButton>
          <div />
        </div>
      </div>

      <div className="text-center text-sm text-[var(--paper-muted)] font-body">
        <p>Gunakan tombol arah atau WASD untuk bergerak</p>
        <p className="mt-1">Tekan P atau Spasi untuk menjeda</p>
      </div>
    </div>
  );
};

export default SnakeGame;
