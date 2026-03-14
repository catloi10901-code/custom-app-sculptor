

## Fix: Pause LiveTicker on hover

Add CSS `hover` rule to pause the ticker animation when the user hovers over it.

### Change in `src/index.css`
Add a rule near the existing `@keyframes ticker`:
```css
.ticker-container:hover .ticker-content {
  animation-play-state: paused;
}
```

### Change in `src/components/home/LiveTicker.tsx`
- Add `ticker-container` class to the outer `div`
- Add `ticker-content` class to the inner scrolling `div`

