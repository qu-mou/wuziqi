import { GameController } from './core/GameController.js';
import { BoardRenderer } from './rendering/BoardRenderer.js';
import { InputHandler } from './input/InputHandler.js';
import { Difficulty, GameStatus } from './types/game.js';

// ---------- 对局记录 ----------

interface GameRecord {
  wins: number;
  losses: number;
  draws: number;
}

const RECORD_STORAGE_KEY = 'gomoku-game-record';

function loadRecord(): GameRecord {
  try {
    const stored = localStorage.getItem(RECORD_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch {
    // localStorage 不可用时静默处理
  }
  return { wins: 0, losses: 0, draws: 0 };
}

function saveRecord(record: GameRecord): void {
  try {
    localStorage.setItem(RECORD_STORAGE_KEY, JSON.stringify(record));
  } catch {
    // localStorage 不可用时静默处理
  }
}

function updateRecordDisplay(record: GameRecord): void {
  const winEl = document.getElementById('win-count');
  const loseEl = document.getElementById('lose-count');
  const drawEl = document.getElementById('draw-count');
  if (winEl) winEl.textContent = String(record.wins);
  if (loseEl) loseEl.textContent = String(record.losses);
  if (drawEl) drawEl.textContent = String(record.draws);
}

// ---------- DOM 元素 ----------

const canvas = document.getElementById('game-board') as HTMLCanvasElement;
const undoBtn = document.getElementById('undo-btn') as HTMLButtonElement;
const newGameBtn = document.getElementById('new-game-btn') as HTMLButtonElement;
const resetRecordBtn = document.getElementById('reset-record-btn') as HTMLButtonElement;
const statusText = document.getElementById('status-text') as HTMLElement;
const aiStatus = document.getElementById('ai-status') as HTMLElement;
const difficultyButtons = document.querySelectorAll(
  '[data-difficulty]'
) as NodeListOf<HTMLButtonElement>;

// ---------- 初始化核心模块 ----------

const gameController = new GameController();
const boardRenderer = new BoardRenderer(canvas);
const inputHandler = new InputHandler(canvas);
let currentDifficulty: Difficulty = 'medium';
let gameRecord = loadRecord();

// ---------- 辅助函数 ----------

/** 从 DOM 中读取当前激活的难度按钮 */
function getSelectedDifficulty(): Difficulty {
  const activeBtn = document.querySelector(
    '[data-difficulty].active'
  ) as HTMLButtonElement | null;
  return activeBtn
    ? (activeBtn.dataset.difficulty as Difficulty)
    : 'medium';
}

/** 重绘整个棋盘（含最后一手标记） */
function redrawBoard(): void {
  const state = gameController.getGameState();
  const lastMove =
    state.moveHistory.length > 0
      ? state.moveHistory[state.moveHistory.length - 1]
      : undefined;
  boardRenderer.drawGameState(state.board, lastMove);
}

/** 根据游戏结束状态更新对局记录 */
function recordGameResult(status: GameStatus): void {
  if (status === 'black_wins') {
    gameRecord.wins++;
  } else if (status === 'white_wins') {
    gameRecord.losses++;
  } else if (status === 'draw') {
    gameRecord.draws++;
  } else {
    return; // 游戏未结束，不记录
  }
  saveRecord(gameRecord);
  updateRecordDisplay(gameRecord);
}

/** 根据当前游戏状态更新 UI 文本和按钮 */
function updateUI(): void {
  const state = gameController.getGameState();

  // 状态文本
  switch (state.gameStatus) {
    case 'playing':
      statusText.textContent =
        state.currentPlayer === 1 ? '黑棋走棋' : '白棋走棋';
      break;
    case 'black_wins':
      statusText.textContent = '黑棋获胜！';
      break;
    case 'white_wins':
      statusText.textContent = '白棋获胜！';
      break;
    case 'draw':
      statusText.textContent = '平局！';
      break;
  }

  // 悔棋按钮：仅在玩家回合、进行中、有足够历史、且未使用过悔棋时可用
  undoBtn.disabled =
    state.gameStatus !== 'playing' ||
    state.currentPlayer !== 1 ||
    state.moveHistory.length < 2 ||
    state.undoUsed;
}

// ---------- AI 落子流程 ----------

function handleAIMove(): void {
  const state = gameController.getGameState();
  if (state.gameStatus !== 'playing' || state.currentPlayer !== 2) {
    return;
  }

  // 禁用输入，显示 AI 思考状态
  inputHandler.setEnabled(false);
  aiStatus.textContent = 'AI思考中...';
  undoBtn.disabled = true;

  // 使用 setTimeout 延迟执行，让 UI 有时间刷新
  setTimeout(() => {
    try {
      gameController.getAIMove();
      redrawBoard();
    } catch {
      // AI 计算异常时静默处理
    } finally {
      aiStatus.textContent = '';
      updateUI();

      const currentState = gameController.getGameState();
      if (currentState.gameStatus === 'playing') {
        inputHandler.setEnabled(true);
      } else {
        // 游戏结束，记录结果
        recordGameResult(currentState.gameStatus);
      }
    }
  }, 300);
}

// ---------- 玩家落子流程 ----------

function handlePlayerMove(row: number, col: number): void {
  const result = gameController.makeMove(row, col);
  if (!result.success) {
    return;
  }

  redrawBoard();
  updateUI();

  const state = gameController.getGameState();
  if (state.gameStatus === 'playing' && state.currentPlayer === 2) {
    handleAIMove();
  } else if (state.gameStatus !== 'playing') {
    // 玩家直接获胜（五子连珠），记录结果
    recordGameResult(state.gameStatus);
  }
}

// ---------- 事件绑定 ----------

function setupEventListeners(): void {
  // 棋盘点击 / 触摸
  inputHandler.addEventListener('click', (event) => {
    handlePlayerMove(event.row, event.col);
  });
  inputHandler.addEventListener('touch', (event) => {
    handlePlayerMove(event.row, event.col);
  });

  // 悔棋
  undoBtn.addEventListener('click', () => {
    if (gameController.undoMove().success) {
      redrawBoard();
      updateUI();
    }
  });

  // 新游戏
  newGameBtn.addEventListener('click', () => {
    const difficulty = getSelectedDifficulty();
    currentDifficulty = difficulty;
    gameController.startGame(difficulty);
    inputHandler.setEnabled(true);
    aiStatus.textContent = '';
    redrawBoard();
    updateUI();
  });

  // 难度选择
  difficultyButtons.forEach((btn) => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');

      const difficulty = btn.dataset.difficulty as Difficulty;
      currentDifficulty = difficulty;
      gameController.setDifficulty(difficulty);
    });
  });

  // 重置对局记录
  resetRecordBtn.addEventListener('click', () => {
    gameRecord = { wins: 0, losses: 0, draws: 0 };
    saveRecord(gameRecord);
    updateRecordDisplay(gameRecord);
  });
}

// ---------- 应用初始化 ----------

function init(): void {
  setupEventListeners();

  currentDifficulty = getSelectedDifficulty();
  gameController.startGame(currentDifficulty);

  redrawBoard();
  updateUI();
  updateRecordDisplay(gameRecord);
}

// 启动
init();
