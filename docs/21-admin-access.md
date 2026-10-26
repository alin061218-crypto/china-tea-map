# 21 — 后台管理系统访问说明（Admin Access）

> 文档状态：已验证（2026-10-18）
> 背景：用户反馈"打不开后台"，排查后确认后台功能正常，问题是访问路径与登录前置条件不明确。

## 1. 后台访问方式（已实机验证）

| 步骤 | 操作 | 说明 |
|---|---|---|
| 1 | 启动服务（后端 3001 + 前端构建/preview） | 后端 `npm run dev:server`（端口 3001）；前端 `npm run build` 后用 `npm run preview`（端口 4173），或由后端直接托管 `localhost:3001` |
| 2 | 打开地图页 → 点底部「登录」 | 弹出登录弹窗 |
| 3 | 输入管理员账号 | **admin / admin123**（后端种子管理员，role=admin） |
| 4 | 点右上角用户名「admin」 | 弹出用户菜单 |
| 5 | 点「管理后台」 | 进入 `http://localhost:4173/admin` |

## 2. 关键事实

- 前端路由：`/admin`（App.jsx，`AdminGuard` 包裹 `AdminPage`）。
- **拦截规则**：未登录或 role ≠ admin 访问 `/admin` 会被 `AdminGuard` 重定向回 `/`（地图页）——这是"打不开后台"的直接原因，不是功能故障。
- 后端接口：`server/routes/admin.js`，挂载 `/api/admin`，全部路由需 `authMiddleware + adminMiddleware`（JWT 管理员校验）。
- 后台功能：数据看板（茶品/用户/收藏/打卡统计）、茶品管理（CRUD 含山脉标记）、用户管理（角色修改/删除，保护唯一管理员）。

## 3. 验证记录

| 项 | 结果 |
|---|---|
| `http://localhost:3001/api/health` | 200 ok |
| `http://localhost:4173/admin`（未登录） | 200（SPA fallback，前端重定向回地图） |
| admin 登录 → 菜单 → 管理后台 | ✅ 数据看板正常：茶品总数 33、用户 1、收藏 0、打卡 0 |
| 茶品管理 / 用户管理导航 | 路由挂载完整（AdminDashboard/TeaManager/UserManager） |

## 4. 备注

- 后端种子数据 25 条 vs 前端 demo 36 条为历史遗留差异（前端为演示数据源），后台管理操作的是后端 SQLite `teas` 表。
- 如需在演示时更快进入后台，可考虑底部栏加「后台管理」入口（admin 登录后显示），当前通过用户名菜单进入，已在本文档记录。
