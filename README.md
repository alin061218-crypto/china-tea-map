# 茶韵中国 · Tea Atlas

> 中国茶文化交互式水墨地图 —— 毕业设计项目
>
> 本文档是**本地实操手册**：告诉你怎么把项目跑起来、怎么往里加新内容。
> 以仓库当前实际代码为准；`docs/` 下的英文文档是早期规划稿，部分内容（如 Vercel / PostgreSQL）与实际实现不一致，启动时不要照搬。

---

## 一、这是个什么项目

一个单页全屏的中国地图网站：用水墨画风的 SVG 地图展示中国茶产区，用户可以平移缩放地图，点开花朵状茶标看茶叶详情（产地、冲泡参数、历史故事、打卡景点），并能按季节/品类筛选。

- **品牌气质**：水墨、宣纸、留白、茶山云雾，像一张会动的水墨版画，不是后台仪表盘。
- **核心交互**：地图平移缩放 → 悬停省份看氛围 → 点茶标出详情面板 → 底部弹层浏览全部茶。
- **当前数据规模**：36 款茶 + 8 个山地区域条目，覆盖 7 大茶类。

---

## 二、技术栈

| 层 | 技术 | 说明 |
|---|---|---|
| 前端 | React 18 + Vite 6 + Tailwind CSS 3 | `client/`，ESM |
| 地图 | D3.js（zoom/pan + GeoJSON） | `china.json` 渲染省界 |
| 动效 | framer-motion + Three.js（粒子花效） | |
| 后端 | Express 4 | `server/`，CommonJS，端口 **3002** |
| 数据库 | SQLite（`sql.js`，优先 `better-sqlite3`） | 文件 `server/tea-map.db` |
| 鉴权 | JWT（jsonwebtoken + bcryptjs） | |
| 部署 | nixpacks（Railway） | 见根目录 `nixpacks.toml` |

---

## 三、环境要求

- **Node.js ≥ 18**（本机已验证 v22.23.2，npm 10.9.8，可直接跑）
- 无需单独装 MySQL / PostgreSQL / Redis，数据库就是一个本地 `.db` 文件。

依赖状态（当前仓库已就绪，无需重装）：

```
E:\tea\node_modules          ✅
E:\tea\client\node_modules   ✅
E:\tea\server\node_modules   ✅
E:\tea\server\tea-map.db     ✅（已含 36 款茶 + admin 账号）
E:\tea\client\dist           ✅（已构建过一次）
E:\tea\server\.env           ✅（已配置）
```

> 如果换到新机器或删过依赖，在根目录执行 `npm run install:all` 一次性装齐三处依赖。

---

## 四、怎么启动

> **端口说明**：本机 3001 被天气项目（pm2）占用，故茶项目后端跑在 **3002**（已写入 `server/.env` 和 `client/vite.config.js`）。前端只访问 http://localhost:5173，Vite 会代理 `/api` 到 3002。换台机器 3001 空闲时可改回 3001。

**所有命令都在根目录 `E:\tea` 下执行。**

### 4.1 开发模式（日常写代码用这个）

```bash
npm run dev
```

这条命令用 `concurrently` 同时起前端和后端：

| 服务 | 地址 | 说明 |
|---|---|---|
| 前端 Vite | http://localhost:5173 | 改代码自动热更新 |
| 后端 API | http://localhost:3002 | `node --watch`，改后端代码自动重启 |

前端通过 Vite 代理把 `/api/*` 转发到 3002，所以浏览器只开 **http://localhost:5173** 就行。

健康检查：浏览器打开 http://localhost:3002/api/health 应返回 `{"status":"ok",...}`。

### 4.2 只起其中一个

```bash
npm run dev:client   # 只起前端 5173
npm run dev:server   # 只起后端 3002
```

### 4.3 生产模式（模拟上线）

```bash
npm run build    # 前端打包到 client/dist
npm start        # 后端 3002 同时托管打包好的前端
```

然后浏览器开 http://localhost:3002 即可，前后端同源，不再需要 Vite。

### 4.4 默认账号

- 管理员：`admin` / `admin123`（首次启动自动创建）
- 管理后台入口：前端登录后访问 `/admin`，或代码里 `components/Admin/AdminDashboard.jsx`。

---

## 五、目录速览

