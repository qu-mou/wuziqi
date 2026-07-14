import { StateManager } from '../../src/core/StateManager';
import { CellState, Player, Move, GameState } from '../../src/types/game';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  test('应该初始化15x15的空棋盘', () => {
    const board = stateManager.getBoard();
    expect(board.length).toBe(15);
    expect(board[0].length).toBe(15);
    expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
  });

  test('应该设置初始玩家为黑棋(1)', () => {
    expect(stateManager.getCurrentPlayer()).toBe(1);
  });

  test('应该设置初始游戏状态为playing', () => {
    expect(stateManager.getGameStatus()).toBe('playing');
  });

  test('应该能够更新棋盘状态', () => {
    stateManager.updateBoard(7, 7, 1);
    const board = stateManager.getBoard();
    expect(board[7][7]).toBe(1);
  });

  test('应该能够切换玩家', () => {
    stateManager.switchPlayer();
    expect(stateManager.getCurrentPlayer()).toBe(2);

    stateManager.switchPlayer();
    expect(stateManager.getCurrentPlayer()).toBe(1);
  });

  test('应该记录落子历史', () => {
    stateManager.updateBoard(7, 7, 1);
    stateManager.updateBoard(8, 8, 2);

    const history = stateManager.getMoveHistory();
    expect(history.length).toBe(2);
    expect(history[0]).toEqual(expect.objectContaining({
      row: 7,
      col: 7,
      player: 1
    }));
    expect(history[1]).toEqual(expect.objectContaining({
      row: 8,
      col: 8,
      player: 2
    }));
  });

  test('应该能够撤销最后一步', () => {
    stateManager.updateBoard(7, 7, 1);
    stateManager.updateBoard(8, 8, 2);

    stateManager.removeLastMove();

    const board = stateManager.getBoard();
    expect(board[8][8]).toBe(0);

    const history = stateManager.getMoveHistory();
    expect(history.length).toBe(1);
  });

  test('应该能够重置游戏状态', () => {
    stateManager.updateBoard(7, 7, 1);
    stateManager.updateBoard(8, 8, 2);

    stateManager.resetGame();

    const board = stateManager.getBoard();
    expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
    expect(stateManager.getCurrentPlayer()).toBe(1);
    expect(stateManager.getMoveHistory().length).toBe(0);
    expect(stateManager.getGameStatus()).toBe('playing');
  });

  test('应该能够设置游戏难度', () => {
    stateManager.setDifficulty('hard');
    expect(stateManager.getDifficulty()).toBe('hard');
  });

  test('应该能够设置游戏状态', () => {
    stateManager.setGameStatus('black_wins');
    expect(stateManager.getGameStatus()).toBe('black_wins');
  });
});
