# 14 — Deployment Guide

> Tea Atlas: Interactive Chinese Tea Culture Digital Museum
>
> **Official Deployment & Operations Specification**

---

## 1. Document Information

| Field | Value |
|---|---|
| **Document ID** | DEP-014 |
| **Version** | 1.0 |
| **Status** | Draft |
| **Last Updated** | 2026-07-05 |
| **Related Documents** | `09-frontend-architecture.md`, `10-development-roadmap.md`, `12-assets-guide.md`, `15-project-rules.md` |

---

## 2. Purpose

This document defines **how Tea Atlas is built, deployed, and operated** in production. It is the operational manual for DevOps, release managers, and developers pushing to production.

| In Scope | Out of Scope |
|---|---|
| Build configuration and optimization | Development environment setup (→ `09-frontend-architecture.md`) |
| Environment variable management | Component architecture (→ `09-frontend-architecture.md`) |
| Hosting platform configuration (Vercel) | UI design (→ `04-ui-design-system.md`) |
| CI/CD pipeline definition | Task execution (→ `10-development-roadmap.md`) |
| Domain, HTTPS, DNS setup | Content authoring (→ `13-content-guide.md`) |
| Performance budgets and monitoring | Data schemas (→ `07-tea-content-system.md`) |
| Error monitoring and logging | Animation behavior (→ `05-animation-system.md`) |
| Release process and rollback | — |
| Security hardening | — |
| SEO and analytics | — |

---

## 3. Deployment Architecture

### 3.1 System Topology

```
                          ┌──────────────────────┐
                          │     Vercel (Edge)     │
                          │  ┌────────────────┐   │
         HTTPS            │  │  Static Assets  │   │
       ──────────▶        │  │  (WebP/SVG/JS/  │   │
                          │  │   CSS/Fonts)    │   │
                          │  └────────────────┘   │
                          │  ┌────────────────┐   │
                          │  │  SPA (Vite)     │   │
                          │  │  React App      │   │
                          │  └────────────────┘   │
                          └──────────┬───────────┘
                                     │
                                     │ /api/*
                                     ▼
                          ┌──────────────────────┐
                          │   API Server         │
                          │   (Express / Node)   │
                          │   tea/server/        │
                          │   Port 3001          │
                          └──────────┬───────────┘
                                     │
                                     ▼
                          ┌──────────────────────┐
                          │   Database           │
                          │   (PostgreSQL /      │
                          │    MongoDB)          │
                          └──────────────────────┘
```

### 3.2 Deployment Targets

| Component | Host | Build Tool | Output | Protocol |
|---|---|---|---|---|
| **Frontend SPA** | Vercel | Vite 6.0.1 | `client/dist/` | HTTPS (auto) |
| **Static Assets** | Vercel Edge CDN | Vite (assets) + manual (textures/images) | `client/dist/assets/` | HTTPS, CDN-cached |
| **API Server** | Separate host (TBD) | Node.js | `server/` | HTTPS |
| **Database** | Managed service (TBD) | — | — | TLS |

### 3.3 Request Flow

```
1. User → https://teaatlas.com
2. Vercel Edge → serves index.html (cached 60s)
3. Browser → loads SPA (JS/CSS chunks)
4. SPA → API call: GET /api/teas
5. Vercel → proxy /api/* → API Server
6. API Server → query DB → respond JSON
7. SPA → render response
```

---

## 4. Environment Requirements

### 4.1 Production Environment

| Requirement | Value | Notes |
|---|---|---|
| **Node.js** | ≥ 18.x (LTS) | Vercel default: 20.x |
| **Package Manager** | npm ≥ 9.x | Lock file: `package-lock.json` |
| **Browser Support** | Chrome 90+, Firefox 90+, Safari 15+, Edge 90+ | Desktop-first; mobile P2 |
| **Viewport** | Min 1280×720, Target 1440×900+ | Desktop-centric design |
| **Network** | HTTPS required | Vercel auto-provisions |
| **CDN** | Vercel Edge Network | Global, 100+ locations |

### 4.2 Build Environment

