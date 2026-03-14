

# Nâng cấp Bản Đồ Cầu Nguyện — Global Prayer Heatmap

## Tổng quan

Giữ globe hiện tại, thêm bên dưới:
1. **Heatmap cards** theo 6 khu vực (Asia, Middle East, Africa, Europe, South America, North America) — hiển thị số prayers theo region
2. **Scrolling country ticker** — tên các quốc gia chạy ngang liên tục (marquee)
3. Cập nhật subtitle hiển thị số quốc gia đang hiệp cầu (realtime)

## Thay đổi chi tiết

### `src/components/home/WorldMapSection.tsx`

**1. Phân loại quốc gia theo khu vực (continent mapping)**

Thêm `COUNTRY_REGION` map gán mỗi quốc gia vào 1 trong 6 region: Asia, Middle East, Africa, Europe, South America, North America. Tính `countByRegion` từ data prayers.

**2. Region Heatmap Cards (6 cards, grid 3x2)**

Bên dưới globe, thêm grid 6 cards với style dark glass:
- Background: `bg-[rgba(10,22,40,0.8)]` + `border border-white/10` + `rounded-xl`
- Mỗi card hiển thị: Tên region + `{count} prayers today`
- Card cuối (North America) có thể hiện "rooms active" thay vì prayers

**3. Scrolling Country Ticker (marquee)**

Bên dưới heatmap cards, thêm một dải chạy ngang hiển thị tất cả tên quốc gia có prayers. Dùng CSS animation `marquee` (translateX 0 → -50%) trên một dải duplicate để loop mượt. Style: text nhỏ, opacity nhẹ, khoảng cách đều.

**4. Subtitle động**

Thay subtitle tĩnh bằng: `Cập nhật theo thời gian thực • {N} quốc gia đang hiệp cầu` — N lấy từ số quốc gia unique trong data.

## Files sửa
- `src/components/home/WorldMapSection.tsx` — thêm region cards + ticker + subtitle động

