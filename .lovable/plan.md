

## Plan: Cải thiện Admin Posts — Thêm chọn chuyên mục & cải thiện bố cục

### Vấn đề hiện tại
- Form tạo bài viết trong Admin (`AdminPosts`) **không có trường chọn chuyên mục (category_id)**, nên không thể gán bài vào "Lời Chúa" hay bất kỳ category nào
- Bài viết tạo ra sẽ có `category_id = null`, không hiển thị đúng trên trang Word
- Thiếu trường cover_image và tags
- Không có chức năng chỉnh sửa bài viết (chỉ tạo mới, publish/unpublish, xóa)

### Thay đổi

**1. Cải thiện `AdminPosts.tsx`**
- Fetch `blog_categories` khi mount để hiển thị dropdown chọn chuyên mục
- Thêm các trường vào form: `category_id` (dropdown), `cover_image` (URL input), `tags` (text input)
- Thêm chức năng **Edit** bài viết (click vào bài → fill form với dữ liệu cũ → save = update)
- Hiển thị tên chuyên mục trong bảng danh sách bài viết
- Cải thiện bố cục bảng: thêm cột Category, cột Date

**2. Không cần thay đổi database** — bảng `blog_posts` đã có đầy đủ các cột `category_id`, `cover_image`, `tags`

### Chi tiết kỹ thuật
- Fetch categories: `supabase.from('blog_categories').select('*').order('sort_order')`
- Insert/Update bài viết kèm `category_id` từ dropdown
- Edit mode: state `editingId` — khi có giá trị thì form submit gọi `update` thay vì `insert`
- Hiển thị category name bằng cách join với danh sách categories đã fetch

