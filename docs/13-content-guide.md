# 13 — Content Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Official Content Specification — Writing Standards, Authoring Rules, and Quality Control**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | CNT-013 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `07-tea-content-system.md`, `04-ui-design-system.md`, `12-assets-guide.md`, `14-deployment-guide.md` |

---

## 2. Purpose

This document defines **how content is written, reviewed, and maintained** for Tea Atlas. It is the operational manual for content authors, translators, and reviewers.

| In Scope | Out of Scope |
|---|---|
| Writing style, voice, and tone | Data schemas and field types (→ `07-tea-content-system.md`) |
| Cultural accuracy standards | Visual design rules (→ `04-ui-design-system.md`) |
| Localization rules (EN ↔ ZH) | Asset specifications (→ `12-assets-guide.md`) |
| Naming conventions for content files | Animation behavior (→ `05-animation-system.md`) |
| Media embedding rules | Component behavior (→ `08-component-specification.md`) |
| Content validation checklist | Frontend architecture (→ `09-frontend-architecture.md`) |
| Authoring workflow and review process | Build and deployment (→ `14-deployment-guide.md`) |
| Markdown / JSON structure conventions | — |

---

## 3. Content Architecture

### 3.1 Content Ownership

```
Content Layer (this document)
    │
    │  Defines: voice, tone, cultural rules, validation
    │  Consumes: schemas from 07-tea-content-system.md
    │  References: assets from 12-assets-guide.md
    │
    ▼
Data Layer (07-tea-content-system.md)
    │
    │  Defines: schemas, enums, field types, relationships
    │  Validated by: content validation checklist (§12)
    │
    ▼
Presentation Layer (04-ui-design-system.md + components)
    │
    │  Renders: content through components
    │  Driven by: data files
```

### 3.2 Content Lifecycle

```
1. RESEARCH
   ├── Source from 2+ authoritative references
   ├── Verify Chinese names, regions, historical claims
   └── Document sources in content metadata

2. DRAFT
   ├── Write in English (source language)
   ├── Follow writing style (§9)
   ├── Follow cultural standards (§6)
   └── Populate all required fields per schema

3. REVIEW
   ├── Cultural accuracy check (§6)
   ├── Terminology consistency check (§5.3)
   ├── Schema compliance check (§12)
   └── Peer review by at least one other author

4. TRANSLATE
   ├── English → Chinese (if English is source)
   ├── Apply localization rules (§8)
   └── Review by native Chinese speaker

5. VALIDATE
   ├── Run content validation checklist (§12)
   ├── Fix all errors
   └── Mark as "ready"

6. PUBLISH
   ├── Merge into data file
   ├── Verify build passes
   └── Verify rendering in all affected components
```

### 3.3 Content Source Hierarchy

| Tier | Source Type | Examples | Authority |
|---|---|---|---|
| **Tier 1** | Academic / Government | Chinese Tea Academy publications, provincial agriculture bureau records, GB/T standards | Highest — use directly |
| **Tier 2** | Recognized Industry | "The Story of Tea" (Heiss), "Tea: History, Terroirs, Varieties" (Gascoyne), China Tea Marketing Association | High — cross-reference with Tier 1 |
| **Tier 3** | Cultural / Literary | Classical Chinese poetry, tea classics (陆羽《茶经》), historical records | Medium — use for stories and cultural content; note as "traditional account" |
| **Tier 4** | Commercial / Tourism | Tea brand websites, tourism boards, blog posts | Low — use for supplementary details only; must verify |
| **Tier 5** | AI-Generated | LLM outputs | Prohibited as sole source — may be used for initial draft, must be fully verified |

---

## 4. Content Types

### 4.1 Content Type Inventory

