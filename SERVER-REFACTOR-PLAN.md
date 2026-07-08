# 后端整改 + 登录系统 实施方案

> Tea Atlas 项目 — Codex 可执行指令
>
> **原则：每步独立、可验证、不破坏已有功能**

---

## ⚠️ 执行协议（必须遵守）

```
1. 只执行当前任务，不要跨任务操作
2. 每个任务完成后：
   a. 启动后端 node index.js，确认无报错
   b. 如果有前端改动，运行 npm run build，确认构建通过
   c. 输出一段总结：改了哪些文件、做了什么、验证结果
   d. 报告"T{N} 完成"，然后 STOP
3. 不要自动进入下一个任务 — 等待人工确认
4. 遇到报错不要猜测，把完整错误信息贴出来
```

**执行顺序：T1 → T2 → T3 → T4 → T5 → T6 → T7**

---

## 最终目标目录结构

```
server/
├── index.js                 ← 入口，瘦身到 ~30 行
├── .env                     ← 不变
├── .env.example             ← 新增（不含真实密钥）
├── config/
│   └── index.js             ← 集中配置 ← 新增
├── db/
│   ├── database.js          ← 基本不动
│   ├── seed.js              ← 瘦身，数据外置
│   └── seeds/
│       └── teas.json        ← 25条茶数据 ← 新增
├── middleware/
│   ├── auth.js              ← 改用 config 导入 JWT_SECRET
│   ├── errorHandler.js      ← 全局错误处理 ← 新增
│   └── validate.js          ← 参数校验工厂 ← 新增
├── routes/
│   ├── auth.js              ← 响应格式统一 + 校验增强
│   ├── teas.js              ← 响应格式统一 + 参数校验
│   ├── favorites.js         ← 响应格式统一 + 参数校验
│   ├── checkins.js          ← 响应格式统一 + 参数校验
│   └── admin.js             ← 响应格式统一
├── utils/
│   └── response.js          ← 统一响应格式 ← 新增
├── package.json             ← 不变
└── tea-map.db               ← 自动生成，不变

client/src/
└── components/
    └── Auth/
        ├── AuthModal.jsx     ← 登录/注册弹窗 ← 新增
        └── UserButton.jsx    ← 用户入口按钮 ← 新增
```

---

## T1：建立统一响应格式 + 全局错误处理

**依赖：无**

### 做什么

新建两个基础模块，所有后续任务依赖它们：

### 新建 `server/utils/response.js`

```js
/**
 * 统一 API 响应格式
 *
 * 成功响应：{ code: 0, data: {...}, message: 'ok' }
 * 失败响应：{ code: -1, data: null, message: '错误描述' }
 */

function success(data = null, message = 'ok') {
  return { code: 0, data, message };
}

function fail(message = '服务器错误') {
  return { code: -1, data: null, message };
}

module.exports = { success, fail };
```

### 新建 `server/middleware/errorHandler.js`

```js
const { fail } = require('../utils/response');

/**
 * 全局错误处理中间件（必须放在所有路由之后）
 * 捕获未处理的异常，统一返回 { code: -1, data: null, message }
 */
function errorHandler(err, req, res, _next) {
  console.error(`[${new Date().toISOString()}] ${req.method} ${req.path}:`, err.message);

  if (res.headersSent) return;

  const status = err.status || 500;
  const message = err.expose ? err.message : '服务器内部错误';
  res.status(status).json(fail(message));
}

module.exports = errorHandler;
```

### 修改 `server/index.js`

在 `app.use(express.json())` 之后、所有路由之后，**最后一行**加上：

```js
// 统一错误处理（必须放在所有路由之后）
app.use(require('./middleware/errorHandler'));
```

### 验收

- [ ] `server/utils/response.js` 存在
- [ ] `server/middleware/errorHandler.js` 存在
- [ ] `node index.js` 启动不报错
- [ ] `curl http://localhost:3001/api/teas` 仍然正常返回

### 🛑 T1 完成，停止并报告。等待确认后再执行 T2。

---

## T2：改造所有路由，使用统一响应格式 + 参数校验

**依赖：T1**

### 做什么

