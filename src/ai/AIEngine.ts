import { CellState, Difficulty, AIMoveResult, Player } from '../types/game';

export class AIEngine {
  private readonly BOARD_SIZE = 15;
  private readonly WIN_CONDITION = 5;

  // 搜索深度配置
  private readonly SEARCH_DEPTHS: Record<Difficulty, number> = {
    easy: 2,
    medium: 4,
    hard: 6
  };

  // 评估分数配置
  private readonly SCORES = {
    FIVE: 100000,
    FOUR: 10000,
    THREE: 1000,
    TWO: 100,
    ONE: 10
  };

  getBestMove(board: CellState[][], difficulty: Difficulty): AIMoveResult {
    const startTime = Date.now();
    const depth = this.SEARCH_DEPTHS[difficulty];

    // 使用Minimax算法与Alpha-Beta剪枝
    const result = this.minimax(board, depth, -Infinity, Infinity, true);

    const endTime = Date.now();

    return {
      row: result.row,
      col: result.col,
      score: result.score,
      calculationTime: endTime - startTime
    };
  }

  private minimax(
    board: CellState[][],
    depth: number,
    alpha: number,
    beta: number,
    maximizing: boolean
  ): { row: number; col: number; score: number } {
    // 检查终止条件
    if (depth === 0 || this.isGameOver(board)) {
      return { row: -1, col: -1, score: this.evaluateBoard(board) };
    }

    const moves = this.getAvailableMoves(board);

    if (moves.length === 0) {
      return { row: -1, col: -1, score: this.evaluateBoard(board) };
    }

    if (maximizing) {
      let bestScore = -Infinity;
      let bestMove = { row: moves[0].row, col: moves[0].col };

      for (const move of moves) {
        board[move.row][move.col] = 2; // AI是白棋

        const result = this.minimax(board, depth - 1, alpha, beta, false);

        board[move.row][move.col] = 0; // 撤销落子

        if (result.score > bestScore) {
          bestScore = result.score;
          bestMove = { row: move.row, col: move.col };
        }

        alpha = Math.max(alpha, bestScore);
        if (beta <= alpha) {
          break; // Alpha-Beta剪枝
        }
      }

      return { ...bestMove, score: bestScore };
    } else {
      let bestScore = Infinity;
      let bestMove = { row: moves[0].row, col: moves[0].col };

      for (const move of moves) {
        board[move.row][move.col] = 1; // 玩家是黑棋

        const result = this.minimax(board, depth - 1, alpha, beta, true);

        board[move.row][move.col] = 0; // 撤销落子

        if (result.score < bestScore) {
          bestScore = result.score;
          bestMove = { row: move.row, col: move.col };
        }

        beta = Math.min(beta, bestScore);
        if (beta <= alpha) {
          break; // Alpha-Beta剪枝
        }
      }

      return { ...bestMove, score: bestScore };
    }
  }

  evaluateBoard(board: CellState[][]): number {
    let score = 0;

    // 评估所有可能的五子连线
    score += this.evaluateLines(board, 2); // AI得分
    score -= this.evaluateLines(board, 1); // 玩家得分

    return score;
  }