| Type | Purpose | Primary Audience | Format | Typical Length | Example |
|---|---|---|---|---|---|
| **Tea Profile** | Describe a tea variety completely | Curious learners, tea enthusiasts | Structured data + prose | 200–400 words EN | Longjing profile |
| **Province Profile** | Introduce a tea-producing province | Map explorers | Structured data + prose | 150–300 words EN | Zhejiang profile |
| **Origin Story** | Tell the legend or history behind a tea | Story-lovers, cultural explorers | Narrative prose | 200–500 words EN | Emperor Qianlong and Longjing |
| **Cultural Topic** | Explain a tea culture concept | Cultural enthusiasts | Expository prose | 200–400 words EN | Gongfu ceremony, Tea Zen |
| **Scene Narrative** | Scroll-driven story content | All users (homepage) | Poetic, concise prose | 80–150 words EN per scene | Harvest scene text |
| **Brewing Guide** | Instruct how to brew a tea | Practical tea drinkers | Instructional steps | 50–100 words EN + structured params | Brewing Longjing |
| **Flavor Description** | Describe taste and aroma | Sensory explorers | Structured + sensory prose | 30–60 words EN | "Floral with chestnut notes" |
| **UI Microcopy** | Labels, buttons, tooltips | All users | Fragments | 1–8 words each | "Add to Collection", "Spring Harvest" |
| **Map Labels** | Province names, tea point labels | Map users | Short strings | 2–25 characters ZH | "浙江", "西湖龙井" |
| **Metadata** | SEO titles, descriptions, alt text | Search engines, screen readers | Structured strings | 50–160 characters | Meta description for tea detail |

### 4.2 Content Type → Data File Mapping

| Content Type | Data File | Schema Document |
|---|---|---|
| Tea Profile | `data/teas.ts` | `07-tea-content-system.md` §3 |
| Province Profile | `data/provinces.ts` | `07-tea-content-system.md` (referenced) |
| Origin Story | `data/stories.ts` | `07-tea-content-system.md` §4 |
| Cultural Topic | `data/cultures.ts` | `07-tea-content-system.md` §5 |
| Scene Narrative | `data/scenes.ts` | (to define) |
| Brewing Guide | (inline in `data/teas.ts`) | `07-tea-content-system.md` §3.7 |
| Flavor Description | (inline in `data/teas.ts`) | `07-tea-content-system.md` §3.4 |
| UI Microcopy | `data/ui-strings.ts` | (to define) |
| Map Labels | (inline in `data/teas.ts` + map data) | `06-map-system.md` |
| Metadata | (inline in entity data files) | This document §4.4 |

### 4.3 Content Priority Matrix

| Priority | Content Types | Rationale |
|---|---|---|
| **P0** | Tea Profiles (27), Brewing Guides (27), Flavor Descriptions (27), Map Labels | Core experience — no tea data = no encyclopedia |
| **P1** | Province Profiles (3), Origin Stories (10), Cultural Topics (10) | Major content sections; can launch with reduced set |
| **P2** | Scene Narratives (6), UI Microcopy, Metadata, Province Profiles (remaining 11) | Polish and SEO; can iterate post-launch |

### 4.4 Metadata Standards

Every content entity page must provide:

| Meta Field | Max Length | Format | Example |
|---|---|---|---|
| `<title>` | 60 chars | `{Entity Name} — Tea Atlas` | `West Lake Longjing — Tea Atlas` |
| `<meta description>` | 160 chars | 1–2 sentence summary with key terms | `Explore West Lake Longjing (西湖龙井), China's most famous green tea from Zhejiang province. Discover its history, flavor profile, and brewing guide.` |
| `og:image` | — | Asset path | `/assets/images/tea/img-tea-green-sd-400x500.webp` |
| `alt` text (hero image) | 125 chars | Descriptive, includes key visual elements | `Watercolor illustration of Longjing green tea leaves with West Lake landscape in background` |

---

## 5. Tea Data Standards

### 5.1 Required Fields by Priority

| Priority | Fields Required | Count |
|---|---|---|
| **P0** (MVP — every tea) | `id`, `name`, `nameEn`, `province`, `city`, `latitude`, `longitude`, `category`, `categoryEn`, `meaning`, `meaningEn`, `flavorProfile`, `originStory`, `brewingGuide`, `heroImage`, `thumbnailImage` | 16 fields |
| **P1** (Full — every tea) | `provinceSlug`, `region`, `elevation`, `relatedTeas`, `storyRefs`, `cultureRefs`, `brewingGuide.vesselAlt`, `brewingGuide.steps`, `brewingGuide.tips`, `flavorProfile.secondaryNotes` | 10 fields |
| **P2** (Polish) | `seasons` refinement, `maturityMonths` refinement, `brewingGuide.steepTimeSubsequent` | 3 fields |

