# 07 — Tea Content System

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Single Source of Truth for All Content Data Models**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | DATA-007 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-04 |
| **Related Documents** | `02-information-architecture.md`, `06-map-system.md`, `16-data-schema.md`, `14-content-guideline.md` |

---

## 2. Content System Overview

The Tea Atlas content system defines three primary entity types. Each has a strict schema, a defined data source, and explicit relationships to other entities.

```
Tea ──────────────── Story
 │                      │
 ├── province FK        ├── tea_refs[] FK
 ├── category enum      ├── region_ref FK
 ├── flavor_profile     ├── type enum
 ├── brewing_guide      └── content (structured)
 └── origin_story
        │
Culture ────────────────┘
 ├── theme enum
 ├── tea_refs[] FK
 ├── region_ref FK
 └── description
```

---

## 3. Tea Entity

### 3.1 Tea Schema

| Field | Type | Required | Status | Description |
|---|---|---|---|---|
| `id` | `string` | P0 | ✅ Exists in seed | URL-safe slug, e.g. `"longjing"` |
| `name` | `string` | P0 | ✅ Exists in seed | Chinese display name, e.g. `"西湖龙井"` |
| `nameEn` | `string` | P1 | ⚠️ New | English display name, e.g. `"West Lake Longjing"` |
| `province` | `string` | P0 | ✅ Exists in seed | Province name in Chinese, e.g. `"浙江"` |
| `provinceSlug` | `string` | P1 | ⚠️ New | Province URL slug, e.g. `"zhejiang"` |
| `city` | `string` | P0 | ✅ Exists in seed | City name in Chinese, e.g. `"杭州"` |
| `latitude` | `number` | P0 | ✅ Exists in seed | Decimal latitude for map pin |
| `longitude` | `number` | P0 | ✅ Exists in seed | Decimal longitude for map pin |
| `category` | `string` | P0 | ✅ Exists in seed | Chinese category, e.g. `"绿茶"` |
| `categoryEn` | `TeaType` (enum) | P0 | ⚠️ New | English type enum: `"green"` |
| `region` | `TeaRegion` (enum) | P1 | ⚠️ New | Tea region grouping: `"jiangnan"` |
| `seasons` | `string` | P0 | ✅ Exists in seed | Space-separated season keys, e.g. `"spring"` |
| `maturityMonths` | `string` | P0 | ✅ Exists in seed | Space-separated month labels, e.g. `"3月 4月"` |
| `meaning` | `string` | P0 | ✅ Exists in seed | Poetic one-line description (Chinese) |
| `meaningEn` | `string` | P1 | ⚠️ New | Poetic one-line description (English) |
| `flavorProfile` | `FlavorProfile` | P0 | ⚠️ New | Structured flavor data (see 3.4) |
| `elevation` | `Elevation` | P1 | ⚠️ New | Growing elevation range |
| `originStory` | `OriginStory` | P0 | ⚠️ New | Legend/history content (see 3.5) |
| `brewingGuide` | `BrewingGuide` | P0 | ⚠️ New | Brewing parameters (see 3.6) |
| `heroImage` | `string` | P0 | ⚠️ New | Asset path for tea detail hero illustration |
| `thumbnailImage` | `string` | P0 | ⚠️ New | Asset path for tea card thumbnail |
| `relatedTeas` | `string[]` | P1 | ⚠️ New | Array of tea `id` values for cross-linking |
| `storyRefs` | `string[]` | P1 | ⚠️ New | Array of story `id` values linked to this tea |
| `cultureRefs` | `string[]` | P1 | ⚠️ New | Array of culture `id` values linked to this tea |

> ✅ Exists in seed = field is present in `client/src/data/demoTeas.js` as of 2026-07-04.
> ⚠️ New = field is defined in this document but not yet in the codebase.

### 3.2 Field Migration Map

