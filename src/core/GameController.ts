import { StateManager } from './StateManager';
import { AIEngine } from '../ai/AIEngine';
import {
  Difficulty,
  GameStatus,
  GameEvent,
  GameEventType,
  GameEventListener,
  AIMoveResult
} from '../types/game';

export class GameController {
  private stateManager: StateManager;
  private aiEngine: AIEngine;
  private eventListeners: Map<GameEventType, GameEventListener[]>;
  private isAIThinking: boolean;

  constructor() {
    this.stateManager = new StateManager();
    this.aiEngine = new AIEngine();
    this.eventListeners = new Map();
    this.isAIThinking = false;
  }

  startGame(difficulty: Difficulty): void {
    this.stateManager.resetGame();
    this.stateManager.setDifficulty(difficulty);

    this.emitEvent('gameStart', { difficulty });
  }

  makeMove(row: number, col: number): { success: boolean; player?: number; error?: string } {
    if (this.isAIThinking) {
      return { success: false, error: 'AI is thinking' };
    }

    if (this.stateManager.getGameStatus() !== 'playing') {
      return { success: false, error: 'Game is not in progress' };
    }

    if (this.stateManager.getCurrentPlayer() !== 1) {
      return { success: false, error: 'Not player turn' };
    }

    if (!this.stateManager.isValidMove(row, col)) {
      return { success: false, error: 'Invalid move' };
    }

    // 玩家落子 - updateBoard already switches player
    this.stateManager.updateBoard(row, col, 1);
    this.emitEvent('playerMove', { row, col, player: 1 });
    this.emitEvent('moveMade', { row, col, player: 1 });

    // 检查玩家是否获胜
    if (this.aiEngine.checkWin(this.stateManager.getBoard(), row, col, 1)) {
      this.stateManager.setGameStatus('black_wins');
      this.emitEvent('gameOver', { winner: 1 });
      return { success: true, player: 1 };
    }

    // 检查是否平局
    if (this.stateManager.isBoardFull()) {
      this.stateManager.setGameStatus('draw');
      this.emitEvent('gameOver', { winner: 0 });
      return { success: true, player: 1 };
    }

    // 切换到AI (updateBoard already switched player)
    this.emitEvent('stateChanged', this.stateManager.getBoard());

    return { success: true, player: 1 };
  }

  getAIMove(): AIMoveResult {
    if (this.stateManager.getGameStatus() !== 'playing') {
      throw new Error('Game is not in progress');
    }

    if (this.stateManager.getCurrentPlayer() !== 2) {
      throw new Error('Not AI turn');
    }

    this.isAIThinking = true;

    try {
      const difficulty = this.stateManager.getDifficulty();
      const board = this.stateManager.getBoard();

      const aiMove = this.aiEngine.getBestMove(board, difficulty);

      // AI落子 - updateBoard already switches player
      this.stateManager.updateBoard(aiMove.row, aiMove.col, 2);
      this.emitEvent('aiMove', { row: aiMove.row, col: aiMove.col, player: 2 });
      this.emitEvent('moveMade', { row: aiMove.row, col: aiMove.col, player: 2 });

      // 检查AI是否获胜
      if (this.aiEngine.checkWin(this.stateManager.getBoard(), aiMove.row, aiMove.col, 2)) {
        this.stateManager.setGameStatus('white_wins');
        this.emitEvent('gameOver', { winner: 2 });
      }

      // 检查是否平局
      if (this.stateManager.isBoardFull()) {
        this.stateManager.setGameStatus('draw');
        this.emitEvent('gameOver', { winner: 0 });
      }

      // 切换回玩家 (updateBoard already switched player)
      this.emitEvent('stateChanged', this.stateManager.getBoard());

      return aiMove;
    } finally {
      this.isAIThinking = false;
    }
  }

  undoMove(): { success: boolean; error?: string } {
    if (this.isAIThinking) {
      return { success: false, error: 'AI is thinking' };
    }

    if (this.stateManager.getGameStatus() !== 'playing') {
      return { success: false, error: 'Game is not in progress' };
    }

    if (this.stateManager.getCurrentPlayer() !== 1) {
      return { success: false, error: 'Can only undo on player turn' };
    }

    const history = this.stateManager.getMoveHistory();
    if (history.length < 2) {
      return { success: false, error: 'Not enough moves to undo' };
    }

    // 撤销AI的落子 - removeLastMove already switches player
    this.stateManager.removeLastMove();

    // 撤销玩家的落子 - removeLastMove already switches player
    this.stateManager.removeLastMove();

    this.emitEvent('undoMove', {});
    this.emitEvent('stateChanged', this.stateManager.getBoard());

    return { success: true };
  }

  setDifficulty(difficulty: Difficulty): void {
    this.stateManager.setDifficulty(difficulty);
    this.emitEvent('stateChanged', this.stateManager.getBoard());
  }

  resetGame(): void {
    this.stateManager.resetGame();
    this.emitEvent('stateChanged', this.stateManager.getBoard());
  }

  getGameState() {
    return {
      board: this.stateManager.getBoard(),
      currentPlayer: this.stateManager.getCurrentPlayer(),
      moveHistory: this.stateManager.getMoveHistory(),
      gameStatus: this.stateManager.getGameStatus(),
      difficulty: this.stateManager.getDifficulty()
    };
  }

  addEventListener(type: GameEventType, listener: GameEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }

    this.eventListeners.get(type)!.push(listener);
  }

  removeEventListener(type: GameEventType, listener: GameEventListener): void {
    if (!this.eventListeners.has(type)) {
      return;
    }

    const listeners = this.eventListeners.get(type)!;
    const index = listeners.indexOf(listener);

    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  private emitEvent(type: GameEventType, data?: unknown): void {
    const event: GameEvent = {
      type,
      data,
      timestamp: Date.now()
    };

    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }
}
