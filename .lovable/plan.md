

## Tính năng Tuyển Dụng (Recruitment)

### Tổng quan
Thêm nút "Tuyển Dụng" trên trang About mở form ứng tuyển, lưu dữ liệu vào database, và trang Admin để quản lý đơn ứng tuyển.

### 1. Database
Tạo bảng `job_applications`:
- `id`, `full_name`, `email`, `phone`, `position`, `message` (text), `resume_url` (optional), `status` (pending/reviewed/accepted/rejected), `created_at`
- RLS: anyone can INSERT, admins can SELECT/UPDATE/DELETE

Tạo bảng `job_positions` (optional, để admin quản lý vị trí tuyển dụng):
- `id`, `title`, `description`, `is_active`, `sort_order`, `created_at`
- RLS: anyone can SELECT active, admins can ALL

### 2. Trang About - Nút & Form
- Thêm nút "Tuyển Dụng" (màu xanh như screenshot) vào section cuối trang About, cạnh các nút hiện có
- Click mở Dialog form với các field: Họ tên, Email, SĐT, Vị trí ứng tuyển (dropdown từ `job_positions`), Lời nhắn
- Submit lưu vào `job_applications`

### 3. Admin - Trang quản lý
- **Admin Job Positions** (`/admin/jobs`): CRUD vị trí tuyển dụng (tên, mô tả, active/inactive)
- **Admin Applications** (`/admin/applications`): Xem danh sách đơn ứng tuyển, lọc theo status, đổi trạng thái (pending → reviewed → accepted/rejected)
- Thêm 2 nav items vào AdminLayout sidebar

### 4. Files thay đổi
- **Migration SQL**: Tạo 2 bảng + RLS
- `src/pages/AboutPage.tsx`: Thêm nút + dialog form tuyển dụng
- `src/pages/admin/AdminJobPositions.tsx`: Trang quản lý vị trí tuyển dụng
- `src/pages/admin/AdminApplications.tsx`: Trang quản lý đơn ứng tuyển
- `src/components/admin/AdminLayout.tsx`: Thêm 2 nav items
- `src/App.tsx`: Thêm 2 routes admin
- `src/i18n/locales/vi.json`: Thêm translations

