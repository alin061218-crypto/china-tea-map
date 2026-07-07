# 茶花图标 AI 生成

**用途**：茶点 hover 时绽放的 mini 茶花图标
**行为**：默认显示 SVG 圆点，hover 时圆点缩小、图标从中心 scale(0)→scale(1) 绽出
**放置**：`public/images/tea-icons/`

---

## 通用规则（全部 7 个）

- 64×64px，RGBA，透明 PNG，alpha 通道
- 极细墨线勾轮廓，毛笔笔触感（粗细略有变化，不是均匀矢量线）
- 用色极克制——每种颜色像被水洗过 5 遍的淡彩
- 没有硬边、没有纯黑、没有鲜艳色
- 图标中央构图，四周留透明 padding
- AI 生成时直接输出透明背景，不要绿幕抠图

---

## 逐个提示词

### 1. 绿茶 — 嫩芽 `green.png`

> A single tiny Chinese tea bud with one leaf (一芽一叶), hand-painted in Song dynasty ink-wash gongbi style (宋代工笔淡彩). Minimal brush strokes — a fine dark ink outline of a tender bud and single unfurling leaf, filled with the faintest celadon-green wash (#c8d5c0) over warm rice-paper cream. The green is barely there, like a water stain. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 2. 红茶 — 盛开的茶花 `black.png`

> A single tiny blooming camellia flower (山茶花), hand-painted in Song dynasty ink-wash gongbi style. Five rounded petals in the faintest warm peach-pink wash (#e8cec0), with barely-visible fine ink strokes defining petal edges and a small cluster of stamens at center. The color is washed-out and soft, like faded silk. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 3. 乌龙茶 — 卷曲茶叶 + 半开花苞 `oolong.png`

> A single tiny curled tea leaf beside a half-open bud, hand-painted in Song dynasty ink-wash gongbi style. The curled leaf has fine ink contour lines with the faintest warm sienna wash (#d4b8a8), showing the characteristic twist of oolong processing. The half-bud has two petals slightly parted. Very sparse ink, mostly negative space. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 4. 白茶 — 银针芽头 `white.png`

> A single tiny silver-needle tea bud (白毫银针), hand-painted in Song dynasty ink-wash gongbi style. A straight upright bud covered in fine white down (毫) — rendered with extremely fine hairline ink strokes, almost no color fill, just the faintest silvery-gray wash (#e8e4e0) and tiny white highlight dots suggesting the fuzz. The most minimal of the seven icons. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 5. 黄茶 — 嫩黄茶芽 `yellow.png`

> A single tiny tender yellow tea bud, hand-painted in Song dynasty ink-wash gongbi style. A plump bud with one slightly open leaf, filled with the faintest warm straw-yellow wash (#e8ddc0), like sunlight through rice paper. Fine ink outline with deliberately broken strokes. The yellow is extremely subtle — more a warmth than a color. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 6. 黑茶 — 老叶 `dark.png`

> A single tiny aged dark tea leaf, hand-painted in Song dynasty ink-wash gongbi style. A broader, more weathered leaf shape with slightly irregular edges, filled with subtle umber-brown wash (#c8b8a8) and slightly darker ink vein lines. More ink presence than the other icons — the leaf has weight and age. Still soft and washed-out, not harsh. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

### 7. 花茶 — 茉莉花 `flower.png`

> A single tiny jasmine flower, hand-painted in Song dynasty ink-wash gongbi style. A small round flower with five delicate rounded petals in pure warm cream-white (#f8f4ec), with the finest hairline ink strokes defining petal edges and a tiny pale yellow-green center. Almost entirely white with just enough ink to read the shape. Clean white background removed — output as transparent PNG with alpha channel. 64×64px.

---

## 集成方式（生成后）

每个茶点的 `<g>` 内，在 `<circle>` 旁边加 `<image>`：

```jsx
<image
  href={`/images/tea-icons/${tea.categoryEn}.png`}
  x={-12} y={-12}
  width={24} height={24}
  className="tea-icon-bloom"
/>
```

CSS：

```css
.tea-icon-bloom {
  opacity: 0;
  transform: scale(0);
  transition: opacity 0.4s var(--ink-ease), transform 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
  pointer-events: none;
}

.tea-signal:hover .tea-icon-bloom,
.tea-signal.region-visible .tea-icon-bloom {
  opacity: 0.85;
  transform: scale(1);
}

.tea-signal:hover .tea-signal-dot,
.tea-signal.region-visible .tea-signal-dot {
  opacity: 0;
  transform: scale(0.3);
}
```
