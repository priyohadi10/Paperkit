import { create } from 'zustand';
import type { SnakeState, SnakeDirection } from '@/types';
import { useStatsStore } from './statsStore';

const GRID_SIZE = 20;
const INITIAL_SPEED = 150;

function randomFood(snake: { x: number; y: number }[]): { x: number; y: number } {
  let pos: { x: number; y: number };
  do {
    pos = {
      x: Math.floor(Math.random() * GRID_SIZE),
      y: Math.floor(Math.random() * GRID_SIZE),
    };
  } while (snake.some(s => s.x === pos.x && s.y === pos.y));
  return pos;
}

const initialSnake = [
  { x: 10, y: 10 },
  { x: 9, y: 10 },
  { x: 8, y: 10 },
];

interface SnakeStore extends SnakeState {
  startGame: () => void;
  changeDirection: (dir: SnakeDirection) => void;
  togglePause: () => void;
  gameTick: () => void;
  resetGame: () => void;
}

export const useSnakeStore = create<SnakeStore>((set, get) => ({
  snake: [...initialSnake],
  food: { x: 15, y: 10 },
  direction: 'RIGHT',
  nextDirection: 'RIGHT',
  gameOver: false,
  score: 0,
  highScore: parseInt(localStorage.getItem('snake-high-score') || '0', 10),
  isPaused: false,
  speed: INITIAL_SPEED,
  gridSize: GRID_SIZE,

  startGame: () => {
    set({
      snake: [...initialSnake],
      food: randomFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      gameOver: false,
      score: 0,
      isPaused: false,
      speed: INITIAL_SPEED,
    });
  },

  changeDirection: (dir) => {
    const { direction, gameOver, isPaused } = get();
    if (gameOver) return;
    if (isPaused) return;

    // Prevent reversing
    const opposites: Record<SnakeDirection, SnakeDirection> = {
      UP: 'DOWN', DOWN: 'UP', LEFT: 'RIGHT', RIGHT: 'LEFT',
    };
    if (opposites[dir] === direction) return;

    set({ nextDirection: dir });
  },

  togglePause: () => {
    const { gameOver } = get();
    if (gameOver) return;
    set((s) => ({ isPaused: !s.isPaused }));
  },

  gameTick: () => {
    const { snake, food, nextDirection, gridSize, gameOver, isPaused, score, speed, highScore } = get();
    if (gameOver || isPaused) return;

    const newDirection = nextDirection;
    const head = { ...snake[0] };

    switch (newDirection) {
      case 'UP': head.y -= 1; break;
      case 'DOWN': head.y += 1; break;
      case 'LEFT': head.x -= 1; break;
      case 'RIGHT': head.x += 1; break;
    }

    // Check wall collision
    if (head.x < 0 || head.x >= gridSize || head.y < 0 || head.y >= gridSize) {
      const newHighScore = Math.max(score, highScore);
      localStorage.setItem('snake-high-score', String(newHighScore));

      useStatsStore.getState().recordGame('snake', 'loss', score);

      set({ gameOver: true, highScore: newHighScore });
      return;
    }

    // Check self collision
    if (snake.some((s, i) => i > 0 && s.x === head.x && s.y === head.y)) {
      const newHighScore = Math.max(score, highScore);
      localStorage.setItem('snake-high-score', String(newHighScore));

      useStatsStore.getState().recordGame('snake', 'loss', score);

      set({ gameOver: true, highScore: newHighScore });
      return;
    }

    const newSnake = [head, ...snake];
    let newFood = food;
    let newScore = score;
    let newSpeed = speed;

    // Check food
    if (head.x === food.x && head.y === food.y) {
      newScore = score + 10;
      newFood = randomFood(newSnake);
      // Speed up slightly
      newSpeed = Math.max(80, INITIAL_SPEED - Math.floor(newScore / 50) * 5);
    } else {
      newSnake.pop();
    }

    set({
      snake: newSnake,
      food: newFood,
      direction: newDirection,
      score: newScore,
      speed: newSpeed,
    });
  },

  resetGame: () => {
    set({
      snake: [...initialSnake],
      food: randomFood(initialSnake),
      direction: 'RIGHT',
      nextDirection: 'RIGHT',
      gameOver: false,
      score: 0,
      isPaused: false,
      speed: INITIAL_SPEED,
    });
  },
}));
