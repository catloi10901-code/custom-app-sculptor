

## Fix: Dropdown khó nhìn trên PrayerForm

### Vấn đề
Các native `<select>` trong PrayerForm (chọn quốc gia và chủ đề) có nền xám mặc định của trình duyệt khi mở dropdown, khiến text với emoji khó đọc.

### Giải pháp
Thay thế native `<select>` bằng Radix `Select` component (đã có sẵn trong `src/components/ui/select.tsx`) để có toàn quyền kiểm soát style dropdown. Dropdown sẽ có nền tối (`bg-card`), text sáng, và highlight vàng gold khi hover — đồng nhất với theme hiện tại.

### Thay đổi
**`src/components/pray/PrayerForm.tsx`**
- Import `Select, SelectTrigger, SelectContent, SelectItem, SelectValue` từ `@/components/ui/select`
- Thay `<select>` quốc gia → `<Select>` component với các `<SelectItem>` kèm emoji cờ
- Thay `<select>` chủ đề → `<Select>` component với các `<SelectItem>` kèm emoji theo topic
- Style trigger: `bg-black/20 border-border text-foreground` (giống input hiện tại)

**`src/components/ui/select.tsx`**
- Cập nhật `SelectContent` className: thêm `bg-card border-border` để nền tối đồng nhất
- Cập nhật `SelectItem` className: thêm `text-foreground` và hover state `focus:bg-gold-dim focus:text-primary`