| Requirement | Value |
|---|---|
| **Node.js** | 20.x (Vercel default) |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist/` |
| **Build Time Budget** | ≤ 120 seconds (Vercel hobby limit) |
| **Memory Budget** | ≤ 1024 MB |

### 4.3 Runtime Dependencies

| Dependency | Version | Package | Why Locked |
|---|---|---|---|
| React | 18.3.1 | `react`, `react-dom` | Stable — no v19 migration yet |
| React Router | 6.28.0 | `react-router-dom` | Route stability |
| Vite | 6.0.1 | `vite` | Build consistency |
| Tailwind CSS | 3.4.15 | `tailwindcss` | No v4 breaking changes |
| D3 | 7.9.0 | `d3`, `d3-geo` | Map rendering |
| Three.js | 0.185.1 | `three` | WebGL stability |
| framer-motion | 11.11.1 | `framer-motion` | Animation consistency |
| axios | 1.7.7 | `axios` | API client |
| GSAP | (in `animations/`) | — | Scroll animation |

---

## 5. Build Configuration

### 5.1 Vite Build Settings

```javascript
// vite.config.js — production additions (from current base config)
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': {
        target: 'http://localhost:3001',
        changeOrigin: true,
      },
    },
  },
  // === Production additions below ===
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,           // No sourcemaps in production
    minify: 'esbuild',         // Fastest minifier
    target: 'es2020',          // Broad browser support
    rollupOptions: {
      output: {
        manualChunks: {
          'vendor-react': ['react', 'react-dom', 'react-router-dom'],
          'vendor-d3': ['d3', 'd3-geo'],
          'vendor-animation': ['framer-motion', 'three'],
        },
      },
    },
    chunkSizeWarningLimit: 500, // kB
  },
});
```

### 5.2 Manual Chunk Strategy

| Chunk Name | Packages | Rationale | Target Size |
|---|---|---|---|
| `vendor-react` | `react`, `react-dom`, `react-router-dom` | Core framework — changes rarely | ≤ 150 KB gzip |
| `vendor-d3` | `d3`, `d3-geo` | Map rendering — large, infrequent changes | ≤ 120 KB gzip |
| `vendor-animation` | `framer-motion`, `three` | Animation/WebGL — moderate, infrequent changes | ≤ 200 KB gzip |
| `vendor-utils` | `axios`, `react-hot-toast` | Small utilities | ≤ 30 KB gzip |
| `app` | All project source | Application code — changes frequently | ≤ 100 KB gzip |

### 5.3 Build Output Structure

```
dist/
├── index.html                    ← Entry point (SPA fallback)
├── assets/
│   ├── vendor-react-[hash].js    ← React + Router (cached 1 year)
│   ├── vendor-d3-[hash].js       ← D3 (cached 1 year)
│   ├── vendor-animation-[hash].js ← framer-motion + Three.js (1 year)
│   ├── vendor-utils-[hash].js    ← axios + toast (1 year)
│   ├── app-[hash].js             ← Application code (cached 1 year)
│   ├── index-[hash].css          ← Tailwind output (cached 1 year)
│   └── images/                   ← Imported image assets
├── textures/                     ← Rice paper, map terrain (manual copy)
├── images/                       ← Tea illustrations, scenes (manual copy)
├── map/                          ← SVG map (manual copy)
├── fonts/                        ← Self-hosted fonts (manual copy)
└── _headers                      ← Custom HTTP headers (Vercel)
```

### 5.4 Static Asset Copy

Assets from `12-assets-guide.md` §16 that are NOT imported by JS modules must be copied into `dist/` separately:

| Source | Destination | Method |
|---|---|---|
| `public/assets/textures/` → | `dist/textures/` | Vite `public/` directory (auto-copied) |
| `public/assets/images/` → | `dist/images/` | Vite `public/` directory |
| `public/assets/map/` → | `dist/map/` | Vite `public/` directory |
| `public/assets/fonts/` → | `dist/fonts/` | Vite `public/` directory |

> Move all non-imported assets under `client/public/` so Vite copies them to `dist/` automatically.

---

## 6. Environment Variables

### 6.1 Variable Inventory

| Variable | Required | Environment | Description | Example |
|---|---|---|---|---|
| `VITE_API_BASE_URL` | P0 | All | API server base URL | `https://api.teaatlas.com` |
| `VITE_MAP_TILES_URL` | P1 | Production | External map tile server (if used) | `https://tiles.teaatlas.com` |
| `VITE_GA_MEASUREMENT_ID` | P1 | Production | Google Analytics 4 ID | `G-XXXXXXXXXX` |
| `VITE_SENTRY_DSN` | P1 | Production | Sentry DSN for error monitoring | `https://xxx@sentry.io/xxx` |
| `VITE_ENVIRONMENT` | P0 | All | Deployment environment | `production` / `staging` / `development` |
| `VITE_APP_VERSION` | P0 | Production | Current release version (from `package.json`) | `1.0.0` |

### 6.2 Vite Environment Variable Rules

