

## Plan: Thêm trang Admin quản lý Chuyên Mục (Blog Categories)

### Vấn đề
- Hiện tại không có trang admin nào để quản lý các chuyên mục blog (thêm, sửa, xóa, đổi tên, đổi icon)
- Các chuyên mục như Đức Tin, Cầu Nguyện, Gia Đình, Truyền Giáo, Lời Chúa, Chứng Đạo, Thanh Niên, Âm Nhạc trong ảnh cần được quản lý động từ admin
- Bảng `blog_categories` đã tồn tại với đầy đủ cột: `name`, `slug`, `icon`, `description`, `sort_order`

### Thay đổi

**1. Tạo `src/pages/admin/AdminCategories.tsx`**
- CRUD đầy đủ cho blog_categories
- Form: name, slug (tự động từ name), icon (emoji picker hoặc text input), description, sort_order
- Bảng hiển thị: Icon + Tên, Slug, Thứ tự, Thao tác (Sửa / Xóa)
- Chức năng edit inline hoặc form toggle giống AdminPosts

**2. Thêm route trong `App.tsx`**
- `/admin/categories` → `AdminCategories`

**3. Thêm menu trong `AdminLayout.tsx`**
- Thêm mục "Chuyên mục" vào sidebar admin với icon `Tag` hoặc `FolderOpen`

### Không cần thay đổi database
Bảng `blog_categories` và RLS policies đã có sẵn.