| Seed Field (demoTeas.js) | Schema Field (this doc) | Action |
|---|---|---|
| `id` | `id` | Keep, no change |
| `name` | `name` | Keep, no change |
| `province` | `province` | Keep, no change |
| `city` | `city` | Keep, no change |
| `latitude` | `latitude` | Keep, no change |
| `longitude` | `longitude` | Keep, no change |
| `category` | `category` | Keep, add `categoryEn` mapping |
| `maturity_months` | `maturityMonths` | Keep, rename to camelCase |
| `seasons` | `seasons` | Keep, no change |
| `meaning` | `meaning` | Keep, no change |
| — | `nameEn` | Add |
| — | `provinceSlug` | Add |
| — | `categoryEn` | Add (enum lookup from `category`) |
| — | `region` | Add |
| — | `meaningEn` | Add |
| — | `flavorProfile` | Add |
| — | `elevation` | Add |
| — | `originStory` | Add |
| — | `brewingGuide` | Add |
| — | `heroImage` | Add |
| — | `thumbnailImage` | Add |
| — | `relatedTeas` | Add |
| — | `storyRefs` | Add |
| — | `cultureRefs` | Add |

### 3.3 Tea Type Enum

| Key | Chinese Label | Badge Variant (04-ui) | Priority |
|---|---|---|---|
| `green` | 绿茶 | `Badge.Type.Green` | P0 |
| `black` | 红茶 | `Badge.Type.Black` | P0 |
| `oolong` | 乌龙茶 | `Badge.Type.Oolong` | P0 |
| `white` | 白茶 | `Badge.Type.White` | P0 |
| `yellow` | 黄茶 | `Badge.Type.Yellow` | P0 |
| `dark` | 黑茶 | `Badge.Type.Dark` | P0 |
| `puer` | 普洱茶 | `Badge.Type.Puer` | P0 |
| `scented` | 花茶 | `Badge.Type.Scented` | P0 |

> Existing seed data uses Chinese labels (e.g. `"绿茶"`, `"乌龙茶"`). The `categoryEn` field is a new addition mapped from `category`.

### 3.4 FlavorProfile

| Field | Type | Required | Description |
|---|---|---|---|
| `primaryNotes` | `FlavorNote[]` | P0 | 1–3 dominant flavor notes |
| `secondaryNotes` | `FlavorNote[]` | P1 | 0–3 subtle flavor notes |
| `body` | `"light" \| "medium" \| "full"` | P0 | Mouthfeel weight |
| `finish` | `"short" \| "medium" \| "long"` | P0 | Aftertaste duration |
| `astringency` | `"none" \| "low" \| "medium" \| "high"` | P1 | Astringency level |

### 3.5 FlavorNote Enum

| Key | Label (EN) | Label (ZH) |
|---|---|---|
| `floral` | Floral | 花香 |
| `nutty` | Nutty | 坚果 |
| `smoky` | Smoky | 烟熏 |
| `sweet` | Sweet | 甘甜 |
| `vegetal` | Vegetal | 青草 |
| `earthy` | Earthy | 陈香 |
| `fruity` | Fruity | 果香 |
| `roasted` | Roasted | 焙火 |
| `marine` | Marine | 海苔 |
| `spicy` | Spicy | 辛香 |
| `honey` | Honey | 蜜香 |
| `woody` | Woody | 木质 |

### 3.6 OriginStory

| Field | Type | Required | Description |
|---|---|---|---|
| `title` | `string` | P0 | Story title, e.g. `"乾隆与龙井"` |
| `titleEn` | `string` | P1 | English title |
| `era` | `string` | P1 | Historical era, e.g. `"Tang Dynasty (618–907)"` |
| `content` | `string` | P0 | Story text, 2–4 paragraphs |
| `contentEn` | `string` | P0 | English story text |
| `source` | `string` | P1 | Attribution or reference |

### 3.7 BrewingGuide

| Field | Type | Required | Description |
|---|---|---|---|
| `waterTemp` | `number` | P0 | Ideal water temperature in °C |
| `waterTempRange` | `[number, number]` | P1 | Acceptable range |
| `steepTime` | `number` | P0 | First infusion time in seconds |
| `steepTimeSubsequent` | `number` | P1 | Subsequent infusion time in seconds |
| `maxInfusions` | `number` | P0 | Recommended maximum infusions |
| `teaAmount` | `string` | P0 | Tea-to-water ratio, e.g. `"3g / 150ml"` |
| `vessel` | `BrewingVessel` | P0 | Recommended teaware (see 3.8) |
| `vesselAlt` | `BrewingVessel` | P1 | Alternative teaware option |
| `steps` | `string[]` | P1 | Short brewing steps, 3–5 items |
| `tips` | `string` | P1 | Pro tip or note |

