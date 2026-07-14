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