### 5.2 Field Quality Standards

| Field | Quality Standard | Bad Example | Good Example |
|---|---|---|---|
| `nameEn` | Standard English tea name, properly capitalized | `west lake longjing` | `West Lake Longjing` |
| `meaning` | Poetic, culturally evocative, 8–15 Chinese characters | `好喝的绿茶` (good green tea) | `乾隆御赐十八棵，湖山灵气一叶收` |
| `meaningEn` | Poetic, not literal translation, 40–80 chars | `Good green tea` | `Eighteen imperial trees blessed by an emperor, a single leaf captures the spirit of West Lake` |
| `flavorProfile.primaryNotes` | 1–3 values from FlavorNote enum only | `["tasty", "good"]` | `["nutty", "vegetal", "sweet"]` |
| `originStory.content` | 2–4 paragraphs, narrative style, culturally accurate | `This tea is old and famous.` | Full narrative with historical context |
| `brewingGuide.steps` | 3–5 short, imperative, user-facing instructions | `put leaves in water` | `1. Warm the gaiwan with hot water.\n2. Add 3g of tea leaves.\n...` |

### 5.3 Terminology Consistency

All content must use the official terminology from `02-information-architecture.md` §2.

| Approved Term | Do NOT Use |
|---|---|
| Hero | Intro, Splash, Landing, Banner |
| Scene | Chapter, Section, Part, Slide |
| Tea Region | Zone, Area, Territory |
| Province | State, Region, District |
| Tea Point / Tea Variety | Tea Item, Tea Entry, Tea Product |
| Detail Panel | Info Card, Popup, Modal |
| Encyclopedia | Catalog, Library, Collection, Gallery |
| Ink Wash | Ink Painting, Sumi-e (use only in art context) |
| Rice Paper | Parchment, Texture Paper |

### 5.4 Tea Name Standards

| Rule ID | Rule | Example |
|---|---|---|
| TEA-R01 | English tea names use standard pinyin with correct capitalization | `Longjing` not `longjing` or `Long Jing` |
| TEA-R02 | Place-name teas include the place in English | `West Lake Longjing` not just `Longjing` |
| TEA-R03 | Non-place teas use the descriptive English name | `Silver Needle` not `Bai Hao Yin Zhen` (use as secondary) |
| TEA-R04 | Chinese name field (`name`) uses standard Chinese characters | `西湖龙井` not variant characters |
| TEA-R05 | If a tea has multiple common English names, pick one as primary, list others in metadata | Primary: `Tieguanyin`, Alt: `Iron Goddess of Mercy` |

---

## 6. Cultural Content Standards

### 6.1 Core Principles

| ID | Principle | Description |
|---|---|---|
| CLT-R01 | **Accuracy over Romance** | Historical claims must be verifiable. Do not invent or embellish historical facts for narrative effect. |
| CLT-R02 | **Respect Over Exoticism** | Present Chinese tea culture as a living tradition, not as mysterious "ancient wisdom." Avoid orientalist framing. |
| CLT-R03 | **Specificity Over Generality** | Name specific places, people, dynasties, and events. "Tang Dynasty poet Lu Tong (卢仝, 790–835)" not "ancient Chinese poets." |
| CLT-R04 | **Context Over Assumption** | Assume the reader knows nothing about Chinese tea culture. Explain terms on first use. |
| CLT-R05 | **Diversity Over Monolith** | China has 14 tea-producing provinces, 56 ethnic groups, and 2000+ years of tea history. Do not present tea culture as uniform. |
| CLT-R06 | **Modern Over Museum** | Show that tea culture is alive today. Include contemporary practices alongside historical ones. |

### 6.2 Forbidden Content

| ID | Prohibition | Rationale |
|---|---|---|
| CLT-F01 | No claims that any tea "cures" or "treats" medical conditions | Regulatory risk; health claims require substantiation |
| CLT-F02 | No ranking teas as "best" or "superior" | Cultural sensitivity; all teas have their own tradition |
| CLT-F03 | No religious claims about tea (Buddhist/Daoist except when historically documented) | Avoid co-opting religious traditions |
| CLT-F04 | No political statements (Tibet/Taiwan sovereignty references) | Tea Atlas is cultural, not political |
| CLT-F05 | No negative comparisons between Chinese and non-Chinese tea cultures | Inclusivity; appreciation, not competition |
| CLT-F06 | No fabricated origin stories — if a tea's origin is unknown, say so | Integrity; "The origins of this tea are lost to history" is acceptable |
| CLT-F07 | No simplified or inaccurate Chinese characters | Use correct characters; verify against authoritative sources |

