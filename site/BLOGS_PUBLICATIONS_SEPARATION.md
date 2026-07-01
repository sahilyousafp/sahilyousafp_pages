# Blogs & Publications — Separated Structure

## Overview
Successfully separated Blogs and Publications into two distinct sections in Code Mode with dedicated UI, navigation, and styling.

---

## Changes Made

### 1. Data Structure (src/data.js)

#### New Exports
```javascript
export const publications = [
  {
    t: 'Building Analysis Tool: Designing for the Visually Impaired',
    c: 'Enhancing Accessibility in Healthcare Architecture',
    d: 'Jul 2025',
    conf: 'ANNSIM 2025',
    u: '/sahilyousafp_pages/project-bat.html',
    desc: 'Peer-reviewed publication by the Society for Modelling & Simulation International...'
  }
];

export const blogs = [
  // 9 IAAC blog posts
];
```

#### Updated GraphData
Separated research node into:
- `publications` → Links to #code-publications
- `blogs` → Links to #code-blogs

---

### 2. Navigation (CodeMode.jsx)

#### Updated Navigation Buttons
```
WORK → PUBLICATIONS → BLOGS → EXPERIENCE → CONTACT
```

#### Section IDs
- `#code-publications` — Publications section
- `#code-blogs` — Blogs section

---

### 3. UI Components

#### PUBLICATIONS Section
- **Display**: Card-based grid layout
- **Elements per card**:
  - Conference tag (e.g., "ANNSIM 2025")
  - Publication date
  - Title (h3)
  - Subtitle (category)
  - Description text
  - "Read the paper" link with icon
- **Styling**: Dark panel with orange hover effect
- **Interaction**: Click to open publication

#### BLOGS Section
- **Display**: List-based grid layout (similar to experience)
- **Elements per row**:
  - Date (left)
  - Title (center)
  - Category (right)
- **Styling**: Dark rows with separator lines
- **Interaction**: Click to open blog post in new tab

---

### 4. CSS Styling (CodeMode.css)

#### New Classes
```css
/* Publications */
.publications-list{}
.publication-card{}
.pub-header{}
.pub-conference{}
.pub-date{}
.pub-subtitle{}
.pub-desc{}
.pub-footer{}
.read-more{}

/* Blogs */
.blogs-list{}
.blog-row{}
.blog-date{}
.blog-title{}
.blog-cat{}
```

#### Responsive Design
- Mobile: Stack all publications and blogs vertically
- Tablet+: Publications cards full width, blogs in rows
- Blog rows: Responsive grid (desktop: 3 columns, mobile: 1 column)

---

### 5. Section Numbering

New section structure in Code Mode:

| # | Section | ID |
|---|---------|-----|
| 01 | WORK | code-work |
| 02 | **PUBLICATIONS** | code-publications |
| 03 | **BLOGS** | code-blogs |
| 04 | EXPERIENCE | code-exp |
| 05 | TOOLING | code-skills |
| 06 | LET'S BUILD | code-contact |

---

## Content Organization

### Publications (1 item)
- Building Analysis Tool (B.A.T.)
  - Conference: ANNSIM 2025
  - Published: Jul 2025
  - Type: Peer-reviewed research
  - Focus: AI accessibility in healthcare architecture

### Blogs (9 items)
1. Large-Scale 3D Printing with Bio-Material (Feb 2026)
2. Interactive Block-Based Structural Generation (Jul 2025)
3. Grounded — Structural Generation Tool (Jun 2025)
4. Agrowealth: Does Agriculture Correlate to Economy? (Apr 2025)
5. Reinforcement Learning for Grid-Based Carving (Apr 2025)
6. B.A.T. Interface — Designing for the Visually Impaired (Dec 2024)
7. Building Analysis Tool — Healthcare Architecture (Dec 2024)
8. Intelligent Prototyping: Microcontrollers & Fabrication (Dec 2024)
9. AI-Driven Inclusive Design: Topology & NLP (Dec 2024)

---

## Visual Distinctions

### Publications
- **Color Accent**: Orange (#FF3300) for conference tags
- **Style**: Card layout with distinct borders
- **Emphasis**: Large title, full description
- **Call-to-action**: "Read the paper" link
- **Hover Effect**: Orange border, subtle background change

### Blogs
- **Color Accent**: Cyan (#00F0FF) for categories
- **Style**: Row-based list with separators
- **Emphasis**: Compact, scannable format
- **Metadata**: Date, title, category
- **Hover Effect**: Background panel color change

---

## Navigation Flow

### Direct Navigation
- Click "PUBLICATIONS" button → Scroll to publications section
- Click "BLOGS" button → Scroll to blogs section

### Graph Navigation
- Click publication node → Opens publication
- Click blog node → Opens blog in new tab

### Internal Links
- From projects: Can link to specific publications
- From experience: Can reference related blog posts

---

## Technical Details

### Import Updates
```javascript
import { codeProjects, publications, blogs, codeExp } from '../data';
```

### Backward Compatibility
```javascript
export const posts = blogs; // For any legacy references
```

### Links
- Publications: Use `/sahilyousafp_pages/project-*.html` paths
- Blogs: Use IAAC blog URLs (external)
- All links tested and verified

---

## Benefits

✅ **Better Organization**: Clear distinction between peer-reviewed and blog content
✅ **Improved Credibility**: Separate section highlights peer-reviewed research
✅ **Enhanced Navigation**: Dedicated buttons for each content type
✅ **Visual Clarity**: Different layouts emphasize different content types
✅ **SEO Friendly**: Proper semantic structure with dedicated sections
✅ **Mobile Friendly**: Responsive design for all screen sizes

---

## Testing Checklist

- [x] Publications section displays correctly
- [x] Blogs section displays correctly
- [x] Navigation buttons work
- [x] Links open correctly
- [x] Hover effects functional
- [x] Mobile responsive
- [x] Section numbering updated
- [x] Graph data updated
- [x] CSS styling complete
- [x] No layout conflicts

---

## Result

Users can now easily:
1. Navigate to publications via "PUBLICATIONS" button
2. View peer-reviewed research in dedicated card layout
3. Navigate to blogs via "BLOGS" button
4. Browse IAAC blog posts in clean list format
5. Understand the distinction between formal and informal writing
6. Access all content with improved visual hierarchy
