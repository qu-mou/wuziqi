// 输入处理器 - 将 Canvas 上的鼠标/触摸点击转换为棋盘坐标

export interface InputEvent {
  row: number;
  col: number;
  timestamp: number;
}

export type InputEventType = 'click' | 'touch';
export type InputEventListener = (event: InputEvent) => void;

export class InputHandler {
  private static readonly CANVAS_SIZE = 600;
  private static readonly BOARD_SIZE = 15;
  private static readonly PADDING = 30;
  private static readonly CELL_SIZE =
    (InputHandler.CANVAS_SIZE - InputHandler.PADDING * 2) / (InputHandler.BOARD_SIZE - 1);
  private static readonly TOLERANCE = InputHandler.CELL_SIZE / 3;

  private canvas: HTMLCanvasElement;
  private enabled: boolean;
  private listeners: Map<InputEventType, InputEventListener[]>;
  private boundClickHandler: (e: MouseEvent) => void;
  private boundTouchHandler: (e: TouchEvent) => void;

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.enabled = true;
    this.listeners = new Map();

    this.boundClickHandler = this.handleClick.bind(this);
    this.boundTouchHandler = this.handleTouch.bind(this);

    this.canvas.addEventListener('click', this.boundClickHandler);
    this.canvas.addEventListener('touchstart', this.boundTouchHandler);
  }

  /**
   * 将像素坐标转换为棋盘网格坐标。
   * 如果坐标超出棋盘范围或不在交叉点容差内，返回 null。
   */
  getGridPosition(pixelX: number, pixelY: number): { row: number; col: number } | null {
    const { PADDING, CELL_SIZE, BOARD_SIZE, TOLERANCE } = InputHandler;

    // 转换为相对于棋盘区域的坐标
    const relX = pixelX - PADDING;
    const relY = pixelY - PADDING;

    // 计算最近的交叉点
    const colFloat = relX / CELL_SIZE;
    const rowFloat = relY / CELL_SIZE;

    const col = Math.round(colFloat);
    const row = Math.round(rowFloat);

    // 检查是否在棋盘范围内
    if (row < 0 || row >= BOARD_SIZE || col < 0 || col >= BOARD_SIZE) {
      return null;
    }

    // 计算到最近交叉点的实际像素距离
    const nearestX = PADDING + col * CELL_SIZE;
    const nearestY = PADDING + row * CELL_SIZE;
    const distX = Math.abs(pixelX - nearestX);
    const distY = Math.abs(pixelY - nearestY);

    // 使用欧氏距离检查是否在容差范围内
    const distance = Math.sqrt(distX * distX + distY * distY);
    if (distance > TOLERANCE) {
      return null;
    }

    return { row, col };
  }

  /**
   * 启用或禁用输入。
   * 禁用时，点击和触摸事件将被忽略。
   */
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }

  /**
   * 返回当前输入是否启用。
   */
  isEnabled(): boolean {
    return this.enabled;
  }

  /**
   * 添加事件监听器。
   */
  addEventListener(type: InputEventType, listener: InputEventListener): void {
    if (!this.listeners.has(type)) {
      this.listeners.set(type, []);
    }
    this.listeners.get(type)!.push(listener);
  }

  /**
   * 移除事件监听器。
   */
  removeEventListener(type: InputEventType, listener: InputEventListener): void {
    const listeners = this.listeners.get(type);
    if (!listeners) {
      return;
    }
    const index = listeners.indexOf(listener);
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  /**
   * 销毁输入处理器，移除所有事件监听器。
   */
  destroy(): void {
    this.canvas.removeEventListener('click', this.boundClickHandler);
    this.canvas.removeEventListener('touchstart', this.boundTouchHandler);
    this.listeners.clear();
    this.enabled = false;
  }

  /**
   * 处理鼠标点击事件。
   */
  private handleClick(e: MouseEvent): void {
    if (!this.enabled) {
      return;
    }

    const rect = this.canvas.getBoundingClientRect();
    const pixelX = e.clientX - rect.left;
    const pixelY = e.clientY - rect.top;

    const position = this.getGridPosition(pixelX, pixelY);
    if (position) {
      this.emitEvent('click', position.row, position.col);
    }
  }

  /**
   * 处理触摸事件。
   */
  private handleTouch(e: TouchEvent): void {
    if (!this.enabled) {
      return;
    }

    if (e.touches.length === 0) {
      return;
    }

    const touch = e.touches[0];
    const rect = this.canvas.getBoundingClientRect();
    const pixelX = touch.clientX - rect.left;
    const pixelY = touch.clientY - rect.top;

    const position = this.getGridPosition(pixelX, pixelY);
    if (position) {
      this.emitEvent('touch', position.row, position.col);
    }
  }

  /**
   * 触发指定类型的事件监听器。
   */
  private emitEvent(type: InputEventType, row: number, col: number): void {
    const event: InputEvent = {
      row,
      col,
      timestamp: Date.now()
    };

    const listeners = this.listeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }
}
