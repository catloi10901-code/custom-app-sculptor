

# Nâng cấp giao diện các tab Cầu Nguyện

## Thay đổi

### 1. PrayerCard.tsx — Hệ thống màu theo topic

Thêm map màu cho từng topic, mỗi card sẽ có:
- `border-l-4` với màu riêng theo topic (peace=blue, healing=green, prosperity=gold, family=pink, nation=purple, poverty=orange, recovery=cyan)
- Badge topic dùng màu tương ứng thay vì tất cả đều primary/gold
- Avatar border theo màu topic
- Hover border theo màu topic

```text
Topic Color Map:
peace       → blue-400    🕊️
prosperity  → amber-400   ⭐
healing     → emerald-400 💚
family      → pink-400    👨‍👩‍👧
nation      → purple-400  🏛️
poverty     → orange-400  🌿
recovery    → cyan-400    🔄
default     → primary     🙏
```

### 2. PrayerWallTab.tsx — Header gradient + filter pills có emoji

- Header: thêm gradient banner nền nhẹ cho phần tiêu đề (tương tự CampaignsTab)
- Filter pills: thêm emoji icon trước label mỗi topic (🕊️ Peace, ⭐ Prosperity...)
- Active filter pill nổi bật hơn với shadow

### 3. LiveSessionsTab.tsx — Gradient cards phân biệt

- Card LIVE: gradient đỏ nhẹ `from-red-500/10` + border đỏ
- Cards upcoming: gradient xanh/tím nhẹ luân phiên, bỏ `opacity-70`
- Thêm icon nhỏ cho mỗi card (🎵, 🌍, 💊...)

## Files sửa
- `src/components/pray/PrayerCard.tsx`
- `src/components/pray/PrayerWallTab.tsx`
- `src/components/pray/LiveSessionsTab.tsx`