### 3.8 BrewingVessel Enum

| Key | Label (EN) | Label (ZH) |
|---|---|---|
| `gaiwan` | Gaiwan | 盖碗 |
| `yixing` | Yixing Teapot | 紫砂壶 |
| `glass` | Glass Teapot | 玻璃壶 |
| `porcelain` | Porcelain Teapot | 瓷壶 |
| `gongfu` | Gongfu Set | 功夫茶具 |
| `grandpa` | Grandpa Style (cup) | 杯泡 |

### 3.9 Elevation

| Field | Type | Required | Description |
|---|---|---|---|
| `min` | `number` | P1 | Minimum elevation in meters |
| `max` | `number` | P1 | Maximum elevation in meters |
| `label` | `string` | P1 | Human-readable, e.g. `"800–1500m"` |

### 3.10 TeaRegion Enum (Grouping)

| Key | Label (EN) | Label (ZH) | Provinces |
|---|---|---|---|
| `jiangnan` | Jiangnan | 江南 | Zhejiang, Jiangsu, Anhui, Jiangxi |
| `jiangbei` | Jiangbei | 江北 | Henan, Shandong, Hubei |
| `southchina` | South China | 华南 | Fujian, Guangdong, Taiwan, Guangxi, Hainan |
| `southwest` | Southwest | 西南 | Yunnan, Sichuan, Guizhou, Tibet |

---

## 4. Story Entity

### 4.1 Story Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | P0 | URL-safe slug, e.g. `"tea-horse-road"` |
| `title` | `string` | P0 | Story title (Chinese), e.g. `"茶马古道"` |
| `titleEn` | `string` | P0 | English title, e.g. `"The Tea Horse Road"` |
| `type` | `StoryType` | P0 | Category (see 4.2) |
| `era` | `string` | P1 | Historical era, e.g. `"Tang–Ming Dynasty"` |
| `regionRef` | `string` | P0 | Linked `TeaRegion` key or province slug |
| `teaRefs` | `string[]` | P0 | Array of tea `id` values linked to this story |
| `cultureRefs` | `string[]` | P1 | Array of culture `id` values linked to this story |
| `summary` | `string` | P0 | One-paragraph summary (Chinese) |
| `summaryEn` | `string` | P0 | One-paragraph summary (English) |
| `content` | `string` | P0 | Full story text, 3–6 paragraphs (Chinese) |
| `contentEn` | `string` | P0 | Full story text (English) |
| `imageRef` | `string` | P1 | Asset path for story illustration |
| `nodeType` | `"story"` | P0 | Map node type (for map system integration) |
| `entryBehavior` | `ANIM-ID` | P0 | Map node entry animation: `ANIM-067` |
| `exitBehavior` | `ANIM-ID` | P0 | Map node exit animation: `ANIM-068` |
| `uiComponent` | `ComponentRef` | P0 | UI component: `StoryPanel` |

### 4.2 StoryType Enum

| Key | Label (EN) | Label (ZH) | Description |
|---|---|---|---|
| `historical` | Historical | 历史 | Real historical events, trade routes, dynastic tea culture |
| `legend` | Legend | 传说 | Myths, folklore, origin legends |
| `sensory` | Sensory | 感官 | Taste, aroma, texture narratives |
| `cultural` | Cultural | 文化 | Rituals, ceremonies, social practices |
| `craftsmanship` | Craftsmanship | 工艺 | Processing techniques, artisan traditions |

### 4.3 Story Inventory (v1)

| ID | Title | Type | Region | Linked Teas |
|---|---|---|---|---|
| `tea-horse-road` | 茶马古道 | `historical` | `southwest` | `puer`, `dianhong` |
| `shennong-tea` | 神农尝茶 | `legend` | — (all) | — |
| `longjing-emperor` | 乾隆与龙井 | `legend` | `jiangnan` | `longjing` |
| `wuyi-rock-tea` | 武夷岩茶传奇 | `historical` | `southchina` | `dahongpao`, `tieguanyin` |
| `gongfu-ceremony` | 功夫茶之道 | `cultural` | `southchina` | `dancong`, `tieguanyin` |
| `tribute-tea` | 贡茶之路 | `historical` | `jiangnan` | `biluochun`, `longjing` |
| `puer-aging` | 普洱茶的时间密码 | `sensory` | `southwest` | `puer` |
| `silver-needle-legend` | 白毫银针的诞生 | `legend` | `southchina` | `yinzhen` |
| `jasmine-scenting` | 茉莉窨制工艺 | `craftsmanship` | `southchina` | `jasmine`, `hengxian` |
| `tibetan-tea` | 藏茶与高原 | `cultural` | `southwest` | `yigong` |