| ID | Rule |
|---|---|
| ENV-R01 | All client-visible env vars MUST be prefixed with `VITE_` — otherwise they are not exposed to the browser |
| ENV-R02 | No secrets in `VITE_*` variables — they are bundled into the client JS |
| ENV-R03 | Secrets (API keys, DB passwords) go in server-side env vars only |
| ENV-R04 | Each environment (dev/staging/prod) has its own `.env` file |
| ENV-R05 | `.env` files are `.gitignore`d — never committed |
| ENV-R06 | `.env.example` is committed with placeholder values for documentation |

### 6.3 Environment File Templates

```
# .env.example — committed to repo
VITE_API_BASE_URL=http://localhost:3001
VITE_ENVIRONMENT=development
VITE_APP_VERSION=0.0.0

# .env.production — Vercel environment variables (set in dashboard)
VITE_API_BASE_URL=https://api.teaatlas.com
VITE_ENVIRONMENT=production
VITE_APP_VERSION=1.0.0
VITE_GA_MEASUREMENT_ID=G-XXXXXXXXXX
VITE_SENTRY_DSN=https://xxx@sentry.io/xxx
```

### 6.4 Vercel Environment Configuration

| Variable | Set In | Scope |
|---|---|---|
| All `VITE_*` vars | Vercel Dashboard → Project Settings → Environment Variables | Production, Preview, Development |
| `NODE_VERSION` | `"node": "20.x"` in `engines` field of `package.json` | All |
| API Server URL | `VITE_API_BASE_URL` per environment | Per-env |

---

## 7. Static Asset Deployment

### 7.1 Asset Delivery Pipeline

```
Source Assets                  Build Process                  CDN Delivery
─────────────                  ─────────────                  ────────────
12-assets-guide.md             Vite build                     Vercel Edge
    │                              │                              │
    ├── Textures (WebP)           ├── Imported images →           ├── Cache: 1 year
    │   └── public/textures/      │   hashed filenames            │   (content-hash)
    │                              │   in dist/assets/            │
    ├── Images (WebP)             │                              │
    │   └── public/images/        ├── public/ files →            ├── Cache: 1 year
    │                              │   copied to dist/            │   (manual versioning)
    ├── Map (SVG)                 │   root (no hash)             │
    │   └── public/map/           │                              │
    │                              └── CSS/JS → hashed            └── Cache: 1 year
    └── Fonts (WOFF2)                 filenames                      (content-hash)
        └── public/fonts/
```

### 7.2 Asset Caching Strategy

| Asset Type | Cache Duration | Cache Key | Reason |
|---|---|---|---|
| JS chunks (hashed) | 1 year (`max-age=31536000, immutable`) | Content hash in filename | Content-hash changes on every build |
| CSS (hashed) | 1 year (`max-age=31536000, immutable`) | Content hash in filename | Same as JS |
| Images in `assets/` (hashed) | 1 year | Content hash | Vite-processed images |
| Images in `public/` (unhashed) | 7 days (`max-age=604800`) | Filename only | Manual cache bust via filename change |
| `index.html` | 60 seconds (`max-age=60, must-revalidate`) | None | Must check for new build |
| Fonts (WOFF2) | 1 year | Filename + version | Fonts change very rarely |
| `_headers` | No cache | — | Vercel config file |

### 7.3 Custom Headers (`public/_headers` / `vercel.json`)

```json
// vercel.json — Vercel-specific headers + SPA routing
{
  "headers": [
    {
      "source": "/assets/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/fonts/(.*)",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=31536000" }
      ]
    },
    {
      "source": "/(.*).webp",
      "headers": [
        { "key": "Cache-Control", "value": "public, max-age=604800" }
      ]
    },
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=()" }
      ]
    }
  ],
  "rewrites": [
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ],
  "redirects": [
    {
      "source": "/map.html",
      "destination": "/map",
      "permanent": true
    }
  ]
}
```

---

## 8. Hosting Platform

### 8.1 Platform Selection: Vercel

| Criterion | Vercel | Rationale |
|---|---|---|
| **Framework** | Native Vite/React support | Zero-config deployment for Vite SPA |
| **CDN** | Global Edge Network (100+ locations) | Low latency for international audience |
| **HTTPS** | Automatic SSL via Let's Encrypt | Zero setup |
| **Preview Deploys** | Per-branch preview URLs | PR review without staging environment |
| **Environment Variables** | Dashboard + CLI management | Secure, per-environment |
| **Serverless Functions** | Optional `/api` routes | Can proxy to external API server or host API directly |
| **Cost** | Free tier (Hobby): 100GB bandwidth, 6000 build minutes/month | Sufficient for v1 launch |
| **Git Integration** | Native GitHub/GitLab integration | Auto-deploy on push |

