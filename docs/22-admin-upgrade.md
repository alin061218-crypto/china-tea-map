# 22 — 后台管理系统升级方案（Admin Upgrade）

> 文档状态：已完成（实施记录见 §7）
> 背景：用户反馈后台"太简陋"，要求：① 找合适的内容/标图 ② 前后端结合 ③ 后台优化。

## 1. 现状诊断（已读代码确认）

| 项 | 现状 | 问题 |
|---|---|---|
| 前端地图数据 | `demoTeas.js` 36 条静态数据（含 story/brewingTemp/checkinSpots/modern_forms 扩展字段） | 不走后端 |
| 后端 SQLite `teas` 表 | 25 条种子，**缺 7 字段**：category_en / brewing_temp / brewing_time / story / checkin_spots / modern_forms / beverage_chain | 后台增删改的茶前端看不到 |
| 后台页面 | AdminPage：数据看板（4 个数字卡）+ 茶品管理（表格 CRUD）+ 用户管理 | 无图、无图表、无搜索，视觉简陋 |
| api.js | `teaAPI/favAPI/checkinAPI` 标注 `@unused — UI uses static data (demoTeas.js)` | 前后端事实脱节 |

**核心结论**：前后端结合 = 让地图/详情/目录的数据源从 demoTeas.js 切换到后端 `/api/teas`，并让后端表承载前端所需的全部字段。

## 2. 方案 A：前后端数据打通（核心）

### 2.1 后端表结构扩展
`server/db/database.js` 建表语句追加列（ALTER TABLE 兼容已有库）：

```sql
ALTER TABLE teas ADD COLUMN category_en TEXT;
ALTER TABLE teas ADD COLUMN brewing_temp TEXT;
ALTER TABLE teas ADD COLUMN brewing_time TEXT;
ALTER TABLE teas ADD COLUMN story TEXT;
ALTER TABLE teas ADD COLUMN checkin_spots TEXT;      -- JSON 数组字符串
ALTER TABLE teas ADD COLUMN modern_forms TEXT;      -- JSON 数组字符串
ALTER TABLE teas ADD COLUMN beverage_chain TEXT;
```

### 2.2 种子对齐脚本
新增 `server/db/seedFromDemo.js`（可重复执行）：
- 读取 `client/src/data/demoTeas.js` 36 条（node 直接 require，demoTeas 为 ESM 导出 → 用 fs 解析或小工具转换）。
- 对已有库：**按 name 匹配 UPDATE 更新字段 + INSERT 缺失条目**（不清空 users/favorites/checkins，收藏外键不受影响；当前收藏/打卡数为 0）。
- 执行入口：`npm run db:seed-admin`（临时脚本），或直接在启动时若 teas 表缺字段则自动补。

### 2.3 后端 teas 路由输出映射
`server/routes/teas.js`：GET /teas 返回时把 snake_case 映射为前端 camelCase（categoryEn/brewingTemp/brewingTime/checkinSpots/modernForms 解析 JSON），modern_forms 保留为 JSON 字段供 `modernTea.js` 工具使用。

### 2.4 前端数据源切换（带安全回退）
新建 `client/src/data/useTeasData.js`：
- `useEffect` 中 `teaAPI.getAll()` → 成功用后端数据（36 条），失败/慢时 **fallback demoTeas.js**（保底不白屏）。
- MapPage 用该 hook 替换直接 import demoTeas；modernTeas 工具不变（读 modern_forms）。
- 效果：后台增删改茶 → 刷新地图立即反映（答辩演示点：后台加茶 → 地图出现新 marker + 详情可点）。

## 3. 方案 B：后台视觉升级（标图 + 内容）

| 模块 | 升级点 |
|---|---|
| 数据看板 | 4 统计卡加茶类图标（复用 `images/category/*.png`）；新增**六大茶类分布**条状图 + **省份 Top 茶产地**列表（由 teas 数据前端现算，无需新接口）；顶部加水墨标题装饰 |
| 茶品管理 | 表格加**缩略图列**（image_url 或茶类图标兜底）；顶部**搜索框 + 分类筛选**；行悬停动效 |
| 用户管理 | 头像圆图、收藏/打卡统计列 |
| 配图 | 搜 1–2 张水墨茶壶/茶山装饰图 → 压缩到 `images/admin/`，用于看板/登录页氛围（若搜索可用） |

## 4. 风险与对策

| 风险 | 对策 |
|---|---|
| 数据源切换改坏地图 | 双保险：fallback demoTeas + 构建后实机全流程回归（地图/详情/目录/现代茶饮/茶信录） |
| 种子重建影响收藏外键 | 只 UPDATE+INSERT 不 DELETE；备份 tea-map.db 到 tmp/ |
| modern_forms JSON 传输 | 后端原样存储字符串，路由层 JSON.parse 返回对象 |
| 时间成本 | 前后端打通为本轮主线；视觉升级按"看板图表 + 管理页缩略图/搜索"范围收敛，不做无限美化 |

