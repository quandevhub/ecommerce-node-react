# Cấu trúc E2E Testing — Playwright

## Tech stack
- **Framework**: Playwright (@playwright/test v1.59.1)
- **Language**: TypeScript
- **Browser**: Chromium

## Cấu trúc thư mục

```
frontend/
├── playwright.config.ts          # Config chung
└── tests/
    └── auth/
        ├── login.spec.ts         # 9 test cases cho login
        └── register.spec.ts      # 9 test cases cho register
```

---

## playwright.config.ts

| Option | Giá trị |
|--------|---------|
| `baseURL` | `http://localhost:5173` |
| `retries` | 1 |
| `screenshot` | only-on-failure |
| `video` | retain-on-failure |
| `browser` | Chromium |
| `webServer` | `npm run dev` (reuse nếu đã chạy) |

---

## Login — `tests/auth/login.spec.ts`

| # | Test case | Loại |
|---|-----------|------|
| 1 | Form rỗng → hiển thị tất cả inline error | Validation |
| 2 | Email sai format → inline error | Validation |
| 3 | Password < 6 ký tự → inline error | Validation |
| 4 | Inline error biến mất khi user sửa field | Validation |
| 5 | Sai mật khẩu → banner đỏ từ API | API error |
| 6 | Email không tồn tại → banner đỏ từ API | API error |
| 7 | Server lỗi (mock abort) → thông báo lỗi mạng | API error |
| 8 | Login thành công → redirect về `/` | Happy path |
| 9 | Login với `?redirect=/cart` → redirect về `/cart` | Happy path |

---

## Register — `tests/auth/register.spec.ts`

| # | Test case | Loại |
|---|-----------|------|
| 1 | Form rỗng → hiển thị tất cả inline error | Validation |
| 2 | Email sai format → inline error | Validation |
| 3 | Password < 6 ký tự → inline error | Validation |
| 4 | confirmPassword không khớp → inline error | Validation |
| 5 | Inline error biến mất khi user sửa field | Validation |
| 6 | Email đã tồn tại → banner đỏ từ API | API error |
| 7 | Server lỗi (mock abort) → thông báo lỗi mạng | API error |
| 8 | Register thành công → redirect về `/` | Happy path |
| 9 | Register thành công → header hiển thị email + Đăng xuất | Happy path |

---

## Scripts

```bash
cd frontend

npm run test           # Chạy toàn bộ tests
npm run test:auth      # Chỉ chạy tests/auth/
npm run test:ui        # Playwright UI mode (interactive)
```

---

## Yêu cầu trước khi chạy

1. Backend đang chạy tại `http://localhost:3000`
2. Frontend đang chạy tại `http://localhost:5173` (hoặc để `webServer` tự khởi động)
3. Tài khoản `quandv@gmail.com / 123456` đã tồn tại trong DB (dùng cho login tests)

---

## Cấu trúc thư mục (cập nhật)

```
frontend/
├── playwright.config.ts
└── tests/
    ├── auth/
    │   ├── login.spec.ts         # 9 test cases cho login
    │   └── register.spec.ts      # 9 test cases cho register
    ├── cart/
    │   └── cart.spec.ts          # 12 test cases cho giỏ hàng
    └── checkout/
        └── checkout.spec.ts      # 6 test cases cho checkout flow
```

---

## Cart — `tests/cart/cart.spec.ts`

| # | Test case | Loại |
|---|-----------|------|
| 1 | Giỏ hàng rỗng → Thanh toán disabled + tổng = 0 | Empty state |
| 2 | Thêm sản phẩm → badge header tăng lên 1 | Add |
| 3 | Thêm sản phẩm → hiển thị trong giỏ với quantity = 1 | Add |
| 4 | Thêm cùng sản phẩm 2 lần → quantity = 2, 1 row | Add |
| 5 | Click + → tăng quantity lên 2 | Update |
| 6 | Click - (quantity > 1) → giảm quantity | Update |
| 7 | Click - (quantity = 1) → sản phẩm bị xóa | Update |
| 8 | Click Xoa → sản phẩm biến mất | Remove |
| 9 | Click Xoa tat ca → giỏ hàng rỗng | Remove |
| 10 | Checkout chưa login → redirect /login?redirect=/cart | Auth guard |
| 11 | Checkout thành công → banner xanh + giỏ hàng xóa | Happy path |
| 12 | Checkout server lỗi → banner đỏ | Error |

### Ghi chú kỹ thuật — cart.spec.ts

**Helper functions:**
- `addFirstProductToCart(page)` — điều hướng về `/`, chờ API products load xong, click "Them vao gio" đầu tiên
- `loginAndAddProduct(page)` — đăng nhập trước rồi thêm sản phẩm trong cùng một phiên (tránh Redux re-init khi navigate)

**Quyết định thiết kế:**
- Dùng `.space-y-4 > div` để đếm số item row thay vì `getByText(/So luong:/)` — vì regex đó cũng khớp cả dòng "Tong so luong: 0" trong phần tổng kết, gây false failure
- Dùng `page.locator('header').getByText(/^\d+$/)` để lấy badge số lượng — chỉ phần tử trong header có nội dung thuần số
- `loginAndAddProduct` không navigate lại sau login — đảm bảo Redux state giữ được token (auth slice đọc từ localStorage khi khởi tạo)
- Mỗi test chạy trong browser context riêng biệt → localStorage sạch → không cần cleanup thủ công

**Lệnh chạy:**
```bash
cd frontend
npx playwright test tests/cart/
```

---

## Scripts (cập nhật)

```bash
cd frontend

npm run test           # Chạy toàn bộ tests
npm run test:auth      # Chỉ chạy tests/auth/
npm run test:ui        # Playwright UI mode (interactive)
npm run test:cart      # Chỉ chạy cart testss
npm run test:ui -- tests/cart/
```

---

## Checkout — `tests/checkout/checkout.spec.ts`

| # | Test case | Loại |
|---|-----------|------|
| 1 | Chưa login, click Thanh toán → redirect /login?redirect=/cart | Auth guard |
| 2 | Login với ?redirect=/cart → auto-redirect về /cart | Auth guard |
| 3 | Button hiển thị "Đang xử lý..." và bị disabled khi API đang chạy | Loading state |
| 4 | Double-click Thanh toán → chỉ gọi API 1 lần | Double-click |
| 5 | API 500 không có message → banner đỏ "Lỗi máy chủ, vui lòng thử lại sau" | API error |
| 6 | API 422 có message tùy chỉnh → banner đỏ hiển thị đúng message | API error |

### Ghi chú kỹ thuật — checkout.spec.ts

**Phân biệt với cart.spec.ts:**
- cart.spec.ts kiểm tra trực tiếp các thao tác giỏ hàng, bao gồm cả các trường hợp checkout cơ bản
- checkout.spec.ts tập trung vào hành vi riêng của checkout: full auth guard round-trip, UI loading state, double-click guard, API error messages

**Kỹ thuật đáng chú ý:**
- Loading state test dùng `setTimeout` trong route handler để delay response 1000ms, đủ để assert UI trong khi API đang chạy
- Double-click test: click lần 1 → đợi `"Đang xử lý..."` xuất hiện → `force: true` click lần 2 (bỏ qua disabled) → kiểm tra `orderCallCount === 1`
- `route.fulfill({ status: 422, body: JSON.stringify({ message: '...' }) })` để kiểm tra `parseApiError` trả về đúng `serverMessage` từ response body

**Lệnh chạy:**
```bash
cd frontend
npm run test:checkout
```
