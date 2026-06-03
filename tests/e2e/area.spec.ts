import { test, expect } from "@playwright/test";

test("has title", async ({ page }) => {
  await page.goto("");

  await expect(page).toHaveTitle(/Meeting Mate/);
});

test("click area card", async ({ page }) => {
  await page.goto("");

  const link = page.locator("css=a", { hasText: /Подробнее/ }).first();
  await link.click();

  await expect(page.locator("css=h2")).toBeVisible();
  await expect(page.locator("css=h2")).toContainText(/Помещение 106/);
});