import { test, expect } from '@playwright/test'

const BASE = 'http://localhost:5173'

// Tạo email ngẫu nhiên để tránh conflict giữa các lần test
function uniqueEmail() {
    return `testuser_${Date.now()}@example.com`
}

const EXISTING_EMAIL = 'quandv@gmail.com' // email đã đăng ký trong DB

test.describe('Register Page', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto(`${BASE}/register`)
    })

    // ── Validation client-side ──────────────────────────────────────────────

    test('form rỗng → hiển thị tất cả inline error cùng lúc', async ({ page }) => {
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.getByText('Email là bắt buộc')).toBeVisible()
        await expect(page.getByText('Mật khẩu là bắt buộc')).toBeVisible()
        await expect(page.getByText('Vui lòng xác nhận mật khẩu')).toBeVisible()
    })

    test('email sai format → inline error', async ({ page }) => {
        await page.getByLabel('Email').fill('khong-phai-email')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.getByText('Email không hợp lệ')).toBeVisible()
    })

    test('password < 6 ký tự → inline error', async ({ page }) => {
        await page.getByLabel('Email').fill(uniqueEmail())
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123')
        await page.getByLabel('Xác nhận mật khẩu').fill('123')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.getByText('Mật khẩu tối thiểu 6 ký tự')).toBeVisible()
    })

    test('confirmPassword không khớp → inline error', async ({ page }) => {
        await page.getByLabel('Email').fill(uniqueEmail())
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123456')
        await page.getByLabel('Xác nhận mật khẩu').fill('654321')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.getByText('Mật khẩu xác nhận không khớp')).toBeVisible()
    })

    test('inline error biến mất khi user sửa field', async ({ page }) => {
        await page.getByRole('button', { name: 'Đăng ký' }).click()
        await expect(page.getByText('Email là bắt buộc')).toBeVisible()

        await page.getByLabel('Email').fill('test@example.com')
        await expect(page.getByText('Email là bắt buộc')).not.toBeVisible()
    })

    // ── Lỗi từ API ──────────────────────────────────────────────────────────

    test('email đã tồn tại → banner đỏ từ API', async ({ page }) => {
        await page.getByLabel('Email').fill(EXISTING_EMAIL)
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123456')
        await page.getByLabel('Xác nhận mật khẩu').fill('123456')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.locator('.bg-red-50')).toBeVisible()
        await expect(page.locator('.bg-red-50')).toContainText('Email đã được sử dụng')
    })

    test('server lỗi → hiển thị thông báo lỗi mạng', async ({ page }) => {
        await page.route('**/api/auth/register', route => route.abort('failed'))

        await page.getByLabel('Email').fill(uniqueEmail())
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123456')
        await page.getByLabel('Xác nhận mật khẩu').fill('123456')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await expect(page.locator('.bg-red-50')).toBeVisible()
        await expect(page.locator('.bg-red-50')).toContainText('Không thể kết nối đến máy chủ')
    })

    // ── Register thành công ──────────────────────────────────────────────────

    test('register thành công → redirect về /', async ({ page }) => {
        await page.getByLabel('Email').fill(uniqueEmail())
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123456')
        await page.getByLabel('Xác nhận mật khẩu').fill('123456')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await page.waitForURL(`${BASE}/`)
        await expect(page).toHaveURL(`${BASE}/`)
    })

    test('register thành công → header hiển thị email và nút Đăng xuất', async ({ page }) => {
        const email = uniqueEmail()

        await page.getByLabel('Email').fill(email)
        await page.getByLabel('Mật khẩu', { exact: true }).fill('123456')
        await page.getByLabel('Xác nhận mật khẩu').fill('123456')
        await page.getByRole('button', { name: 'Đăng ký' }).click()

        await page.waitForURL(`${BASE}/`)
        await expect(page.getByText(/Xin chào,/)).toBeVisible()
        await expect(page.getByText(email)).toBeVisible()
        await expect(page.getByRole('button', { name: 'Đăng xuất' })).toBeVisible()
    })

    // ── Navigation ───────────────────────────────────────────────────────────

    test('click "Đăng nhập" → navigate sang /login', async ({ page }) => {
        await page.getByRole('link', { name: 'Đăng nhập' }).click()
        await expect(page).toHaveURL(`${BASE}/login`)
    })
})
