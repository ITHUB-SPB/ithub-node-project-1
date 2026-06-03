import { test, expect } from "@playwright/test";

test("show booking form", async ({ page }) => {
  await page.goto("/details/8");

  const bookingLink = page
    .locator("css=a", { hasText: /Забронировать/ })
    .first();

  await bookingLink.click();

  const form = page.locator("css=form").first();

  expect(form).toBeDefined();

  const titleInput = form.getByPlaceholder(/Стендапчик/).first();
  const usernameInput = form.getByPlaceholder(/Ваше имя/).first();
  const timeslotSelect = form.getByRole("combobox").first();

  const submitButton = form.getByRole("button").first();

  await titleInput.fill("Лекция");
  await usernameInput.fill("Петров Т.Я.");
  await timeslotSelect.selectOption({ value: "2" });
  await submitButton.click();

  const successAlert = page.locator("css=.alert").first();
  await expect(successAlert).toHaveText(/Бронирование успешно создано/);
});