```
E:\tea\
├── client\                     前端
│   ├── index.html
│   ├── vite.config.js          代理 /api → 3002
│   ├── public\
│   │   ├── china.json          中国省界 GeoJSON
│   │   ├── neighbors.json      邻国边界
│   │   └── images\
│   │       └── tea\
│   │           ├── green\      绿茶图
│   │           ├── black\      红茶图
│   │           ├── oolong\     乌龙茶图
│   │           ├── white\      白茶图
│   │           ├── yellow\      黄茶图
│   │           ├── dark\        黑茶图
│   │           └── flower\     花茶图
│   └── src\
│       ├── data\
│       │   ├── demoTeas.js     ★ 36 款茶的主数据源（加新茶改这里）
│       │   └── teaKnowledge.js
│       ├── components\
│       │   ├── Map\TeaMap.jsx          地图主组件
│       │   ├── Tea\TeaDetailPanel.jsx  详情面板
│       │   ├── Tea\TeaCatalogPopup.jsx 底部茶单
│       │   └── Admin\...               管理后台
│       ├── contexts\           SeasonContext / AuthContext
│       └── services\api.js     axios 封装
├── server\                     后端
│   ├── index.js                Express 入口
│   ├── config\index.js         端口/JWT/CORS 配置
│   ├── .env                    本地环境变量
│   ├── tea-map.db              SQLite 数据库文件
│   ├── routes\                 auth / teas / favorites / checkins / admin
│   ├── db\
│   │   ├── database.js         建表 + sql.js/better-sqlite3 双后端
│   │   ├── seed.js             旧版种子（25 条，已弃用，别再用）
│   │   ├── seeds\teas.json     旧版种子数据（已弃用）
│   │   └── migrateFromDemo.js   ★ 把 demoTeas.js 同步进 SQLite（加新茶跑这个）
├── modules\                    TypeScript 设计层（不参与运行，仅供参考）
├── scripts\                    Python 脚本：生成山脉/水墨图层 PNG
├── docs\                       英文规划文档（22 篇，早期设计稿）
├── nixpacks.toml               Railway 部署配置
└── package.json                根脚本
```

---

## 六、怎么加一款新茶（重点）

> 当前**唯一权威数据源**是 `client/src/data/demoTeas.js`。
> `server/db/seeds/teas.json` 是早期 25 条旧版，已经和现库对不上，**不要再改它、不要靠它重建数据库**。

### 6.1 三步流程

1. **在 `client/src/data/demoTeas.js` 数组里追加一条对象**（格式见 6.2）。
2. **放茶叶图片**到 `client/public/images/tea/{categoryEn}/{id}.jpg`（命名见 6.3）。
3. **同步进数据库**：
   ```bash
   cd server
   node db/migrateFromDemo.js
   ```
   这个脚本会按"茶名"匹配：已存在就 UPDATE，不存在就 INSERT；**不会清空 users / favorites / checkins**，也会自动补缺失列。
4. 重启后端（`npm run dev:server`，或 dev 模式下 `node --watch` 自动重启），刷新前端即可看到新茶标。

### 6.2 demoTeas.js 单条记录字段规范

照着数组里现有 36 条的写法抄，字段含义：

| 字段 | 必填 | 类型 | 说明 / 示例 |
|---|---|---|---|
| `id` | ✅ | string | **slug，kebab-case，全局唯一**，同时决定图片文件名。如 `longjing`、`dahongpao`、`anhua-heicha` |
| `name` | ✅ | string | 中文名，如 `西湖龙井` |
| `province` | ✅ | string | 省，如 `浙江` |
| `city` | ✅ | string | 市/产地，如 `杭州` |
| `latitude` / `longitude` | ✅ | number | **十进制经纬度**，决定地图上落点。可用高德/百度地图坐标拾取器查，如 `30.10, 120.30` |
| `category` | ✅ | string | 中文大类：`绿茶` / `红茶` / `乌龙茶` / `白茶` / `黄茶` / `黑茶` / `花茶` |
| `categoryEn` | ✅ | string | 英文枚举，**必须与图片子目录一致**：`green` / `black` / `oolong` / `white` / `yellow` / `dark` / `flower` |
| `maturity_months` | ✅ | string | 采摘月份，空格分隔中文，如 `"3月 4月"` |
| `seasons` | ✅ | string | **英文季节键**（不是中文！），空格分隔多季：`spring` / `summer` / `autumn` / `winter` |
| `meaning` | ✅ | string | 一句诗意短描述（≤30 字），如 `"清雅鲜爽，像春日西湖边刚展开的一缕嫩芽。"` |
| `brewingTemp` | ✅ | string | 冲泡水温，如 `"80-85°C"` / `"95-100°C"` / `"100°C"` |
| `brewingTime` | ✅ | string | 冲泡时长，如 `"2-3分钟"` / `"3-5分钟"` |
| `story` | ✅ | string | 历史/传说一段（80–150 字），要有文化感，别写成商品简介 |
| `checkinSpots` | ✅ | string[3] | 3 个当地可打卡景点，如 `["龙井村","九溪烟树","西湖风景名胜区"]` |
| `modern_forms` | 可选 | array | 现代茶饮关联（瓶装茶/奶茶茶底），结构见 6.4；没有就删掉这个键 |
| `beverage_chain` | 可选 | string | 一句话产业链，如 `"福建安溪 → 铁观音乌龙 → 果子熟了·金桂乌龙 / 喜茶·金凤茶王（新茶饮）"` |