### 8.2 Vercel Project Configuration

| Setting | Value |
|---|---|
| **Framework** | Vite |
| **Build Command** | `npm run build` |
| **Output Directory** | `dist` |
| **Install Command** | `npm install` |
| **Root Directory** | `client/` |
| **Node.js Version** | 20.x |

### 8.3 API Proxy Configuration

If the API server is hosted separately, configure a Vercel rewrite to proxy `/api/*` requests:

```json
// vercel.json — add to existing rewrites array
{
  "rewrites": [
    {
      "source": "/api/(.*)",
      "destination": "https://api.teaatlas.com/api/$1"
    },
    {
      "source": "/((?!api/).*)",
      "destination": "/index.html"
    }
  ]
}
```

### 8.4 Vercel Environment Strategy

| Environment | Git Branch | URL Pattern | Purpose |
|---|---|---|---|
| **Production** | `main` | `teaatlas.com` | Live site |
| **Preview** | All other branches | `{branch}--teaatlas.vercel.app` | PR review, QA |
| **Development** | Local (`npm run dev`) | `localhost:5173` | Active development |

---

## 9. Domain & HTTPS

### 9.1 Domain Configuration

| Setting | Value |
|---|---|
| **Primary Domain** | `teaatlas.com` |
| **www Subdomain** | Redirect `www.teaatlas.com` → `teaatlas.com` (301) |
| **API Subdomain** | `api.teaatlas.com` (if separate API host) |
| **DNS Provider** | Cloudflare (recommended) or Vercel DNS |
| **Nameservers** | As configured in Vercel Dashboard → Domains |

### 9.2 HTTPS Configuration

