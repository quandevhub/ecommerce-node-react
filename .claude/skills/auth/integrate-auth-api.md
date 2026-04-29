---
name: integrate_auth_api
description: Kết nối auth UI với API bằng Axios
---

## Khi nào dùng
- Khi đã có UI nhưng chưa connect API

## API endpoints
POST /api/auth/register
POST /api/auth/login

## Yêu cầu
Tạo file:
- services/authService.ts

## Nội dung
- Dùng axios instance
- Base URL config
- Timeout

## Logic
- login(data)
- register(data)

## Response
- Lưu token từ response

## Error handling
- response.data.message
- fallback message

## Edge cases
- Network error
- Timeout
- API không trả message

## Output
- Code TypeScript
- Typed response