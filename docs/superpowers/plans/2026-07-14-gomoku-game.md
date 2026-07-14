# 五子棋游戏实现计划

> **面向 AI 代理的工作者：** 必需子技能：使用 superpowers:subagent-driven-development（推荐）或 superpowers:executing-plans 逐任务实现此计划。步骤使用复选框（`- [ ]`）语法来跟踪进度。

**目标：** 创建一个智能五子棋游戏，让玩家与能够进行策略性落子并准确判断胜负的算法对战。

**架构：** 采用模块化架构，包含五个核心模块：游戏控制器、棋盘渲染器、AI引擎、输入处理器和状态管理器。使用TypeScript实现，Canvas绘制，支持三种AI难度级别，中国传统水墨风格界面。

**技术栈：** TypeScript 5.x、HTML5 Canvas、CSS3、Jest（单元测试）、Cypress（端到端测试）

---

## 文件结构

### 核心模块文件
- `src/types/game.ts` - 游戏类型定义
- `src/core/StateManager.ts` - 状态管理器
- `src/core/GameController.ts` - 游戏控制器
- `src/ai/AIEngine.ts` - AI引擎（Minimax算法）
- `src/rendering/BoardRenderer.ts` - 棋盘渲染器
- `src/input/InputHandler.ts` - 输入处理器

### 主入口文件
- `src/main.ts` - 应用入口
- `index.html` - HTML页面
- `css/styles.css` - 样式文件

### 测试文件
- `tests/unit/StateManager.test.ts` - 状态管理器单元测试
- `tests/unit/AIEngine.test.ts` - AI引擎单元测试
- `tests/unit/GameController.test.ts` - 游戏控制器单元测试
- `tests/unit/InputHandler.test.ts` - 输入处理器单元测试
- `tests/e2e/game.spec.ts` - 端到端测试

### 配置文件
- `tsconfig.json` - TypeScript配置
- `package.json` - 项目依赖
- `jest.config.js` - Jest配置
- `cypress.config.ts` - Cypress配置

---

## 任务分解

### 任务 1：项目初始化和环境搭建

**文件：**
- 创建：`package.json`
- 创建：`tsconfig.json`
- 创建：`jest.config.js`
- 创建：`index.html`
- 创建：`css/styles.css`

- [ ] **步骤 1：初始化npm项目**

```bash
npm init -y
```

- [ ] **步骤 2：安装开发依赖**

```bash
npm install --save-dev typescript jest ts-jest @types/jest cypress
```

- [ ] **步骤 3：创建TypeScript配置**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "outDir": "./dist",
    "rootDir": "./src",
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

- [ ] **步骤 4：创建Jest配置**

```javascript
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  testMatch: ['**/*.test.ts'],
  transform: {
    '^.+\\.ts$': 'ts-jest',
  },
};
```

- [ ] **步骤 5：创建基础HTML文件**

```html
<!DOCTYPE html>
<html lang="zh-CN">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>五子棋 - 中国传统风格</title>
    <link rel="stylesheet" href="css/styles.css">
</head>
<body>
    <div class="container">
        <header>
            <h1>五子棋</h1>
            <p class="subtitle">水墨丹青，棋道人生</p>
        </header>
        
        <main>
            <div class="game-area">
                <canvas id="game-board" width="600" height="600"></canvas>
            </div>
            
            <div class="controls">
                <div class="difficulty-selector">
                    <h3>难度选择</h3>
                    <button class="btn" data-difficulty="easy">简单</button>
                    <button class="btn active" data-difficulty="medium">中等</button>
                    <button class="btn" data-difficulty="hard">困难</button>
                </div>
                
                <div class="game-controls">
                    <button id="undo-btn" class="btn" disabled>悔棋</button>
                    <button id="new-game-btn" class="btn">新游戏</button>
                </div>
                
                <div class="game-status">
                    <p id="status-text">黑棋先行</p>
                    <p id="ai-status"></p>
                </div>
            </div>
        </main>
        
        <footer>
            <p>© 2026 五子棋游戏 - TypeScript + Canvas</p>
        </footer>
    </div>
    
    <script type="module" src="dist/main.js"></script>
</body>
</html>
```

- [ ] **步骤 6：创建基础CSS样式**

```css
/* 水墨风格基础样式 */
:root {
    --primary-color: #2c3e50;
    --secondary-color: #8b4513;
    --accent-color: #c0392b;
    --background-color: #f5f5dc;
    --paper-color: #fdf5e6;
    --ink-color: #2c3e50;
}

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

body {
    font-family: '华文行楷', 'STXingkai', 'FangSong', serif;
    background-color: var(--background-color);
    color: var(--ink-color);
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background-image: url('data:image/svg+xml,<svg xmlns="http://www.w3.org/2000/svg" width="100" height="100" viewBox="0 0 100 100"><rect fill="%23f5f5dc" width="100" height="100"/><path fill="%23e8e8d0" d="M0 0h100v100H0z"/></svg>');
}

.container {
    max-width: 1200px;
    margin: 0 auto;
    padding: 2rem;
    background-color: var(--paper-color);
    border-radius: 10px;
    box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
    border: 2px solid var(--secondary-color);
}

header {
    text-align: center;
    margin-bottom: 2rem;
    border-bottom: 2px solid var(--secondary-color);
    padding-bottom: 1rem;
}

h1 {
    font-size: 3rem;
    color: var(--primary-color);
    margin-bottom: 0.5rem;
    text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.2);
}

.subtitle {
    font-size: 1.2rem;
    color: var(--secondary-color);
    font-style: italic;
}

main {
    display: flex;
    gap: 2rem;
    justify-content: center;
    align-items: flex-start;
}

.game-area {
    flex: 0 0 auto;
}

#game-board {
    background-color: var(--paper-color);
    border: 3px solid var(--secondary-color);
    border-radius: 5px;
    box-shadow: 5px 5px 15px rgba(0, 0, 0, 0.3);
    cursor: pointer;
}

.controls {
    flex: 0 0 300px;
    display: flex;
    flex-direction: column;
    gap: 1.5rem;
}

.difficulty-selector, .game-controls, .game-status {
    background-color: rgba(255, 255, 255, 0.7);
    padding: 1.5rem;
    border-radius: 8px;
    border: 1px solid var(--secondary-color);
}

h3 {
    margin-bottom: 1rem;
    color: var(--primary-color);
    border-bottom: 1px dashed var(--secondary-color);
    padding-bottom: 0.5rem;
}

.btn {
    background-color: var(--paper-color);
    color: var(--ink-color);
    border: 2px solid var(--secondary-color);
    padding: 0.8rem 1.5rem;
    margin: 0.5rem;
    border-radius: 5px;
    cursor: pointer;
    font-family: inherit;
    font-size: 1rem;
    transition: all 0.3s ease;
}

.btn:hover {
    background-color: var(--secondary-color);
    color: white;
}

.btn:disabled {
    opacity: 0.5;
    cursor: not-allowed;
}

.btn.active {
    background-color: var(--secondary-color);
    color: white;
}

.game-status p {
    margin: 0.5rem 0;
    font-size: 1.1rem;
}

#ai-status {
    color: var(--accent-color);
    font-style: italic;
}

footer {
    margin-top: 2rem;
    text-align: center;
    color: var(--secondary-color);
    border-top: 2px solid var(--secondary-color);
    padding-top: 1rem;
}

/* 响应式设计 */
@media (max-width: 900px) {
    main {
        flex-direction: column;
        align-items: center;
    }
    
    .controls {
        flex: 0 0 auto;
        width: 100%;
        max-width: 600px;
    }
    
    #game-board {
        width: 100%;
        max-width: 600px;
        height: auto;
    }
}

@media (max-width: 600px) {
    .container {
        padding: 1rem;
    }
    
    h1 {
        font-size: 2rem;
    }
    
    .btn {
        padding: 0.6rem 1rem;
        font-size: 0.9rem;
    }
}
```

