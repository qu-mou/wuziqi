import { CellState, Difficulty, AIMoveResult, Player } from '../types/game.js';

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
    // 检查是否所有格子都已填满
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] === 0) {
          return false;
        }
      }
    }

    // 检查是否有玩家获胜（满棋盘但有获胜者不是平局）
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell !== 0 && this.checkWin(board, row, col, cell as Player)) {
          return false;
        }
      }
    }

    return true;
  }

  getSearchDepth(difficulty: Difficulty): number {
    return this.SEARCH_DEPTHS[difficulty];
  }

  private getAvailableMoves(board: CellState[][]): Array<{ row: number; col: number; score: number }> {
    const moves: Array<{ row: number; col: number; score: number }> = [];
    const moveSet = new Set<string>();

    // 优先考虑已有棋子周围的位置
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] !== 0) {
          // 检查周围2格范围内的位置（扩大搜索范围以捕获更多候选走法）
          for (let i = -2; i <= 2; i++) {
            for (let j = -2; j <= 2; j++) {
              const newRow = row + i;
              const newCol = col + j;

              if (newRow >= 0 && newRow < this.BOARD_SIZE &&
                  newCol >= 0 && newCol < this.BOARD_SIZE &&
                  board[newRow][newCol] === 0) {
                const key = `${newRow},${newCol}`;
                if (!moveSet.has(key)) {
                  moveSet.add(key);
                  // 计算启发式评分用于移动排序
                  const moveScore = this.scoreMove(board, newRow, newCol);
                  moves.push({ row: newRow, col: newCol, score: moveScore });
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
            moves.push({ row, col, score: 0 });
          }
        }
      }
    }

    // 按启发式评分降序排序（好的走法优先，提升Alpha-Beta剪枝效率）
    moves.sort((a, b) => b.score - a.score);

    return moves;
  }

  /**
   * 评估单个候选走法的启发式评分
   * 模拟落子后评估局部得分，分越高越值得优先搜索
   */
  private scoreMove(board: CellState[][], row: number, col: number): number {
    let score = 0;

    // 模拟AI落子后的攻击得分
    board[row][col] = 2;
    score += this.evaluatePositionScore(board, row, col, 2) * 2;
    board[row][col] = 0;

    // 模拟玩家落子后的防守得分（防守应与攻击同权重）
    board[row][col] = 1;
    score += this.evaluatePositionScore(board, row, col, 1) * 2;
    board[row][col] = 0;

    // 奖励靠近中心的位置
    const center = Math.floor(this.BOARD_SIZE / 2);
    const distFromCenter = Math.abs(row - center) + Math.abs(col - center);
    score += Math.max(0, (this.BOARD_SIZE - distFromCenter));

    return score;
  }

  /**
   * 评估某个位置落子后对周围连线的贡献
   */
  private evaluatePositionScore(board: CellState[][], row: number, col: number, player: Player): number {
    const directions = [[0, 1], [1, 0], [1, 1], [1, -1]];
    let totalScore = 0;

    for (const [rowDir, colDir] of directions) {
      let count = 0;
      let empty = 0;

      // 正向扫描
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const r = row + i * rowDir;
        const c = col + i * colDir;
        if (r >= 0 && r < this.BOARD_SIZE && c >= 0 && c < this.BOARD_SIZE) {
          if (board[r][c] === player) count++;
          else if (board[r][c] === 0) empty++;
          else break;
        } else break;
      }

      // 反向扫描
      for (let i = 1; i < this.WIN_CONDITION; i++) {
        const r = row - i * rowDir;
        const c = col - i * colDir;
        if (r >= 0 && r < this.BOARD_SIZE && c >= 0 && c < this.BOARD_SIZE) {
          if (board[r][c] === player) count++;
          else if (board[r][c] === 0) empty++;
          else break;
        } else break;
      }

      if (count >= 4) totalScore += this.SCORES.FIVE;
      else if (count === 3 && empty >= 1) totalScore += this.SCORES.FOUR;
      else if (count === 2 && empty >= 2) totalScore += this.SCORES.THREE;
      else if (count === 1 && empty >= 3) totalScore += this.SCORES.TWO;
    }

    return totalScore;
  }

  private isGameOver(board: CellState[][]): boolean {
    let hasEmpty = false;

    // 检查是否有玩家获胜，同时记录是否有空位
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell !== 0) {
          if (this.checkWin(board, row, col, cell as Player)) {
            return true;
          }
        } else {
          hasEmpty = true;
        }
      }
    }

    // 无获胜者时，直接通过是否有空位判断是否平局
    // 避免调用 checkDraw 导致的重复全盘获胜扫描
    return !hasEmpty;
  }
}
