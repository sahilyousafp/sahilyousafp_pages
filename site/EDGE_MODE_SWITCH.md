# Edge-Based Mode Switching

## Feature Overview
When in **Code Mode** or **Architecture Mode**, drag your mouse to any edge of the screen to reveal a mode-switching button.

---

## How It Works

### Detection Zone
- **Threshold**: 50px from any screen edge
- **Active Edges**: Top, Right, Bottom, Left
- **Activation**: Automatic when mouse enters edge zone

### Visual Indicators
Each edge displays:
- Directional arrow (↑ ↓ ← →)
- Mode label ("TO ARCHITECTURE" or "TO CODE")
- Gradient background matching current mode
- Smooth fade-in/out animation (0.3s)

---

## CODE MODE Edge Switch
**Colors**: Ember Orange (#FF3300) + Cyan accents
- **Background Gradient**: Orange (#FF3300) at edge, fading away
- **Border Color**: Orange with transparency
- **Text Color**: White
- **Hover Effect**: Increased opacity, glowing box-shadow

**Example**:
```
[↓ TO ARCHITECTURE]  ← appears at top edge
```

---

## ARCHITECTURE MODE Edge Switch
**Colors**: Clay (#C75B3A) + Umber accents  
- **Background Gradient**: Clay (#C75B3A) at edge, fading away
- **Border Color**: Clay with transparency
- **Text Color**: Umber brown (#3D2B1F)
- **Hover Effect**: Increased opacity, warm glow

**Example**:
```
[← TO CODE]  ← appears at left edge
```

---

## Edge Positions

| Edge | Position | Icon | Display |
|------|----------|------|---------|
| **Top** | 0-60px from top | ↓ | Horizontal, full width |
| **Right** | 0-60px from right | ← | Vertical, full height |
| **Bottom** | 0-60px from bottom | ↑ | Horizontal, full width |
| **Left** | 0-60px from left | → | Vertical, full height |

---

## Interaction Behavior

### Appearance
1. Mouse enters 50px threshold from any edge
2. Button fades in with 0.3s animation
3. Text and icon scale based on mode

### Click / Interaction
- **Click**: Switches to opposite mode (code ↔ architecture)
- **Hover**: Background brightens, box-shadow appears
- **Leave**: Button fades out after 200ms delay

### Mobile
- Feature disabled on touch devices (pointer:coarse)
- Mobile users see default browser behavior

---

## Technical Implementation

### Component
**File**: `src/components/EdgeModeSwitch.jsx`

**Props**:
- `mode` (string): Current mode ('code' or 'arch')
- `onSwitch` (function): Callback to switch modes

**Features**:
- Real-time mouse position tracking
- GSAP animations for smooth transitions
- Automatic cleanup on component unmount
- Timeout handling for smooth hide/show

### Styling
**File**: `src/components/EdgeModeSwitch.css`

**Key Classes**:
- `.edge-switch`: Base container (fixed positioning, z-index: 8000)
- `.edge-switch-top/right/bottom/left`: Edge-specific positioning
- `.edge-switch-code`: Code mode colors (orange/cyan)
- `.edge-switch-arch`: Architecture mode colors (clay/umber)
- `.edge-label`: Text and icon styling
- `.edge-icon`: Directional arrows

---

## Performance Optimizations

✅ **Mouse event listeners**: Added at window level for efficiency
✅ **GSAP animations**: Smooth opacity transitions (0.3s)
✅ **Timeout delays**: 200ms hide delay prevents flickering
✅ **Mobile detection**: Disabled on touch devices to prevent false triggers
✅ **Z-index management**: 8000 (above content, below cursors at 9999)

---

## UX Considerations

1. **Discovery**: Non-intrusive until user approaches edges
2. **Visual Feedback**: Color-coded to match current mode
3. **Accessibility**: Clear directional icons and mode labels
4. **Performance**: Minimal overhead, no impact on scrolling
5. **Mobile**: Gracefully disabled on touch devices

---

## Future Enhancements

Potential improvements:
- Add haptic feedback on mobile (if enabled)
- Keyboard shortcut alternative (e.g., 'T' to toggle)
- Edge threshold customization
- Animation speed preferences
- Accessibility: ARIA labels and keyboard navigation

---

## Testing Checklist

- [x] Code Mode: Edge buttons appear with orange gradient
- [x] Architecture Mode: Edge buttons appear with clay gradient
- [x] All 4 edges: Top, Right, Bottom, Left functional
- [x] Click to switch: Mode changes, cursor updates
- [x] Hover effect: Background brightens, glow appears
- [x] Mouse leave: Button fades out smoothly
- [x] Mobile: Buttons hidden on touch devices
- [x] Performance: No lag during rapid edge movements
- [x] Z-index: Positioned correctly below cursors
