import {
  CellState,
  Player,
  Move,
  GameStatus,
  Difficulty,
  GameConfig
} from '../types/game';

export class StateManager {
  private board: CellState[][];
  private currentPlayer: Player;
  private moveHistory: Move[];
  private gameStatus: GameStatus;
  private difficulty: Difficulty;
  private config: GameConfig;

  constructor() {
    this.config = {
      boardSize: 15,
      winCondition: 5
    };

    this.board = this.initializeBoard();
    this.currentPlayer = 1; // 黑棋先行
    this.moveHistory = [];
    this.gameStatus = 'playing';
    this.difficulty = 'medium';
  }

  private initializeBoard(): CellState[][] {
    const board: CellState[][] = [];
    for (let i = 0; i < this.config.boardSize; i++) {
      board[i] = [];
      for (let j = 0; j < this.config.boardSize; j++) {
        board[i][j] = 0;
      }
    }
    return board;
  }

  getBoard(): CellState[][] {
    return this.board.map(row => [...row]);
  }

  getCurrentPlayer(): Player {
    return this.currentPlayer;
  }

  getMoveHistory(): Move[] {
    return [...this.moveHistory];
  }

  getGameStatus(): GameStatus {
    return this.gameStatus;
  }

  getDifficulty(): Difficulty {
    return this.difficulty;
  }

  getConfig(): GameConfig {
    return { ...this.config };
  }

  updateBoard(row: number, col: number, player: Player): void {
    if (row < 0 || row >= this.config.boardSize ||
        col < 0 || col >= this.config.boardSize) {
      throw new Error('Invalid board position');
    }

    if (this.board[row][col] !== 0) {
      throw new Error('Cell already occupied');
    }

    this.board[row][col] = player;

    const move: Move = {
      row,
      col,
      player,
      timestamp: Date.now()
    };

    this.moveHistory.push(move);
  }

  switchPlayer(): void {
    this.currentPlayer = this.currentPlayer === 1 ? 2 : 1;
  }

  removeLastMove(): Move | null {
    if (this.moveHistory.length === 0) {
      return null;
    }

    const lastMove = this.moveHistory.pop()!;
    this.board[lastMove.row][lastMove.col] = 0;

    return lastMove;
  }

  resetGame(): void {
    this.board = this.initializeBoard();
    this.currentPlayer = 1;
    this.moveHistory = [];
    this.gameStatus = 'playing';
  }

  setDifficulty(difficulty: Difficulty): void {
    this.difficulty = difficulty;
  }

  setGameStatus(status: GameStatus): void {
    this.gameStatus = status;
  }

  // 检查指定位置是否有效
  isValidMove(row: number, col: number): boolean {
    if (row < 0 || row >= this.config.boardSize ||
        col < 0 || col >= this.config.boardSize) {
      return false;
    }

    return this.board[row][col] === 0;
  }

  // 获取棋盘上指定位置的值
  getCell(row: number, col: number): CellState {
    if (row < 0 || row >= this.config.boardSize ||
        col < 0 || col >= this.config.boardSize) {
      throw new Error('Invalid board position');
    }

    return this.board[row][col];
  }

  // 检查棋盘是否已满
  isBoardFull(): boolean {
    for (let i = 0; i < this.config.boardSize; i++) {
      for (let j = 0; j < this.config.boardSize; j++) {
        if (this.board[i][j] === 0) {
          return false;
        }
      }
    }
    return true;
  }
}
