---
name: generate_auth_ui
description: Tạo UI login và register bằng React + TypeScript
---

## Khi nào dùng
- Khi chưa có UI auth

## Yêu cầu
Tạo:
- pages/LoginPage.tsx
- pages/RegisterPage.tsx

## Form fields
Login:
- email
- password

Register:
- name
- email
- password

## Validation
- Email đúng format
- Password >= 6 ký tự
- Name không rỗng

## UX
- Hiển thị error dưới input
- Disable button khi loading
- Submit bằng Enter

## Edge cases
- Double submit
- Input rỗng
- Email sai format

## Output
- Code TSX hoàn chỉnh
- Dùng useState hoặc react-hook-form (ưu tiên react-hook-form)