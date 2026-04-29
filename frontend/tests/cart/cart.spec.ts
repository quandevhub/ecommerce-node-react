import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:5173";
const LOGIN_EMAIL = "quandv@gmail.com";
const LOGIN_PASSWORD = "123456";

async function waitForProducts(page: Page) {
  await page.waitForResponse(
    (resp) => resp.url().includes("/api/products") && resp.status() === 200,
  );
}

// Dùng click SPA thay vì page.goto('/cart') để giữ Redux state (cart không persist qua reload)
async function goToCart(page: Page) {
  await page.locator("header").getByRole("link", { name: /Cart/ }).click();
}

async function addFirstProductToCart(page: Page) {
  await page.goto(`${BASE}/`);
  await waitForProducts(page);
  await page.getByRole("button", { name: "Them vao gio" }).first().click();
}

async function loginAndAddProduct(page: Page) {
  await page.goto(`${BASE}/login`);
  await page.getByLabel("Email").fill(LOGIN_EMAIL);
  await page.getByLabel("Mật khẩu").fill(LOGIN_PASSWORD);
  await page.getByRole("button", { name: "Đăng nhập" }).click();
  await page.waitForURL(`${BASE}/`);
  await waitForProducts(page);
  await page.getByRole("button", { name: "Them vao gio" }).first().click();
}

test.describe("Cart Page", () => {
  // ── Giỏ hàng rỗng ───────────────────────────────────────────────────────

  test("giỏ hàng rỗng → Thanh toán bị disabled và tổng = 0", async ({
    page,
  }) => {
    await page.goto(`${BASE}/cart`);

    await expect(
      page.getByRole("button", { name: "Thanh toán" }),
    ).toBeDisabled();
    await expect(page.getByText(/Tong so luong: 0/)).toBeVisible();
    await expect(page.getByText(/Tong tien: 0/)).toBeVisible();
  });

  // ── Thêm sản phẩm ───────────────────────────────────────────────────────

  test("thêm sản phẩm → badge trên header tăng lên 1", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitForProducts(page);

    const badge = page.locator("header").getByText(/^\d+$/);
    await expect(badge).toHaveText("0");

    await page.getByRole("button", { name: "Them vao gio" }).first().click();
    await expect(badge).toHaveText("1");
  });

  test("thêm sản phẩm → hiển thị trong giỏ hàng với quantity = 1", async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await expect(page.getByText(/So luong: 1/)).toBeVisible();
    await expect(page.getByText(/Tong so luong: 1/)).toBeVisible();
  });

  test("thêm cùng sản phẩm 2 lần → quantity = 2 và chỉ có 1 row", async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await waitForProducts(page);

    const addBtn = page.getByRole("button", { name: "Them vao gio" }).first();
    await addBtn.click();
    await addBtn.click();

    await goToCart(page);

    await expect(page.getByText(/So luong: 2/)).toBeVisible();
    await expect(page.locator(".space-y-4 > div")).toHaveCount(1);
  });

  // ── Điều chỉnh số lượng ─────────────────────────────────────────────────

  test("click + → tăng số lượng lên 2", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await page.getByRole("button", { name: "+" }).first().click();

    await expect(page.getByText(/So luong: 2/)).toBeVisible();
    await expect(page.getByText(/Tong so luong: 2/)).toBeVisible();
  });

  test("click - khi quantity > 1 → giảm quantity xuống 1", async ({ page }) => {
    await page.goto(`${BASE}/`);
    await waitForProducts(page);

    const addBtn = page.getByRole("button", { name: "Them vao gio" }).first();
    await addBtn.click();
    await addBtn.click();

    await goToCart(page);
    await expect(page.getByText(/So luong: 2/)).toBeVisible();

    await page.getByRole("button", { name: "-" }).first().click();
    await expect(page.getByText(/So luong: 1/)).toBeVisible();
  });

  test("click - khi quantity = 1 → sản phẩm bị xóa khỏi giỏ", async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await page.getByRole("button", { name: "-" }).first().click();

    await expect(page.locator(".space-y-4 > div")).toHaveCount(0);
    await expect(page.getByText(/Tong so luong: 0/)).toBeVisible();
  });

  // ── Xóa sản phẩm ────────────────────────────────────────────────────────

  test("click Xoa → sản phẩm biến mất khỏi danh sách", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await page
      .getByRole("button", { name: "Xoa", exact: true })
      .first()
      .click();

    await expect(page.locator(".space-y-4 > div")).toHaveCount(0);
    await expect(page.getByText(/Tong so luong: 0/)).toBeVisible();
  });

  test("click Xoa tat ca → giỏ hàng về trạng thái rỗng", async ({ page }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await page.getByRole("button", { name: "Xoa tat ca" }).click();

    await expect(page.locator(".space-y-4 > div")).toHaveCount(0);
    await expect(page.getByText(/Tong so luong: 0/)).toBeVisible();
    await expect(
      page.getByRole("button", { name: "Thanh toán" }),
    ).toBeDisabled();
  });

  // ── Thanh toán ──────────────────────────────────────────────────────────

  test("checkout khi chưa login → redirect sang /login?redirect=/cart", async ({
    page,
  }) => {
    await addFirstProductToCart(page);
    await goToCart(page);

    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page).toHaveURL(`${BASE}/login?redirect=/cart`);
  });

  test("checkout thành công → banner xanh và giỏ hàng bị xóa", async ({
    page,
  }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page.locator(".bg-green-50")).toBeVisible();
    await expect(page.locator(".bg-green-50")).toContainText(
      "Đặt hàng thành công",
    );
    await expect(page.locator(".space-y-4 > div")).toHaveCount(0);
    await expect(page.getByText(/Tong so luong: 0/)).toBeVisible();
  });

  test("checkout server lỗi → banner đỏ hiển thị lỗi kết nối", async ({
    page,
  }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    await page.route("**/api/orders", (route) => route.abort("failed"));
    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.locator(".bg-red-50")).toContainText(
      "Không thể kết nối đến máy chủ",
    );
  });
});
