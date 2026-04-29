---
name: generate_playwright_auth_test
description: Tạo Playwright e2e test cho login và register trong project ecommerce-node-react
---

## Khi nào sử dụng
- Khi test authentication flow (login/register)
- Khi test redirect sau login
- Khi test validation client-side hoặc error từ API

## Tech stack
- Playwright (@playwright/test)
- TypeScript

## URLs
- Frontend: `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Route login: `/login`
- Route register: `/register`

## Cấu trúc file
- `tests/auth/login.spec.ts`
- `tests/auth/register.spec.ts`

---

## Form fields — Login (`/login`)
- `name="email"` — input type email
- `name="password_hash"` — input type password
- Submit button: text "Đăng nhập"

## Form fields — Register (`/register`)
- `name="email"` — input type email
- `name="password_hash"` — input type password (tối thiểu 6 ký tự)
- `name="confirmPassword"` — input type password
- Submit button: text "Đăng ký"
- **Không có trường name/username/phone**

---

## Validation messages (hiển thị inline dưới field)
| Field | Lỗi | Message |
|-------|-----|---------|
| email | rỗng | "Email là bắt buộc" |
| email | sai format | "Email không hợp lệ" |
| password_hash | rỗng | "Mật khẩu là bắt buộc" |
| password_hash | < 6 ký tự | "Mật khẩu tối thiểu 6 ký tự" |
| confirmPassword | rỗng | "Vui lòng xác nhận mật khẩu" |
| confirmPassword | không khớp | "Mật khẩu xác nhận không khớp" |

## API error message
- Hiển thị trong banner đỏ phía trên form (không phải inline)
- Ví dụ: "Email đã được sử dụng", "Email hoặc mật khẩu không đúng"

---

## Test cases — Login

1. **Login thành công** → redirect về `/` hoặc `?redirect=` param nếu có
2. **Sai mật khẩu** → banner đỏ: "Email hoặc mật khẩu không đúng"
3. **Email rỗng** → inline error: "Email là bắt buộc"
4. **Password rỗng** → inline error: "Mật khẩu là bắt buộc"
5. **Email sai format** → inline error: "Email không hợp lệ"
6. **Login → redirect về /cart** khi URL có `?redirect=/cart`
7. **Header sau login** → hiển thị "Xin chào, <email>" và nút "Đăng xuất"

## Test cases — Register

1. **Register thành công** → redirect về `/`
2. **Email đã tồn tại** → banner đỏ: "Email đã được sử dụng"
3. **Email sai format** → inline error: "Email không hợp lệ"
4. **Password < 6 ký tự** → inline error: "Mật khẩu tối thiểu 6 ký tự"
5. **confirmPassword không khớp** → inline error: "Mật khẩu xác nhận không khớp"
6. **Form rỗng** → tất cả các inline error hiển thị đồng thời

---

## Locators chuẩn

```ts
// Login
page.getByLabel('Email')
page.getByLabel('Mật khẩu')
page.getByRole('button', { name: 'Đăng nhập' })

// Register
page.getByLabel('Email')
page.getByLabel('Mật khẩu')
page.getByLabel('Xác nhận mật khẩu')
page.getByRole('button', { name: 'Đăng ký' })

// Error banner API
page.locator('.bg-red-50')

// Inline error
page.getByText('Email là bắt buộc')

// Header sau login
page.getByText(/Xin chào,/)
page.getByRole('button', { name: 'Đăng xuất' })
```

---

## beforeEach
```ts
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/login')
})
```

## Output
- Code TypeScript hoàn chỉnh
- Có thể chạy bằng `npx playwright test tests/auth/`
