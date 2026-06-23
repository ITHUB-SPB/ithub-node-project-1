import { test, expect } from "@playwright/test";

test.describe("Функционал списка помещений", () => {
  test("главная показывает счётчик и карточки комнат", async ({ page }) => {
    await page.goto("/");

    await expect(page.locator(".rooms-counter")).toContainText(
      /Найдено комнат/,
    );

    const cards = page.locator(".room_card");
    expect(await cards.count()).toBeGreaterThan(0);
  });

  test("у карточки есть название и кнопка «Подробнее»", async ({ page }) => {
    await page.goto("/");

    const firstCard = page.locator(".room_card").first();

    await expect(firstCard.locator(".card-title")).toContainText(/Помещение/);
    await expect(firstCard.locator("a.more-info")).toHaveText(/Подробнее/);
  });
});

test.describe("Функционал деталей помещения", () => {
  test("переход на страницу деталей показывает заголовок комнаты", async ({
    page,
  }) => {
    await page.goto("/");

    await page.locator("a.more-info").first().click();

    const title = page.locator("h2.room-title");
    await expect(title).toBeVisible();
    await expect(title).toContainText(/Помещение/);
  });

  test("на странице деталей есть кнопка «Забронировать»", async ({ page }) => {
    await page.goto("/");
    await page.locator("a.more-info").first().click();

    const bookingLink = page.locator("a", { hasText: /Забронировать/ });
    await expect(bookingLink.first()).toBeVisible();
  });
});

test.describe("Функционал бронирования", () => {
  test("успешное создание бронирования через форму", async ({ page }) => {
    await page.goto("/");
    await page.locator("a.more-info").first().click();
    await page.locator("a", { hasText: /Забронировать/ }).first().click();

    const form = page.locator("form").first();

    await form.locator("input[name=title]").fill("Лекция по тестированию");
    await form.locator("input[name=username]").fill("Ника");
    // выбираем первый доступный слот
    await form.locator("select[name=timeslotId]").selectOption({ index: 0 });

    await form.locator("button[type=submit]").click();

    await expect(page.locator(".alert--success")).toContainText(
      /Бронирование успешно создано/,
    );
  });
});
