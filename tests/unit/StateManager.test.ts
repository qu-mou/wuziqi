import { StateManager } from '../../src/core/StateManager';
import { CellState, Player, Move } from '../../src/types/game';

describe('StateManager', () => {
  let stateManager: StateManager;

  beforeEach(() => {
    stateManager = new StateManager();
  });

  // ========== Happy Path Tests ==========

  test('应该初始化15x15的空棋盘', () => {
    const board: CellState[][] = stateManager.getBoard();
    expect(board.length).toBe(15);
    expect(board[0].length).toBe(15);
    expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
  });

  test('应该设置初始玩家为黑棋(1)', () => {
    const player: Player = stateManager.getCurrentPlayer();
    expect(player).toBe(1);
  });

  test('应该设置初始游戏状态为playing', () => {
    expect(stateManager.getGameStatus()).toBe('playing');
  });

  test('应该能够更新棋盘状态', () => {
    stateManager.updateBoard(7, 7, 1);
    const board = stateManager.getBoard();
    expect(board[7][7]).toBe(1);
  });

  test('落子后应自动切换玩家', () => {
    expect(stateManager.getCurrentPlayer()).toBe(1);
    stateManager.updateBoard(7, 7, 1);
    expect(stateManager.getCurrentPlayer()).toBe(2);
    stateManager.updateBoard(8, 8, 2);
    expect(stateManager.getCurrentPlayer()).toBe(1);
  });

  test('应该记录落子历史', () => {
    stateManager.updateBoard(7, 7, 1);
    stateManager.updateBoard(8, 8, 2);

    const history: Move[] = stateManager.getMoveHistory();
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
    stateManager.setDifficulty('hard');

    stateManager.resetGame();

    const board = stateManager.getBoard();
    expect(board.every(row => row.every(cell => cell === 0))).toBe(true);
    expect(stateManager.getCurrentPlayer()).toBe(1);
    expect(stateManager.getMoveHistory().length).toBe(0);
    expect(stateManager.getGameStatus()).toBe('playing');
    expect(stateManager.getDifficulty()).toBe('medium');
  });

  test('应该能够设置游戏难度', () => {
    stateManager.setDifficulty('hard');
    expect(stateManager.getDifficulty()).toBe('hard');
  });

  test('应该能够设置游戏状态', () => {
    stateManager.setGameStatus('black_wins');
    expect(stateManager.getGameStatus()).toBe('black_wins');
  });

  // ========== updateBoard 自动切换玩家 ==========

  test('updateBoard 应自动切换当前玩家', () => {
    expect(stateManager.getCurrentPlayer()).toBe(1);
    stateManager.updateBoard(0, 0, 1);
    expect(stateManager.getCurrentPlayer()).toBe(2);
    stateManager.updateBoard(0, 1, 2);
    expect(stateManager.getCurrentPlayer()).toBe(1);
  });

  test('updateBoard 应在玩家不匹配时抛出错误', () => {
    expect(() => {
      stateManager.updateBoard(7, 7, 2); // currentPlayer 是 1，传入 2 应报错
    }).toThrow('Player does not match current player');
  });

  // ========== Error Path Tests ==========

  describe('updateBoard 错误路径', () => {
    test('行越界（负数）应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.updateBoard(-1, 7, 1);
      }).toThrow('Invalid board position');
    });

    test('行越界（超出棋盘）应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.updateBoard(15, 7, 1);
      }).toThrow('Invalid board position');
    });

    test('列越界（负数）应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.updateBoard(7, -1, 1);
      }).toThrow('Invalid board position');
    });

    test('列越界（超出棋盘）应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.updateBoard(7, 15, 1);
      }).toThrow('Invalid board position');
    });

    test('在已占位格子上落子应抛出 Cell already occupied', () => {
      stateManager.updateBoard(7, 7, 1);
      // currentPlayer 已切换为 2，用 2 落同一个位置
      expect(() => {
        stateManager.updateBoard(7, 7, 2);
      }).toThrow('Cell already occupied');
    });
  });

  describe('removeLastMove 错误路径', () => {
    test('空历史时撤销应返回 null', () => {
      const result = stateManager.removeLastMove();
      expect(result).toBeNull();
    });

    test('撤销后 currentPlayer 应切换回前一个玩家', () => {
      expect(stateManager.getCurrentPlayer()).toBe(1);
      stateManager.updateBoard(7, 7, 1); // currentPlayer -> 2
      expect(stateManager.getCurrentPlayer()).toBe(2);
      stateManager.updateBoard(8, 8, 2); // currentPlayer -> 1
      expect(stateManager.getCurrentPlayer()).toBe(1);

      stateManager.removeLastMove(); // 撤销 2 的落子，currentPlayer -> 2
      expect(stateManager.getCurrentPlayer()).toBe(2);

      stateManager.removeLastMove(); // 撤销 1 的落子，currentPlayer -> 1
      expect(stateManager.getCurrentPlayer()).toBe(1);
    });

    test('撤销后棋盘对应位置应恢复为空', () => {
      stateManager.updateBoard(3, 4, 1);
      expect(stateManager.getCell(3, 4)).toBe(1);

      stateManager.removeLastMove();
      expect(stateManager.getCell(3, 4)).toBe(0);
    });
  });

  describe('isValidMove 边界和已占位', () => {
    test('负坐标应返回 false', () => {
      expect(stateManager.isValidMove(-1, 0)).toBe(false);
      expect(stateManager.isValidMove(0, -1)).toBe(false);
    });

    test('超出棋盘范围应返回 false', () => {
      expect(stateManager.isValidMove(15, 0)).toBe(false);
      expect(stateManager.isValidMove(0, 15)).toBe(false);
    });

    test('已占位格子应返回 false', () => {
      stateManager.updateBoard(7, 7, 1);
      expect(stateManager.isValidMove(7, 7)).toBe(false);
    });

    test('空位应返回 true', () => {
      expect(stateManager.isValidMove(7, 7)).toBe(true);
    });
  });

  describe('getCell 错误路径', () => {
    test('负坐标应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.getCell(-1, 0);
      }).toThrow('Invalid board position');
    });

    test('超出棋盘范围应抛出 Invalid board position', () => {
      expect(() => {
        stateManager.getCell(15, 0);
      }).toThrow('Invalid board position');
    });

    test('有效坐标应返回对应格子状态', () => {
      expect(stateManager.getCell(7, 7)).toBe(0);
      stateManager.updateBoard(7, 7, 1);
      expect(stateManager.getCell(7, 7)).toBe(1);
    });
  });

  describe('isBoardFull', () => {
    test('空棋盘应返回 false', () => {
      expect(stateManager.isBoardFull()).toBe(false);
    });

    test('部分填充时应返回 false', () => {
      stateManager.updateBoard(0, 0, 1);
      expect(stateManager.isBoardFull()).toBe(false);
    });

    test('棋盘满时应返回 true', () => {
      // 循环填满 15x15 = 225 个格子，玩家交替落子
      const size = 15;
      let current: 1 | 2 = 1;
      for (let r = 0; r < size; r++) {
        for (let c = 0; c < size; c++) {
          stateManager.updateBoard(r, c, current);
          current = current === 1 ? 2 : 1;
        }
      }
      expect(stateManager.isBoardFull()).toBe(true);
    });
  });
});