### 6.3 Culturally Sensitive Terms

| Term | Guideline |
|---|---|
| **Tibet / Xizang** | Use "Tibet" in English (recognized internationally); use "西藏" in Chinese |
| **Taiwan** | Use "Taiwan" in English; use "台湾" in Chinese; refer to as "region" not "province" or "country" |
| **Ethnic minorities** | Name specific groups (e.g., "Dai people" / "傣族"); never "minority tribes" |
| **Pu'er (普洱)** | Always include the apostrophe; city name is "Pu'er" not "Puer" |
| **Daoism / Taoism** | Either spelling is acceptable; be consistent within a document. Prefer "Daoism" (pinyin). |

### 6.4 Historical Era Reference Format

| Era | Date Range | Usage Format |
|---|---|---|
| Shang Dynasty | ~1600–1046 BCE | `Shang Dynasty (c. 1600–1046 BCE)` |
| Zhou Dynasty | ~1046–256 BCE | `Zhou Dynasty (c. 1046–256 BCE)` |
| Tang Dynasty | 618–907 CE | `Tang Dynasty (618–907)` |
| Song Dynasty | 960–1279 CE | `Song Dynasty (960–1279)` |
| Ming Dynasty | 1368–1644 CE | `Ming Dynasty (1368–1644)` |
| Qing Dynasty | 1644–1912 CE | `Qing Dynasty (1644–1912)` |
| Republican Era | 1912–1949 | `Republican Era (1912–1949)` |
| Contemporary | 1949–present | `Contemporary (1949–present)` |

> Format: `{Dynasty Name} Dynasty ({years})`. Always include years on first reference in a content item. On subsequent references, "the Tang" or "Tang-era" is acceptable.

---

## 7. Markdown & JSON Structure

### 7.1 Content File Formats

Tea Atlas content is authored in **TypeScript data files**, not Markdown. Prose content is stored as string fields within typed objects.

```
// ✅ CORRECT — TypeScript data file
export const teas: Tea[] = [
  {
    id: "longjing",
    name: "西湖龙井",
    nameEn: "West Lake Longjing",
    province: "浙江",
    originStory: {
      title: "乾隆与龙井",
      content: "Legend holds that Emperor Qianlong...",
      contentEn: "Legend holds that Emperor Qianlong...",
    },
    // ...
  },
];

// ❌ INCORRECT — Separate markdown files
// content/teas/longjing.md  ← not used
```

### 7.2 Multi-Line String Format

Prose fields use template literals in TypeScript source:

```typescript
// ✅ CORRECT — Template literal for multi-paragraph text
contentEn: `Legend holds that Emperor Qianlong visited the West Lake region during one of his southern inspections. Upon arriving at the Longjing tea gardens, he was so impressed by the tea's quality that he designated eighteen tea bushes as "imperial tea trees."

These eighteen bushes, still standing today near the Dragon Well (Longjing) spring, produce a minuscule harvest each year — reserved historically for the imperial court and now auctioned at extraordinary prices.

The emperor's patronage cemented Longjing's reputation as China's most celebrated green tea, a status it retains to this day.`,

// ❌ INCORRECT — Hard line breaks (will render as-is)
contentEn: "Legend holds that Emperor Qianlong visited the West Lake region.\n\nUpon arriving...",
```

### 7.3 Character Encoding Rules

| ID | Rule |
|---|---|
| ENC-R01 | All source files are UTF-8 encoded |
| ENC-R02 | Chinese characters stored directly (不编码), not as Unicode escapes (不编码) |
| ENC-R03 | Use curly quotes `"` `"` `'` `'` in prose; straight quotes `"` `'` only in code |
| ENC-R04 | Em dashes (—) not double hyphens (--) in prose |
| ENC-R05 | Ellipsis character (…) not three dots (...) |
| ENC-R06 | No HTML tags in content strings — plain text only |
| ENC-R07 | No Markdown in content strings — content renders through components, not a Markdown parser |

