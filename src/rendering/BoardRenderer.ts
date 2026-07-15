import { CellState, Player, Move } from '../types/game.js';

/**
 * 棋盘渲染器 - 中国传统水墨风格
 * 负责在Canvas上绘制五子棋棋盘、棋子和游戏状态
 */
export class BoardRenderer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  // 棋盘配置参数
  private readonly canvasSize = 600;
  private readonly padding = 30;
  private readonly boardSize = 15;
  private readonly cellSize: number;

  // 水墨风格颜色方案
  private readonly colors = {
    background: '#fdf5e6',    // 宣纸色
    gridLine: '#8b4513',      // 棕色（网格线）
    blackPiece: '#2c3e50',    // 深墨色（黑棋）
    whitePiece: '#fdf5e6',    // 宣纸色（白棋）
    whiteBorder: '#2c3e50',   // 白棋描边
    lastMoveMarker: '#c0392b' // 红色（最后一手标记）
  };

  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    const ctx = canvas.getContext('2d');
    if (!ctx) {
      throw new Error('Failed to get 2D rendering context');
    }
    this.ctx = ctx;

    // 设置canvas尺寸
    this.canvas.width = this.canvasSize;
    this.canvas.height = this.canvasSize;

    // 计算格子大小: (600 - 60) / 14 ≈ 38.57px
    this.cellSize = (this.canvasSize - 2 * this.padding) / (this.boardSize - 1);
  }

  /**
   * 获取canvas尺寸
   */
  getCanvasSize(): { width: number; height: number } {
    return { width: this.canvasSize, height: this.canvasSize };
  }

  /**
   * 清空canvas
   */
  clearCanvas(): void {
    this.ctx.fillStyle = this.colors.background;
    this.ctx.fillRect(0, 0, this.canvasSize, this.canvasSize);
  }

  /**
   * 绘制完整的棋盘（网格和星位）
   */
  drawBoard(): void {
    this.clearCanvas();
    this.drawGrid();
    this.drawStarPoints();
  }

  /**
   * 绘制网格线 - 毛笔风格
   */
  private drawGrid(): void {
    const ctx = this.ctx;
    const startX = this.padding;
    const startY = this.padding;

    ctx.strokeStyle = this.colors.gridLine;
    ctx.lineWidth = 1.5; // 较粗的毛笔风格线条
    ctx.lineCap = 'round'; // 圆润的线条末端

    // 绘制横线
    for (let i = 0; i < this.boardSize; i++) {
      const y = startY + i * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(startX, y);
      ctx.lineTo(startX + (this.boardSize - 1) * this.cellSize, y);
      ctx.stroke();
    }

    // 绘制纵线
    for (let j = 0; j < this.boardSize; j++) {
      const x = startX + j * this.cellSize;
      ctx.beginPath();
      ctx.moveTo(x, startY);
      ctx.lineTo(x, startY + (this.boardSize - 1) * this.cellSize);
      ctx.stroke();
    }
  }

  /**
   * 绘制星位（天元和四个角星）
   */
  private drawStarPoints(): void {
    const ctx = this.ctx;
    const starPositions = [
      { row: 7, col: 7 },  // 天元（中心）
      { row: 3, col: 3 },  // 左上角星
      { row: 3, col: 11 }, // 右上角星
      { row: 11, col: 3 }, // 左下角星
      { row: 11, col: 11 } // 右下角星
    ];

    ctx.fillStyle = this.colors.gridLine;
    const starRadius = 4;

    for (const pos of starPositions) {
      const x = this.padding + pos.col * this.cellSize;
      const y = this.padding + pos.row * this.cellSize;

      ctx.beginPath();
      ctx.arc(x, y, starRadius, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  /**
   * 绘制单个棋子 - 水墨效果
   * @param row 行号（0-14）
   * @param col 列号（0-14）
   * @param player 玩家（1: 黑棋, 2: 白棋）
   * @param isLastMove 是否是最后一手（显示红色标记）
   */
  drawPiece(row: number, col: number, player: Player, isLastMove: boolean = false): void {
    const x = this.padding + col * this.cellSize;
    const y = this.padding + row * this.cellSize;
    const radius = this.cellSize * 0.42;

    if (player === 1) {
      this.drawBlackPiece(x, y, radius);
    } else {
      this.drawWhitePiece(x, y, radius);
    }

    // 绘制最后一手标记
    if (isLastMove) {
      this.drawLastMoveMarker(x, y);
    }
  }

  /**
   * 绘制黑棋 - 深墨色带飞溅效果
   */
  private drawBlackPiece(x: number, y: number, radius: number): void {
    const ctx = this.ctx;

    // 主体 - 径向渐变模拟水墨效果
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, '#1a252f'); // 深墨色
    gradient.addColorStop(0.5, this.colors.blackPiece);
    gradient.addColorStop(1, '#1a1a2e'); // 边缘深色

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 添加随机墨点飞溅效果
    this.addInkSplash(x, y, radius);
  }

  /**
   * 添加墨点飞溅效果
   */
  private addInkSplash(x: number, y: number, radius: number): void {
    const ctx = this.ctx;
    const splashCount = 5 + Math.floor(Math.random() * 5);

    for (let i = 0; i < splashCount; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = radius * (0.6 + Math.random() * 0.5);
      const splashX = x + Math.cos(angle) * distance;
      const splashY = y + Math.sin(angle) * distance;
      const splashRadius = 1 + Math.random() * 2;

      ctx.beginPath();
      ctx.arc(splashX, splashY, splashRadius, 0, Math.PI * 2);
      ctx.fillStyle = this.colors.blackPiece;
      ctx.globalAlpha = 0.3 + Math.random() * 0.3;
      ctx.fill();
    }

    ctx.globalAlpha = 1.0; // 重置透明度
  }

  /**
   * 绘制白棋 - 宣纸色带光泽效果
   */
  private drawWhitePiece(x: number, y: number, radius: number): void {
    const ctx = this.ctx;

    // 描边
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.strokeStyle = this.colors.whiteBorder;
    ctx.lineWidth = 2;
    ctx.stroke();

    // 主体 - 径向渐变模拟光泽
    const gradient = ctx.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    gradient.addColorStop(0, '#ffffff'); // 高光白色
    gradient.addColorStop(0.4, this.colors.whitePiece);
    gradient.addColorStop(1, '#f5f5dc'); // 边缘米色

    ctx.beginPath();
    ctx.arc(x, y, radius, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // 添加光泽效果
    this.addGlossEffect(x, y, radius);
  }

  /**
   * 添加光泽效果
   */
  private addGlossEffect(x: number, y: number, radius: number): void {
    const ctx = this.ctx;

    // 左上角高光
    const highlightX = x - radius * 0.35;
    const highlightY = y - radius * 0.35;
    const highlightRadius = radius * 0.4;

    const highlightGradient = ctx.createRadialGradient(
      highlightX,
      highlightY,
      0,
      highlightX,
      highlightY,
      highlightRadius
    );
    highlightGradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    highlightGradient.addColorStop(1, 'rgba(255, 255, 255, 0)');

    ctx.beginPath();
    ctx.arc(highlightX, highlightY, highlightRadius, 0, Math.PI * 2);
    ctx.fillStyle = highlightGradient;
    ctx.fill();
  }

  /**
   * 绘制最后一手标记 - 红色小圆点
   */
  private drawLastMoveMarker(x: number, y: number): void {
    const ctx = this.ctx;
    const markerRadius = 4;

    ctx.beginPath();
    ctx.arc(x, y, markerRadius, 0, Math.PI * 2);
    ctx.fillStyle = this.colors.lastMoveMarker;
    ctx.fill();
  }

  /**
   * 绘制整个游戏状态
   * @param board 棋盘状态数组
   * @param lastMove 最后一手（可选，用于显示标记）
   */
  drawGameState(board: CellState[][], lastMove?: Move): void {
    // 先绘制棋盘
    this.drawBoard();

    // 绘制所有棋子
    for (let row = 0; row < board.length; row++) {
      for (let col = 0; col < board[row].length; col++) {
        const cell = board[row][col];
        if (cell !== 0) {
          const isLastMove = lastMove
            ? lastMove.row === row && lastMove.col === col
            : false;
          this.drawPiece(row, col, cell as Player, isLastMove);
        }
      }
    }
  }

  /**
   * 绘制落子动画
   * @param row 行号
   * @param col 列号
   * @param player 玩家
   * @param duration 动画时长（毫秒）
   * @returns Promise，动画完成后resolve
   */
  animatePiece(
    row: number,
    col: number,
    player: Player,
    duration: number = 300
  ): Promise<void> {
    return new Promise((resolve) => {
      const x = this.padding + col * this.cellSize;
      const y = this.padding + row * this.cellSize;
      const targetRadius = this.cellSize * 0.42;
      const startTime = performance.now();

      const animate = (currentTime: number) => {
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // 使用缓动函数使动画更自然
        const easedProgress = this.easeOutBack(progress);
        const currentRadius = targetRadius * easedProgress;

        // 保存当前棋盘状态并重绘
        this.drawBoard();

        // 绘制已有的棋子（不带动画）
        // 注意：这里简化处理，实际使用时可能需要传入完整棋盘状态

        // 绘制动画中的棋子
        if (progress < 1) {
          this.drawAnimatedPiece(x, y, currentRadius, player);
          requestAnimationFrame(animate);
        } else {
          // 动画完成，绘制最终棋子
          this.drawPiece(row, col, player);
          resolve();
        }
      };

      requestAnimationFrame(animate);
    });
  }

  /**
   * 绘制动画中的棋子（带缩放效果）
   */
  private drawAnimatedPiece(
    x: number,
    y: number,
    radius: number,
    player: Player
  ): void {
    const ctx = this.ctx;

    if (player === 1) {
      // 黑棋动画
      const gradient = ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, '#1a252f');
      gradient.addColorStop(0.5, this.colors.blackPiece);
      gradient.addColorStop(1, '#1a1a2e');

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    } else {
      // 白棋动画
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.strokeStyle = this.colors.whiteBorder;
      ctx.lineWidth = 2;
      ctx.stroke();

      const gradient = ctx.createRadialGradient(
        x - radius * 0.3,
        y - radius * 0.3,
        radius * 0.1,
        x,
        y,
        radius
      );
      gradient.addColorStop(0, '#ffffff');
      gradient.addColorStop(0.4, this.colors.whitePiece);
      gradient.addColorStop(1, '#f5f5dc');

      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2);
      ctx.fillStyle = gradient;
      ctx.fill();
    }
  }

  /**
   * 缓动函数 - 弹性效果
   */
  private easeOutBack(t: number): number {
    const c1 = 1.70158;
    const c3 = c1 + 1;
    return 1 + c3 * Math.pow(t - 1, 3) + c1 * Math.pow(t - 1, 2);
  }
}