| Setting | Value |
|---|---|
| **SSL Certificate** | Automatic (Let's Encrypt via Vercel) |
| **HSTS** | `max-age=31536000; includeSubDomains; preload` |
| **Minimum TLS** | TLS 1.2 (TLS 1.3 preferred) |
| **HTTP → HTTPS** | Auto-redirect (Vercel default) |

### 9.3 DNS Records

| Type | Name | Value | TTL |
|---|---|---|---|
| `A` | `@` | `76.76.21.21` (Vercel) | Auto |
| `CNAME` | `www` | `cname.vercel-dns.com` | Auto |
| `CNAME` | `api` | (API server host) | 3600 |

---

## 10. Performance Optimization

### 10.1 Performance Budget

| Metric | Budget | Measurement |
|---|---|---|
| **LCP (Largest Contentful Paint)** | ≤ 2.5s | Lighthouse / Vercel Analytics |
| **FID (First Input Delay)** | ≤ 100ms | Lighthouse |
| **CLS (Cumulative Layout Shift)** | ≤ 0.1 | Lighthouse |
| **TTFB (Time to First Byte)** | ≤ 600ms | Vercel Edge |
| **Total JS (gzipped)** | ≤ 400 KB | `vite build` report |
| **Total CSS (gzipped)** | ≤ 50 KB | `vite build` report |
| **Font Load (total)** | ≤ 150 KB | Network tab |
| **Total Page Weight** | ≤ 2 MB (initial load) | Network tab |

### 10.2 Optimization Techniques

| Technique | Implementation | Impact |
|---|---|---|
| **Code Splitting** | Manual chunks (§5.2) + dynamic `import()` for route-level components | Reduces initial JS by ~60% |
| **Font Subsetting** | Subset Noto Serif SC + Noto Sans SC to Latin + common CJK (3,000 chars) | Reduces font payload from ~2MB to ~120KB |
| **Image Format** | WebP for all raster images; lossy quality 85–90 | ~40% smaller than PNG/JPEG |
| **Image Lazy Loading** | `loading="lazy"` on below-fold images | Defers off-screen image loads |
| **SVG Optimization** | SVGO with precision 2 on all SVG assets | ~30% smaller SVGs |
| **CSS Purging** | Tailwind `content` config — purge unused classes | CSS ≤ 50KB gzipped |
| **Preload Critical Assets** | `<link rel="preload">` for hero image + primary font | Faster LCP |
| **Prefetch Likely Routes** | `<link rel="prefetch">` for `/map` and `/encyclopedia` in `index.html` | Faster navigation |
| **Gzip/Brotli** | Vercel auto-compresses text assets | ~70% size reduction |

### 10.3 Critical Resource Preloading

```html
<!-- In index.html <head> -->
<link rel="preload" href="/fonts/NotoSerifSC-Bold.woff2" as="font" type="font/woff2" crossorigin>
<link rel="preload" href="/images/hero/img-hero-landscape-2560.webp" as="image" media="(min-width: 1280px)">
<link rel="prefetch" href="/assets/vendor-d3-[hash].js" as="script">
```

### 10.4 Performance Monitoring

| Tool | Purpose | Frequency |
|---|---|---|
| **Lighthouse CI** | Automated perf audit per PR | Every push |
| **Vercel Analytics** | Real-user metrics (Web Vitals) | Continuous |
| **Bundle Analyzer** | Chunk size visualization | Every build (`npm run build -- --analyze`) |

---

## 11. SEO Configuration

### 11.1 Meta Tags

Every page must render (via React Helmet or equivalent):

```html
<!-- In <head> -->
<title>Tea Atlas — Interactive Chinese Tea Culture Digital Museum</title>
<meta name="description" content="Explore China's tea culture through an immersive digital museum. Discover tea varieties, regions, and stories in an interactive ink-wash experience.">
<meta name="robots" content="index, follow">
<link rel="canonical" href="https://teaatlas.com">
<meta property="og:title" content="Tea Atlas — Interactive Chinese Tea Culture Digital Museum">
<meta property="og:description" content="Explore China's tea culture through an immersive digital museum.">
<meta property="og:image" content="https://teaatlas.com/images/og-default.webp">
<meta property="og:url" content="https://teaatlas.com">
<meta property="og:type" content="website">
<meta name="twitter:card" content="summary_large_image">
```

### 11.2 SEO Requirements

| ID | Requirement | Priority |
|---|---|---|
| SEO-R01 | Every route renders a unique `<title>` tag | P0 |
| SEO-R02 | Every route renders a unique `<meta description>` | P0 |
| SEO-R03 | Tea detail pages include structured data (JSON-LD) for rich snippets | P1 |
| SEO-R04 | All images have descriptive `alt` attributes | P0 |
| SEO-R05 | `robots.txt` disallows `/api/`, allows everything else | P0 |
| SEO-R06 | XML sitemap generated at build time (`sitemap.xml`) | P1 |
| SEO-R07 | Canonical URLs set for every page | P1 |
| SEO-R08 | Open Graph tags set for every page | P1 |

### 11.3 robots.txt

```
User-agent: *
Allow: /
Disallow: /api/
Sitemap: https://teaatlas.com/sitemap.xml
```

### 11.4 Structured Data (JSON-LD)

Tea detail pages should include `Product` or `Article` schema; Province pages should include `Place` schema.

```json
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "West Lake Longjing",
  "description": "China's most celebrated green tea from Zhejiang province.",
  "category": "Green Tea",
  "productionRegion": {
    "@type": "Place",
    "name": "Zhejiang, China"
  }
}
```

---

## 12. Analytics Integration

### 12.1 Analytics Tools

| Tool | Purpose | Priority | Status |
|---|---|---|---|
| **Google Analytics 4** | Page views, user flow, engagement | P1 | Configure post-launch |
| **Vercel Analytics** | Web Vitals, real-user metrics | P1 | Enable in Vercel Dashboard |
| **Sentry** | Error tracking and performance | P1 | Configure post-launch |

### 12.2 Analytics Configuration

| ID | Rule |
|---|---|
| ANA-R01 | Analytics scripts load asynchronously — never block rendering |
| ANA-R02 | GA4 measurement ID is an environment variable (`VITE_GA_MEASUREMENT_ID`) |
| ANA-R03 | Page view events fire on route change (React Router `useLocation`) |
| ANA-R04 | No PII (Personally Identifiable Information) sent to analytics |
| ANA-R05 | Analytics disabled in development and preview environments |
| ANA-R06 | Cookie consent banner is NOT required — Tea Atlas uses no tracking cookies beyond anonymized analytics |

### 12.3 Page View Tracking

```typescript
// Conceptual — in App.jsx or router setup
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

function usePageTracking() {
  const location = useLocation();
  useEffect(() => {
    if (import.meta.env.VITE_ENVIRONMENT === 'production') {
      window.gtag?.('config', import.meta.env.VITE_GA_MEASUREMENT_ID, {
        page_path: location.pathname,
      });
    }
  }, [location]);
}
```

---

## 13. Error Monitoring

### 13.1 Error Monitoring Strategy

| Error Type | Tool | Alert Channel | Response SLA |
|---|---|---|---|
| **JS Runtime Errors** | Sentry | Email + Slack | 4 hours (P1), 24 hours (P2) |
| **API Errors (4xx/5xx)** | Sentry + API Server logs | Email + Slack | 1 hour (P0), 4 hours (P1) |
| **Build Failures** | GitHub Actions / Vercel | GitHub PR status | Before merge |
| **Web Vitals Regression** | Vercel Analytics | Dashboard | Weekly review |
| **404 / Broken Links** | Vercel Analytics | Dashboard | Weekly review |

### 13.2 Sentry Configuration

```typescript
// Conceptual — in main.jsx
import * as Sentry from '@sentry/react';

if (import.meta.env.VITE_ENVIRONMENT === 'production') {
  Sentry.init({
    dsn: import.meta.env.VITE_SENTRY_DSN,
    environment: import.meta.env.VITE_ENVIRONMENT,
    release: import.meta.env.VITE_APP_VERSION,
    tracesSampleRate: 0.1,        // 10% of transactions
    replaysSessionSampleRate: 0,  // No session replay (privacy)
  });
}
```

### 13.3 Error Boundary

The root `App.jsx` should wrap content in a React Error Boundary that:
- Catches unhandled render errors
- Renders a branded fallback UI (not a white screen)
- Reports the error to Sentry
- Provides a "Reload" button

---

## 14. Security Checklist

### 14.1 Security Headers

| Header | Value | Enforced By |
|---|---|---|
| `X-Content-Type-Options` | `nosniff` | `vercel.json` |
| `X-Frame-Options` | `DENY` | `vercel.json` |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | `vercel.json` |
| `Permissions-Policy` | `camera=(), microphone=(), geolocation=(), interest-cohort=()` | `vercel.json` |
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | `vercel.json` |
| `Content-Security-Policy` | See §14.3 | `vercel.json` |
| `X-XSS-Protection` | `0` (deprecated — CSP handles this) | — |

### 14.2 Security Requirements

| ID | Requirement | Priority |
|---|---|---|
| SEC-R01 | All traffic uses HTTPS — HTTP redirects to HTTPS (Vercel default) | P0 |
| SEC-R02 | No secrets in client-side code or environment variables | P0 |
| SEC-R03 | API requests use CORS with explicit allowed origins | P0 |
| SEC-R04 | Dependencies scanned for known vulnerabilities (`npm audit`) on every PR | P0 |
| SEC-R05 | No `eval()`, no `innerHTML` with user input | P0 |
| SEC-R06 | Content Security Policy header restricts script sources | P1 |
| SEC-R07 | Rate limiting on API endpoints (server-side) | P1 |
| SEC-R08 | No sensitive data in URL query parameters | P0 |
| SEC-R09 | CSRF protection on state-changing API endpoints (server-side) | P1 |
| SEC-R10 | Input validation on all API endpoints (server-side) | P0 |

### 14.3 Content Security Policy

```json
// vercel.json — add CSP header
{
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; script-src 'self' https://www.googletagmanager.com; style-src 'self' 'unsafe-inline'; img-src 'self' data:; font-src 'self'; connect-src 'self' https://api.teaatlas.com https://*.sentry.io https://www.google-analytics.com; frame-src 'none'; object-src 'none'; base-uri 'self'; form-action 'self';"
        }
      ]
    }
  ]
}
```

### 14.4 Dependency Audit

```bash
# Run in CI on every PR
npm audit --production --audit-level=high
# Fail if high or critical vulnerabilities found
```

---

## 15. CI/CD Workflow

### 15.1 CI/CD Pipeline (GitHub Actions + Vercel)

```
Git Push
    │
    ▼
┌─────────────────────┐
│ 1. Install          │
│    npm ci           │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 2. Lint & TypeCheck │
│    tsc --noEmit     │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 3. Test             │
│    npm test         │
│    npm audit        │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 4. Build            │
│    npm run build    │
└─────────┬───────────┘
          ▼
┌─────────────────────┐
│ 5. Deploy           │
│    Vercel (auto)    │
│    ├── Preview URL  │  (non-main branches)
│    └── Production   │  (main branch)
└─────────────────────┘
```

### 15.2 GitHub Actions Workflow

```yaml
# .github/workflows/ci.yml
name: CI

on:
  push:
    branches: [main]
  pull_request:
    branches: [main]

jobs:
  check:
    runs-on: ubuntu-latest
    defaults:
      run:
        working-directory: client/
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: '20'
          cache: 'npm'
          cache-dependency-path: client/package-lock.json
      - run: npm ci
      - run: npx tsc --noEmit
      - run: npm run build
      - run: npm audit --production --audit-level=high

  deploy:
    needs: check
    if: github.ref == 'refs/heads/main'
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Deploy to Vercel
        uses: amondnet/vercel-action@v25
        with:
          vercel-token: ${{ secrets.VERCEL_TOKEN }}
          vercel-org-id: ${{ secrets.VERCEL_ORG_ID }}
          vercel-project-id: ${{ secrets.VERCEL_PROJECT_ID }}
          vercel-args: '--prod'
          working-directory: client/
```

### 15.3 CI/CD Rules

| ID | Rule | Priority |
|---|---|---|
| CICD-R01 | Every PR triggers lint + typecheck + build — all must pass before merge | P0 |
| CICD-R02 | `main` branch is always deployable — no broken builds on main | P0 |
| CICD-R03 | Preview deploys for every PR — reviewer can test live before approving | P0 |
| CICD-R04 | Build failures block merge — no override without explicit approval | P0 |
| CICD-R05 | `npm audit` runs on every PR — high/critical vulnerabilities block merge | P0 |
| CICD-R06 | Production deploy is automatic on merge to `main` | P1 |
| CICD-R07 | Build cache is used between CI runs for faster builds | P1 |

---

## 16. Release Process

### 16.1 Versioning Scheme

```
MAJOR.MINOR.PATCH

MAJOR — Breaking changes to public URLs, data structure, or core user flows
MINOR — New features, new pages, new tea entries
PATCH — Bug fixes, content corrections, typo fixes, asset updates
```

### 16.2 Release Steps

```
1. DEVELOP
   ├── Create feature branch from main
   ├── Implement changes
   ├── Open PR
   └── CI passes + code review approved

2. MERGE
   ├── Squash merge to main
   ├── CI builds and deploys production
   └── Verify production deployment

3. TAG
   ├── Create git tag: v{MAJOR}.{MINOR}.{PATCH}
   ├── Push tag to remote
   └── Create GitHub Release with changelog

4. VERIFY
   ├── Smoke test production: hero, map, encyclopedia, tea detail
   ├── Check Vercel Analytics for errors
   ├── Check Sentry for new errors
   └── Mark release as verified
```

### 16.3 Release Checklist

- [ ] All CI checks pass on `main`
- [ ] Preview deploy verified by reviewer
- [ ] Production deploy confirmed healthy
- [ ] Git tag created and pushed
- [ ] GitHub Release published with changelog
- [ ] Production smoke test: 5 critical paths verified
- [ ] No new Sentry errors within 30 minutes
- [ ] Team notified (Slack/Discord)

### 16.4 Changelog Format

```markdown
## v1.0.1 (2026-07-15)

### Added
- Tea profile: Bi Luo Chun (Jiangsu)

### Fixed
- Province panel close animation jitter on Safari
- Longjing flavor notes typo ("nutty" → "chestnut")

### Changed
- Hero landscape image: updated to higher quality WebP
```

---

## 17. Rollback Procedure

### 17.1 Rollback Decision Matrix

| Severity | Symptom | Action | Timeline |
|---|---|---|---|
| **P0 — Critical** | Site down, blank page, 500 errors on all routes | Immediate rollback | ≤ 5 minutes |
| **P1 — Major** | Core feature broken (map, encyclopedia), severe visual regression | Rollback or hotfix | ≤ 1 hour |
| **P2 — Minor** | Non-critical bug, minor visual issue | Hotfix forward (no rollback) | ≤ 24 hours |
| **P3 — Cosmetic** | Typo, minor styling | Fix in next release | Next business day |

### 17.2 Vercel Rollback Steps

```
1. IDENTIFY
   ├── Check Vercel Dashboard → Deployments
   ├── Find the last healthy deployment
   └── Note the deployment URL and timestamp

2. ROLLBACK
   ├── Vercel Dashboard → Deployments
   ├── Click "..." on the healthy deployment
   ├── Select "Promote to Production"
   └── Confirm — Vercel instantly swaps production traffic

3. VERIFY
   ├── Confirm production URL loads correctly
   ├── Run smoke test (5 critical paths)
   └── Check Sentry for error rate drop

4. COMMUNICATE
   ├── Notify team of rollback
   ├── Document: what failed, why, which deployment was restored
   └── Create issue to fix the root cause
```

### 17.3 Rollback Rules

| ID | Rule |
|---|---|
| ROL-R01 | Vercel instant rollback is the primary rollback method — no git revert needed in emergency |
| ROL-R02 | After rollback, create a git branch to fix the root cause — do not develop on the reverted main |
| ROL-R03 | Document every rollback: timestamp, reason, affected deployment, restored deployment |
| ROL-R04 | Rollback preserves all user data (API + DB are separate from frontend deploy) |

---

## 18. Deployment Checklist

### 18.1 Pre-Deployment

- [ ] All CI checks pass (`tsc --noEmit`, `npm run build`, `npm audit`)
- [ ] Preview deploy reviewed and approved
- [ ] All environment variables configured in Vercel Dashboard (production)
- [ ] Custom domain configured and verified
- [ ] SSL certificate active
- [ ] `vercel.json` present and correctly configured (headers, rewrites, redirects)
- [ ] `robots.txt` present and correct (no disallow on production)
- [ ] Performance budget check passes (Lighthouse ≥ 90 on desktop)
- [ ] No console errors in preview deploy
- [ ] All images load correctly on preview deploy
- [ ] API connectivity verified (if API server is live)
- [ ] Security headers verified (check via `curl -I` or browser DevTools)

### 18.2 Post-Deployment

- [ ] Production URL loads without errors
- [ ] HTTPS active (no mixed content warnings)
- [ ] Custom domain resolves correctly
- [ ] Smoke test: 5 critical paths (hero → scenes → map → encyclopedia → tea detail)
- [ ] All routes load correctly (direct URL access, not just in-app navigation)
- [ ] 404 page renders for invalid routes
- [ ] Sentry receiving data (if configured)
- [ ] Google Analytics receiving data (if configured)
- [ ] Vercel Analytics Web Vitals within budget
- [ ] CDN caching working (check response headers for hashed assets)
- [ ] Sitemap accessible at `/sitemap.xml` (if generated)
- [ ] `robots.txt` accessible at `/robots.txt`

### 18.3 First-Launch Only

- [ ] DNS records configured (A, CNAME)
- [ ] Domain verified in Vercel
- [ ] SSL certificate provisioned
- [ ] WWW → apex redirect working
- [ ] Google Search Console property verified
- [ ] Sitemap submitted to Google Search Console
- [ ] Custom 404 page styled (matches brand)
- [ ] Rate limiting configured on API server

---

## 19. Acceptance Criteria

- [ ] Deployment architecture diagram shows full topology (Vercel → API → DB)
- [ ] 3 deployment targets defined with host, build tool, output, protocol
- [ ] Request flow documented (user → Vercel → SPA → API → DB)
- [ ] Environment requirements: production, build, and runtime dependencies specified
- [ ] Vite build configuration with manual chunk strategy (5 chunks, target sizes)
- [ ] Build output structure documented
- [ ] 6 environment variables inventoried with env/scope/example
- [ ] Vite env var rules (6 rules)
- [ ] Custom headers configuration (`vercel.json`) with 4 header groups
- [ ] SPA routing rewrite rule configured
- [ ] Vercel project settings table (7 settings)
- [ ] 3-environment strategy (production/preview/development)
- [ ] Domain + HTTPS configuration with DNS records
- [ ] Performance budget: 9 metrics with targets
- [ ] 10 optimization techniques with implementation notes
- [ ] SEO: 8 requirements + meta tag template + robots.txt + JSON-LD
- [ ] Analytics: 3 tools with 6 configuration rules
- [ ] Error monitoring: 5 error types with tools, alerts, and SLAs
- [ ] Error boundary + Sentry init code patterns
- [ ] Security: 7 headers, 10 requirements, CSP configuration
- [ ] CI/CD workflow: 5-stage pipeline + GitHub Actions YAML
- [ ] 7 CI/CD rules
- [ ] Release process: 4 steps + 8-item release checklist
- [ ] Rollback procedure: severity matrix + 4-step process + 4 rules
- [ ] Deployment checklist: 12 pre-deploy + 13 post-deploy + 8 first-launch items
- [ ] All ENV-R*, SEO-R*, ANA-R*, SEC-R*, CICD-R*, ROL-R* rules are verifiable
- [ ] No duplication of `09-frontend-architecture.md` or `10-development-roadmap.md`

---

## 20. References

| Document | Relationship |
|---|---|
| `09-frontend-architecture.md` | Tech stack, folder structure, package.json — this document deploys that architecture |
| `10-development-roadmap.md` | Task sequence — deployment tasks (Task017–Task020) reference this document |
| `12-assets-guide.md` | Asset inventory and directory structure — deployed as static assets (§7) |
| `13-content-guide.md` | Content validation rules — enforced in CI (§15) |
| `15-project-rules.md` | Global development rules — CI enforcement and code standards |

---

## 21. Next Document

> **`15-project-rules.md`** — Global development rules, code standards, Git conventions, review requirements, and enforced constraints that apply across all tasks and all developers.

---

> This document is the operational constitution of Tea Atlas. It defines how code becomes a live website, how it stays live, and how it recovers when things go wrong. Every deploy, every release, every rollback follows these procedures. No ad-hoc deployments. No manual FTP. No surprises.
