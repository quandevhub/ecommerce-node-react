---
name: generate_playwright_cart_test
description: Tạo Playwright test cho chức năng giỏ hàng trong project ecommerce-node-react
---

## Khi nào sử dụng
- Khi test add/remove/update sản phẩm trong giỏ hàng
- Khi test tính tổng tiền, tổng số lượng
- Khi test UI giỏ hàng rỗng

## URLs
- Trang sản phẩm: `http://localhost:5173/` (route `/`)
- Trang giỏ hàng: `http://localhost:5173/cart` (route `/cart`)

## Cấu trúc file
- `tests/cart/cart.spec.ts`

---

## Quan trọng — Cart state

- Cart lưu trong **Redux store** (in-memory)
- **KHÔNG persist** khi reload trang — cart reset về rỗng sau reload
- Mỗi test nên bắt đầu từ trang sản phẩm và thêm hàng mới

---

## Button texts (tiếng Việt, không dùng selector CSS)

| Action | Text/Role |
|--------|-----------|
| Thêm vào giỏ | "Thêm vào giỏ" (nút trong ProductItem) |
| Tăng số lượng | "+" |
| Giảm số lượng | "-" |
| Xóa 1 sản phẩm | "Xoa" |
| Xóa tất cả | "Xoa tat ca" |
| Badge số lượng | số trong `<span>` bên cạnh "Cart" trên header |

---

## Test cases

1. **Thêm sản phẩm vào giỏ**
   - Từ `/`, click "Thêm vào giỏ"
   - Badge trên header tăng lên 1
   - Vào `/cart` → sản phẩm xuất hiện với quantity = 1

2. **Tăng số lượng**
   - Click "+" → quantity tăng 1
   - Tổng tiền cập nhật đúng

3. **Giảm số lượng**
   - Click "-" khi quantity > 1 → quantity giảm 1
   - Click "-" khi quantity = 1 → sản phẩm bị xóa khỏi giỏ

4. **Xóa 1 sản phẩm**
   - Click "Xoa" → sản phẩm biến khỏi danh sách

5. **Xóa tất cả**
   - Click "Xoa tat ca" → giỏ hàng rỗng

6. **Tính tổng đúng**
   - Tổng số lượng = sum(item.quantity)
   - Tổng tiền = sum(item.price × item.quantity)

7. **Cart rỗng**
   - Khi không có sản phẩm → danh sách trống, tổng = 0

---

## Locators chuẩn

```ts
// Header badge
page.locator('header').getByText(/^\d+$/) // số lượng trong badge

// Nút thêm vào giỏ (ProductItem)
page.getByRole('button', { name: 'Thêm vào giỏ' }).first()

// Cart item actions
page.getByRole('button', { name: '+' }).first()
page.getByRole('button', { name: '-' }).first()
page.getByRole('button', { name: 'Xoa' }).first()

// Xóa tất cả
page.getByRole('button', { name: 'Xoa tat ca' })

// Tổng tiền / tổng số lượng
page.getByText(/Tong so luong:/)
page.getByText(/Tong tien:/)
```

---

## Lưu ý edge cases

- **Reload page** → cart bị reset (Redux không persist), đây là behavior đúng của project
- **Thêm cùng 1 sản phẩm 2 lần** → quantity tăng, không tạo row mới
- Button "Thanh toán" bị disabled khi giỏ hàng rỗng

---

## beforeEach
```ts
test.beforeEach(async ({ page }) => {
    await page.goto('http://localhost:5173/')
    // Chờ sản phẩm load xong
    await page.waitForResponse(resp =>
        resp.url().includes('/api/products') && resp.status() === 200
    )
})
```

## Output
- File: `tests/cart/cart.spec.ts`
- Code chạy được ngay với `npx playwright test tests/cart/`