### 7.4 Whitespace & Formatting

| ID | Rule |
|---|---|
| WHT-R01 | Paragraphs separated by a single blank line in template literals |
| WHT-R02 | No trailing whitespace on any line |
| WHT-R03 | Indent content within template literals consistently (2 spaces from template literal margin) |
| WHT-R04 | One sentence per line in source (simplifies diff review) — not enforced, but preferred |
| WHT-R05 | Trim leading/trailing whitespace from all single-line string fields |

---

## 8. Localization Rules

### 8.1 Language Strategy

| Language | Role | Status |
|---|---|---|
| **English (EN)** | Source language — all content authored in English first | P0 |
| **Chinese (ZH)** | Target language — translated from English | P0 |

> Rationale: English source ensures global accessibility. The museum's primary audience is international users discovering Chinese tea culture. Chinese translation serves native speakers and cultural authenticity.

### 8.2 What Gets Translated

| Content Field | EN Field | ZH Field | Translation Rule |
|---|---|---|---|
| Tea name | `nameEn` | `name` | ZH is the canonical name; EN is a translation or transliteration |
| Tea meaning | `meaningEn` | `meaning` | ZH is poetic/literary; EN is evocative but not literal |
| Origin story | `contentEn` | `content` | Independent prose in each language — not word-for-word translation |
| Cultural topic | `descriptionEn` | `description` | Independent prose |
| Brewing steps | — | — | EN only for v1; short imperative form works in both languages |
| UI labels | EN key | ZH value | Direct translation; stored in `data/ui-strings.ts` |
| Flavor notes | `FlavorNote` enum label | ZH label (from enum) | Enum provides both; content references key |
| Province names | `provinceEn` | `province` | ZH is canonical; EN is standard English name |
| Map labels | — | ZH only | Map uses Chinese characters for geographic labels |
| Metadata | EN fields | ZH fields | Separate `<title>` and `<meta>` per locale |

### 8.3 Translation Quality Standards

| ID | Rule |
|---|---|
| LOC-R01 | Chinese translation must be reviewed by a native Chinese speaker |
| LOC-R02 | Chinese prose should read like original writing, not translated text |
| LOC-R03 | Cultural terms use standard Chinese characters — no simplified/variant confusion |
| LOC-R04 | Tea names in English use standard pinyin — check against GB/T standards |
| LOC-R05 | English prose uses Oxford English spelling (-ise, -our, etc.) for consistency |
| LOC-R06 | Measurements: use metric (°C, grams, ml) in both languages |
| LOC-R07 | Dates: use "Month YYYY" format in English (e.g., "March 2026"); "YYYY年M月" in Chinese |

### 8.4 Non-Translatable Content

| Content | Reason |
|---|---|
| Tea type names as proper nouns | "Longjing" stays "Longjing" in both languages |
| Historical era names | "Tang Dynasty" / "唐代" — use appropriate form per language |
| Place names | "Zhejiang" in EN, "浙江" in ZH |
| Brewing vessel names | "Gaiwan" / "盖碗" — use appropriate form per language |
| Cultural concept names | "Gongfu Cha" / "功夫茶" — use appropriate form; italicize on first EN use |

---

## 9. Typography & Writing Style

### 9.1 Voice & Tone

| Dimension | Description |
|---|---|
| **Voice** | Warm, knowledgeable, poetic without being flowery. Like a museum curator who loves their subject. |
| **Tone** | Respectful and unhurried. Never marketing-speak. Never academic-dense. Accessible to an intelligent general audience. |
| **Persona** | A scholar-gardener: knows the history and the soil, can tell you which emperor drank which tea, but also how the morning mist feels on a tea terrace. |
| **Distance** | Second person ("you") for brewing guides and instructions. Third person for descriptions and stories. Never first person ("we"). |

### 9.2 Writing Rules