- [ ] **步骤 7：Commit初始项目结构**

```bash
git add package.json tsconfig.json jest.config.js index.html css/styles.css
git commit -m "feat: 初始化项目结构和基础配置"
```

---

### 任务 2：游戏类型定义

**文件：**
- 创建：`src/types/game.ts`

- [ ] **步骤 1：创建游戏类型定义文件**

```typescript
// 游戏核心类型定义

// 棋盘格子状态
export type CellState = 0 | 1 | 2; // 0: 空, 1: 黑棋, 2: 白棋

// 玩家类型
export type Player = 1 | 2; // 1: 黑棋(玩家), 2: 白棋(AI)

// 游戏难度
export type Difficulty = 'easy' | 'medium' | 'hard';

// 游戏状态
export type GameStatus = 'playing' | 'black_wins' | 'white_wins' | 'draw';

// 落子记录
export interface Move {
  row: number;
  col: number;
  player: Player;
  timestamp: number;
}

// 游戏状态接口
export interface GameState {
  board: CellState[][];
  currentPlayer: Player;
  moveHistory: Move[];
  gameStatus: GameStatus;
  difficulty: Difficulty;
}

// 游戏配置
export interface GameConfig {
  boardSize: number;
  winCondition: number; // 连成多少子获胜
}

// 事件类型
export type GameEventType = 
  | 'gameStart'
  | 'playerMove'
  | 'aiMove'
  | 'moveMade'
  | 'undoMove'
  | 'gameOver'
  | 'stateChanged';

// 事件数据
export interface GameEvent {
  type: GameEventType;
  data?: any;
  timestamp: number;
}

// AI计算结果
export interface AIMoveResult {
  row: number;
  col: number;
  score: number;
  calculationTime: number;
}

// 游戏事件监听器类型
export type GameEventListener = (event: GameEvent) => void;
```

- [ ] **步骤 2：Commit类型定义**

```bash
git add src/types/game.ts
git commit -m "feat: 添加游戏核心类型定义"
```

---

### 任务 3：状态管理器实现（TDD）

**文件：**
- 创建：`tests/unit/StateManager.test.ts`
- 创建：`src/core/StateManager.ts`

- [ ] **步骤 1：编写状态管理器单元测试**

```typescript
// tests/unit/StateManager.test.ts
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
```

- [ ] **步骤 2：运行测试验证失败**

```bash
npm test -- --testPathPattern=StateManager.test.ts
```

预期：FAIL，报错 "Cannot find module '../../src/core/StateManager'"

- [ ] **步骤 3：编写状态管理器实现**

```typescript
// src/core/StateManager.ts
import { 
  CellState, 
  Player, 
  Move, 
  GameState, 
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
```

- [ ] **步骤 4：运行测试验证通过**

```bash
npm test -- --testPathPattern=StateManager.test.ts
```

预期：PASS，所有测试通过

- [ ] **步骤 5：Commit状态管理器**

```bash
git add tests/unit/StateManager.test.ts src/core/StateManager.ts
git commit -m "feat: 实现状态管理器，包含棋盘状态管理和历史记录"
```

---

### 任务 4：AI引擎实现（TDD）

**文件：**
- 创建：`tests/unit/AIEngine.test.ts`
- 创建：`src/ai/AIEngine.ts`

- [ ] **步骤 1：编写AI引擎单元测试**

```typescript
// tests/unit/AIEngine.test.ts
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
```

- [ ] **步骤 2：运行测试验证失败**

```bash
npm test -- --testPathPattern=AIEngine.test.ts
```

预期：FAIL，报错 "Cannot find module '../../src/ai/AIEngine'"

- [ ] **步骤 3：编写AI引擎实现**

```typescript
// src/ai/AIEngine.ts
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
    
    if (maximizing) {
      let bestScore = -Infinity;
      let bestMove = { row: -1, col: -1 };
      
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
      let bestMove = { row: -1, col: -1 };
      
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
                moves.push({ row: newRow, col: newCol });
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
    
    // 去重
    const uniqueMoves = moves.filter((move, index, self) =>
      index === self.findIndex(m => m.row === move.row && m.col === move.col)
    );
    
    return uniqueMoves;
  }

  private isGameOver(board: CellState[][]): boolean {
    // 检查是否有玩家获胜
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        if (board[row][col] !== 0) {
          if (this.checkWin(board, row, col, board[row][col])) {
            return true;
          }
        }
      }
    }
    
    // 检查是否平局
    return this.checkDraw(board);
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

```bash
npm test -- --testPathPattern=AIEngine.test.ts
```

预期：PASS，所有测试通过

- [ ] **步骤 5：Commit AI引擎**

```bash
git add tests/unit/AIEngine.test.ts src/ai/AIEngine.ts
git commit -m "feat: 实现AI引擎，包含Minimax算法与Alpha-Beta剪枝"
```

---

### 任务 5：游戏控制器实现（TDD）

**文件：**
- 创建：`tests/unit/GameController.test.ts`
- 创建：`src/core/GameController.ts`

- [ ] **步骤 1：编写游戏控制器单元测试**

```typescript
// tests/unit/GameController.test.ts
import { GameController } from '../../src/core/GameController';
import { Difficulty, GameStatus } from '../../src/types/game';

