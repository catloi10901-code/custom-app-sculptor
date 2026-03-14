

# Thêm 200 Lời Chúa (Bible Verses) vào trang Word

## Cách tiếp cận

Tạo một edge function `seed-bible-verses` chứa 200 câu Kinh Thánh nổi tiếng, insert vào bảng `blog_posts` dưới dạng bài viết ngắn.

## Các bước

### 1. Thêm blog category "Lời Chúa"
- Insert một category mới: `name: "Lời Chúa"`, `slug: "loi-chua"`, `icon: "✝️"`

### 2. Tạo edge function `seed-bible-verses`
- Chứa mảng 200 câu Kinh Thánh phổ biến (Giăng 3:16, Thi Thiên 23, Châm Ngôn, Rô-ma, v.v.)
- Mỗi câu sẽ insert vào `blog_posts` với:
  - `title`: Tên sách + chương:câu (VD: "Giăng 3:16")
  - `content`: Nội dung câu Kinh Thánh
  - `excerpt`: Nội dung rút gọn
  - `slug`: auto-generated từ title
  - `status`: `published`
  - `category_id`: ID của category "Lời Chúa"
  - `published_at`: ngẫu nhiên trong 6 tháng qua (để phân bổ đều)
  - `tags`: theo chủ đề (hy vọng, tình yêu, đức tin, bình an...)

### 3. Gọi edge function để seed data
- Chia thành batches (mỗi lần insert 50 câu) để tránh timeout
- 200 câu Kinh Thánh bằng tiếng Việt, bao gồm các sách:
  - Thi Thiên, Châm Ngôn, Ê-sai, Giê-rê-mi
  - Ma-thi-ơ, Giăng, Rô-ma, Phi-líp, Hê-bơ-rơ
  - Khải Huyền, Sáng Thế Ký, v.v.

## Files
- Tạo: `supabase/functions/seed-bible-verses/index.ts`
- Insert data vào: `blog_categories`, `blog_posts`