| ID | Rule | Example |
|---|---|---|
| WRT-R01 | Open with a sensory detail, not a dictionary definition | ✅ `The first sip of Longjing tastes like spring water filtered through chestnut leaves.`<br>❌ `Longjing is a famous Chinese green tea from Zhejiang province.` |
| WRT-R02 | Use active voice | ✅ `Emperor Qianlong designated eighteen tea bushes as imperial trees.`<br>❌ `Eighteen tea bushes were designated as imperial trees by Emperor Qianlong.` |
| WRT-R03 | Keep paragraphs short: 2–4 sentences, max 80 words | Visual breathing room; scannable on screen |
| WRT-R04 | Define Chinese terms on first use | `The tea is grown using the zhengshan (traditional mountain) method.` |
| WRT-R05 | Avoid superlatives: "best," "most famous," "number one" | ✅ `Longjing is among China's most celebrated green teas.`<br>❌ `Longjing is the best green tea in China.` |
| WRT-R06 | Avoid cliché: "ancient wisdom," "mysterious East," "thousands of years of history" | Be specific about what, where, when |
| WRT-R07 | Use concrete quantities over vague intensifiers | ✅ `Harvested for over 1,200 years`<br>❌ `Harvested since ancient times` |
| WRT-R08 | Italicize non-English words on first use only | `The tea is grown using the zhengshan method. Zhengshan production requires...` |
| WRT-R09 | Temperature in Celsius with Fahrenheit in parentheses on first use | `Brew at 80°C (176°F)` — subsequent references: `80°C` only |
| WRT-R10 | No exclamation marks in body text | Museum tone; excitement comes from content, not punctuation |

### 9.3 Content Templates

#### Tea Profile (200–400 words EN)

```
[OPENING LINE — sensory or contextual hook, 1 sentence]

[ORIGIN PARAGRAPH — where it's grown, geographic context, elevation, 2–3 sentences]

[CHARACTER PARAGRAPH — what makes it distinctive: leaf shape, processing, flavor, 2–3 sentences]

[CULTURAL PARAGRAPH — historical significance, legends, cultural role, 2–3 sentences]

[CLOSING LINE — why it matters, what to appreciate, 1 sentence]
```

#### Origin Story (200–500 words EN)

```
[HOOK — the most compelling moment or image from the story, 1–2 sentences]

[NARRATIVE BODY — chronological or thematic flow, 3–4 paragraphs]

[RESOLUTION — how this story connects to the tea today, 1–2 sentences]
```

#### Brewing Guide Steps (3–5 steps)

```
Step format: Numbered. Imperative mood. One action per step. Include quantities.
  1. Warm the gaiwan by filling it with hot water, then discard.
  2. Add 3g of tea leaves to the warmed gaiwan.
  3. Pour 150ml of water at 80°C over the leaves.
  4. Steep for 60 seconds for the first infusion.
  5. Pour and serve. Re-steep up to 4 times, increasing time by 15s each infusion.
```

---

## 10. Naming Conventions

### 10.1 Content File Naming

| File Type | Pattern | Example |
|---|---|---|
| Tea data | `teas.ts` | `data/teas.ts` |
| Story data | `stories.ts` | `data/stories.ts` |
| Culture data | `cultures.ts` | `data/cultures.ts` |
| Province data | `provinces.ts` | `data/provinces.ts` |
| Scene data | `scenes.ts` | `data/scenes.ts` |
| UI strings | `ui-strings.ts` | `data/ui-strings.ts` |
| Type definitions | `{entity}.ts` | `types/tea.ts` |
| Enum definitions | `{entity}-{aspect}.ts` | `data/tea-types.ts` |

### 10.2 Entity ID (Slug) Conventions

| ID | Rule | Example |
|---|---|---|
| SLG-R01 | Lowercase ASCII, hyphen-separated | `longjing`, `tieguanyin`, `silver-needle` |
| SLG-R02 | Use standard pinyin for Chinese tea names | `dahongpao` not `big-red-robe` |
| SLG-R03 | Use English for non-tea concepts | `tea-ceremony` not `chadao` |
| SLG-R04 | No numbers, no special characters except hyphens | `tea-horse-road` not `tea-horse-road-2` |
| SLG-R05 | IDs are immutable after v1 launch | Never change `longjing` to `west-lake-longjing` |
| SLG-R06 | Province slugs use standard English names | `zhejiang`, `fujian`, `yunnan` |
| SLG-R07 | Tea region slugs use pinyin | `jiangnan`, `jiangbei`, `southchina`, `southwest` |

