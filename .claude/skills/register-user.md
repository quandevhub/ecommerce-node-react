---
name: register_user
description: Đăng ký tài khoản người dùng mới
---

## Khi nào sử dụng
- Khi user muốn tạo tài khoản
- Khi user nói: "đăng ký", "sign up", "tạo tài khoản"

## Input cần thiết
- email (string)
- password_hash (string)

## Quy tắc
- Không tự tạo dữ liệu
- Nếu thiếu → hỏi user

## Ví dụ
User: đăng ký tài khoản với email test@gmail.com mật khẩu 123456

Output:
{
  "name": "register_user",
  "arguments": {
    "email": "test@gmail.com",
    "password_hash": "123456",
  }
}