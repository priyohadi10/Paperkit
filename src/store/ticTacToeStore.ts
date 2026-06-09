import { create } from 'zustand';
import type { TicTacToeState, TicTacToeBoard, TicTacToePlayer } from '@/types';
import { useStatsStore } from './statsStore';

const createBoard = (): TicTacToeBoard => Array(9).fill(null);

const WINNING_LINES = [
  [0, 1, 2], [3, 4, 5], [6, 7, 8],
  [0, 3, 6], [1, 4, 7], [2, 5, 8],
  [0, 4, 8], [2, 4, 6],
];

function checkWinner(board: TicTacToeBoard): { winner: TicTacToePlayer | 'draw' | null; line: number[] | null } {
  for (const line of WINNING_LINES) {
    const [a, b, c] = line;
    if (board[a] && board[a] === board[b] && board[a] === board[c]) {
      return { winner: board[a] as TicTacToePlayer, line };
    }
  }

  if (board.every(cell => cell !== null)) {
    return { winner: 'draw', line: null };
  }

  return { winner: null, line: null };
}

interface TicTacToeStore extends TicTacToeState {
  makeMove: (index: number) => void;
  resetBoard: () => void;
  resetScores: () => void;
  init: () => void;
}

export const useTicTacToeStore = create<TicTacToeStore>((set, get) => ({
  board: createBoard(),
  currentPlayer: 'X',
  winner: null,
  scores: { X: 0, O: 0, draws: 0 },
  winningLine: null,

  makeMove: (index) => {
    const { board, currentPlayer, winner } = get();
    if (board[index] || winner) return;

    const newBoard = [...board];
    newBoard[index] = currentPlayer;

    const { winner: gameWinner, line } = checkWinner(newBoard);

    if (gameWinner) {
      const newScores = { ...get().scores };
      if (gameWinner === 'X') newScores.X += 1;
      else if (gameWinner === 'O') newScores.O += 1;
      else if (gameWinner === 'draw') newScores.draws += 1;

      set({
        board: newBoard,
        winner: gameWinner,
        winningLine: line,
        scores: newScores,
        currentPlayer: gameWinner === 'draw' ? get().currentPlayer : currentPlayer,
      });

      // Record stats
      const statsStore = useStatsStore.getState();
      if (gameWinner === 'draw') {
        statsStore.recordGame('tic-tac-toe', 'draw');
      } else {
        statsStore.recordGame('tic-tac-toe', 'win', 1, `Winner: ${gameWinner}`);
      }
    } else {
      set({
        board: newBoard,
        currentPlayer: currentPlayer === 'X' ? 'O' : 'X',
      });
    }
  },

  resetBoard: () => {
    set({
      board: createBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
    });
  },

  resetScores: () => {
    set({
      board: createBoard(),
      currentPlayer: 'X',
      winner: null,
      winningLine: null,
      scores: { X: 0, O: 0, draws: 0 },
    });
  },

  init: () => {
    set({
      board: createBoard(),
      currentPlayer: 'X',
      winner: null,
      scores: { X: 0, O: 0, draws: 0 },
      winningLine: null,
    });
  },
}));
