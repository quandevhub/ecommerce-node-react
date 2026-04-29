# 🔐 Auth Flow Prompts (React + TSX + Redux + Axios)

## 📌 Mục tiêu
Tạo full authentication flow:
- Login
- Register
- Redux state
- API integration
- Header UI

---

## 🧩 Step-by-step (chuẩn khi làm task)

### 1. Tạo UI

Prompt:Tạo LoginPage và RegisterPage bằng React TypeScript có validation đầy đủ

---

### 2. Tạo API

Prompt:Kết nối login/register với API bằng axios và xử lý error đầy đủ

---

### 3. Tạo Redux

Prompt:Tạo auth slice bằng Redux Toolkit với createAsyncThunk cho login/register

---

### 4. Tạo Header

Prompt:Tích hợp trạng thái login vào header và hiển thị user/logout

---

## 🔥 One-shot prompt (dùng khi cần nhanh)
Prompt:
Tạo full authentication flow cho React + TypeScript ecommerce app dùng Redux Toolkit và Axios, bao gồm:
- Login/Register UI (TSX)
- Validation
- Axios API service
- Redux slice (createAsyncThunk)
- Header hiển thị login/register/user
- Xử lý loading, error, edge cases

---

## ⚠️ Lưu ý
- Luôn validate form
- Không gọi API trực tiếp trong component (dùng service)
- Handle loading + error