1. 所有路由的 `res.json()` / `res.status().json()` 改用 `success()` / `fail()`
2. 所有路由加上 `express-validator` 参数校验
3. 移除路由内部重复的 `validationResult` 检查逻辑（交给 validate 中间件）

### 文件列表

| 文件 | 改动 |
|---|---|
| `server/routes/auth.js` | 响应格式 + 校验规则加强 |
| `server/routes/teas.js` | 响应格式 + 参数校验 |
| `server/routes/favorites.js` | 响应格式 + 参数校验 |
| `server/routes/checkins.js` | 响应格式 + 参数校验 |
| `server/routes/admin.js` | 响应格式 |

### 新建 `server/middleware/validate.js`

```js
const { validationResult } = require('express-validator');
const { fail } = require('../utils/response');

/**
 * 参数校验中间件工厂
 * 用法：router.post('/xxx', validate([body('name').notEmpty()]), handler)
 */
function validate(rules) {
  return [
    ...rules,
    (req, res, next) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        const msg = errors.array().map(e => e.msg).join('; ');
        return res.status(400).json(fail(msg));
      }
      next();
    },
  ];
}

module.exports = { validate };
```

### `server/routes/auth.js` 改动要点

- 文件顶部加 `const { success, fail } = require('../utils/response');`
- 文件顶部加 `const { validate } = require('../middleware/validate');`
- 三个路由的 `res.status(201).json({ user, token })` → `res.status(201).json(success({ user, token }))`
- `res.json({ user: userInfo, token })` → `res.json(success({ user: userInfo, token }))`
- `res.json({ user })` → `res.json(success({ user }))`
- `res.status(400).json({ errors: ... })` → `res.status(400).json(fail(错误信息))`
- `res.status(404).json({ error: ... })` → `res.status(404).json(fail(错误信息))`
- 用 `validate([...rules])` 替代手动 `validationResult` 检查

### `server/routes/teas.js` 改动要点

- 顶部加 `const { success, fail } = require('../utils/response');`
- 顶部加 `const { param, query } = require('express-validator');`
- 顶部加 `const { validate } = require('../middleware/validate');`
- `/api/teas/:id` 路由增加 `validate([param('id').isInt().withMessage('ID 必须为整数')])`
- `/api/teas/season/:season` 增加 `validate([param('season').isIn(['春','夏','秋','冬','spring','summer','autumn','winter']).withMessage('无效的季节')])`
- 所有响应改写为 `success()` / `fail()`

### `server/routes/favorites.js` 改动要点

- 顶部加 `const { success, fail } = require('../utils/response');`
- 顶部加 `const { body, param } = require('express-validator');`
- 顶部加 `const { validate } = require('../middleware/validate');`
- POST `/` 增加 `validate([body('tea_id').isInt().withMessage('茶品 ID 无效')])`
- DELETE `/:teaId` 增加 `validate([param('teaId').isInt().withMessage('茶品 ID 无效')])`
- GET `/check/:teaId` 增加 `validate([param('teaId').isInt().withMessage('茶品 ID 无效')])`
- 所有响应改写为 `success()` / `fail()`

### `server/routes/checkins.js` 改动要点

- 顶部加 `const { success, fail } = require('../utils/response');`
- 顶部加 `const { body, param } = require('express-validator');`
- 顶部加 `const { validate } = require('../middleware/validate');`
- POST `/` 增加 `validate([body('city_name').trim().notEmpty().withMessage('城市名不能为空')])`
- DELETE `/:id` 增加 `validate([param('id').isInt().withMessage('打卡记录 ID 无效')])`
- 所有响应改写为 `success()` / `fail()`

### `server/routes/admin.js` 改动要点

- 顶部加 `const { success, fail } = require('../utils/response');`
- 所有响应改写为 `success()` / `fail()`

### 验收

- [ ] 每个路由文件顶部导入了 `success` 和 `fail`
- [ ] 所有 `res.json()` 返回 `{ code: 0, data, message }` 格式
- [ ] 所有 `res.status(4xx/5xx)` 返回 `{ code: -1, data: null, message }` 格式
- [ ] 带参数的路由有 validate 校验
- [ ] `node index.js` 启动不报错
- [ ] 用 curl 测一遍所有接口，返回格式正确

### 🛑 T2 完成，停止并报告。等待确认后再执行 T3。

---

## T3：配置集中管理

