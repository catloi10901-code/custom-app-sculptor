

## Tăng độ đậm màu xanh toàn trang

Hiện tại các màu xanh có saturation 62-68% và lightness 33-46%. Để tăng độ đậm (sâu hơn, bão hòa hơn), cần tăng saturation và giảm nhẹ lightness.

### Changes in `src/index.css`

Update all blue HSL variables:

| Variable | Current | New |
|---|---|---|
| `--blue-deep` | `221 68% 33%` | `221 82% 28%` |
| `--blue-mid` | `221 62% 38%` | `221 78% 32%` |
| `--blue-light` | `221 68% 46%` | `221 80% 40%` |
| `--background` | `221 68% 33%` | `221 82% 28%` |
| `--card` | `221 62% 38%` | `221 78% 32%` |
| `--popover` | `221 62% 38%` | `221 78% 32%` |
| `--primary-foreground` | `221 68% 33%` | `221 82% 28%` |
| `--secondary` | `221 68% 46%` | `221 80% 40%` |
| `--muted` | `221 62% 38%` | `221 78% 32%` |
| `--muted-foreground` | `216 52% 80%` | `216 60% 78%` |
| `--accent-foreground` | `221 68% 33%` | `221 82% 28%` |
| `--sidebar-background` | `221 68% 33%` | `221 82% 28%` |
| `--sidebar-primary-foreground` | `221 68% 33%` | `221 82% 28%` |
| `--sidebar-accent` | `221 62% 38%` | `221 78% 32%` |

Also update the scrollbar track and HeroSection inline background colors to match.

### Changes in `src/components/home/HeroSection.tsx`

Update the inline `background: '#162c50'` to a deeper blue matching the new variables (~`#0f2347`), and adjust the gradient hex values accordingly.

