

# Kế hoạch hoàn thiện Admin Panel

## Phân tích hiện trạng

### Đã có trong Admin:
1. **Dashboard** — tổng quan số liệu
2. **Live Stats** — quản lý số liệu prayers/members/donations
3. **Posts** — quản lý bài viết blog (tạo/xóa/publish)
4. **Prayers** — duyệt/ẩn/xóa lời cầu nguyện
5. **Users** — quản lý người dùng, phân quyền
6. **Campaigns** — quản lý chiến dịch cầu nguyện
7. **Settings** — cài đặt cơ bản (chưa hoạt động thực tế)

### Thiếu — nội dung hardcode chưa quản lý được:

| Phần trên web | Vấn đề | Cần làm |
|---|---|---|
| **Hero Section** | Text, badge, CTA từ i18n — không sửa được từ admin | Tạo bảng `site_content` key-value để quản lý |
| **Live Cards** (LIVE section) | 3 card hardcode (title, host, time) | Tạo bảng `live_sessions` để quản lý từ admin |
| **Testimonials** | 3 testimonial hardcode trong i18n | Tạo bảng `testimonials` |
| **Impact Stats** | 4 số liệu hardcode ("2.4M+", "$847K"...) | Tạo bảng `impact_stats` |
| **About Page** | Team members + values hardcode | Tạo bảng `team_members` |
| **Footer** | Social links hardcode (#) | Quản lý trong `site_content` |
| **Live Ticker** | 8 items hardcode | Có thể lấy từ DB prayers gần nhất |
| **Blog Posts** | Không upload ảnh bìa, không edit bài | Bổ sung upload ảnh + form edit |
| **Newsletter** | Có bảng subscribers nhưng admin chưa xem được | Thêm trang admin xem subscribers |
| **Impact Articles** | Có bảng nhưng chưa có trang admin | Thêm trang admin quản lý |

---

## Kế hoạch triển khai — chia thành 4 giai đoạn

### Giai đoạn 1: Quản lý nội dung trang chủ

**Database mới:**

- **`site_content`** — bảng key-value lưu text/link/ảnh có thể sửa từ admin (hero title, hero subtitle, social links, footer text...)
- **`live_sessions`** — quản lý các card Live (title, host, time, youtube_url, is_live, sort_order)
- **`testimonials`** — quản lý lời chứng (quote, name, org, avatar_url, sort_order, is_active)

**Admin pages mới:**
- **Admin Site Content** — form chỉnh sửa các text/link chính trên web (hero, footer social links)
- **Admin Live Sessions** — CRUD card live (gán link YouTube, đánh dấu live/upcoming)
- **Admin Testimonials** — CRUD testimonials

### Giai đoạn 2: Quản lý Impact & About

**Database mới:**
- **`team_members`** — tên, role, avatar_url, sort_order, is_active

**Admin pages mới:**
- **Admin Impact Articles** — CRUD bài viết impact (đã có bảng, chỉ cần UI)
- **Admin Team** — quản lý thành viên trang About

**Cải thiện:**
- Impact Stats section đọc từ `site_content` thay vì hardcode

### Giai đoạn 3: Cải thiện Posts & Media

- **Upload ảnh bìa** cho blog posts (dùng storage bucket `uploads`)
- **Edit bài viết** (hiện chỉ tạo mới, không sửa được)
- **Rich text editor** cơ bản (bold, italic, heading, link)
- **Admin Newsletter** — xem danh sách subscribers, export

### Giai đoạn 4: Cải thiện Settings & tiện ích

- **Settings thực tế** — lưu site name, contact email, social links vào `site_content`
- **Admin sidebar** thêm các mục mới: Site Content, Live Sessions, Testimonials, Team, Newsletter, Impact Articles

---

## Cấu trúc Admin sidebar sau khi hoàn thiện

```text
├── Dashboard          (tổng quan)
├── Live Stats         (số liệu realtime)
├── Site Content       (hero, footer, social links) ← MỚI
├── Live Sessions      (quản lý card LIVE + YouTube) ← MỚI  
├── Posts              (bài viết blog + upload ảnh)
├── Impact Articles    (bài viết impact) ← MỚI
├── Prayers            (duyệt lời cầu nguyện)
├── Campaigns          (chiến dịch)
├── Testimonials       (lời chứng) ← MỚI
├── Team               (thành viên About) ← MỚI
├── Users              (quản lý người dùng)
├── Newsletter         (subscribers) ← MỚI
└── Settings           (cài đặt chung)
```

---

## Đề xuất thứ tự ưu tiên

Nên bắt đầu với **Giai đoạn 1** (Live Sessions + Testimonials + Site Content) vì đây là những phần hardcode rõ ràng nhất và ảnh hưởng trực tiếp đến trang chủ. Mỗi giai đoạn sẽ triển khai trong 1-2 lượt chat.

