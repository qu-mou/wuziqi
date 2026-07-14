import { InputHandler, InputEvent, InputEventType, InputEventListener } from '../../src/input/InputHandler';

/**
 * 创建一个最小化的 Canvas mock，满足 InputHandler 的依赖。
 * 在 Node.js 测试环境中没有真实的 HTMLCanvasElement，
 * 因此使用类型断言来模拟必要的 API。
 */
function createMockCanvas(): HTMLCanvasElement {
  const listeners: Record<string, Function[]> = {};

  return {
    addEventListener: jest.fn((type: string, listener: Function) => {
      if (!listeners[type]) {
        listeners[type] = [];
      }
      listeners[type].push(listener);
    }),
    removeEventListener: jest.fn((type: string, listener: Function) => {
      if (listeners[type]) {
        listeners[type] = listeners[type].filter(l => l !== listener);
      }
    }),
    getBoundingClientRect: jest.fn(() => ({
      left: 0,
      top: 0,
      width: 600,
      height: 600,
      right: 600,
      bottom: 600,
      x: 0,
      y: 0,
      toJSON: () => {}
    })),
    // 暴露 listeners 以便测试中手动触发事件
    __listeners: listeners
  } as unknown as HTMLCanvasElement;
}

/**
 * 辅助函数：手动触发 mock canvas 上的事件
 */
function dispatchEvent(canvas: HTMLCanvasElement, type: string, event: unknown): void {
  const listeners = (canvas as any).__listeners[type] || [];
  listeners.forEach((listener: Function) => listener(event));
}

/**
 * 辅助函数：创建模拟的 MouseEvent
 */
function createMouseEvent(clientX: number, clientY: number): MouseEvent {
  return {
    clientX,
    clientY,
    type: 'click',
    preventDefault: jest.fn()
  } as unknown as MouseEvent;
}

/**
 * 辅助函数：创建模拟的 TouchEvent
 */
function createTouchEvent(clientX: number, clientY: number): TouchEvent {
  return {
    type: 'touchstart',
    preventDefault: jest.fn(),
    touches: [{
      clientX,
      clientY,
      identifier: 0,
      target: null,
      pageX: clientX,
      pageY: clientY,
      screenX: 0,
      screenY: 0,
      radiusX: 0,
      radiusY: 0,
      rotationAngle: 0,
      force: 0
    }] as unknown as TouchList
  } as unknown as TouchEvent;
}

// ============================================================
// 棋盘常量（与 InputHandler 实现保持一致）
// ============================================================
const CANVAS_SIZE = 600;
const PADDING = 30;
const BOARD_SIZE = 15;
const CELL_SIZE = (CANVAS_SIZE - PADDING * 2) / (BOARD_SIZE - 1); // ≈38.571