**最小可用示例**（一款全新绿茶）：

```js
{
  id: 'xincha-example', name: '示例新茶', province: '浙江', city: '杭州',
  latitude: 30.25, longitude: 120.10, category: '绿茶', categoryEn: 'green',
  maturity_months: '3月 4月', seasons: 'spring',
  meaning: '一句诗意的短描述。',
  brewingTemp: '80-85°C', brewingTime: '2-3分钟',
  story: '这段写历史或传说，80到150字，要有文化味道。',
  checkinSpots: ['景点一', '景点二', '景点三']
},
```

### 6.3 图片要求

- 路径：`client/public/images/tea/{categoryEn}/{id}.jpg`
  - 例如 `id: 'longjing'`、`categoryEn: 'green'` → `client/public/images/tea/green/longjing.jpg`
- 尺寸：≥ 400×300，横版 4:3 或 3:2
- 格式：`.jpg`（现有 36 张都是 jpg）
- 风格：尽量贴水墨/实景茶质感，避免白边、水印、过度修图

### 6.4 modern_forms 结构（可选，加"现代茶饮"模块时用）

```js
modern_forms: [{
  type: '瓶装即饮茶',            // 或 '奶茶茶底' / '现代调饮'
  brand: '果子熟了',             // 品牌
  product: '茉莉龙井',            // 产品名
  note: '一句话说明关联（据品牌公开产品信息）',
  anchor: { province: '福建', city: '福州',
            latitude: 26.20, longitude: 119.42 }  // 地图上额外落点
}],
beverage_chain: '福建福州 → 茉莉花茶 → 果子熟了·茉莉龙井 / 茶百道·茉莉奶绿（新茶饮）'
```

---

## 七、⚠️ 容易踩的坑

1. **不要去改 `server/db/seeds/teas.json`**。那是旧的 25 条版本，已经和 `demoTeas.js`（36 条）脱节。加新茶只改 `demoTeas.js`。
2. **不要直接删 `tea-map.db` 然后靠 `npm run seed` 重建**。`seed.js` 读的是旧 `seeds/teas.json`，重建后会把你现在的 36 条数据冲掉成 25 条。正确做法是跑 `node db/migrateFromDemo.js`。
3. **`seasons` 字段用英文键**（spring/summer/autumn/winter），不要写"春"。写中文季节会导致季节筛选失效。
4. **图片路径两级目录**：`images/tea/green/longjing.jpg`，不是 `images/teas/longjing.jpg`（旧路径已废弃，`images/teas/` 目录现在不存在）。
5. **后端在跑时不要同时用别的工具写同一个 `tea-map.db`**，会锁库；跑 `migrateFromDemo.js` 前最好先停掉 dev:server。
6. **改完 `demoTeas.js` 必须跑 migrate 脚本**，否则前端虽然能热更新看到，但刷新后如果走后端 API 就还是旧数据（前端有 demoTeas 兜底，所以视觉上可能"看起来加了"，但数据库里没有）。
7. **JWT_SECRET** 在 `server/.env` 里，上线前务必改成强随机值，别用默认的。

---

## 八、常用命令速查

| 目的 | 命令（在 E:\tea 下） |
|---|---|
| 同时起前后端（开发） | `npm run dev` |
| 只起前端 | `npm run dev:client` |
| 只起后端 | `npm run dev:server` |
| 前端打包 | `npm run build` |
| 生产启动 | `npm start` |
| 把 demoTeas.js 同步进数据库 | `cd server; node db/migrateFromDemo.js` |
| 健康检查 | 浏览器开 http://localhost:3002/api/health |
| 全部茶数据 API | 浏览器开 http://localhost:3002/api/teas |

---

## 九、下一步

按本 README 跑起来确认无误后，告诉我你要加的具体茶（或其他内容：新模块、新页面、改文案等），我会按第六章的流程直接帮你改代码、放图、同步数据库并验证。