  private evaluateLines(board: CellState[][], player: Player): number {
    let score = 0;

    // 横向评估
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col <= this.BOARD_SIZE - this.WIN_CONDITION; col++) {
        score += this.evaluateLine(board, row, col, 0, 1, player);
      }
    }

    // 纵向评估
    for (let row = 0; row <= this.BOARD_SIZE - this.WIN_CONDITION; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        score += this.evaluateLine(board, row, col, 1, 0, player);
      }
    }

    // 对角线评估（从左上到右下）
    for (let row = 0; row <= this.BOARD_SIZE - this.WIN_CONDITION; row++) {
      for (let col = 0; col <= this.BOARD_SIZE - this.WIN_CONDITION; col++) {
        score += this.evaluateLine(board, row, col, 1, 1, player);
      }
    }

    // 对角线评估（从右上到左下）
    for (let row = 0; row <= this.BOARD_SIZE - this.WIN_CONDITION; row++) {
      for (let col = this.WIN_CONDITION - 1; col < this.BOARD_SIZE; col++) {
        score += this.evaluateLine(board, row, col, 1, -1, player);
      }
    }

    return score;
  }

  private evaluateLine(
    board: CellState[][],
    startRow: number,
    startCol: number,
    rowDir: number,
    colDir: number,
    player: Player
  ): number {
    let count = 0;
    let emptyCount = 0;

    for (let i = 0; i < this.WIN_CONDITION; i++) {
      const row = startRow + i * rowDir;
      const col = startCol + i * colDir;

      if (board[row][col] === player) {
        count++;
      } else if (board[row][col] === 0) {
        emptyCount++;
      }
    }

    if (count === this.WIN_CONDITION) {
      return this.SCORES.FIVE;
    } else if (count === 4 && emptyCount === 1) {
      return this.SCORES.FOUR;
    } else if (count === 3 && emptyCount === 2) {
      return this.SCORES.THREE;
    } else if (count === 2 && emptyCount === 3) {
      return this.SCORES.TWO;
    } else if (count === 1 && emptyCount === 4) {
      return this.SCORES.ONE;
    }

    return 0;
  }

  checkWin(board: CellState[][], row: number, col: number, player: Player): boolean {
    const directions = [
      [0, 1],  // 横向
      [1, 0],  // 纵向
      [1, 1],  // 对角线
      [1, -1]  // 反对角线
    ];

    for (const [rowDir, colDir] of directions) {
      let count = 1;

      // 正向检查
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const newRow = row + i * rowDir;
        const newCol = col + i * colDir;

        if (newRow >= 0 && newRow < this.BOARD_SIZE &&
            newCol >= 0 && newCol < this.BOARD_SIZE &&
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      // 反向检查
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const newRow = row - i * rowDir;
        const newCol = col - i * colDir;

        if (newRow >= 0 && newRow < this.BOARD_SIZE &&
            newCol >= 0 && newCol < this.BOARD_SIZE &&
            board[newRow][newCol] === player) {
          count++;
        } else {
          break;
        }
      }

      if (count >= this.WIN_CONDITION) {
        return true;
      }
    }

    return false;
  }

  checkDraw(board: CellState[][]): boolean {
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }
    return true;
  }

  getSearchDepth(difficulty: Difficulty): number {
    return this.SEARCH_DEPTHS[difficulty];
  }

  private getAvailableMoves(board: CellState[][]): Array<{ row: number; col: number }> {
    const moves: Array<{ row: number; col: number }> = [];
    const moveSet = new Set<string>();

    // 优先考虑已有棋子周围的位置
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] !== 0) {
          // 检查周围8个位置
          for (let i = -1; i <= 1; i++) {
            for (let j = -1; j <= 1; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (newRow >= 0 && newRow < this.BOARD_SIZE &&
                  newCol >= 0 && newCol < this.BOARD_SIZE &&
                  board[newRow][newCol] === 0) {
                const key = `${newRow},${newCol}`;
                if (!moveSet.has(key)) {
                  moveSet.add(key);
                  moves.push({ row: newRow, col: newCol });
                }
              }
            }
          }
        }
      }
    }

    // 如果没有找到周围位置，返回所有空位置
    if (moves.length === 0) {
      for (let row = 0; row < this.BOARD_SIZE; row++) {
        for (let col = 0; col < this.BOARD_SIZE; col++) {
          if (board[row][col] === 0) {
            moves.push({ row, col });
          }
        }
      }
    }

    return moves;
  }

  private isGameOver(board: CellState[][]): boolean {
    // 检查是否有玩家获胜
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell !== 0) {
          if (this.checkWin(board, row, col, cell as Player)) {
            return true;
          }
        }
      }
    }

    // 检查是否平局
    return this.checkDraw(board);
  }
}