## 5. 实施顺序

1. 备份 tea-map.db → 后端表加 7 字段 → seedFromDemo 对齐 36 条 → /api/teas 映射验证
2. 前端 useTeasData hook + MapPage 切换（fallback）
3. 构建 + 实机回归（传统/现代视图、详情、目录、茶信录）
4. 后台视觉：看板图表 + 管理页缩略图/搜索 + 水墨标图
5. 构建 + 后台实机验证（增删改茶 → 回地图确认生效）
6. 更新本文档实施记录 + 交付

## 6. 配图清单

| 用途 | 来源 | 落盘 |
|---|---|---|
| 茶类统计卡图标 | 复用 `images/category/*.png`（已有 7 个） | 不新增 |
| 看板/后台水墨装饰 | image_search 水墨茶壶/茶山 1–2 张 | `images/admin/`（≤120KB） |
| 茶品缩略图 | 复用 `images/tea/*.jpg`（36 张已压缩）+ image_url | 不新增 |

---

## 7. 实施记录（2026-10-18 完成）

### 7.1 数据迁移（已完成并验证）
- 新增 `server/db/migrateFromDemo.js`（可重复跑）：ALTER TABLE 加 7 字段（category_en/brewing_temp/brewing_time/story/checkin_spots/modern_forms/beverage_chain）+ slug；按 name UPDATE 已存在行 / INSERT 缺失行，**不清空任何表**。
- 执行结果：**43 条 = 36 茶 + 7 山脉条目保留**；9 条产地茶挂载现代茶饮；36 条茶都有 slug（=原 id）。
- 备份：`tmp/tea-map-backup-20261018.db`（69632B）。

### 7.2 后端路由（已完成并验证）
- `server/routes/teas.js` 新增 `mapTea()`：snake_case→camelCase（id=slug、categoryEn/brewingTemp/brewingTime、checkinSpots/modern_forms JSON.parse、beverage_chain）；GET /、/season、/month 统一映射；GET /:id 按 slug 或数字 id。
- `server/routes/admin.js` 扩 7 新字段 CRUD（toJson 辅助），DELETE 级联删 favorites。
- **`server/index.js` 新增 `app.disable('etag')`**（本轮修复）：Express 默认 ETag 导致浏览器对 /api/teas 返回 304（响应体空），axios 拿不到数据 → 前端静默回退静态数据。

### 7.3 前端数据源（已完成并验证）
- 新增 `client/src/data/useTeasData.js`：demoTeas 兜底 + 异步替换后端数据。
- **修复 2 个 bug（本轮实测发现）**：
  1. `data?.teas` → `data?.data?.teas`：axios 响应拦截器已把 res.data 改写为后端 data 字段，then 回调参数是 response 对象，原代码永远拿不到数据（一直回退 demoTeas）。
  2. 过滤条件 `!t.is_mountain && t.categoryEn`：排除 2 条旧种子残条（福州茉莉 24 / 午子仙毫 25，无 categoryEn，会与 jasmine/汉中仙毫在地图重复渲染）。
- MapPage 三处硬引用全部替换 useTeasData；modernTea.js 零改动（id=slug 兼容）。

### 7.4 后台视觉升级（已完成并实机验证）
- AdminDashboard 重写：4 统计卡水墨线性图标 + 六大茶类分布条状图 + 省份 Top 6（前端现算）。
- TeaManager 重写：缩略图列（/images/tea/{categoryEn}/{slug}.jpg，兜底 tea-icons）、搜索框、分类筛选、冲泡列、现代茶饮徽标列；TeaForm 扩到 24 字段。
- UserManager：头像圆图、管理员徽标、禁删管理员。
- AdminPage：标题横幅 + 茶壶 SVG + 水墨装饰图（image_search 2 张 → `images/admin/` 压缩落盘）。

### 7.5 闭环演示（已实机验证通过）
- 后台新增「云雾测试」（安徽六安 31.5,116.3 绿茶 green）→ 保存成功（茶品管理 44 条）→ 后端 /api/teas total=44 含云雾测试 → 前端硬刷新 → **茶信录列表 count=37、云雾测试 has=true、首条滇红（后端顺序）** → 后台增删改茶即时反映到前端 ✅
- 实机验证截图帧（cu）：admin-dashboard-v2 / tea-manager-v2 / after-save / verify-fixed / verify-final。

### 7.6 遗留说明
- 新增茶「云雾测试」为验证用数据，答辩前可后台删除（其 favorites 级联删除）。
- 数据库 sql.js 内存库定时写回；后端重启后数据持久化于 `server/tea-map.db`。
