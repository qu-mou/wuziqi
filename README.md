# 五子棋 - 中国传统风格

一款基于 TypeScript + Canvas 开发的五子棋游戏，采用中国传统水墨画风格设计。

## 游戏特色

- 🎮 **智能AI对战** - 基于 Minimax 算法与 Alpha-Beta 剪枝的AI引擎
- 🎨 **水墨风格界面** - 传统中国水墨画风格的棋盘和棋子设计
- 🏆 **多难度选择** - 简单、中等、困难三种难度级别
- ↩️ **悔棋功能** - 每局游戏允许悔棋一次
- 📊 **对局记录** - 自动记录胜/负/平场次和当前步数
- 📱 **响应式设计** - 支持桌面和移动设备

## 技术栈

- **语言**: TypeScript 5.x
- **绘图**: HTML5 Canvas
- **测试**: Jest + Cypress
- **模块**: ES Modules

## 项目结构

```
├── index.html              # 游戏页面
├── css/
│   └── styles.css          # 水墨风格样式
├── src/
│   ├── main.ts             # 主入口
│   ├── types/
│   │   └── game.ts         # 类型定义
│   ├── core/
│   │   ├── StateManager.ts # 状态管理器
│   │   └── GameController.ts # 游戏控制器
│   ├── ai/
│   │   └── AIEngine.ts     # AI引擎
│   ├── input/
│   │   └── InputHandler.ts # 输入处理器
│   └── rendering/
│       └── BoardRenderer.ts # 棋盘渲染器
├── tests/
│   └── unit/               # 单元测试
├── cypress/                # 端到端测试
├── dist/                   # 编译输出
├── package.json
└── tsconfig.json
```

## 快速开始

### 安装依赖

```bash
npm install
```

### 编译项目

```bash
npm run build
```

### 运行测试

```bash
npm test
```

### 启动游戏

```bash
npx http-server . -p 3000
```

然后在浏览器中访问 http://localhost:3000

## 游戏规则

1. 黑棋先行，玩家执黑棋
2. 双方轮流落子，先形成五子连珠者获胜
3. 五子连珠方向：横向、纵向、对角线
4. 每局游戏允许悔棋一次（撤销最近的玩家和AI各一步）

## AI算法

游戏使用 **Minimax 算法** 配合 **Alpha-Beta 剪枝**：

| 难度 | 搜索深度 | 特点 |
|------|----------|------|
| 简单 | 2层 | 快速响应，随机性较高 |
| 中等 | 3层 | 平衡攻防 |
| 困难 | 4层 | 专注进攻和防守 |

### 优化特性

- **落子排序** - 优先搜索有价值的落子位置，提升剪枝效率
- **智能落子生成** - 只考虑已有棋子周围的位置，减少搜索空间
- **棋盘评估** - 基于线路模式的评分系统（活四、冲四、活三等）

## 核心模块

### StateManager - 状态管理器
- 维护 15×15 棋盘状态
- 管理玩家回合切换
- 记录落子历史
- 支持悔棋操作

### GameController - 游戏控制器
- 协调各模块工作
- 处理玩家落子和AI落子流程
- 检测获胜和胜负条件
- 管理游戏事件系统

### AIEngine - AI引擎
- Minimax + Alpha-Beta 剪枝算法
- 可配置搜索深度
- 线路模式评估（活四、冲四、活三等）
- 智能落子排序优化

### InputHandler - 输入处理器
- 支持鼠标和触摸事件
- 像素坐标到网格坐标转换
- 落子位置容差检测
- 输入启用/禁用控制

### BoardRenderer - 棋盘渲染器
- 水墨风格棋盘绘制
- 黑白棋子渲染（带渐变效果）
- 最后一手标记
- 星位标记（天元和角星）

## 测试

### 运行单元测试

```bash
npm test
```

### 测试覆盖

- **StateManager** - 30个测试（状态管理、悔棋、边界情况）
- **AIEngine** - 15个测试（落子计算、胜负检测、平局检测）
- **GameController** - 12个测试（游戏流程、事件触发、悔棋限制）
- **InputHandler** - 33个测试（坐标转换、事件处理、启用/禁用）

### 运行端到端测试

```bash
npx cypress open
```

## 浏览器兼容性

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 开发说明

### 添加新功能

1. 在 `src/types/game.ts` 中定义类型
2. 实现核心逻辑并添加单元测试
3. 更新 UI 和事件处理
4. 运行测试确保无回归

### 代码规范

- 使用 TypeScript 严格模式
- 遵循 TDD 开发流程
- 保持模块职责单一
- 使用有意义的命名

## 许可证

ISC License

## 作者

五子棋游戏 - TypeScript + Canvas 实现
