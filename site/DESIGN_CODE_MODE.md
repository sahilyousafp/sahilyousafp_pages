# Code Mode — Design System

## Overview
The code mode is the dark, electric, reactive half of the portfolio. It presents Sahil Yousaf's work as an AI researcher and developer. The aesthetic is inspired by creative developer portfolios, data visualisation dashboards, and terminal interfaces — sharp, high-contrast, and kinetic.

---

## Color Palette

| Token | Value | Usage |
|-------|-------|-------|
| `--c-black` | `#070707` | Primary background |
| `--c-void` | `#0B0B0E` | Alternate section background |
| `--c-panel` | `#111116` | Cards, panels, elevated surfaces |
| `--c-white` | `#F4F4F0` | Primary text |
| `--c-muted` | `#6B6B75` | Secondary/body text, descriptions |
| `--c-ember` | `#FF3300` | Primary accent — CTAs, links, active states, section numbers |
| `--c-cyan` | `#00F0FF` | Secondary accent — tags, hover states, category labels |
| `--c-line` | `rgba(255,255,255,0.10)` | Borders, dividers, separators |

### Semantic Usage
- **Backgrounds:** `--c-black` for main, `--c-void` for alternating `.alt` sections.
- **Surfaces:** `--c-panel` for all cards and elevated content blocks.
- **Text hierarchy:** `--c-white` (primary) > `--c-muted` (secondary/body) > `rgba(255,255,255,0.55)` (tertiary).
- **Accents:** `--c-ember` for action items, numbers, badges. `--c-cyan` for informational tags, hover borders, and category labels.
- **Selection:** `background: var(--c-ember); color: var(--c-black)`.

---

## Typography

### Font Families
| Role | Token | Font | Fallback |
|------|-------|------|----------|
| Display / Headings | `--font-display` | Anton | Impact, sans-serif |
| UI / Controls | `--font-ui` | Space Grotesk | sans-serif |
| Body | `--font-body` | Archivo | sans-serif |
| Labels / Mono | `--font-mono` | JetBrains Mono | monospace |
| Serif (graph card) | `--font-serif` | Newsreader | Georgia, serif |

### Type Scale
| Element | Size | Weight | Transform | Tracking |
|---------|------|--------|-----------|----------|
| Hero graph labels (main) | 22px | 600 | none | -0.01em |
| Section headings | `clamp(36px, 6vw, 80px)` | 400 | uppercase | -0.01em |
| Card titles | 26px | 400 | uppercase | — |
| Publication titles | `clamp(20px, 3vw, 32px)` | 400 | uppercase | — |
| Blog card titles | 18px | 400 | uppercase | — |
| Experience titles | 22px | 400 | uppercase | — |
| Marquee text | `clamp(28px, 4vw, 56px)` | 400 | uppercase | — |
| Body text | 14px | 400 | none | — |
| Labels / eyebrows | 9–12px | 400–500 | uppercase | 0.1–0.3em |
| Section numbers | 12px | 400 | uppercase | 0.2em |

### Font Family Rules
- **Anton** — all headings and display text, always uppercase.
- **JetBrains Mono** — all labels, tags, nav links, section numbers, dates, metadata.
- **Archivo** — body text and descriptions.
- **Space Grotesk** — UI controls (not currently used heavily in code mode).
- **Newsreader** — reserved for the knowledge graph card body text (Hanken Grotesk used as graph label font).

---

## Spacing & Layout

| Property | Value |
|----------|-------|
| Page horizontal padding | `4vw` |
| Section vertical padding | `120px` top/bottom |
| Max content width | Fluid (no max-width in code mode) |
| Grid gap (cards) | `24px` |
| Grid gap (research) | `40px` |
| Card internal padding | `22px` (body), `30–40px` (feature) |
| Border radius | `2px` (via `--radius`) |
| Section head margin-bottom | `60px` |

---

## Components

