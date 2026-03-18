

## Fix: Textarea không hiển thị đủ nội dung khi lời cầu nguyện dài

### Vấn đề
Textarea trong PrayerForm có `rows={4}` và `min-h-[110px]`, không đủ cho lời cầu nguyện dài. Dù có `resize-y` nhưng mặc định vẫn quá nhỏ.

### Giải pháp
- Tăng `rows` từ 4 lên 6
- Tăng `min-h-[110px]` thành `min-h-[180px]`  
- Đảm bảo trong `PrayerFormDialog`, `DialogContent` có đủ `max-h` và `overflow-y-auto` (đã có)

### File thay đổi
- `src/components/pray/PrayerForm.tsx`: Dòng textarea — tăng rows và min-height

