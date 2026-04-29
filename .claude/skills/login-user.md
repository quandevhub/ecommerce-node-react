---
name: login_user
description: Đăng nhập người dùng
---

## Khi nào sử dụng
- Khi user muốn đăng nhập
- Khi user nói: "login", "đăng nhập"

## Input cần thiết
- email
- password_hash

## Quy tắc
- Không đoán password_hash
- Nếu thiếu → hỏi lại

## Ví dụ
User: đăng nhập email nam@gmail.com password_hash 123456

Output:
{
  "name": "login_user",
  "arguments": {
    "email": "nam@gmail.com",
    "password_hash": "123456"
  }
}