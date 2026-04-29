---
name: generate_playwright_checkout_test
description: Tạo Playwright test cho checkout flow trong project ecommerce-node-react
---

## Khi nào sử dụng
- Khi test flow thanh toán đơn hàng
- Khi test auth guard trước khi thanh toán
- Khi test success/error message sau thanh toán

## URLs
- Trang giỏ hàng + checkout: `http://localhost:5173/cart`
- Trang login (redirect): `http://localhost:5173/login?redirect=/cart`
- Backend order API: `POST http://localhost:3000/api/orders`

## Cấu trúc file
- `tests/checkout/checkout.spec.ts`

---

## Quan trọng — Checkout trong project này

- **Không có trang checkout riêng** — thanh toán xảy ra ngay trên trang `/cart`
- **Không có form** nhập địa chỉ / tên / payment method
- Payload gửi lên: `{ user_id, products: [{ product_id, quantity, price }] }`
- `user_id` lấy từ JWT token trong Redux auth state

---

## UI elements

| Element | Mô tả |
|---------|-------|
| Button "Thanh toán" | Nút submit, disabled khi giỏ rỗng hoặc đang xử lý |
| Button "Đang xử lý..." | Trạng thái loading (disabled) |
| Banner xanh lá | Thành công: "Đặt hàng thành công! Cảm ơn bạn đã mua hàng." |
| Banner đỏ | Lỗi: message từ API hoặc "Đặt hàng thất bại, vui lòng thử lại" |

---

## Test cases

1. **Chưa login → click Thanh toán → redirect login**
   - URL đổi thành `/login?redirect=/cart`
   - Sau khi login → tự redirect về `/cart`
   - Thanh toán thành công

2. **Đã login, giỏ hàng có sản phẩm → thanh toán thành công**
   - Banner xanh hiển thị: "Đặt hàng thành công! Cảm ơn bạn đã mua hàng."
   - Giỏ hàng bị xóa (tổng số lượng = 0)

3. **API lỗi → hiển thị error message**
   - Mock `POST /api/orders` trả về 500
   - Banner đỏ hiển thị message lỗi

4. **Giỏ rỗng → button Thanh toán bị disabled**
   - Không thể click khi `cartItems.length === 0`

5. **Double-click Thanh toán**
   - Button disabled khi đang loading ("Đang xử lý...")
   - Chỉ tạo 1 order duy nhất

6. **Không kết nối mạng → hiển thị lỗi mạng**
   - Mock offline
   - Banner đỏ: "Không thể kết nối đến máy chủ. Kiểm tra kết nối mạng"

---

## Locators chuẩn

```ts
// Nút thanh toán
page.getByRole('button', { name: 'Thanh toán' })
page.getByRole('button', { name: 'Đang xử lý...' }) // khi loading

// Success message
page.getByText('Đặt hàng thành công! Cảm ơn bạn đã mua hàng.')

// Error banner
page.locator('.bg-red-50')

// Tổng số lượng sau thanh toán (phải = 0)
page.getByText('Tong so luong: 0')
```

---

## Mock API order (khi test lỗi)

```ts
await page.route('**/api/orders', route => {
    route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({ error: 'Failed to create order' }),
    })
})
```

---

## Helper: login trước khi test

```ts
async function loginAs(page: Page, email: string, password: string) {
    await page.goto('http://localhost:5173/login')
    await page.getByLabel('Email').fill(email)
    await page.getByLabel('Mật khẩu').fill(password)
    await page.getByRole('button', { name: 'Đăng nhập' }).click()
    await page.waitForURL('http://localhost:5173/')
}
```

---

## beforeEach

```ts
test.beforeEach(async ({ page }) => {
    // Login
    await loginAs(page, 'test@example.com', '123456')
    // Thêm sản phẩm vào giỏ
    await page.goto('http://localhost:5173/')
    await page.waitForResponse(r => r.url().includes('/api/products') && r.status() === 200)
    await page.getByRole('button', { name: 'Thêm vào giỏ' }).first().click()
    await page.goto('http://localhost:5173/cart')
})
```

## Output
- File: `tests/checkout/checkout.spec.ts`
- Code chạy được với `npx playwright test tests/checkout/`
