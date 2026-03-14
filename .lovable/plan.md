

# Thêm logo đối tác vào Footer

## Thay đổi

### 1. Copy 3 file logo vào `src/assets/`
- `7center_Copy.png` → `src/assets/logos/7center.png`
- `9slogo_123.png` → `src/assets/logos/9slogo.png`
- `logo_GIFPP_am_ban.png` → `src/assets/logos/gifpp.png`

### 2. Footer.tsx — Thêm hàng logo bên dưới social icons

Sau phần social icons (dòng 59-65), thêm một row hiển thị 3 logo với:
- `flex items-center gap-6 mt-5`
- Mỗi logo cao khoảng 28-32px, `opacity-70 hover:opacity-100` transition
- Import các logo từ `@/assets/logos/`

