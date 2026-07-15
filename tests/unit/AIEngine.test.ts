import { AIEngine } from '../../src/ai/AIEngine';
import { CellState, Difficulty, AIMoveResult } from '../../src/types/game';

describe('AIEngine', () => {
  let aiEngine: AIEngine;

  beforeEach(() => {
    aiEngine = new AIEngine();
  });

  test('应该能够计算简单难度的落子', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1; // 玩家在中心落子

    const result = aiEngine.getBestMove(board, 'easy');

    expect(result).toBeDefined();
    expect(result.row).toBeGreaterThanOrEqual(0);
    expect(result.row).toBeLessThan(15);
    expect(result.col).toBeGreaterThanOrEqual(0);
    expect(result.col).toBeLessThan(15);
    expect(board[result.row][result.col]).toBe(0); // 位置应该为空
  });

  test('应该能够计算中等难度的落子', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    board[7][8] = 2;

    const result = aiEngine.getBestMove(board, 'medium');

    expect(result).toBeDefined();
    expect(result.row).toBeGreaterThanOrEqual(0);
    expect(result.row).toBeLessThan(15);
    expect(result.col).toBeGreaterThanOrEqual(0);
    expect(result.col).toBeLessThan(15);
    expect(board[result.row][result.col]).toBe(0);
  });

  test('应该能够计算困难难度的落子并阻止玩家四子连珠', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    board[7][8] = 1;
    board[7][9] = 1;
    board[7][10] = 1; // 玩家有四子连珠 (7,7)-(7,10)

    const result = aiEngine.getBestMove(board, 'hard');

    // AI应该阻止玩家获胜 - 必须落在四子连线的两端之一
    expect(result).toBeDefined();
    expect(board[result.row][result.col]).toBe(0);
    const blocksLeft = result.row === 7 && result.col === 6;
    const blocksRight = result.row === 7 && result.col === 11;
    expect(blocksLeft || blocksRight).toBe(true);
  });

  test('应该评估棋盘状态', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    board[7][8] = 1;
    board[7][9] = 1;

    const score = aiEngine.evaluateBoard(board);

    expect(typeof score).toBe('number');
  });

  test('应该检测获胜条件', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    board[7][8] = 1;
    board[7][9] = 1;
    board[7][10] = 1;
    board[7][11] = 1; // 五子连珠

    const hasWon = aiEngine.checkWin(board, 7, 7, 1);

    expect(hasWon).toBe(true);
  });

  test('应该检测平局条件', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    // 填满棋盘，使用 (i + 2*j) % 5 模式确保任意方向最多连续3个相同值
    // mod 5 的步长在行(2)、列(1)、主对角线(3)、反对角线(4)方向上均不为0，
    // 保证了所有方向的充分交替，不会出现五子连珠
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        board[i][j] = (i + 2 * j) % 5 < 3 ? 1 : 2;
      }
    }

    const isDraw = aiEngine.checkDraw(board);

    expect(isDraw).toBe(true);
  });

  test('满棋盘但有获胜者不应是平局', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    // 填满棋盘，(i+j)%2 模式在主对角线上产生五子连珠
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        board[i][j] = (i + j) % 2 === 0 ? 1 : 2;
      }
    }

    const isDraw = aiEngine.checkDraw(board);

    expect(isDraw).toBe(false);
  });

  test('不同难度应该有不同的搜索深度', () => {
    const easyDepth = aiEngine.getSearchDepth('easy');
    const mediumDepth = aiEngine.getSearchDepth('medium');
    const hardDepth = aiEngine.getSearchDepth('hard');

    expect(easyDepth).toBeLessThan(mediumDepth);
    expect(mediumDepth).toBeLessThan(hardDepth);
  });

  test('应该返回计算时间', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;

    const result = aiEngine.getBestMove(board, 'medium');

    expect(result.calculationTime).toBeGreaterThanOrEqual(0);
    expect(typeof result.calculationTime).toBe('number');
  });

  test('空棋盘调用checkWin应返回false', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));

    expect(aiEngine.checkWin(board, 7, 7, 1)).toBe(false);
    expect(aiEngine.checkWin(board, 0, 0, 2)).toBe(false);
  });

  test('已有获胜者的不完整棋盘调用checkDraw应返回false', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    // 只放五子连珠，其余全是空位
    board[3][3] = 1;
    board[3][4] = 1;
    board[3][5] = 1;
    board[3][6] = 1;
    board[3][7] = 1;

    expect(aiEngine.checkDraw(board)).toBe(false);
  });

  test('checkWin应从连珠的中间位置检测获胜', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[5][3] = 1;
    board[5][4] = 1;
    board[5][5] = 1;
    board[5][6] = 1;
    board[5][7] = 1; // 五子横向连珠

    // 从中间位置(5,5)检测，应该能检测到获胜
    expect(aiEngine.checkWin(board, 5, 5, 1)).toBe(true);
    // 从非端点的靠前位置(5,4)也应能检测到
    expect(aiEngine.checkWin(board, 5, 4, 1)).toBe(true);
    // 从端点位置也能检测到
    expect(aiEngine.checkWin(board, 5, 3, 1)).toBe(true);
    expect(aiEngine.checkWin(board, 5, 7, 1)).toBe(true);
  });

  test('checkWin应检测对角线方向的获胜', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    // 主对角线（左上到右下）
    board[2][2] = 2;
    board[3][3] = 2;
    board[4][4] = 2;
    board[5][5] = 2;
    board[6][6] = 2;

    expect(aiEngine.checkWin(board, 4, 4, 2)).toBe(true);
    expect(aiEngine.checkWin(board, 2, 2, 2)).toBe(true);

    // 反对角线（右上到左下）
    const board2: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board2[2][12] = 1;
    board2[3][11] = 1;
    board2[4][10] = 1;
    board2[5][9] = 1;
    board2[6][8] = 1;

    expect(aiEngine.checkWin(board2, 4, 10, 1)).toBe(true);
    expect(aiEngine.checkWin(board2, 6, 8, 1)).toBe(true);
  });
});
