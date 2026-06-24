# Sahil Yousaf Portfolio — Design System

## Overview
A bold, dual-mode portfolio for an architect turned AI researcher. The experience splits into two distinct but related modes:

- **Code mode** — dark, electric, reactive. Inspired by creative developer portfolios and data visualisation.
- **Architecture mode** — warm, editorial, grounded. Inspired by architectural folios and floor-plan diagrams.

Both modes share the same typographic attitude: oversized display type, strong contrast, generous whitespace, and a custom cursor.

---

## Color Palette

### Core Tokens
| Token | Value | Usage |
|-------|-------|-------|
| `--c-black` | `#070707` | Code mode backgrounds |
| `--c-void` | `#0B0B0E` | Code mode section alternates |
| `--c-panel` | `#111116` | Code mode cards / panels |
| `--c-white` | `#F4F4F0` | Code mode primary text |
| `--c-muted` | `#6B6B75` | Code mode secondary text |
| `--c-parchment` | `#F2EDE4` | Architecture mode background |
| `--c-stone` | `#E6E1D6` | Architecture mode section alternates |
| `--c-umber` | `#3D2B1F` | Architecture mode primary text |
| `--c-taupe` | `#8B7E6A` | Architecture mode secondary text |
| `--c-clay` | `#C75B3A` | Architecture mode accent |
| `--c-ember` | `#FF3300` | Code mode accent / CTAs |
| `--c-cyan` | `#00F0FF` | Code mode secondary accent |
| `--c-line` | `rgba(255,255,255,0.10)` | Code mode borders |
| `--c-line-dark` | `rgba(28,20,15,0.12)` | Architecture mode borders |

### Mode Usage
- **Code mode:** black/void background, white text, ember + cyan accents.
- **Architecture mode:** parchment/stone background, umber text, clay accent.
- **Landing:** dark background with split imagery, ember for code, clay for architecture.

---

## Typography

### Font Families
| Role | Font | Fallback |
|------|------|----------|
| Display | Anton | Impact, sans-serif |
| UI / Labels | Space Grotesk | sans-serif |
| Body | Archivo | sans-serif |
| Serif / Quotes | Newsreader | Georgia, serif |
| Monospace | JetBrains Mono | monospace |

### Type Scale
- **Hero display:** `clamp(56px, 10vw, 150px)` — Anton, uppercase, tight line-height.
- **Section titles:** `clamp(36px, 6vw, 80px)` — Anton, uppercase.
- **Card titles:** `26px–36px` — Anton, uppercase.
- **Body:** `14px–16px` — Archivo, line-height 1.6–1.75.
- **Labels / Eyebrows:** `10px–12px` — JetBrains Mono, uppercase, wide letter-spacing.

---

## Spacing & Layout

- Page padding: `4vw` horizontal.
- Section vertical padding: `100px–120px`.
- Max content width: `1300px` for architecture, fluid for code.
- Border radius: `2px` (sharp, architectural).
- Grid gaps: `24px–60px` depending on section.

---

## Components

### Buttons
- **Primary (code):** `background: var(--c-ember)`, white text, mono label, no radius.
- **Outline (code):** `1px solid white`, white text, hover inverts to white background.
- **Primary (architecture):** `background: var(--c-umber)`, parchment text.
- **Outline (architecture):** `1px solid var(--c-umber)`, umber text, hover fills umber.

### Cards
- Background: mode panel color.
- Border: `1px solid` mode line color.
- Hover: lift `6px`, border switches to accent.

### Custom Cursors
- **Code mode:** React Bits-style `TargetCursor` — center dot + four corner brackets that expand to frame hovered targets, with slow spin.
- **Architecture mode:** Simple ring-and-dot cursor — circular ring with centered dot, scales up and changes color on targets.
- Hidden on touch devices (`pointer: coarse`).

---

## Animation Principles

- **Reveals:** `translateY(30px) → 0` with `0.9s` ease, staggered by `0.08s`.
- **Cursor:** Smooth follow via `requestAnimationFrame` + linear interpolation (`0.12–0.15`).
- **Hover:** Quick `0.2–0.25s` transitions on borders, scales, and colors.
- **Graph:** Physics-based force-directed graph with spring links and mouse repulsion.
- **Floor plan:** SVG rooms highlight on scroll-linked active state.

---

## Assets

- Architecture renders: `uploads/arch-projects/`
- GitHub project images: loaded from GitHub user-attachments or repository raw URLs.
- Favicon: `References/For website.PNG`

---

## Tech Stack

- React 18 + Vite 5
- GSAP for cursor and micro-animations
- Font Awesome for icons
- Google Fonts for typography
- Static project pages: HTML + CSS + vanilla JS

---

## GitHub Pages Notes

- Base path: `/sahilyousafp_pages/`
- The React app builds into `site/dist/` and is copied to the repo root (`index.html` + `assets/`).
- Existing static project pages (`project-*.html`) remain at root and share the architecture-mode palette.