### 10.3 Field Naming Conventions

| Convention | Applies To | Example |
|---|---|---|
| `camelCase` | All TypeScript fields | `nameEn`, `flavorProfile`, `waterTemp` |
| `UPPER_SNAKE_CASE` | Enum keys | `TeaType.GREEN`, `CultureTheme.CEREMONY` |
| `lowercase` | Enum values (when stored as strings) | `"green"`, `"floral"` |
| `kebab-case` | File names, URL slugs | `tea-content-system.md`, `/tea/longjing` |

---

## 11. Media Embedding Rules

### 11.1 Image References in Content

Content files reference images by **asset ID** (from `12-assets-guide.md`), not by file path directly.

```typescript
// ✅ CORRECT — Reference by asset ID
heroImage: "AST-030",        // Green tea illustration
thumbnailImage: "AST-030",   // Same asset, thumbnail variant

// ❌ INCORRECT — Hardcoded file paths
heroImage: "/assets/images/tea/img-tea-green-sd-400x500.webp",
```

> The asset resolution layer maps `AST-030` → the correct file path, variant (sd/2x/thumb), and format. This allows asset file paths to change without touching content files.

### 11.2 Image Usage Rules

| ID | Rule |
|---|---|
| MED-R01 | Every image must have `alt` text — descriptive, 40–125 characters |
| MED-R02 | Hero images use `AST-0XX` asset IDs, resolved to 2× variant on retina displays |
| MED-R03 | Thumbnail images use the same asset ID, resolved to `-thumb` variant |
| MED-R04 | Decorative images (scene backgrounds, textures) use empty `alt=""` — they are not content |
| MED-R05 | Tea type badges are rendered by the component from the `categoryEn` field — no image reference needed |
| MED-R06 | Map point icons are rendered by the map system — no per-tea image reference needed |
| MED-R07 | No inline images in prose fields (`content`, `contentEn`, `description`) — prose is plain text |
| MED-R08 | Story/Culture `imageRef` fields use asset IDs, same resolution as hero images |

### 11.3 Icon References

Icons are referenced by icon name (from `04-ui-design-system.md` §14.2), rendered as inline SVGs by the icon component.

```
Content files do NOT reference icons.
Icons are selected by the component based on context (tea type, action, state).
```

### 11.4 External Media Policy

| ID | Rule |
|---|---|
| MED-E01 | No hotlinked images — all assets are local |
| MED-E02 | No embedded iframes (YouTube, maps, social media) |
| MED-E03 | No external font CDNs — fonts are self-hosted (see `12-assets-guide.md` §16) |
| MED-E04 | No external scripts loaded by content |
| MED-E05 | Attribution for sourced images stored in asset metadata, not displayed in UI |

---

## 12. Content Validation Checklist

### 12.1 Pre-Submission Self-Check

Every content item must pass this checklist before submission for review.

#### Schema Compliance
- [ ] All P0 fields populated per `07-tea-content-system.md`
- [ ] All P1 fields populated or explicitly marked as deferred
- [ ] No field contains HTML or Markdown
- [ ] All enum fields use valid enum values only
- [ ] All `ref` fields (`teaRefs`, `storyRefs`, `relatedTeas`) reference existing entity IDs
- [ ] No self-referencing fields

#### Writing Quality
- [ ] English prose: 2–5 paragraphs, follows template from §9.3
- [ ] Chinese prose: reads naturally (native speaker reviewed)
- [ ] No superlatives, no clichés, no orientalist framing
- [ ] Active voice throughout
- [ ] Chinese terms italicized on first English use
- [ ] Paragraphs ≤ 80 words each

#### Cultural Accuracy
- [ ] Historical claims verifiable (source cited)
- [ ] Dynasty names + year ranges correct
- [ ] Place names use correct pinyin/English forms
- [ ] Tea name characters verified against authoritative source
- [ ] No health claims, no religious claims, no political content
- [ ] Culturally sensitive terms handled per §6.3

