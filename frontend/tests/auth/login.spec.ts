import { test, expect } from "@playwright/test";

const BASE = "http://localhost:5173";

// Tài khoản đã tồn tại trong DB (chạy register trước nếu cần)
const VALID_EMAIL = "quandv@gmail.com";
const VALID_PASSWORD = "123456";

test.describe("Login Page", () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`${BASE}/login`);
  });

  // ── Validation client-side ──────────────────────────────────────────────

  test("form rỗng → hiển thị tất cả inline error", async ({ page }) => {
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByText("Email là bắt buộc")).toBeVisible();
    await expect(page.getByText("Mật khẩu là bắt buộc")).toBeVisible();
  });

  test("email sai format → inline error", async ({ page }) => {
    await page.getByLabel("Email").fill("khong-phai-email");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByText("Email không hợp lệ")).toBeVisible();
  });

  test("password < 6 ký tự → inline error", async ({ page }) => {
    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill("123");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.getByText("Mật khẩu tối thiểu 6 ký tự")).toBeVisible();
  });

  test("inline error biến mất khi user sửa field", async ({ page }) => {
    await page.getByRole("button", { name: "Đăng nhập" }).click();
    await expect(page.getByText("Email là bắt buộc")).toBeVisible();

    await page.getByLabel("Email").fill("a@b.com");
    await expect(page.getByText("Email là bắt buộc")).not.toBeVisible();
  });

  // ── Lỗi từ API ──────────────────────────────────────────────────────────

  test("sai mật khẩu → banner đỏ từ API", async ({ page }) => {
    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill("satroi123");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.locator(".bg-red-50")).toContainText(
      "Email hoặc mật khẩu không đúng",
    );
  });

  test("email không tồn tại → banner đỏ từ API", async ({ page }) => {
    await page.getByLabel("Email").fill("khongtontai@nowhere.com");
    await page.getByLabel("Mật khẩu").fill("123456");
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
  });

  test("server lỗi → hiển thị thông báo lỗi mạng", async ({ page }) => {
    await page.route("**/api/auth/login", (route) => route.abort("failed"));

    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill(VALID_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.locator(".bg-red-50")).toContainText(
      "Không thể kết nối đến máy chủ",
    );
  });

  // ── Login thành công ─────────────────────────────────────────────────────

  test("login thành công → redirect về /", async ({ page }) => {
    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill(VALID_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await page.waitForURL(`${BASE}/`);
    await expect(page).toHaveURL(`${BASE}/`);
  });

  test("login thành công → header hiển thị email và nút Đăng xuất", async ({
    page,
  }) => {
    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill(VALID_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await page.waitForURL(`${BASE}/`);
    await expect(page.getByText(/Xin chào,/)).toBeVisible();
    await expect(page.getByText(VALID_EMAIL)).toBeVisible();
    await expect(page.getByRole("button", { name: "Đăng xuất" })).toBeVisible();
  });

  test("login với ?redirect=/cart → redirect về /cart sau khi login", async ({
    page,
  }) => {
    await page.goto(`${BASE}/login?redirect=/cart`);

    await page.getByLabel("Email").fill(VALID_EMAIL);
    await page.getByLabel("Mật khẩu").fill(VALID_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await page.waitForURL(`${BASE}/cart`);
    await expect(page).toHaveURL(`${BASE}/cart`);
  });

  // ── Navigation ───────────────────────────────────────────────────────────

  test('click "Đăng ký" → navigate sang /register', async ({ page }) => {
    await page.getByRole("link", { name: "Đăng ký" }).click();
    await expect(page).toHaveURL(`${BASE}/register`);
  });
});
