import { test, expect, type Page } from "@playwright/test";

const BASE = "http://localhost:5173";
const LOGIN_EMAIL = "quandv@gmail.com";
const LOGIN_PASSWORD = "123456";

async function waitForProducts(page: Page) {
  await page.waitForResponse(
    (resp) => resp.url().includes("/api/products") && resp.status() === 200,
  );
}

// SPA navigation giữ Redux state (cart không persist qua reload)
async function goToCart(page: Page) {
  await page.locator("header").getByRole("link", { name: /Cart/ }).click();
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

test.describe("Checkout Flow", () => {
  // ── Auth guard ──────────────────────────────────────────────────────────

  test("chưa login, click Thanh toán → redirect /login?redirect=/cart", async ({
    page,
  }) => {
    await page.goto(`${BASE}/`);
    await waitForProducts(page);
    await page.getByRole("button", { name: "Them vao gio" }).first().click();
    await goToCart(page);

    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page).toHaveURL(`${BASE}/login?redirect=/cart`);
  });

  test("login với ?redirect=/cart → auto-redirect về /cart", async ({
    page,
  }) => {
    await page.goto(`${BASE}/login?redirect=/cart`);
    await page.getByLabel("Email").fill(LOGIN_EMAIL);
    await page.getByLabel("Mật khẩu").fill(LOGIN_PASSWORD);
    await page.getByRole("button", { name: "Đăng nhập" }).click();

    await page.waitForURL(`${BASE}/cart`);
    await expect(page).toHaveURL(`${BASE}/cart`);
  });

  // ── Trạng thái loading ───────────────────────────────────────────────────

  test('button hiển thị "Đang xử lý..." và bị disabled trong khi API đang chạy', async ({
    page,
  }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    // Delay phản hồi để quan sát loading state
    await page.route("**/api/orders", async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Order created successfully",
          data: {},
        }),
      });
    });

    await page.getByRole("button", { name: "Thanh toán" }).click();

    const loadingBtn = page.getByRole("button", { name: "Đang xử lý..." });
    await expect(loadingBtn).toBeVisible();
    await expect(loadingBtn).toBeDisabled();
  });

  // ── Double-click protection ──────────────────────────────────────────────

  test("double-click Thanh toán → chỉ gọi API 1 lần", async ({ page }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    let orderCallCount = 0;
    await page.route("**/api/orders", async (route) => {
      orderCallCount++;
      await new Promise((resolve) => setTimeout(resolve, 500));
      await route.fulfill({
        status: 201,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Order created successfully",
          data: {},
        }),
      });
    });

    // Click lần 1 → button chuyển sang loading
    await page.getByRole("button", { name: "Thanh toán" }).click();

    // Đợi loading state xuất hiện rồi force-click lần 2 (bỏ qua disabled)
    await expect(
      page.getByRole("button", { name: "Đang xử lý..." }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Đang xử lý..." })
      .click({ force: true });

    await expect(page.locator(".bg-green-50")).toBeVisible();
    expect(orderCallCount).toBe(1);
  });

  // ── API error messages ───────────────────────────────────────────────────

  test("API 500 không có message → banner đỏ với STATUS_MESSAGES[500]", async ({
    page,
  }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    await page.route("**/api/orders", (route) =>
      route.fulfill({
        status: 500,
        contentType: "application/json",
        body: JSON.stringify({ error: "Failed to create order" }),
      }),
    );

    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.locator(".bg-red-50")).toContainText(
      "Lỗi máy chủ, vui lòng thử lại sau",
    );
  });

  test("API trả về message tùy chỉnh → banner đỏ hiển thị đúng message đó", async ({
    page,
  }) => {
    await loginAndAddProduct(page);
    await goToCart(page);

    await page.route("**/api/orders", (route) =>
      route.fulfill({
        status: 422,
        contentType: "application/json",
        body: JSON.stringify({
          message: "Sản phẩm không đủ số lượng trong kho",
        }),
      }),
    );

    await page.getByRole("button", { name: "Thanh toán" }).click();

    await expect(page.locator(".bg-red-50")).toBeVisible();
    await expect(page.locator(".bg-red-50")).toContainText(
      "Sản phẩm không đủ số lượng trong kho",
    );
  });
});