---

## 5. Culture Entity

### 5.1 Culture Schema

| Field | Type | Required | Description |
|---|---|---|---|
| `id` | `string` | P0 | URL-safe slug, e.g. `"tea-ceremony-tang"` |
| `title` | `string` | P0 | Culture topic title (Chinese) |
| `titleEn` | `string` | P0 | English title |
| `theme` | `CultureTheme` | P0 | Thematic category (see 5.2) |
| `era` | `string` | P1 | Associated historical era |
| `regionRef` | `string` | P0 | Linked `TeaRegion` key or province slug |
| `teaRefs` | `string[]` | P0 | Array of tea `id` values linked to this topic |
| `storyRefs` | `string[]` | P1 | Array of story `id` values linked to this topic |
| `description` | `string` | P0 | Full description, 2–5 paragraphs (Chinese) |
| `descriptionEn` | `string` | P0 | Full description (English) |
| `imageRef` | `string` | P1 | Asset path for culture illustration |
| `nodeType` | `"culture"` | P0 | Map node type |
| `entryBehavior` | `ANIM-ID` | P0 | Map node entry animation: `ANIM-067` |
| `exitBehavior` | `ANIM-ID` | P0 | Map node exit animation: `ANIM-068` |
| `uiComponent` | `ComponentRef` | P0 | UI component: `CultureCard` |

### 5.2 CultureTheme Enum

| Key | Label (EN) | Label (ZH) | Description |
|---|---|---|---|
| `ceremony` | Ceremony | 茶礼 | Tea rituals, ceremonies, etiquette |
| `tradition` | Tradition | 传统 | Cultural traditions involving tea |
| `philosophy` | Philosophy | 哲学 | Tea and Zen, tea and Dao, tea aesthetics |
| `tools` | Tools & Teaware | 茶具 | Teapots, cups, tools, craftsmanship |
| `literature` | Literature & Art | 文艺 | Tea in poetry, painting, calligraphy |
| `society` | Society | 社会 | Tea houses, social customs, daily life |
| `healing` | Healing & Health | 养生 | Tea and traditional medicine, wellness |

### 5.3 Culture Inventory (v1)

| ID | Title | Theme | Region | Linked Teas |
|---|---|---|---|---|
| `tang-tea-ceremony` | 唐代煎茶 | `ceremony` | — (all) | — |
| `song-diancha` | 宋代点茶 | `ceremony` | `jiangnan` | `longjing` |
| `gongfu-cha` | 功夫茶 | `ceremony` | `southchina` | `tieguanyin`, `dancong` |
| `tea-zen` | 茶禅一味 | `philosophy` | — (all) | — |
| `yixing-teapot` | 紫砂壶艺 | `tools` | `jiangnan` | `biluochun`, `keemun` |
| `jianzhan` | 建盏 | `tools` | `southchina` | `dahongpao` |
| `tea-poetry-tang` | 唐代茶诗 | `literature` | — (all) | — |
| `tea-house-culture` | 茶馆文化 | `society` | — (all) | — |
| `chaqi` | 茶气 | `philosophy` | — (all) | — |
| `tea-medicine` | 茶疗 | `healing` | — (all) | `puer` |

---

## 6. Data Relationships

### 6.1 Entity Relationship Diagram

```
TeaRegion (enum)
    │
    │ groups
    ▼
Province ──────────────< Tea
    │                      │
    │ hosts                │ references
    ▼                      ▼
Culture ◄────────────── Story
    │                      │
    └────────── references ─┘
```

### 6.2 Relationship Rules

