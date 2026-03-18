

## Audit: All Links and Their Status

### Current Issues Found

**Footer — "Tác Động Toàn Cầu" column:**
| Link | Current | Should be |
|------|---------|-----------|
| Lời Chúa | `href="#"` (broken) | `/word` |
| Chiến Dịch | `/pray?tab=campaigns` | OK |
| Lịch Cầu Nguyện | `href="#"` (broken) | `/pray?tab=calendar` |

**Footer — "Tổ Chức" column:**
| Link | Current | Should be |
|------|---------|-----------|
| Giới Thiệu | `href="#"` (broken) | `/about` |
| Báo Cáo Tác Động | `href="#"` (broken) | `/impact` |
| Đối Tác | `href="#"` (broken) | no dedicated page — link to `/about` or remove |
| Tuyển Dụng | `href="#"` (broken) | no dedicated page — link to `/about` or remove |
| Tin Tức | `href="#"` (broken) | `/word` |

**Footer — "Pháp Lý" column:**
| Link | Current | Should be |
|------|---------|-----------|
| All 5 items | `href="#"` (broken) | No dedicated pages exist — keep as `#` or create placeholder pages |

**Other components:**
| Component | Link | Issue |
|-----------|------|-------|
| GiveCTASection | `/give` | Route is **commented out** in App.tsx |
| AboutPage "Dâng Hiến" button | `/give` | Route is **commented out** |
| Navbar | All OK | All routes exist |
| HeroSection | CTA1 → popup, CTA2 → `/about` | OK |
| QuickPraySection | Cards → popup, link → `/pray` | OK |
| LiveWidgetSection | `/pray?tab=live` | OK |

### Plan

1. **Fix Footer links** — Replace all `href="#"` with correct `<Link to="...">` for pages that exist:
   - Lời Chúa → `/word`
   - Lịch Cầu Nguyện → `/pray?tab=calendar`
   - Giới Thiệu → `/about`
   - Báo Cáo Tác Động → `/impact`
   - Tin Tức → `/word`
   - Đối Tác, Tuyển Dụng → `/about` (anchor to relevant section)
   - Liên Hệ → `/about`

2. **Fix Footer "Pháp Lý" column** — Keep as `href="#"` since no legal pages exist (unless you want placeholder pages created).

3. **Fix GiveCTASection & AboutPage** — Either uncomment the `/give` route or change the give buttons to link to a different page / open a dialog.

### Technical Details
- Convert `<a href="#">` to `<Link to="/...">` using react-router-dom for internal navigation
- Refactor the footer columns from `.map()` loops to individual `<Link>` elements so each link can have its own destination
- No database changes needed

