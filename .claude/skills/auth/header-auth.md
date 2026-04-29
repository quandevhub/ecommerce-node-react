---
name: integrate_auth_header
description: Tích hợp login/register vào header
---

## Khi nào dùng
- Khi cần hiển thị auth UI trên header

## Yêu cầu
Update:
- components/Header.tsx

## Logic
Nếu chưa login:
- Hiển thị:
  - Login
  - Register

Nếu đã login:
- Hiển thị:
  - user.name
  - Logout button

## Behavior
- Logout → dispatch logout
- Redirect về home

## Edge cases
- Token hết hạn
- Reload page vẫn giữ login

## Output
- Header component TSX
- Kết nối Redux