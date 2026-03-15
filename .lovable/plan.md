

## Fix: Card cầu nguyện không đồng đều chiều cao

### Vấn đề
Các prayer card trong grid có chiều cao khác nhau vì nội dung (content) dài ngắn khác nhau, khiến layout không đều.

### Giải pháp
Đảm bảo mỗi card chiếm hết chiều cao của hàng bằng cách thêm `h-full` và dùng flex layout để phần nội dung giãn ra, đẩy footer (amen button) xuống đáy.

### Thay đổi

**`src/components/pray/PrayerCard.tsx`**
- Thêm `h-full flex flex-col` vào wrapper div ngoài cùng
- Thêm `flex-1 flex flex-col` vào div `.bg-card` bên trong
- Thêm `flex-1` vào thẻ `<p>` chứa nội dung cầu nguyện để nó chiếm không gian còn lại
- Footer (amen count + button) sẽ tự động nằm ở đáy card

