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

  test('应该能够计算困难难度的落子', () => {
    const board: CellState[][] = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    board[7][8] = 1;
    board[7][9] = 1;
    board[7][10] = 1; // 玩家有四子连珠

    const result = aiEngine.getBestMove(board, 'hard');

    // AI应该阻止玩家获胜
    expect(result).toBeDefined();
    expect(board[result.row][result.col]).toBe(0);
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
    // 填满棋盘但没有五子连珠
    for (let i = 0; i < 15; i++) {
      for (let j = 0; j < 15; j++) {
        board[i][j] = (i + j) % 2 === 0 ? 1 : 2;
      }
    }

    const isDraw = aiEngine.checkDraw(board);

    expect(isDraw).toBe(true);
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
});
