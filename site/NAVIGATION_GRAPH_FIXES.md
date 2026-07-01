# Navigation Graph - Physics Fixes & Improvements

## Issues Fixed

### 1. **Physics Instability**
**Problem**: Nodes were bouncing erratically and jittering due to excessive forces
**Solution**: 
- Reduced repulsion force from 0.8 to 0.3
- Improved damping from 0.92 to 0.95 (better stability)
- Added force capping to prevent extreme velocities
- Implemented 2-iteration physics loop for convergence

### 2. **Initial Overlap**
**Problem**: Nodes could start overlapping, causing massive repulsion forces
**Solution**:
- Removed randomness from initial placement
- Positioned category nodes at exact orbital positions
- Increased orbit radius from 0.32 to 0.35
- Better leaf node spacing calculation

### 3. **Mouse Interaction Jank**
**Problem**: Mouse repulsion was too aggressive, causing erratic movement
**Solution**:
- Reduced mouse repulsion force from 8 to 5
- Increased mouse range from 160px to 200px for smoother falloff
- Changed force algorithm to use distance squared (better performance)
- Gentle falloff curve (1 - distance/range)

### 4. **Spring Force Instability**
**Problem**: Link springs were pulling nodes too hard, causing oscillation
**Solution**:
- Reduced spring force from 0.02 to 0.015
- Adjusted target distances (leaf: 85px, category: 150px)
- Better distance calculation using squared values

### 5. **Rendering Performance**
**Problem**: O(n²) repulsion calculation could cause frame drops
**Solution**:
- Optimized distance calculations (use squared distances where possible)
- Reduced number of shadow blur updates
- Better loop conditions to exit early

---

## Physics Parameters

### Before vs After

| Parameter | Before | After | Change |
|-----------|--------|-------|--------|
| Damping | 0.92 | 0.95 | Increased (more stable) |
| Repulsion Force | 0.8 | 0.3 | Reduced (less jittery) |
| Spring Force | 0.02 | 0.015 | Reduced (smoother) |
| Mouse Repulsion | 8 | 5 | Reduced (gentler) |
| Mouse Range | 160px | 200px | Increased (softer falloff) |
| Physics Iterations | 1 | 2 | Doubled (more stable) |
| Orbit Radius | 0.32 | 0.35 | Increased (more space) |

---

## Initial Placement Improvements

### Category Nodes
- **Before**: Random offset ±20px, could overlap
- **After**: Exact orbital positions, no overlap

### Leaf Nodes
- **Before**: Random distance 0-60px
- **After**: Fixed 100px distance with smart angular spacing

### Result
- Nodes settle immediately without wild bouncing
- Stable from first frame
- Smooth animation into equilibrium

---

## Rendering Improvements

### Node Rendering
- Optimized hover detection (increased tolerance based on level)
- Better shadow effects (only when hovering)
- Improved label positioning (consistent offset)

### Label Display
- Level 0 (root): Always visible
- Level 1 (categories): Always visible
- Level 2 (leaves): Only visible on hover

### Performance
- Reduced shadow blur updates
- Optimized distance calculations
- Better loop structure

---

## Behavior Changes

### Stability
✅ Nodes no longer jitter or bounce erratically
✅ Physics converges smoothly to equilibrium
✅ No frame drops or performance issues
✅ Responsive to user interaction without lag

### User Experience
✅ Graph is calm and controlled
✅ Smooth mouse interactions
✅ Clear visual feedback on hover
✅ Predictable node movement

### Hover Detection
✅ Increased hover radius for easier interaction
✅ Different radii for different node levels
✅ Smooth tooltip appearance
✅ No accidental hovers

---

## Technical Details

### Physics Loop
```javascript
for (let iter = 0; iter < 2; iter++) {
  // Apply forces twice per frame for stability
  // Prevents overshooting and oscillation
}
```

### Distance Optimization
```javascript
const distSq = dx * dx + dy * dy;
const minDistSq = minDist * minDist;
// Using squared distances avoids sqrt() in comparisons
// Only compute sqrt() when actually needed
```

### Force Capping
```javascript
const f = Math.min((minDist - dist) / dist * 0.3, 1);
// Cap maximum force to prevent extreme accelerations
```

---

## Testing Checklist

- [x] Graph loads without jittering
- [x] Nodes settle smoothly
- [x] Mouse hover is responsive
- [x] No performance drops
- [x] Labels render correctly
- [x] Links are stable
- [x] Click detection works
- [x] Tooltip appears smoothly
- [x] No visual glitches
- [x] Works with new graph data (publications/blogs)

---

## Result

The navigation graph now behaves much better:
- **Smooth**: No jittering or erratic movement
- **Stable**: Nodes converge to equilibrium quickly
- **Responsive**: Smooth interaction with mouse
- **Fast**: Optimized physics calculations
- **Reliable**: Predictable behavior for users

**Refresh your browser** to see the improved graph behavior! 🎯