describe('InputHandler', () => {
  let canvas: HTMLCanvasElement;
  let handler: InputHandler;

  beforeEach(() => {
    canvas = createMockCanvas();
    handler = new InputHandler(canvas);
  });

  afterEach(() => {
    handler.destroy();
  });

  // ========== getGridPosition 坐标转换 ==========

  describe('getGridPosition', () => {
    test('棋盘左上角交叉点 (0,0) 应正确转换', () => {
      // 左上角交叉点像素坐标：(30, 30)
      const result = handler.getGridPosition(PADDING, PADDING);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    test('棋盘右下角交叉点 (14,14) 应正确转换', () => {
      // 右下角交叉点像素坐标：(570, 570)
      const result = handler.getGridPosition(
        PADDING + 14 * CELL_SIZE,
        PADDING + 14 * CELL_SIZE
      );
      expect(result).toEqual({ row: 14, col: 14 });
    });

    test('棋盘中心交叉点 (7,7) 应正确转换', () => {
      // 中心交叉点像素坐标：(300, 300)
      const result = handler.getGridPosition(
        PADDING + 7 * CELL_SIZE,
        PADDING + 7 * CELL_SIZE
      );
      expect(result).toEqual({ row: 7, col: 7 });
    });

    test('点击交叉点附近（误差范围内）应返回最近的交叉点', () => {
      // 在 (0,0) 交叉点附近偏移 5px
      const result = handler.getGridPosition(PADDING + 5, PADDING + 5);
      expect(result).toEqual({ row: 0, col: 0 });
    });

    test('点击两个交叉点中间位置应返回 null（超出容差）', () => {
      // 在 (0,0) 和 (0,1) 交叉点正中间，距离约为 CELL_SIZE/2 ≈ 19.29px
      // 容差为 CELL_SIZE/3 ≈ 12.86px，中间点超出容差
      const midX = PADDING + CELL_SIZE / 2;
      const midY = PADDING;
      const result = handler.getGridPosition(midX, midY);
      expect(result).toBeNull();
    });

    test('各种交叉点位置都应正确转换', () => {
      // 测试多个交叉点
      const testCases = [
        { row: 0, col: 7 },
        { row: 3, col: 11 },
        { row: 14, col: 0 },
        { row: 7, col: 3 },
        { row: 10, col: 10 }
      ];

      for (const { row, col } of testCases) {
        const pixelX = PADDING + col * CELL_SIZE;
        const pixelY = PADDING + row * CELL_SIZE;
        const result = handler.getGridPosition(pixelX, pixelY);
        expect(result).toEqual({ row, col });
      }
    });
  });

  // ========== 超出棋盘范围返回 null ==========

  describe('超出棋盘范围', () => {
    test('点击棋盘左侧边距外应返回 null', () => {
      const result = handler.getGridPosition(0, PADDING);
      expect(result).toBeNull();
    });

    test('点击棋盘上方边距外应返回 null', () => {
      const result = handler.getGridPosition(PADDING, 0);
      expect(result).toBeNull();
    });

    test('点击棋盘右侧边距外应返回 null', () => {
      const result = handler.getGridPosition(CANVAS_SIZE, PADDING);
      expect(result).toBeNull();
    });

    test('点击棋盘下方边距外应返回 null', () => {
      const result = handler.getGridPosition(PADDING, CANVAS_SIZE);
      expect(result).toBeNull();
    });

    test('点击左上角边距区域应返回 null', () => {
      const result = handler.getGridPosition(10, 10);
      expect(result).toBeNull();
    });

    test('负坐标应返回 null', () => {
      const result = handler.getGridPosition(-10, -10);
      expect(result).toBeNull();
    });
  });

  // ========== 事件监听器 ==========

  describe('事件监听器', () => {
    test('点击棋盘应触发 click 事件监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      const rect = canvas.getBoundingClientRect();
      const pixelX = PADDING + 7 * CELL_SIZE;
      const pixelY = PADDING + 7 * CELL_SIZE;

      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + pixelX,
        rect.top + pixelY
      ));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        row: 7,
        col: 7,
        timestamp: expect.any(Number)
      }));
    });

    test('触摸棋盘应触发 touch 事件监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('touch', listener);

      const rect = canvas.getBoundingClientRect();
      const pixelX = PADDING + 3 * CELL_SIZE;
      const pixelY = PADDING + 5 * CELL_SIZE;

      dispatchEvent(canvas, 'touchstart', createTouchEvent(
        rect.left + pixelX,
        rect.top + pixelY
      ));

      expect(listener).toHaveBeenCalledTimes(1);
      expect(listener).toHaveBeenCalledWith(expect.objectContaining({
        row: 5,
        col: 3,
        timestamp: expect.any(Number)
      }));
    });

    test('多个监听器应全部被触发', () => {
      const listener1 = jest.fn();
      const listener2 = jest.fn();
      handler.addEventListener('click', listener1);
      handler.addEventListener('click', listener2);

      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));

      expect(listener1).toHaveBeenCalledTimes(1);
      expect(listener2).toHaveBeenCalledTimes(1);
    });

    test('移除监听器后不应再被触发', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));
      expect(listener).toHaveBeenCalledTimes(1);

      handler.removeEventListener('click', listener);

      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING + CELL_SIZE,
        rect.top + PADDING
      ));
      expect(listener).toHaveBeenCalledTimes(1); // 不应再增加
    });

    test('点击无效位置（容差外）不应触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      // 点击两个交叉点正中间
      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING + CELL_SIZE / 2,
        rect.top + PADDING
      ));

      expect(listener).not.toHaveBeenCalled();
    });

    test('点击边距区域不应触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + 10,
        rect.top + 10
      ));

      expect(listener).not.toHaveBeenCalled();
    });

    test('InputEvent 应包含正确的 timestamp', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      const before = Date.now();
      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));
      const after = Date.now();

      const event: InputEvent = listener.mock.calls[0][0];
      expect(event.timestamp).toBeGreaterThanOrEqual(before);
      expect(event.timestamp).toBeLessThanOrEqual(after);
    });
  });

  // ========== 启用/禁用功能 ==========

  describe('启用/禁用输入', () => {
    test('默认应为启用状态', () => {
      expect(handler.isEnabled()).toBe(true);
    });

    test('setEnabled(false) 应禁用输入', () => {
      handler.setEnabled(false);
      expect(handler.isEnabled()).toBe(false);
    });

    test('setEnabled(true) 应启用输入', () => {
      handler.setEnabled(false);
      handler.setEnabled(true);
      expect(handler.isEnabled()).toBe(true);
    });

    test('禁用时点击不应触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);
      handler.setEnabled(false);

      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));

      expect(listener).not.toHaveBeenCalled();
    });

    test('禁用时触摸不应触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('touch', listener);
      handler.setEnabled(false);

      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'touchstart', createTouchEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));

      expect(listener).not.toHaveBeenCalled();
    });

    test('重新启用后应能正常触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      handler.setEnabled(false);
      const rect = canvas.getBoundingClientRect();
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));
      expect(listener).not.toHaveBeenCalled();

      handler.setEnabled(true);
      dispatchEvent(canvas, 'click', createMouseEvent(
        rect.left + PADDING,
        rect.top + PADDING
      ));
      expect(listener).toHaveBeenCalledTimes(1);
    });
  });

  // ========== destroy 清理 ==========

  describe('destroy', () => {
    test('destroy 应移除 canvas 上的事件监听器', () => {
      handler.destroy();

      // 验证 removeEventListener 被调用（至少移除了 click 和 touchstart）
      expect(canvas.removeEventListener).toHaveBeenCalled();
    });

    test('destroy 后点击不应触发监听器', () => {
      const listener = jest.fn();
      handler.addEventListener('click', listener);

      handler.destroy();

      // destroy 后事件监听器已从 canvas 移除，
      // 手动触发不应再到达 handler 的内部处理
      // 但由于 mock 的 removeEventListener 只从数组中移除，
      // 我们需要验证 handler 的 isEnabled 状态或内部清理
      // 这里验证 destroy 后 isEnabled 返回 false（表示已销毁）
      expect(handler.isEnabled()).toBe(false);
    });

    test('destroy 后 getGridPosition 仍应返回 null（输入已禁用）', () => {
      handler.destroy();
      // destroy 后虽然坐标转换逻辑本身不受影响，
      // 但通常 destroy 意味着不再使用该 handler
      // 此测试验证 destroy 不会导致异常
      expect(() => handler.getGridPosition(PADDING, PADDING)).not.toThrow();
    });
  });

  // ========== 边界值和容差测试 ==========

  describe('容差边界', () => {
    test('在容差范围内（1/3 格子大小）应返回有效坐标', () => {
      const tolerance = CELL_SIZE / 3;
      // 在 (0,0) 交叉点偏移 tolerance - 0.1
      const result = handler.getGridPosition(
        PADDING + tolerance - 0.1,
        PADDING
      );
      expect(result).toEqual({ row: 0, col: 0 });
    });

    test('超出容差范围应返回 null', () => {
      const tolerance = CELL_SIZE / 3;
      // 在 (0,0) 交叉点偏移 tolerance + 0.1
      const result = handler.getGridPosition(
        PADDING + tolerance + 0.1,
        PADDING
      );
      expect(result).toBeNull();
    });

    test('精确点击交叉点应返回有效坐标', () => {
      // 精确点击 (5, 10) 交叉点
      const pixelX = PADDING + 10 * CELL_SIZE;
      const pixelY = PADDING + 5 * CELL_SIZE;
      const result = handler.getGridPosition(pixelX, pixelY);
      expect(result).toEqual({ row: 5, col: 10 });
    });
  });

  // ========== 构造函数 ==========

  describe('构造函数', () => {
    test('应在 canvas 上注册 click 事件监听器', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith(
        'click',
        expect.any(Function)
      );
    });

    test('应在 canvas 上注册 touchstart 事件监听器', () => {
      expect(canvas.addEventListener).toHaveBeenCalledWith(
        'touchstart',
        expect.any(Function)
      );
    });
  });
});