**依赖：无，可与 T1/T2 并行**

### 做什么

把散落在多个文件里的硬编码配置收拢到一个文件

### 新建 `server/config/index.js`

```js
const path = require('path');

// 加载 .env（相对于 server/ 目录）
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });

module.exports = {
  // 服务器
  port: parseInt(process.env.PORT, 10) || 3001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // JWT
  jwtSecret: process.env.JWT_SECRET || 'tea-map-secret-key-change-me',
  jwtExpiresIn: '7d',

  // CORS
  corsOrigins: [
    'http://localhost:5173',
    'http://localhost:4173',
    process.env.CLIENT_URL,
  ].filter(Boolean),

  // 数据库
  dbPath: path.join(__dirname, '..', 'tea-map.db'),

  // 客户端构建产物
  clientDist: path.join(__dirname, '..', '..', 'client', 'dist'),
};
```

### 修改 `server/middleware/auth.js`

```js
// 改前：
const JWT_SECRET = process.env.JWT_SECRET || 'tea-map-secret-key-2024-graduation';

// 改后：
const { jwtSecret } = require('../config');
// 下面所有 JWT_SECRET 替换为 jwtSecret
```

### 修改 `server/index.js`

```js
// 改前：
require('dotenv').config({ path: path.join(__dirname, '.env') });
const PORT = process.env.PORT || 3001;

// 改后：
const config = require('./config');
const PORT = config.port;
// CORS origins 改用 config.corsOrigins
// clientDist 路径改用 config.clientDist
```

### 新建 `server/.env.example`

```
JWT_SECRET=your-secret-key-here
PORT=3001
NODE_ENV=development
CLIENT_URL=http://localhost:5173
```

### 验收

- [ ] `server/config/index.js` 存在
- [ ] `middleware/auth.js` 从 config 导入 jwtSecret
- [ ] `index.js` 从 config 导入配置，不再直接读 process.env
- [ ] `server/.env.example` 存在，不含真实密钥
- [ ] `node index.js` 启动不报错
- [ ] 登录接口返回的 JWT 仍然有效

### 🛑 T3 完成，停止并报告。等待确认后再执行 T4。

---

## T4：种子数据外置

**依赖：无，可与 T1-T3 并行**

### 做什么

`db/seed.js` 现在 600 行，25 条茶数据直接硬编码在 JS 里。把数据拆到 JSON 文件。

### 新建 `server/db/seeds/teas.json`

把 `seed.js` 里的 `const teas = [...]` 数组原样复制到 JSON 文件。

保持字段名完全不变：`name, province, city, latitude, longitude, category, maturity_months, seasons, local_characteristics, appearance, history, spirit, meaning, image_url, is_mountain`

### 修改 `server/db/seed.js`

```js
// 改前：
const teas = [ /* 600 行硬编码数据 */ ];

// 改后：
const path = require('path');
const teas = require('./seeds/teas.json');

// 其他逻辑保持不变
```

### 验收

- [ ] `server/db/seeds/teas.json` 存在，包含 25 条茶
- [ ] `seed.js` 不再包含数据数组
- [ ] `node db/seed.js` 成功入库，打印 `已导入 25 条茶叶数据`

### 🛑 T4 完成，停止并报告。等待确认后再执行 T5。

---

## T5：入口文件瘦身

**依赖：T1, T3**

### 做什么

`index.js` 现在是 84 行的脚本，逻辑混在一起。重构为：初始化 → 中间件 → 路由 → 静态文件 → 错误处理 → 启动。

### 修改后的 `server/index.js` 目标结构