| ID | Rule | Priority |
|---|---|---|
| REL-R01 | Every Tea belongs to exactly one Province | P0 |
| REL-R02 | Every Tea belongs to exactly one TeaType | P0 |
| REL-R03 | Every Tea belongs to exactly one TeaRegion (derived from province) | P0 |
| REL-R04 | A Story may link to 0–N Teas and 0–N Cultures | P0 |
| REL-R05 | A Culture may link to 0–N Teas and 0–N Stories | P0 |
| REL-R06 | Tea ↔ Story and Tea ↔ Culture are many-to-many | P0 |
| REL-R07 | All references use stable `id` strings — no circular resolution | P0 |
| REL-R08 | A `regionRef` on Story/Culture may be a region key or province slug — both resolve | P0 |

---

## 7. Content Categories

### 7.1 Tea Category Distribution (v1 Target: 27 Teas)

| TeaType | Count (Existing Seed) | Target Count | Provinces Represented |
|---|---|---|---|
| `green` | 10 | 10 | Zhejiang, Jiangsu, Anhui, Henan, Jiangxi, Sichuan, Hubei, Shandong, Tibet |
| `black` | 4 | 4 | Anhui, Yunnan, Fujian, Hainan |
| `oolong` | 5 | 5 | Fujian, Guangdong, Taiwan |
| `white` | 2 | 2 | Fujian |
| `yellow` | 2 | 2 | Hunan, Anhui |
| `dark` | 2 | 2 | Yunnan, Guangxi |
| `puer` | 1 | 1 | Yunnan |
| `scented` | 2 | 2 | Fujian, Guangxi |
| **Total** | **27** | **27** | **10+ provinces** |

### 7.2 Season Mapping

| Season Key | Months | Teas in Season (count) |
|---|---|---|
| `spring` | 3–5 | 20 (peak harvest) |
| `summer` | 6–8 | 8 |
| `autumn` | 9–11 | 5 |
| `winter` | 12–2 | 0 |

---

## 8. Data File Structure

### 8.1 File Ownership

| File | Content | Format | Status |
|---|---|---|---|
| `data/demoTeas.js` | Tea entity array (27 items) | JS (export const) | ✅ Exists |
| `data/teas.ts` | Tea entity array (typed) | TS (export const) | ⚠️ To create (migration) |
| `data/stories.ts` | Story entity array | TS | ⚠️ New |
| `data/cultures.ts` | Culture entity array | TS | ⚠️ New |
| `data/tea-types.ts` | TeaType enum + metadata | TS | ⚠️ New |
| `data/tea-regions.ts` | TeaRegion enum + province mapping | TS | ⚠️ New |
| `data/flavor-profiles.ts` | FlavorNote enum | TS | ⚠️ New |
| `data/brewing-vessels.ts` | BrewingVessel enum | TS | ⚠️ New |
| `types/tea.ts` | Tea, FlavorProfile, OriginStory, BrewingGuide, Elevation types | TS (type defs) | ⚠️ New |
| `types/story.ts` | Story, StoryType types | TS | ⚠️ New |
| `types/culture.ts` | Culture, CultureTheme types | TS | ⚠️ New |
| `types/content.ts` | Shared types: TeaRegion, Season, FlavorNote, BrewingVessel | TS | ⚠️ New |

### 8.2 Migration Path

```
Existing:  data/demoTeas.js (JS, untyped)
              │
              ▼
Step 1:    types/tea.ts (define TS types)
              │
              ▼
Step 2:    data/teas.ts (same data, typed, camelCase fields)
              │
              ▼
Step 3:    Add new fields (flavorProfile, originStory, brewingGuide, etc.)
              │
              ▼
Step 4:    Remove data/demoTeas.js, update all imports
```

---

## 9. Content Authoring Rules

| ID | Rule | Priority |
|---|---|---|
| AUTH-R01 | All tea `id` values are lowercase ASCII slugs, hyphen-separated — never change after v1 launch | P0 |
| AUTH-R02 | Chinese text (`name`, `meaning`, `content`) may contain Chinese characters, spaces, and punctuation — no special encoding | P0 |
| AUTH-R03 | English text (`nameEn`, `meaningEn`, `contentEn`) is required for all tea/story/culture entities | P0 |
| AUTH-R04 | `flavorProfile.primaryNotes` must contain 1–3 values from the FlavorNote enum | P0 |
| AUTH-R05 | `brewingGuide.waterTemp` must be between 60–100°C | P0 |
| AUTH-R06 | `brewingGuide.steepTime` must be between 5–300 seconds | P0 |
| AUTH-R07 | `relatedTeas` references must exist in the tea data file — no dead links | P0 |
| AUTH-R08 | `elevation.min` must be ≤ `elevation.max` | P0 |
| AUTH-R09 | Province names must match the SVG map province `data-province` attribute values | P0 |
| AUTH-R10 | All content must be culturally accurate — see `14-content-guideline.md` for review process | P0 |