describe('GameController', () => {
  let gameController: GameController;

  beforeEach(() => {
    gameController = new GameController();
  });

  test('应该能够开始新游戏', () => {
    gameController.startGame('medium');
    
    const state = gameController.getGameState();
    expect(state.gameStatus).toBe('playing');
    expect(state.difficulty).toBe('medium');
    expect(state.currentPlayer).toBe(1);
  });

  test('玩家应该能够落子', () => {
    gameController.startGame('medium');
    
    const result = gameController.makeMove(7, 7);
    
    expect(result.success).toBe(true);
    expect(result.player).toBe(1);
    
    const state = gameController.getGameState();
    expect(state.board[7][7]).toBe(1);
    expect(state.currentPlayer).toBe(2); // 切换到AI
  });

  test('AI应该能够落子', () => {
    gameController.startGame('medium');
    
    // 玩家落子
    gameController.makeMove(7, 7);
    
    // AI落子
    const aiMove = gameController.getAIMove();
    
    expect(aiMove).toBeDefined();
    expect(aiMove.row).toBeGreaterThanOrEqual(0);
    expect(aiMove.row).toBeLessThan(15);
    expect(aiMove.col).toBeGreaterThanOrEqual(0);
    expect(aiMove.col).toBeLessThan(15);
    
    const state = gameController.getGameState();
    expect(state.board[aiMove.row][aiMove.col]).toBe(2);
    expect(state.currentPlayer).toBe(1); // 切换回玩家
  });

  test('应该检测玩家获胜', () => {
    gameController.startGame('easy');
    
    // 模拟玩家五子连珠
    gameController.makeMove(7, 7);
    gameController.makeMove(0, 0); // AI落子
    gameController.makeMove(7, 8);
    gameController.makeMove(0, 1); // AI落子
    gameController.makeMove(7, 9);
    gameController.makeMove(0, 2); // AI落子
    gameController.makeMove(7, 10);
    gameController.makeMove(0, 3); // AI落子
    gameController.makeMove(7, 11);
    
    const state = gameController.getGameState();
    expect(state.gameStatus).toBe('black_wins');
  });

  test('应该支持悔棋功能', () => {
    gameController.startGame('medium');
    
    // 玩家落子
    gameController.makeMove(7, 7);
    
    // AI落子
    gameController.getAIMove();
    
    // 悔棋
    const undoResult = gameController.undoMove();
    
    expect(undoResult.success).toBe(true);
    
    const state = gameController.getGameState();
    expect(state.board[7][7]).toBe(0);
    expect(state.moveHistory.length).toBe(0);
    expect(state.currentPlayer).toBe(1); // 回到玩家回合
  });

  test('不应该在玩家回合悔棋', () => {
    gameController.startGame('medium');
    
    // 玩家落子
    gameController.makeMove(7, 7);
    
    // 尝试在玩家回合悔棋（应该失败）
    const undoResult = gameController.undoMove();
    
    expect(undoResult.success).toBe(false);
  });

  test('应该能够切换难度', () => {
    gameController.startGame('easy');
    
    gameController.setDifficulty('hard');
    
    const state = gameController.getGameState();
    expect(state.difficulty).toBe('hard');
  });

  test('应该能够重置游戏', () => {
    gameController.startGame('medium');
    
    gameController.makeMove(7, 7);
    gameController.getAIMove();
    
    gameController.resetGame();
    
    const state = gameController.getGameState();
    expect(state.board.every(row => row.every(cell => cell === 0))).toBe(true);
    expect(state.currentPlayer).toBe(1);
    expect(state.moveHistory.length).toBe(0);
    expect(state.gameStatus).toBe('playing');
  });

  test('应该触发游戏事件', () => {
    const events: string[] = [];
    
    gameController.addEventListener('gameStart', () => events.push('gameStart'));
    gameController.addEventListener('playerMove', () => events.push('playerMove'));
    gameController.addEventListener('aiMove', () => events.push('aiMove'));
    
    gameController.startGame('medium');
    gameController.makeMove(7, 7);
    gameController.getAIMove();
    
    expect(events).toContain('gameStart');
    expect(events).toContain('playerMove');
    expect(events).toContain('aiMove');
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

```bash
npm test -- --testPathPattern=GameController.test.ts
```

预期：FAIL，报错 "Cannot find module '../../src/core/GameController'"

- [ ] **步骤 3：编写游戏控制器实现**

```typescript
// src/core/GameController.ts
import { StateManager } from './StateManager';
import { AIEngine } from '../ai/AIEngine';
import { 
  Difficulty, 
  GameStatus, 
  GameEvent, 
  GameEventType, 
  GameEventListener,
  Move 
} from '../types/game';

export class GameController {
  private stateManager: StateManager;
  private aiEngine: AIEngine;
  private eventListeners: Map<GameEventType, GameEventListener[]>;
  private isAIThinking: boolean;

  constructor() {
    this.stateManager = new StateManager();
    this.aiEngine = new AIEngine();
    this.eventListeners = new Map();
    this.isAIThinking = false;
  }

  startGame(difficulty: Difficulty): void {
    this.stateManager.resetGame();
    this.stateManager.setDifficulty(difficulty);
    
    this.emitEvent('gameStart', { difficulty });
  }

  makeMove(row: number, col: number): { success: boolean; player?: number; error?: string } {
    if (this.isAIThinking) {
      return { success: false, error: 'AI is thinking' };
    }
    
    if (this.stateManager.getGameStatus() !== 'playing') {
      return { success: false, error: 'Game is not in progress' };
    }
    
    if (this.stateManager.getCurrentPlayer() !== 1) {
      return { success: false, error: 'Not player turn' };
    }
    
    if (!this.stateManager.isValidMove(row, col)) {
      return { success: false, error: 'Invalid move' };
    }
    
    // 玩家落子
    this.stateManager.updateBoard(row, col, 1);
    this.emitEvent('playerMove', { row, col, player: 1 });
    this.emitEvent('moveMade', { row, col, player: 1 });
    
    // 检查玩家是否获胜
    if (this.aiEngine.checkWin(this.stateManager.getBoard(), row, col, 1)) {
      this.stateManager.setGameStatus('black_wins');
      this.emitEvent('gameOver', { winner: 1 });
      return { success: true, player: 1 };
    }
    
    // 检查是否平局
    if (this.aiEngine.checkDraw(this.stateManager.getBoard())) {
      this.stateManager.setGameStatus('draw');
      this.emitEvent('gameOver', { winner: 0 });
      return { success: true, player: 1 };
    }
    
    // 切换到AI
    this.stateManager.switchPlayer();
    this.emitEvent('stateChanged', this.stateManager.getBoard());
    
    return { success: true, player: 1 };
  }

  getAIMove(): { row: number; col: number; score: number; calculationTime: number } {
    if (this.stateManager.getGameStatus() !== 'playing') {
      throw new Error('Game is not in progress');
    }
    
    if (this.stateManager.getCurrentPlayer() !== 2) {
      throw new Error('Not AI turn');
    }
    
    this.isAIThinking = true;
    
    try {
      const difficulty = this.stateManager.getDifficulty();
      const board = this.stateManager.getBoard();
      
      const aiMove = this.aiEngine.getBestMove(board, difficulty);
      
      // AI落子
      this.stateManager.updateBoard(aiMove.row, aiMove.col, 2);
      this.emitEvent('aiMove', { row: aiMove.row, col: aiMove.col, player: 2 });
      this.emitEvent('moveMade', { row: aiMove.row, col: aiMove.col, player: 2 });
      
      // 检查AI是否获胜
      if (this.aiEngine.checkWin(this.stateManager.getBoard(), aiMove.row, aiMove.col, 2)) {
        this.stateManager.setGameStatus('white_wins');
        this.emitEvent('gameOver', { winner: 2 });
      }
      
      // 检查是否平局
      if (this.aiEngine.checkDraw(this.stateManager.getBoard())) {
        this.stateManager.setGameStatus('draw');
        this.emitEvent('gameOver', { winner: 0 });
      }
      
      // 切换回玩家
      this.stateManager.switchPlayer();
      this.emitEvent('stateChanged', this.stateManager.getBoard());
      
      return aiMove;
    } finally {
      this.isAIThinking = false;
    }
  }

  undoMove(): { success: boolean; error?: string } {
    if (this.isAIThinking) {
      return { success: false, error: 'AI is thinking' };
    }
    
    if (this.stateManager.getGameStatus() !== 'playing') {
      return { success: false, error: 'Game is not in progress' };
    }
    
    if (this.stateManager.getCurrentPlayer() !== 1) {
      return { success: false, error: 'Can only undo on player turn' };
    }
    
    const history = this.stateManager.getMoveHistory();
    if (history.length < 2) {
      return { success: false, error: 'Not enough moves to undo' };
    }
    
    // 撤销AI的落子
    this.stateManager.removeLastMove();
    
    // 撤销玩家的落子
    this.stateManager.removeLastMove();
    
    this.emitEvent('undoMove', {});
    this.emitEvent('stateChanged', this.stateManager.getBoard());
    
    return { success: true };
  }

  setDifficulty(difficulty: Difficulty): void {
    this.stateManager.setDifficulty(difficulty);
    this.emitEvent('stateChanged', this.stateManager.getBoard());
  }

  resetGame(): void {
    this.stateManager.resetGame();
    this.emitEvent('stateChanged', this.stateManager.getBoard());
  }

  getGameState() {
    return {
      board: this.stateManager.getBoard(),
      currentPlayer: this.stateManager.getCurrentPlayer(),
      moveHistory: this.stateManager.getMoveHistory(),
      gameStatus: this.stateManager.getGameStatus(),
      difficulty: this.stateManager.getDifficulty()
    };
  }

  addEventListener(type: GameEventType, listener: GameEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    
    this.eventListeners.get(type)!.push(listener);
  }

  removeEventListener(type: GameEventType, listener: GameEventListener): void {
    if (!this.eventListeners.has(type)) {
      return;
    }
    
    const listeners = this.eventListeners.get(type)!;
    const index = listeners.indexOf(listener);
    
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }

  private emitEvent(type: GameEventType, data?: any): void {
    const event: GameEvent = {
      type,
      data,
      timestamp: Date.now()
    };
    
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

```bash
npm test -- --testPathPattern=GameController.test.ts
```

预期：PASS，所有测试通过

- [ ] **步骤 5：Commit游戏控制器**

```bash
git add tests/unit/GameController.test.ts src/core/GameController.ts
git commit -m "feat: 实现游戏控制器，协调游戏流程和AI交互"
```

---

### 任务 6：输入处理器实现（TDD）

**文件：**
- 创建：`tests/unit/InputHandler.test.ts`
- 创建：`src/input/InputHandler.ts`

- [ ] **步骤 1：编写输入处理器单元测试**

```typescript
// tests/unit/InputHandler.test.ts
import { InputHandler } from '../../src/input/InputHandler';

describe('InputHandler', () => {
  let inputHandler: InputHandler;
  let mockCanvas: HTMLCanvasElement;
  let mockContext: CanvasRenderingContext2D;

  beforeEach(() => {
    // 模拟Canvas元素
    mockCanvas = document.createElement('canvas');
    mockCanvas.width = 600;
    mockCanvas.height = 600;
    
    mockContext = mockCanvas.getContext('2d')!;
    
    inputHandler = new InputHandler(mockCanvas);
  });

  test('应该能够将像素坐标转换为网格位置', () => {
    // 假设棋盘边距为30，格子大小为36
    const pixelX = 30 + 36 * 7 + 18; // 第7列中间
    const pixelY = 30 + 36 * 7 + 18; // 第7行中间
    
    const gridPos = inputHandler.getGridPosition(pixelX, pixelY);
    
    expect(gridPos).toBeDefined();
    expect(gridPos.row).toBe(7);
    expect(gridPos.col).toBe(7);
  });

  test('应该检测超出棋盘范围的点击', () => {
    const pixelX = 10; // 超出左边距
    const pixelY = 10;
    
    const gridPos = inputHandler.getGridPosition(pixelX, pixelY);
    
    expect(gridPos).toBeNull();
  });

  test('应该验证合法的落子位置', () => {
    const board = Array(15).fill(0).map(() => Array(15).fill(0));
    
    const isValid = inputHandler.isValidMove(board, 7, 7);
    
    expect(isValid).toBe(true);
  });

  test('应该检测已有棋子的位置', () => {
    const board = Array(15).fill(0).map(() => Array(15).fill(0));
    board[7][7] = 1;
    
    const isValid = inputHandler.isValidMove(board, 7, 7);
    
    expect(isValid).toBe(false);
  });

  test('应该触发点击事件', () => {
    const events: any[] = [];
    
    inputHandler.addEventListener('click', (event) => {
      events.push(event);
    });
    
    // 模拟点击事件
    const clickEvent = new MouseEvent('click', {
      clientX: 30 + 36 * 7 + 18,
      clientY: 30 + 36 * 7 + 18
    });
    
    mockCanvas.dispatchEvent(clickEvent);
    
    expect(events.length).toBe(1);
    expect(events[0].row).toBe(7);
    expect(events[0].col).toBe(7);
  });

  test('应该能够启用和禁用输入', () => {
    const events: any[] = [];
    
    inputHandler.addEventListener('click', (event) => {
      events.push(event);
    });
    
    // 禁用输入
    inputHandler.setEnabled(false);
    
    // 模拟点击事件
    const clickEvent = new MouseEvent('click', {
      clientX: 30 + 36 * 7 + 18,
      clientY: 30 + 36 * 7 + 18
    });
    
    mockCanvas.dispatchEvent(clickEvent);
    
    expect(events.length).toBe(0);
    
    // 启用输入
    inputHandler.setEnabled(true);
    
    mockCanvas.dispatchEvent(clickEvent);
    
    expect(events.length).toBe(1);
  });

  test('应该支持触摸事件', () => {
    const events: any[] = [];
    
    inputHandler.addEventListener('click', (event) => {
      events.push(event);
    });
    
    // 模拟触摸事件
    const touchEvent = new TouchEvent('touchstart', {
      touches: [
        new Touch({
          identifier: 1,
          target: mockCanvas,
          clientX: 30 + 36 * 7 + 18,
          clientY: 30 + 36 * 7 + 18
        })
      ]
    });
    
    mockCanvas.dispatchEvent(touchEvent);
    
    expect(events.length).toBe(1);
    expect(events[0].row).toBe(7);
    expect(events[0].col).toBe(7);
  });

  test('应该能够移除事件监听器', () => {
    const events: any[] = [];
    
    const listener = (event: any) => {
      events.push(event);
    };
    
    inputHandler.addEventListener('click', listener);
    
    // 模拟点击事件
    const clickEvent = new MouseEvent('click', {
      clientX: 30 + 36 * 7 + 18,
      clientY: 30 + 36 * 7 + 18
    });
    
    mockCanvas.dispatchEvent(clickEvent);
    expect(events.length).toBe(1);
    
    // 移除监听器
    inputHandler.removeEventListener('click', listener);
    
    mockCanvas.dispatchEvent(clickEvent);
    expect(events.length).toBe(1); // 应该没有增加
  });
});
```

- [ ] **步骤 2：运行测试验证失败**

```bash
npm test -- --testPathPattern=InputHandler.test.ts
```

预期：FAIL，报错 "Cannot find module '../../src/input/InputHandler'"

- [ ] **步骤 3：编写输入处理器实现**

```typescript
// src/input/InputHandler.ts
import { CellState } from '../types/game';

export interface InputEvent {
  row: number;
  col: number;
  timestamp: number;
}

export type InputEventType = 'click' | 'touch';

export type InputEventListener = (event: InputEvent) => void;

export class InputHandler {
  private canvas: HTMLCanvasElement;
  private enabled: boolean;
  private eventListeners: Map<InputEventType, InputEventListener[]>;
  
  // 棋盘配置
  private readonly BOARD_SIZE = 15;
  private readonly BOARD_PADDING = 30;
  private readonly CELL_SIZE: number;
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.enabled = true;
    this.eventListeners = new Map();
    
    // 计算格子大小
    this.CELL_SIZE = (canvas.width - this.BOARD_PADDING * 2) / (this.BOARD_SIZE - 1);
    
    this.initializeEventListeners();
  }
  
  private initializeEventListeners(): void {
    // 鼠标点击事件
    this.canvas.addEventListener('click', this.handleClick.bind(this));
    
    // 触摸事件
    this.canvas.addEventListener('touchstart', this.handleTouch.bind(this));
  }
  
  private handleClick(event: MouseEvent): void {
    if (!this.enabled) {
      return;
    }
    
    const rect = this.canvas.getBoundingClientRect();
    const x = event.clientX - rect.left;
    const y = event.clientY - rect.top;
    
    const gridPos = this.getGridPosition(x, y);
    
    if (gridPos) {
      this.emitEvent('click', gridPos.row, gridPos.col);
    }
  }
  
  private handleTouch(event: TouchEvent): void {
    if (!this.enabled) {
      return;
    }
    
    event.preventDefault();
    
    if (event.touches.length > 0) {
      const touch = event.touches[0];
      const rect = this.canvas.getBoundingClientRect();
      const x = touch.clientX - rect.left;
      const y = touch.clientY - rect.top;
      
      const gridPos = this.getGridPosition(x, y);
      
      if (gridPos) {
        this.emitEvent('touch', gridPos.row, gridPos.col);
      }
    }
  }
  
  getGridPosition(pixelX: number, pixelY: number): { row: number; col: number } | null {
    // 转换为相对于棋盘的坐标
    const boardX = pixelX - this.BOARD_PADDING;
    const boardY = pixelY - this.BOARD_PADDING;
    
    // 检查是否在棋盘范围内
    if (boardX < 0 || boardY < 0) {
      return null;
    }
    
    // 计算最近的格子
    const col = Math.round(boardX / this.CELL_SIZE);
    const row = Math.round(boardY / this.CELL_SIZE);
    
    // 检查是否在有效范围内
    if (row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE) {
      return null;
    }
    
    // 检查点击是否足够接近交叉点
    const centerX = col * this.CELL_SIZE;
    const centerY = row * this.CELL_SIZE;
    const distance = Math.sqrt(
      Math.pow(boardX - centerX, 2) + Math.pow(boardY - centerY, 2)
    );
    
    // 允许一定的误差范围（格子大小的1/3）
    if (distance > this.CELL_SIZE / 3) {
      return null;
    }
    
    return { row, col };
  }
  
  isValidMove(board: CellState[][], row: number, col: number): boolean {
    if (row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE) {
      return false;
    }
    
    return board[row][col] === 0;
  }
  
  setEnabled(enabled: boolean): void {
    this.enabled = enabled;
  }
  
  isEnabled(): boolean {
    return this.enabled;
  }
  
  addEventListener(type: InputEventType, listener: InputEventListener): void {
    if (!this.eventListeners.has(type)) {
      this.eventListeners.set(type, []);
    }
    
    this.eventListeners.get(type)!.push(listener);
  }
  
  removeEventListener(type: InputEventType, listener: InputEventListener): void {
    if (!this.eventListeners.has(type)) {
      return;
    }
    
    const listeners = this.eventListeners.get(type)!;
    const index = listeners.indexOf(listener);
    
    if (index > -1) {
      listeners.splice(index, 1);
    }
  }
  
  private emitEvent(type: InputEventType, row: number, col: number): void {
    const event: InputEvent = {
      row,
      col,
      timestamp: Date.now()
    };
    
    const listeners = this.eventListeners.get(type) || [];
    listeners.forEach(listener => listener(event));
  }
  
  destroy(): void {
    this.canvas.removeEventListener('click', this.handleClick.bind(this));
    this.canvas.removeEventListener('touchstart', this.handleTouch.bind(this));
    this.eventListeners.clear();
  }
}
```

- [ ] **步骤 4：运行测试验证通过**

```bash
npm test -- --testPathPattern=InputHandler.test.ts
```

预期：PASS，所有测试通过

- [ ] **步骤 5：Commit输入处理器**

```bash
git add tests/unit/InputHandler.test.ts src/input/InputHandler.ts
git commit -m "feat: 实现输入处理器，支持鼠标和触摸事件"
```

---

### 任务 7：棋盘渲染器实现

**文件：**
- 创建：`src/rendering/BoardRenderer.ts`

- [ ] **步骤 1：编写棋盘渲染器实现**

```typescript
// src/rendering/BoardRenderer.ts
import { CellState, Player, Move } from '../types/game';

export class BoardRenderer {
  private canvas: HTMLCanvasElement;
  private context: CanvasRenderingContext2D;
  
  // 棋盘配置
  private readonly BOARD_SIZE = 15;
  private readonly BOARD_PADDING = 30;
  private readonly CELL_SIZE: number;
  
  // 颜色配置
  private readonly COLORS = {
    BACKGROUND: '#f5f5dc',
    BOARD: '#fdf5e6',
    GRID: '#8b4513',
    BLACK: '#2c3e50',
    WHITE: '#fdf5e6',
    LAST_MOVE: '#c0392b',
    HOVER: 'rgba(139, 69, 19, 0.3)'
  };
  
  constructor(canvas: HTMLCanvasElement) {
    this.canvas = canvas;
    this.context = canvas.getContext('2d')!;
    
    // 计算格子大小
    this.CELL_SIZE = (canvas.width - this.BOARD_PADDING * 2) / (this.BOARD_SIZE - 1);
    
    this.initializeCanvas();
  }
  
  private initializeCanvas(): void {
    // 设置Canvas样式
    this.canvas.style.backgroundColor = this.COLORS.BACKGROUND;
    
    // 绘制初始棋盘
    this.drawBoard();
  }
  
  drawBoard(): void {
    const { context, canvas } = this;
    
    // 清空画布
    context.fillStyle = this.COLORS.BOARD;
    context.fillRect(0, 0, canvas.width, canvas.height);
    
    // 绘制网格线
    context.strokeStyle = this.COLORS.GRID;
    context.lineWidth = 1;
    
    // 绘制横向线
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const y = this.BOARD_PADDING + i * this.CELL_SIZE;
      context.beginPath();
      context.moveTo(this.BOARD_PADDING, y);
      context.lineTo(this.BOARD_PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE, y);
      context.stroke();
    }
    
    // 绘制纵向线
    for (let i = 0; i < this.BOARD_SIZE; i++) {
      const x = this.BOARD_PADDING + i * this.CELL_SIZE;
      context.beginPath();
      context.moveTo(x, this.BOARD_PADDING);
      context.lineTo(x, this.BOARD_PADDING + (this.BOARD_SIZE - 1) * this.CELL_SIZE);
      context.stroke();
    }
    
    // 绘制星位（天元和四个角星）
    this.drawStarPoints();
  }
  
  private drawStarPoints(): void {
    const { context } = this;
    const starPositions = [
      { row: 3, col: 3 },
      { row: 3, col: 11 },
      { row: 7, col: 7 },  // 天元
      { row: 11, col: 3 },
      { row: 11, col: 11 }
    ];
    
    context.fillStyle = this.COLORS.GRID;
    
    starPositions.forEach(pos => {
      const x = this.BOARD_PADDING + pos.col * this.CELL_SIZE;
      const y = this.BOARD_PADDING + pos.row * this.CELL_SIZE;
      
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
    });
  }
  
  drawPiece(row: number, col: number, player: Player, isLastMove: boolean = false): void {
    const { context } = this;
    const x = this.BOARD_PADDING + col * this.CELL_SIZE;
    const y = this.BOARD_PADDING + row * this.CELL_SIZE;
    const radius = this.CELL_SIZE * 0.4;
    
    // 绘制棋子阴影
    context.fillStyle = 'rgba(0, 0, 0, 0.3)';
    context.beginPath();
    context.arc(x + 2, y + 2, radius, 0, Math.PI * 2);
    context.fill();
    
    // 绘制棋子
    if (player === 1) {
      // 黑棋
      context.fillStyle = this.COLORS.BLACK;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      
      // 添加水墨效果
      this.drawInkEffect(x, y, radius);
    } else {
      // 白棋
      context.fillStyle = this.COLORS.WHITE;
      context.strokeStyle = this.COLORS.BLACK;
      context.lineWidth = 2;
      context.beginPath();
      context.arc(x, y, radius, 0, Math.PI * 2);
      context.fill();
      context.stroke();
      
      // 添加光泽效果
      this.drawGlossEffect(x, y, radius);
    }
    
    // 标记最后一手
    if (isLastMove) {
      context.fillStyle = this.COLORS.LAST_MOVE;
      context.beginPath();
      context.arc(x, y, 4, 0, Math.PI * 2);
      context.fill();
    }
  }
  
  private drawInkEffect(x: number, y: number, radius: number): void {
    const { context } = this;
    
    // 绘制水墨飞溅效果
    context.fillStyle = 'rgba(44, 62, 80, 0.8)';
    
    // 随机添加一些小点
    for (let i = 0; i < 3; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = Math.random() * radius * 0.5;
      const dotX = x + Math.cos(angle) * distance;
      const dotY = y + Math.sin(angle) * distance;
      const dotRadius = Math.random() * 2 + 1;
      
      context.beginPath();
      context.arc(dotX, dotY, dotRadius, 0, Math.PI * 2);
      context.fill();
    }
  }
  
  private drawGlossEffect(x: number, y: number, radius: number): void {
    const { context } = this;
    
    // 绘制光泽效果
    const gradient = context.createRadialGradient(
      x - radius * 0.3,
      y - radius * 0.3,
      radius * 0.1,
      x,
      y,
      radius
    );
    
    gradient.addColorStop(0, 'rgba(255, 255, 255, 0.8)');
    gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
    
    context.fillStyle = gradient;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  
  drawHoverPosition(row: number, col: number, player: Player): void {
    const { context } = this;
    const x = this.BOARD_PADDING + col * this.CELL_SIZE;
    const y = this.BOARD_PADDING + row * this.CELL_SIZE;
    const radius = this.CELL_SIZE * 0.4;
    
    // 绘制半透明棋子
    context.fillStyle = this.COLORS.HOVER;
    context.beginPath();
    context.arc(x, y, radius, 0, Math.PI * 2);
    context.fill();
  }
  
  drawGameState(board: CellState[][], lastMove?: Move): void {
    // 重绘棋盘
    this.drawBoard();
    
    // 绘制所有棋子
    for (let row = 0; row < this.BOARD_SIZE; row++) {
      for (let col = 0; col < this.BOARD_SIZE; col++) {
        const cell = board[row][col];
        if (cell !== 0) {
          const isLastMove = lastMove && 
                           lastMove.row === row && 
                           lastMove.col === col;
          this.drawPiece(row, col, cell, isLastMove);
        }
      }
    }
  }
  
  clearCanvas(): void {
    const { context, canvas } = this;
    context.clearRect(0, 0, canvas.width, canvas.height);
  }
  
  getCanvasSize(): { width: number; height: number } {
    return {
      width: this.canvas.width,
      height: this.canvas.height
    };
  }
  
  getBoardCoordinates(clientX: number, clientY: number): { row: number; col: number } | null {
    const rect = this.canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;
    
    // 转换为相对于棋盘的坐标
    const boardX = x - this.BOARD_PADDING;
    const boardY = y - this.BOARD_PADDING;
    
    // 检查是否在棋盘范围内
    if (boardX < 0 || boardY < 0) {
      return null;
    }
    
    // 计算最近的格子
    const col = Math.round(boardX / this.CELL_SIZE);
    const row = Math.round(boardY / this.CELL_SIZE);
    
    // 检查是否在有效范围内
    if (row < 0 || row >= this.BOARD_SIZE || col < 0 || col >= this.BOARD_SIZE) {
      return null;
    }
    
    return { row, col };
  }
}
```

- [ ] **步骤 2：Commit棋盘渲染器**

```bash
git add src/rendering/BoardRenderer.ts
git commit -m "feat: 实现棋盘渲染器，包含水墨风格视觉效果"
```

---

### 任务 8：主应用入口和集成

**文件：**
- 创建：`src/main.ts`

- [ ] **步骤 1：编写主应用入口**

```typescript
// src/main.ts
import { GameController } from './core/GameController';
import { BoardRenderer } from './rendering/BoardRenderer';
import { InputHandler } from './input/InputHandler';
import { Difficulty } from './types/game';

class GomokuApp {
  private gameController: GameController;
  private boardRenderer: BoardRenderer;
  private inputHandler: InputHandler;
  
  private elements: {
    canvas: HTMLCanvasElement;
    difficultyButtons: NodeListOf<HTMLButtonElement>;
    undoButton: HTMLButtonElement;
    newGameButton: HTMLButtonElement;
    statusText: HTMLElement;
    aiStatus: HTMLElement;
  };

  constructor() {
    this.initializeElements();
    this.initializeGame();
    this.setupEventListeners();
    this.startNewGame('medium');
  }

  private initializeElements(): void {
    this.elements = {
      canvas: document.getElementById('game-board') as HTMLCanvasElement,
      difficultyButtons: document.querySelectorAll('[data-difficulty]'),
      undoButton: document.getElementById('undo-btn') as HTMLButtonElement,
      newGameButton: document.getElementById('new-game-btn') as HTMLButtonElement,
      statusText: document.getElementById('status-text') as HTMLElement,
      aiStatus: document.getElementById('ai-status') as HTMLElement
    };
  }

  private initializeGame(): void {
    // 初始化游戏控制器
    this.gameController = new GameController();
    
    // 初始化渲染器
    this.boardRenderer = new BoardRenderer(this.elements.canvas);
    
    // 初始化输入处理器
    this.inputHandler = new InputHandler(this.elements.canvas);
  }

  private setupEventListeners(): void {
    // 难度选择按钮
    this.elements.difficultyButtons.forEach(button => {
      button.addEventListener('click', () => {
        const difficulty = button.dataset.difficulty as Difficulty;
        this.setDifficulty(difficulty);
      });
    });
    
    // 悔棋按钮
    this.elements.undoButton.addEventListener('click', () => {
      this.undoMove();
    });
    
    // 新游戏按钮
    this.elements.newGameButton.addEventListener('click', () => {
      this.startNewGame(this.gameController.getGameState().difficulty);
    });
    
    // 游戏输入事件
    this.inputHandler.addEventListener('click', (event) => {
      this.handlePlayerMove(event.row, event.col);
    });
    
    // 游戏事件监听
    this.gameController.addEventListener('gameStart', () => {
      this.updateUI();
    });
    
    this.gameController.addEventListener('stateChanged', () => {
      this.updateBoard();
      this.updateUI();
    });
    
    this.gameController.addEventListener('gameOver', (event) => {
      this.handleGameOver(event.data.winner);
    });
  }

  private startNewGame(difficulty: Difficulty): void {
    this.gameController.startGame(difficulty);
    this.updateBoard();
    this.updateUI();
    this.updateDifficultyButtons(difficulty);
  }

  private setDifficulty(difficulty: Difficulty): void {
    this.gameController.setDifficulty(difficulty);
    this.updateDifficultyButtons(difficulty);
  }

  private handlePlayerMove(row: number, col: number): void {
    const gameState = this.gameController.getGameState();
    
    // 检查是否是玩家回合
    if (gameState.currentPlayer !== 1 || gameState.gameStatus !== 'playing') {
      return;
    }
    
    // 尝试玩家落子
    const result = this.gameController.makeMove(row, col);
    
    if (result.success) {
      this.updateBoard();
      this.updateUI();
      
      // 如果游戏继续，触发AI落子
      if (gameState.gameStatus === 'playing') {
        this.triggerAIMove();
      }
    }
  }

  private triggerAIMove(): void {
    // 显示AI思考状态
    this.elements.aiStatus.textContent = 'AI思考中...';
    this.inputHandler.setEnabled(false);
    
    // 使用setTimeout让UI有时间更新
    setTimeout(() => {
      try {
        const aiMove = this.gameController.getAIMove();
        
        // 更新棋盘显示
        this.updateBoard();
        this.updateUI();
        
        // 隐藏AI思考状态
        this.elements.aiStatus.textContent = '';
        this.inputHandler.setEnabled(true);
      } catch (error) {
        console.error('AI move error:', error);
        this.elements.aiStatus.textContent = 'AI计算错误';
        this.inputHandler.setEnabled(true);
      }
    }, 100);
  }

  private undoMove(): void {
    const result = this.gameController.undoMove();
    
    if (result.success) {
      this.updateBoard();
      this.updateUI();
    } else {
      console.error('Undo failed:', result.error);
    }
  }

  private updateBoard(): void {
    const gameState = this.gameController.getGameState();
    const lastMove = gameState.moveHistory.length > 0 
      ? gameState.moveHistory[gameState.moveHistory.length - 1]
      : undefined;
    
    this.boardRenderer.drawGameState(gameState.board, lastMove);
  }

  private updateUI(): void {
    const gameState = this.gameController.getGameState();
    
    // 更新状态文本
    if (gameState.gameStatus === 'playing') {
      const playerText = gameState.currentPlayer === 1 ? '黑棋' : '白棋';
      this.elements.statusText.textContent = `${playerText}落子`;
      
      // 更新悔棋按钮状态
      this.elements.undoButton.disabled = 
        gameState.currentPlayer !== 1 || 
        gameState.moveHistory.length < 2;
    }
    
    // 更新难度按钮状态
    this.updateDifficultyButtons(gameState.difficulty);
  }

  private updateDifficultyButtons(activeDifficulty: Difficulty): void {
    this.elements.difficultyButtons.forEach(button => {
      const difficulty = button.dataset.difficulty as Difficulty;
      button.classList.toggle('active', difficulty === activeDifficulty);
    });
  }

  private handleGameOver(winner: number): void {
    let message = '';
    
    if (winner === 1) {
      message = '恭喜你获胜！';
    } else if (winner === 2) {
      message = 'AI获胜！';
    } else {
      message = '平局！';
    }
    
    this.elements.statusText.textContent = message;
    this.elements.aiStatus.textContent = '';
    
    // 禁用输入
    this.inputHandler.setEnabled(false);
    
    // 显示获胜动画
    this.showWinAnimation(winner);
  }

  private showWinAnimation(winner: number): void {
    // 这里可以添加获胜动画效果
    console.log(`Game over! Winner: ${winner}`);
  }
}

// 启动应用
document.addEventListener('DOMContentLoaded', () => {
  new GomokuApp();
});
```

- [ ] **步骤 2：Commit主应用入口**

```bash
git add src/main.ts
git commit -m "feat: 实现主应用入口，集成所有模块"
```

---

### 任务 9：构建配置和测试

**文件：**
- 修改：`package.json`

- [ ] **步骤 1：更新package.json脚本**

```json
{
  "scripts": {
    "build": "tsc",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "dev": "tsc --watch",
    "start": "npx http-server . -p 3000"
  }
}
```

- [ ] **步骤 2：运行所有测试**

```bash
npm test
```

预期：所有测试通过

- [ ] **步骤 3：构建项目**

```bash
npm run build
```

预期：TypeScript编译成功

- [ ] **步骤 4：Commit构建配置**

```bash
git add package.json
git commit -m "feat: 添加构建和测试脚本配置"
```

---

### 任务 10：端到端测试

**文件：**
- 创建：`cypress.config.ts`
- 创建：`cypress/e2e/game.spec.ts`

- [ ] **步骤 1：创建Cypress配置**

```typescript
// cypress.config.ts
import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    supportFile: 'cypress/support/e2e.ts',
    specPattern: 'cypress/e2e/**/*.spec.ts',
  },
})
```

- [ ] **步骤 2：创建端到端测试**

```typescript
// cypress/e2e/game.spec.ts
describe('五子棋游戏', () => {
  beforeEach(() => {
    cy.visit('/');
  });

  it('应该显示游戏界面', () => {
    cy.contains('五子棋');
    cy.get('#game-board').should('be.visible');
    cy.get('[data-difficulty="medium"]').should('have.class', 'active');
  });

  it('应该能够开始新游戏', () => {
    cy.get('#new-game-btn').click();
    cy.get('#status-text').should('contain', '黑棋落子');
  });

  it('应该能够落子', () => {
    // 点击棋盘中心位置
    cy.get('#game-board').click(300, 300);
    
    // 检查状态更新
    cy.get('#status-text').should('contain', '白棋落子');
    
    // 等待AI落子
    cy.wait(1000);
    cy.get('#status-text').should('contain', '黑棋落子');
  });

  it('应该能够切换难度', () => {
    cy.get('[data-difficulty="easy"]').click();
    cy.get('[data-difficulty="easy"]').should('have.class', 'active');
    cy.get('[data-difficulty="medium"]').should('not.have.class', 'active');
  });

  it('应该能够悔棋', () => {
    // 落子
    cy.get('#game-board').click(300, 300);
    cy.wait(1000);
    
    // 悔棋
    cy.get('#undo-btn').click();
    
    // 检查状态
    cy.get('#status-text').should('contain', '黑棋落子');
  });

  it('应该检测获胜条件', () => {
    // 模拟快速获胜（简化测试）
    cy.get('#new-game-btn').click();
    cy.get('[data-difficulty="easy"]').click();
    
    // 连续落子形成五子连珠
    const positions = [
      [300, 300], [336, 300], [372, 300], [408, 300], [444, 300]
    ];
    
    positions.forEach(([x, y]) => {
      cy.get('#game-board').click(x, y);
      cy.wait(500);
    });
    
    // 检查获胜
    cy.get('#status-text').should('contain', '获胜');
  });

  it('应该支持响应式布局', () => {
    // 测试桌面布局
    cy.viewport(1200, 800);
    cy.get('.controls').should('be.visible');
    
    // 测试移动布局
    cy.viewport(375, 667);
    cy.get('.controls').should('be.visible');
  });
});
```

- [ ] **步骤 3：Commit端到端测试**

```bash
git add cypress.config.ts cypress/e2e/game.spec.ts
git commit -m "feat: 添加端到端测试，验证游戏核心功能"
```

---

## 执行说明

### 计划执行顺序
1. 按顺序执行任务1-10
2. 每个任务包含完整的TDD流程：测试 → 实现 → 验证 → 提交
3. 确保每个任务完成后测试通过再进行下一个任务

### 测试策略
- **单元测试**：每个模块独立测试
- **集成测试**：模块间交互测试
- **端到端测试**：完整用户流程测试

### 质量保证
- 所有测试必须通过
- TypeScript编译无错误
- 代码符合ESLint规范
- 响应式设计适配不同屏幕尺寸

### 部署准备
1. 运行`npm run build`构建项目
2. 使用`npm start`启动本地服务器
3. 在浏览器中访问`http://localhost:3000`测试游戏
4. 部署到静态网站托管服务

---

**计划版本**: 1.0  
**创建日期**: 2026-07-14  
**预计完成时间**: 10-15小时  
**状态**: 待执行