### Navigation (Fixed Header)
- Position: fixed, top, full-width, `z-index: 100`.
- `mix-blend-mode: difference` — inverts over any background.
- Left: back button "MODES" with left arrow, mono 12px, 0.15em tracking, 60% opacity, 100% on hover.
- Right: nav buttons "WORK · PUBLICATIONS · BLOGS · EXPERIENCE · CONTACT" — mono 11px, 0.12em tracking, 60% opacity with ember underline on hover (1px, expands from left).
- Hidden on mobile (< 900px).

### Hero Section
- Full viewport height (`100vh`, min 700px).
- Contains the interactive **CodeGraph** (force-directed knowledge graph) as background.
- No text overlay — the graph IS the hero.

### Knowledge Graph (CodeGraph)
- Canvas-based line drawing + absolutely positioned DOM nodes.
- **Center node:** 40px circle, `--c-ember` background, pulsing scale animation (4s cycle).
- **Branch nodes:** 36px hexagon clip-path, `rgba(255,255,255,0.06)` bg, 1.5px white 18% opacity border.
- **Sub nodes:** 28px square, same styling as branch but smaller.
- **Lines:** 1px `#ff3300` at 35% opacity. Dashed (4,4) for sub-node connections, solid for branch connections.
- **Parallax:** Nodes shift based on mouse position with variable depth (0.4x or 0.8x).
- **Labels:** Hanken Grotesk — main: 22px/600, branch: 15px/600, leaf: 14px/500, sub: 14px/400.
- **Floating index card:** 280px wide, glassmorphism (4% white bg, 12px blur, 12px radius), positioned top-center. Shows hovered node details or default bio text. Has section rows (INITIATIVES, RESEARCH, ARTIFACTS) with material icons.

### Marquee
- Full-width `--c-ember` background, 18px vertical padding.
- Skills scroll horizontally: Anton font, `clamp(28px, 4vw, 56px)`, `--c-black` text.
- Infinite linear animation at 20s, duplicated 4x for seamless loop.
- Skills: PYTHON, LLMS, GRAPH NETWORKS, REACT, GRASSHOPPER, SIMULATION, OPENCV.

### Section Header
- Layout: flex row, baseline-aligned, 20px gap.
- Section number: mono 12px, `--c-ember`, 0.2em tracking.
- Title: Anton, `clamp(36px, 6vw, 80px)`, uppercase, line-height 1.

### Project Cards
- Grid: `repeat(auto-fit, minmax(320px, 1fr))`, 24px gap.
- Card: `--c-panel` bg, 1px `--c-line` border, 2px radius.
- Image area: 220px height, cover fit.
- Body: 22px padding.
- Title: Anton 26px uppercase.
- Tags: mono 11px, `--c-cyan`, 0.08em tracking.
- Description: 14px, `--c-muted`, line-height 1.55.
- Hover: `translateY(-6px)`, border-color changes to `--c-cyan`.

### Publication Cards
- Vertical stack, 20px gap.
- Card: `--c-panel` bg, 1px `--c-line` border, 30px padding.
- Conference badge: 1px `--c-ember` border, `--c-ember` text, mono 9px, 0.12em tracking.
- Date: mono 11px, `--c-muted`.
- Title: Anton `clamp(20px, 3vw, 32px)` uppercase.
- Subtitle: mono 11px, `--c-cyan`, 0.1em tracking.
- Description: 14px, `--c-muted`.
- "Read the paper" link: mono 11px, `--c-cyan`, arrow icon shifts right 4px on hover.
- Hover: bg shifts to `rgba(255,51,0,0.08)`, border becomes `--c-ember`.

### Blog Cards (Horizontal Carousel)
- Horizontally scrollable carousel with `overflow-x: auto`.
- Track: flex row, 16px gap, `width: max-content`.
- Card: 320px wide, `--c-panel` bg, 1px `--c-line` border.
- Image: 180px height, cover, `--c-void` fallback bg, 2px `--c-cyan` bottom border.
- Body: 22px/20px padding.
- Category: mono 9px, `--c-cyan`, 0.12em tracking.
- Title: Anton 18px uppercase.
- Date: mono 10px, `--c-muted`.
- "Read on IAAC" link: mono 10px, `--c-ember`.
- Hover: `translateY(-6px)`, border-color `--c-cyan`, image scales to 110%.

