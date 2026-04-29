---
name: apply_playwright_best_practices
description: Best practices Playwright cho project ecommerce-node-react (React 19 + Vite + Redux)
---

## Khi nào sử dụng
- Khi test flaky hoặc không ổn định
- Khi cần review / refactor test hiện có
- Khi viết test mới cần đảm bảo chất lượng

---

## URLs project

- Frontend (Vite): `http://localhost:5173`
- Backend API: `http://localhost:3000/api`
- Cần cả 2 server đang chạy trước khi test

---

## 1. Không dùng waitForTimeout

```ts
// ❌
await page.waitForTimeout(2000)

// ✅ Chờ API response
await page.waitForResponse(r => r.url().includes('/api/products') && r.status() === 200)

// ✅ Chờ element xuất hiện
await expect(page.getByText('San pham noi bat')).toBeVisible()

// ✅ Chờ URL thay đổi sau login
await page.waitForURL('http://localhost:5173/')
```

---

## 2. Locator ưu tiên

```ts
// ✅ Ưu tiên theo thứ tự
page.getByRole('button', { name: 'Đăng nhập' })
page.getByLabel('Email')
page.getByText('Đặt hàng thành công!')
page.getByPlaceholder('example@email.com')
page.locator('[data-testid="cart-item"]')

// ❌ Tránh
page.locator('.div > nth-child(2)')
page.locator('#root > div > main > div:nth-child(3)')
```

---

## 3. Cart state là Redux in-memory

- Cart **reset** khi reload trang — KHÔNG persist
- Mỗi test phải tự thêm sản phẩm vào giỏ, không dựa vào state từ test trước
- Không dùng `localStorage` để seed cart

```ts
// ✅ Setup cart đúng cách
await page.goto('http://localhost:5173/')
await page.waitForResponse(r => r.url().includes('/api/products'))
await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click()
```

---

## 4. Auth — login helper tái sử dụng

```ts
async function loginAs(page: Page, email = 'test@example.com', password = '123456') {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Mật khẩu').fill(password)
    await page.getByRole('button', { name: 'Đăng nhập' }).click()
    await page.waitForURL('http://localhost:5173/')
}
```

---

## 5. Mock API khi cần test error

```ts
// Mock order API lỗi 500
await page.route('**/api/orders', route =>
    route.fulfill({ status: 500, body: JSON.stringify({ error: 'Failed' }) })
)

// Mock không kết nối
await page.route('**/api/orders', route => route.abort('failed'))
```

---

## 6. Screenshot khi fail

```ts
// playwright.config.ts
export default defineConfig({
    use: {
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
    },
    retries: 1,
})
```

---

## 7. Isolate test state

```ts
test.beforeEach(async ({ page }) => {
    // Mỗi test bắt đầu từ trạng thái sạch
    await page.goto('http://localhost:5173/')
})
```

---

## 8. Assertion đúng loại

```ts
// ✅ Kiểm tra URL
await expect(page).toHaveURL('/cart')

// ✅ Kiểm tra text
await expect(page.getByText('Đặt hàng thành công!')).toBeVisible()

// ✅ Kiểm tra disabled
await expect(page.getByRole('button', { name: 'Thanh toán' })).toBeDisabled()

// ✅ Kiểm tra count
await expect(page.getByRole('listitem')).toHaveCount(3)
```

---

## 9. Các text cố định trong project (dùng để assert)

| Tình huống | Text |
|-----------|------|
| Checkout thành công | "Đặt hàng thành công! Cảm ơn bạn đã mua hàng." |
| Checkout đang xử lý | "Đang xử lý..." |
| Đã đăng nhập | /Xin chào,/ |
| Validation email rỗng | "Email là bắt buộc" |
| Validation password ngắn | "Mật khẩu tối thiểu 6 ký tự" |
| Confirm password sai | "Mật khẩu xác nhận không khớp" |

---

## Output
- Refactor code Playwright theo các nguyên tắc trên
- Chỉ thay đổi phần có vấn đề, giữ nguyên logic test
