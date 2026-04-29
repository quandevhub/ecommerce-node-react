---
name: setup_auth_redux
description: Tạo Redux Toolkit slice cho authentication
---

## Khi nào dùng
- Khi cần global auth state

## Yêu cầu
Tạo:
- store/authSlice.ts

## State
- user
- token
- loading
- error
- isAuthenticated

## Actions
- login (createAsyncThunk)
- register (createAsyncThunk)
- logout

## Logic
- Lưu token vào localStorage
- Load token khi init

## Extra reducers
- pending → loading true
- fulfilled → save user + token
- rejected → save error

## Edge cases
- Token invalid
- API fail
- Logout clear state

## Output
- Full slice TypeScript
- Typed dispatch + state