---

## 10. Risks

| ID | Risk | Impact | Likelihood | Mitigation |
|---|---|---|---|---|
| RISK-DATA-01 | Existing `demoTeas.js` field names (snake_case) conflict with new camelCase schema | Medium | High | Migration Step 2 normalizes field names; old file removed in Step 4 |
| RISK-DATA-02 | Flavor profile data is subjective — different sources disagree on same tea | Low | Medium | Use broad categories; note "typical profile" not "definitive" in UI |
| RISK-DATA-03 | Origin stories have multiple versions — which one is authoritative? | Low | Medium | Pick the most widely recognized version; cite sources in `originStory.source` |
| RISK-DATA-04 | Brewing parameters vary by personal preference — data may be contested | Low | High | Show a range where applicable (`waterTempRange`, `vesselAlt`) |
| RISK-DATA-05 | 27 teas × 15+ fields each = 400+ data points to author and validate | Medium | Medium | Author in batches of 5 teas per task; validate against 2+ sources per tea |
| RISK-DATA-06 | Story and Culture content has no existing seed data — must be authored from scratch | Medium | High | Start with 10 stories + 10 cultures; expand in v2 |

---

## 11. Constraints

| ID | Constraint |
|---|---|
| DATA-C01 | Tea `id` values are immutable after v1 launch |
| DATA-C02 | Maximum teas in v1: 30 (current seed: 27) |
| DATA-C03 | Maximum stories in v1: 10 |
| DATA-C04 | Maximum cultures in v1: 10 |
| DATA-C05 | All data files export pure data objects — no functions, no side effects |
| DATA-C06 | All data files are TypeScript by end of migration |
| DATA-C07 | No data field may contain HTML or Markdown — plain text only |
| DATA-C08 | All geographic data (`latitude`, `longitude`, `geoCenter`) must use decimal degrees |
| DATA-C09 | All `ref` fields (`teaRefs`, `storyRefs`, `cultureRefs`, `relatedTeas`) must reference existing entity IDs |
| DATA-C10 | No entity may reference itself (no self-referencing `relatedTeas` or circular `storyRefs`/`cultureRefs`) |

---

## 12. Acceptance Criteria

- [ ] Tea schema defined: 25 fields, with status (Exists/New) marked per field
- [ ] Field migration map documents how each seed field maps to the new schema
- [ ] TeaType enum: 8 values, each with Chinese label + Badge variant reference
- [ ] FlavorProfile structure: 5 fields with 12-value FlavorNote enum
- [ ] OriginStory structure: 6 fields
- [ ] BrewingGuide structure: 10 fields with 6-value BrewingVessel enum
- [ ] Elevation structure: 3 fields
- [ ] TeaRegion enum: 4 regions with province mappings
- [ ] Story schema: 15 fields with 5-value StoryType enum
- [ ] Culture schema: 15 fields with 7-value CultureTheme enum
- [ ] Story inventory: 10 stories with titles, types, regions, linked teas
- [ ] Culture inventory: 10 cultures with titles, themes, regions, linked teas
- [ ] Data file structure: 12 files mapped with format and status
- [ ] Migration path: 4 steps documented
- [ ] Content authoring rules: 10 rules covering IDs, text, validation
- [ ] All DATA-C* constraints are verifiable
- [ ] Existing `demoTeas.js` seed data is compatible with the new schema (no breaking changes to existing field semantics)
- [ ] No UI, animation, or frontend implementation details in this document

---

## 13. Open Questions