```js
const express = require('express');
const cors = require('cors');
const config = require('./config');
const { initDb } = require('./db/database');
const errorHandler = require('./middleware/errorHandler');

async function start() {
  // 1. 初始化数据库
  await initDb();
  console.log('📦 数据库已就绪');

  // 2. 自动播种（空库时）
  const { getDb } = require('./db/database');
  const db = getDb();
  const count = db.prepare('SELECT COUNT(*) as count FROM teas').get();
  if (!count || count.count === 0) {
    require('./db/seed').seed();
    console.log('🌱 已导入种子数据');
  }

  // 3. 创建 Express 实例
  const app = express();

  // 4. 全局中间件
  app.use(cors({ origin: config.corsOrigins, credentials: true }));
  app.use(express.json());

  // 5. API 路由
  app.use('/api/auth', require('./routes/auth'));
  app.use('/api/teas', require('./routes/teas'));
  app.use('/api/favorites', require('./routes/favorites'));
  app.use('/api/checkins', require('./routes/checkins'));
  app.use('/api/admin', require('./routes/admin'));

  // 6. 健康检查
  app.get('/api/health', (req, res) => {
    res.json({ status: 'ok', timestamp: new Date().toISOString() });
  });

  // 7. 生产环境：serve 前端静态文件
  const fs = require('fs');
  if (fs.existsSync(config.clientDist)) {
    app.use(express.static(config.clientDist));
    app.get('*', (req, res) => {
      if (!req.path.startsWith('/api')) {
        res.sendFile(require('path').join(config.clientDist, 'index.html'));
      }
    });
    console.log('📦 前端静态文件已启用');
  }

  // 8. 全局错误处理（最后）
  app.use(errorHandler);

  // 9. 启动
  app.listen(config.port, () => {
    console.log(`🍵 Tea Atlas API 启动: http://localhost:${config.port}`);
  });
}

start().catch(err => {
  console.error('服务启动失败:', err);
  process.exit(1);
});
```

### 验收

- [ ] `index.js` 逻辑清晰，分 9 步
- [ ] `node index.js` 启动不报错
- [ ] 所有 API 路由仍然可访问
- [ ] 健康检查 `curl localhost:3001/api/health` 返回 200

### 🛑 T5 完成，停止并报告。等待确认后再执行 T6。

---

## T6：更新 `api.js` 使用新响应格式

**依赖：T2**

### 做什么

后端返回格式从 `{ data }` 变成了 `{ code: 0, data }`，前端 `api.js` 的响应拦截器要适配。

### 修改 `client/src/services/api.js`

在响应拦截器中，解包统一格式：

```js
// 响应拦截器 — 在现有 401 检查之后加：
api.interceptors.response.use(
  (res) => {
    // 后端统一格式 { code: 0, data: {...}, message: 'ok' }
    if (res.data && typeof res.data.code === 'number') {
      if (res.data.code === 0) {
        res.data = res.data.data; // 解包，对外透明的 data
      }
    }
    return res;
  },
  (err) => {
    // 后端统一格式 { code: -1, data: null, message: '...' }
    if (err.response?.data?.message) {
      err.message = err.response.data.message; // 把后端消息提到 err.message
    }
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
    }
    return Promise.reject(err);
  }
);
```

这样 `authAPI.login()` 的调用方仍然拿到 `data.user` 和 `data.token`，无需改动 AuthContext。

### 验收

- [ ] `npm run dev` 启动前后端
- [ ] 浏览器 console 无报错
- [ ] 注册/登录 API 调用仍然正常（虽然还没 UI，但 AuthContext 逻辑不受影响）

### 🛑 T6 完成，停止并报告。等待确认后再执行 T7。

---

## T7：登录/注册 UI

**依赖：T2、T6**

### 做什么

前端加登录注册弹窗，用户可以在页面上登录。

### 新建 `client/src/components/Auth/AuthModal.jsx`

- 居中弹窗，毛玻璃背景，水墨配色
- Tab 切换：登录 / 注册
- **登录 Tab**：用户名 + 密码 + 登录按钮
- **注册 Tab**：用户名 + 邮箱 + 密码 + 注册按钮
- 调用 `useAuth()` 的 `login()` / `register()`
- 错误提示：红色文字显示在表单底部
- 成功后自动关闭弹窗
- framer-motion 淡入 + 缩放动画
- 风格参照现有的 `TeaDetailPanel`（圆角 26px、毛玻璃、水墨色）

### 新建 `client/src/components/Auth/UserButton.jsx`

- 放在 `BottomControlBar` 右侧
- **未登录状态**：显示 "登录" pill 按钮，点击打开 AuthModal
- **已登录状态**：显示用户名，点击弹出下拉：显示 "退出登录"
- 使用 `useAuth()` 获取 `user` 和 `logout`

### 修改 `client/src/components/Navigation/BottomControlBar.jsx`

- 接收新 prop：`onAuthOpen`
- 在 "茶信录" 按钮右边加一个用户按钮

### 修改 `client/src/pages/MapPage.jsx`

- 新增 state：`authModalOpen`
- 传给 BottomControlBar：`onAuthOpen={() => setAuthModalOpen(true)}`
- 在 JSX 底部加：

```jsx
{/* 登录弹窗 */}
<AuthModal
  isOpen={authModalOpen}
  onClose={() => setAuthModalOpen(false)}
