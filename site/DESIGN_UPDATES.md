# Design System Updates — Split-Screen Intro

## Overview
Restructured the intro/landing screen to showcase dual aesthetic approaches: Code Mode (left) and Architecture Mode (right) with consistent design language throughout the system.

## Intro Screen Split Design

### Left Side: CODE MODE
- **Background**: Dark (#070707) with gradient overlay
- **Primary Colors**: White, Cyan accents (#00F0FF), Ember orange (#FF3300)
- **Typography**: 
  - Display: Anton (uppercase, bold)
  - Body: Archivo (14px, muted)
  - Mono: JetBrains Mono (metrics, technical)
- **Content**:
  - Heading: "AI BUILDER"
  - Stats: 6 Projects, 9 Publications
  - Subtitle: Cyan technical label
  - Description: Technical capabilities focus
  - CTA: Ember button with hover lift effect

### Right Side: ARCHITECTURE MODE
- **Background**: Parchment (#F2EDE4) with gradient overlay
- **Primary Colors**: Umber (#3D2B1F), Clay (#C75B3A), Taupe (#8B7E6A)
- **Typography**:
  - Display: Anton (uppercase, elegant)
  - Body: Newsreader serif (for sophistication)
  - Mono: JetBrains Mono (minimal use)
- **Content**:
  - Heading: "SAHIL YOUSAF" (centered)
  - Subtitle: Italic serif description
  - Description: Studio experience + education
  - CTA: Umber button with clay hover state

## Data Cross-Referenced
- **Resume**: Sahil Yousaf - AI Research Resume.pdf
  - 6 major computational projects
  - 9 published research posts
  - Education: IAAC Barcelona (Masters in AI for Architecture)
  - Experience: Morphogenesis (2022-2024), SHAPE (2024), DNEG (2024), City Layers (2025)

- **Portfolio**: Architecture projects from uploads/arch-projects
  - 6 featured architecture projects
  - Clients: Amazon, Infosys, Trump, Capital, Sumadhura, Allianz
  - Experience: 6+ years across multiple award-winning studios

## UI Consistency Features
- **Responsive Design**: 1024px+ split layout, 768px- stacked layout
- **Interactive Effects**: 
  - Tilt divider on mouse movement
  - Subtle depth shifts per side
  - Button hover states with lift
  - Background image opacity on hover
- **Accessibility**: 
  - Proper color contrast
  - Clear visual hierarchy
  - Touch-friendly button sizing

## Files Modified
- `src/App.jsx`: Updated ModeLanding component with split layout
- `src/App.css`: Complete styling overhaul for dual-aesthetic intro screen
- `src/data.js`: Already contains accurate project and experience data

## Design Tokens Used
- Colors: --c-black, --c-white, --c-parchment, --c-umber, --c-clay, --c-ember, --c-cyan
- Typography: --font-display, --font-body, --font-serif, --font-mono
- Spacing: 48px padding, 40px+ gap units
- Transitions: 0.3s cubic-bezier for smooth interactions

## Next Steps
1. Verify responsive behavior on mobile devices
2. Test accessibility with screen readers
3. Optimize background images for load performance
4. Consider adding scroll indicators for mobile