| ID | Question | Impact | Resolution Needed By |
|---|---|---|---|
| DATA-Q01 | Should the existing `maturity_months` field remain as-is or be renamed to `maturityMonths` (camelCase)? | Breakage of all existing component references if renamed | Before Task: Data Migration |
| DATA-Q02 | Should `category` store the Chinese label (`"绿茶"`) or the enum key (`"green"`)? | Filter logic, badge rendering, bilingual display | Before Task: Type System |
| DATA-Q03 | Should `seasons` remain a space-separated string (`"spring summer"`) or switch to an array (`["spring", "summer"]`)? | SeasonContext integration, SeasonSlider component | Before Task: Data Migration |
| DATA-Q04 | Should story/culture content (`content`, `contentEn`) be inline in the data file or in separate markdown files loaded at build time? | Bundle size, content editing workflow | Before Task: Story/Culture Data |
| DATA-Q05 | Should tea `heroImage` and `thumbnailImage` be asset paths or imported image references? | Build tooling, dynamic image loading | Before Task: Asset Pipeline |
| DATA-Q06 | Should the flavor wheel show primary + secondary notes, or just primary? | UI complexity vs information richness | Before Task: FlavorWheel Component |

---

## 14. Dependencies

| Dependency | Document | Status |
|---|---|---|
| TeaType enum used in UI badges | `04-ui-design-system.md` (Section 11.2.3) | ✅ Defined |
| FlavorNote used in FlavorWheel component | `04-ui-design-system.md` (Section 11.1) | ✅ Referenced |
| Story/Culture node types map to Map System | `06-map-system.md` (Section 3.2) | ✅ Defined |
| Formal TypeScript type definitions | `16-data-schema.md` | ⚠️ Pending |
| Content writing tone and accuracy rules | `14-content-guideline.md` | ⚠️ Pending |
| Province data linked by `provinceSlug` | `data/provinces.ts` (to create) | ⚠️ Pending |

---

## 15. References

| Document | Relationship |
|---|---|
| `01-product-requirements.md` | FR-E-01–FR-E-10 define encyclopedia functional requirements |
| `02-information-architecture.md` | Section 6 defines data relationships; Section 8 defines content types |
| `04-ui-design-system.md` | Badge variants, FlavorWheel component, Card component tokens |
| `06-map-system.md` | Node schema requires `entryBehavior`/`exitBehavior`/`uiComponent` fields |
| `14-content-guideline.md` | Content authoring tone, cultural accuracy, review process |
| `16-data-schema.md` | Formal TypeScript type definitions derived from schemas here |

---

## 16. Implementation Checklist

- [ ] DATA-001: `types/tea.ts` — Tea, FlavorProfile, OriginStory, BrewingGuide, Elevation type definitions
- [ ] DATA-002: `types/story.ts` — Story, StoryType type definitions
- [ ] DATA-003: `types/culture.ts` — Culture, CultureTheme type definitions
- [ ] DATA-004: `types/content.ts` — TeaRegion, Season, FlavorNote, BrewingVessel shared types
- [ ] DATA-005: `data/tea-types.ts` — TeaType enum + Chinese labels + badge mappings
- [ ] DATA-006: `data/tea-regions.ts` — TeaRegion enum + province lists
- [ ] DATA-007: `data/flavor-profiles.ts` — FlavorNote enum + labels (EN/ZH)
- [ ] DATA-008: `data/brewing-vessels.ts` — BrewingVessel enum + labels
- [ ] DATA-009: `data/teas.ts` — 27 teas migrated from `demoTeas.js` with camelCase + new fields
- [ ] DATA-010: `data/stories.ts` — 10 stories authored with all required fields
- [ ] DATA-011: `data/cultures.ts` — 10 cultures authored with all required fields
- [ ] DATA-012: `data/demoTeas.js` removed after all imports updated
- [ ] DATA-013: All `ref` fields validated (no dead links, no self-references)
- [ ] DATA-014: All geographic coordinates validated against SVG map
- [ ] DATA-015: Brewing parameters validated (60–100°C, 5–300s)

---

## 17. Next Document

> **`08-component-specification.md`** — Every UI component: props interface, required/optional props, all visual states, behavior specification, accessibility attributes, ANIM-ID bindings, and variant enforcement.

---

> This document is the content constitution of Tea Atlas. It defines what data exists, how it is structured, and how entities relate. The schemas here are compatible with the existing `demoTeas.js` seed file — all existing fields are preserved; new fields are additive only. No existing data is invalidated.