/>
```

### 样式约束

- 弹窗背景：`bg-[rgba(255,249,241,.82)]` + `backdrop-blur-2xl`
- 圆角：`rounded-[26px]`
- 按钮：沿用 `ui-pill` + `active` 类
- 输入框：圆角 12px，半透明背景，细边框
- 错误文字：`text-red-400`，字号 xs
- 字体：系统字体（`font-sans`），标题用 `font-serif`
- 动画时长：0.5-0.8s，ease: `[0.25, 0.1, 0.1, 1]`

### 验收

- [ ] 底部控制栏有登录按钮
- [ ] 点击登录打开弹窗
- [ ] 登录 Tab 可输入用户名密码，点击登录调 API
- [ ] 登录成功弹窗关闭，按钮变成用户名
- [ ] 注册 Tab 可输入用户名邮箱密码，点击注册调 API
- [ ] 注册成功自动登录
- [ ] 点击用户名出现退出登录选项
- [ ] 退出后按钮变回 "登录"
- [ ] 输入错误有红色提示
- [ ] 弹窗风格与整体水墨 UI 一致
- [ ] `npm run build` 成功

### 🛑 T7 完成，停止并报告。等待确认后再执行 T8。

---

## T8：管理后台页面

**依赖：T7**

### 做什么

新增 `/admin` 路由，管理员登录后可管理茶数据和用户。普通用户无法访问。

### 后端已有接口（不需要改）

| 接口 | 方法 | 说明 |
|---|---|---|
| `/api/admin/stats` | GET | 统计数据（茶数、用户数、收藏数、打卡数）|
| `/api/admin/teas` | GET | 所有茶列表 |
| `/api/admin/teas/:id` | GET | 单个茶详情 |
| `/api/admin/teas` | POST | 新增茶 |
| `/api/admin/teas/:id` | PUT | 编辑茶 |
| `/api/admin/teas/:id` | DELETE | 删除茶 |
| `/api/admin/users` | GET | 所有用户列表 |
| `/api/admin/users/:id` | PUT | 编辑用户 |
| `/api/admin/users/:id` | DELETE | 删除用户 |

### 新增文件

```
client/src/
├── pages/
│   └── AdminPage.jsx          ← 管理后台主页（Tab 切换容器）
├── components/Admin/
│   ├── AdminDashboard.jsx     ← 数据看板（统计卡片）
│   ├── TeaManager.jsx         ← 茶管理（列表 + 新增/编辑/删除）
│   ├── UserManager.jsx        ← 用户管理（列表 + 删除）
│   └── AdminGuard.jsx         ← 路由守卫（非管理员跳回首页）
```

### 1. 新建 `client/src/components/Admin/AdminGuard.jsx`

```jsx
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminGuard({ children }) {
  const { user, loading } = useAuth();

  if (loading) {
    return <div className="flex h-screen items-center justify-center text-[var(--ink-faint)]">加载中...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
}
```

### 2. 新建 `client/src/pages/AdminPage.jsx`

- 顶部导航：左侧 "Tea Atlas 管理后台" 标题，右侧 "返回地图" 链接
- Tab 切换栏：`数据看板` / `茶品管理` / `用户管理`
- Tab 内容区渲染对应组件
- 样式：全屏布局，毛玻璃底色，水墨配色，与地图风格统一

### 3. 新建 `client/src/components/Admin/AdminDashboard.jsx`

- 4 张统计卡片横排：茶品总数、用户总数、收藏总数、打卡总数
- 卡片样式：`rounded-2xl bg-white/30 p-6`，大数字 + 小标签
- 页面加载时调 `adminAPI.getStats()` 获取数据

### 4. 新建 `client/src/components/Admin/TeaManager.jsx`

- 茶列表表格（名称、省份、分类、操作）
- "新增茶品" 按钮 → 弹出编辑弹窗
- 每条茶有"编辑"和"删除"按钮
- 删除有二次确认弹窗
- 编辑弹窗：表单含所有字段（名称、省份、城市、经纬度、分类、采制月份、描述等）
- 调 `adminAPI.getTeas()` / `createTea()` / `updateTea()` / `deleteTea()`

### 5. 新建 `client/src/components/Admin/UserManager.jsx`

- 用户列表表格（用户名、邮箱、角色、注册时间、操作）
- 每条用户有"删除"按钮（不能删除自己）
- 删除有二次确认弹窗
- 调 `adminAPI.getUsers()` / `deleteUser()`

### 6. 修改 `client/src/App.jsx`

```jsx
// 新增导入
import AdminPage from './pages/AdminPage';
import AdminGuard from './components/Admin/AdminGuard';

// 新增路由（放在现有 <Routes> 内）
<Route path="/admin" element={
  <AdminGuard>
    <AdminPage />
  </AdminGuard>
} />
```

### 7. 修改 `client/src/components/Auth/UserButton.jsx`

- 如果 `user.role === 'admin'`，在下拉菜单中增加 "管理后台" 选项
- 点击跳转到 `/admin`

### 样式约束

- 沿用项目已有的 CSS 变量：`--ink`、`--ink-soft`、`--ink-faint`
- 表格行 hover 效果：`hover:bg-white/20`
- 按钮复用 `ui-pill` 类
- 弹窗复用 AuthModal 的毛玻璃风格
- 删除按钮用红色：`text-red-400 hover:bg-red-50`
- 字体：系统字体，标题 `font-serif`

### 验收

- [ ] 用 admin 账户登录后，用户按钮下拉出现 "管理后台"
- [ ] 点击进入 `/admin`，普通用户访问被重定向回首页
- [ ] 数据看板显示正确的统计数据
- [ ] 茶品管理可查看、新增、编辑、删除茶
- [ ] 用户管理可查看、删除用户
- [ ] 删除操作有确认弹窗
- [ ] 所有弹窗风格与地图 UI 一致
- [ ] "返回地图" 链接可用
- [ ] `npm run build` 成功

### 🛑 T8 完成，停止并报告。全部任务执行完毕。

---

## 执行顺序

```
T1（响应格式 + 错误处理）
 │
 ├──→ T2（改造所有路由）
 │     │
 │     └──→ T6（前端 api.js 适配）
 │            │
 │            └──→ T7（登录 UI，需要 T2+T6 都完成）
 │                   │
 │                   └──→ T8（管理后台，需要 T7 的登录体系）
 │
 ├──→ T3（配置集中，与 T2 可并行）
 │
 └──→ T5（入口瘦身，需要 T1+T3）
        │
        └──→ 最终验证

T4（种子数据外置）— 完全独立，随时可做
```

**推荐执行顺序：T1 → T2 → T3 → T4 → T5 → T6 → T7 → T8**

---

## 全局约束

| ID | 规则 |
|---|---|
| C01 | 每个任务只修改该任务列出的文件，不动其他文件 |
| C02 | 不新增 npm 依赖 |
| C03 | 不修改数据库表结构 |
| C04 | 不修改 `client/src/data/demoTeas.js` |
| C05 | 不修改前端组件（除 T6、T7、T8 明确列出的文件） |
| C06 | 每完成一个任务，必须 `node index.js` 验证后端启动 |
| C07 | 每完成一个任务，必须 `npm run build` 验证前端构建 |
| C08 | 所有新增文件使用 UTF-8 编码 |
| C09 | 所有新增 .js 文件顶部要有单行注释说明用途 |

---

## 最终验收（全部任务完成后）

- [ ] `npm run dev` 一键启动前后端
- [ ] 浏览器打开，地图渲染正常
- [ ] 所有 API 返回 `{ code: 0/1, data, message }` 格式
- [ ] 登录弹窗可正常注册、登录、退出
- [ ] 管理员可访问 `/admin` 后台，普通用户被拦截
- [ ] 后台可查看数据看板、管理茶品、管理用户
- [ ] `npm run build` 成功
- [ ] 后端文件结构清晰，无冗余
- [ ] `.env.example` 存在，不含真实密钥