### Experience Rows
- Vertical stack with 1px `--c-line` dividers (gap trick).
- Row: 3-column grid `120px 140px 1fr`, 30px gap, 28px/22px padding, `--c-black` bg.
- Type label: mono 11px, `--c-ember`, 0.1em tracking.
- Date: mono 12px, `--c-muted`.
- Title: Anton 22px uppercase.
- Description: 14px, `--c-muted`.
- Hover: bg shifts to `--c-panel`.

### Skill Pills
- Flex wrap container, 12px gap.
- Pill: 1px `--c-line` border, 100px border-radius, 10px/18px padding.
- Text: mono 12px, `--c-white`.
- Hover: border and text shift to `--c-cyan`.

### Contact Cards
- Grid: `repeat(auto-fit, minmax(280px, 1fr))`, 24px gap.
- Card: 1px `--c-line` border, 34px padding, `--c-panel` bg.
- Label: mono 11px, 0.15em tracking, `--c-muted`.
- Value: mono 15px, `--c-white`.
- Hover: border becomes `--c-ember`, `translateY(-4px)`.

### Buttons
- **Primary (filled):** `--c-ember` bg (implied from landing), white text, mono label, no radius.
- **Outline:** 1px solid white border, white text, hover inverts to white bg.
- Both: mono font, 0.12em tracking, uppercase.

---

## Custom Cursor (TargetCursor)

- Fixed position, `z-index: 9999`, pointer-events none.
- **Structure:** Center dot (5px circle) + four corner brackets (6px L-shapes, 1.5px borders).
- **Color:** `var(--cursor-color)` — set to `--c-ember` (#FF3300) in code mode.
- **Default size:** 20px.
- **On `.cursor-target` hover:** Expands to frame the hovered element.
- **Animation:** Smooth follow via `requestAnimationFrame` with linear interpolation.
- Hidden on touch devices (`@media (pointer: coarse)`).

---

## Edge Mode Switch

- Fixed arrows at left/right screen edges for switching between Code and Architecture modes.
- Code mode shows "ARCHITECTURE" label with `--c-clay` (#C75B3A) color on the right edge.
- Arrow SVG with `drop-shadow(0 0 6px currentColor)` glow.
- Label: mono 10px, 0.25em tracking, uppercase, text-shadow glow.
- Hidden on touch devices.

---

## Animation & Motion

| Animation | Duration | Easing | Details |
|-----------|----------|--------|---------|
| Scroll reveal | 0.9s | `cubic-bezier(.2,.7,.2,1)` | `translateY(30px)` to none, staggered by 0.08s per delay level |
| Card hover lift | 0.3s | default | `translateY(-6px)` |
| Border color transitions | 0.2–0.3s | default | On cards, pills, contacts |
| Marquee scroll | 20s | linear | Infinite, `translateX(0)` to `translateX(-50%)` |
| Graph node pulse | 4s | ease-in-out | Center node scale 1 to 1.1 |
| Graph parallax | per frame | — | Mouse-driven via `requestAnimationFrame` |
| Cursor follow | per frame | lerp 0.12–0.15 | `requestAnimationFrame` + linear interpolation |
| Nav underline | 0.3s | ease | Width 0 to 100% from left |
| Loader pulse | 1.2s | — | Opacity 1 to 0.4 |

---

## Responsive Breakpoints

### < 900px
- Nav links hidden.
- Research grid: single column.
- Post rows: single column.
- Blog cards: 260px wide, 140px image.
- Publication cards: reduced padding (20px), reduced gap (12px).
- Experience rows: single column.
- Hero meta and graph hint hidden.
- Graph card hidden.
- Graph labels scale down.

---

## Footer
- Flex row, space-between, 30px vertical / 4vw horizontal padding.
- 1px `--c-line` top border.
- Text: mono 10px, 0.12em tracking, `--c-muted`.
- Left: "© {year} SAHIL YOUSAF".
- Right: "BUILT WITH REACT + VITE".