#### Technical Correctness
- [ ] `latitude` and `longitude` are valid decimal degrees (not swapped)
- [ ] `brewingGuide.waterTemp` between 60–100°C
- [ ] `brewingGuide.steepTime` between 5–300 seconds
- [ ] `elevation.min` ≤ `elevation.max` (if both populated)
- [ ] `seasons` values match valid season keys
- [ ] Entity ID follows slug conventions (§10.2)

#### Media
- [ ] Hero image asset ID is valid (exists in `12-assets-guide.md` inventory)
- [ ] Thumbnail image asset ID is valid
- [ ] `alt` text provided for all content images
- [ ] No broken asset references

### 12.2 Peer Review Checklist

- [ ] Content is factually accurate (reviewer spot-checks 2+ claims)
- [ ] Content is culturally appropriate (reviewer checks §6 compliance)
- [ ] No duplication with existing content (search existing IDs and names)
- [ ] Writing voice matches §9.1 tone description
- [ ] Translation quality acceptable (native speaker review for Chinese)

### 12.3 Automated Validation

The following should be automated in CI:

| Check | Tool / Method |
|---|---|
| All required fields present | TypeScript compiler (`tsc --noEmit`) |
| Enum values valid | TypeScript enum types |
| Ref fields resolve to existing IDs | Unit test: iterate all entities, check all refs |
| Coordinates within China bounding box | Unit test: lat 18–54, lon 73–135 |
| Water temp in range | Unit test: 60–100 |
| Steep time in range | Unit test: 5–300 |
| No HTML/Markdown in prose fields | Regex check: `<[^>]+>`, `\[.*\]\(.*\)` |
| Slug format valid | Regex check: `^[a-z0-9]+(-[a-z0-9]+)*$` |
| Asset IDs exist in inventory | Unit test: cross-reference with `asset-manifest.json` |

---

## 13. Acceptance Criteria

- [ ] Content lifecycle defined (6 stages: Research → Draft → Review → Translate → Validate → Publish)
- [ ] Content source hierarchy defined (5 tiers with authority levels)
- [ ] 10 content types inventoried with purpose, audience, format, and length
- [ ] Content type → data file mapping complete
- [ ] P0/P1/P2 priority matrix for content fields
- [ ] Terminology consistency table (approved terms vs forbidden synonyms)
- [ ] Tea name standards (5 rules)
- [ ] Cultural content standards: 6 principles + 7 prohibitions
- [ ] Culturally sensitive terms guide (5 terms)
- [ ] Historical era reference format table (8 dynasties)
- [ ] Markdown/JSON structure rules (encoding, whitespace, formatting)
- [ ] Localization rules: strategy, what gets translated, quality standards, non-translatable items
- [ ] Writing style: voice/tone/persona, 10 writing rules, 3 content templates
- [ ] Naming conventions: file names, entity slugs (7 rules), field names
- [ ] Media embedding rules: asset ID referencing, image usage (8 rules), icon refs, external media policy
- [ ] Content validation checklist: 20+ self-check items, 5 peer review items, 9 automated checks
- [ ] All CLT-*, WRT-R*, LOC-R*, MED-R*, SLG-R*, TEA-R* rules are verifiable
- [ ] No duplication of `07-tea-content-system.md` (schema) or `12-assets-guide.md` (asset specs)

---

## 14. References

| Document | Relationship |
|---|---|
| `07-tea-content-system.md` | Data schemas, enums, field types — this document defines HOW to write those fields |
| `02-information-architecture.md` | Terminology (§2) — all content must use these approved terms |
| `04-ui-design-system.md` | Typography tokens, icon inventory — content references these but does not redefine |
| `12-assets-guide.md` | Asset IDs used in `heroImage`/`thumbnailImage`/`imageRef` fields |
| `05-animation-system.md` | Scene scroll mapping (§7.3) — scene narrative content aligns with these ranges |
| `06-map-system.md` | Map labels, province data — content references province names and coordinates |
| `14-deployment-guide.md` | Build validation — automated content checks run in CI |

---

## 15. Next Document

> **`14-deployment-guide.md`** — Build configuration, deployment pipeline, CI/CD setup, environment variables, hosting architecture, content validation automation, and launch checklist.

---

> This document is the editorial constitution of Tea Atlas. It governs every word, every translation, every cultural claim. Content that does not pass through this guide does not ship.
