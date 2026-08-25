import { expect, test, type Locator, type Page } from "@playwright/test";

async function expectWithinViewport(page: Page, locator: Locator): Promise<void> {
  const box = await locator.boundingBox();
  expect(box, "expected a visible element with a bounding box").not.toBeNull();
  expect(box!.x).toBeGreaterThanOrEqual(0);
  expect(box!.y).toBeGreaterThanOrEqual(0);
  expect(box!.x + box!.width).toBeLessThanOrEqual(await page.evaluate(() => window.innerWidth));
  expect(box!.y + box!.height).toBeLessThanOrEqual(await page.evaluate(() => window.innerHeight));
}

test("mobile launch keeps the composer and primary action in view without horizontal overflow", async ({
  page,
}) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto("./", { waitUntil: "domcontentloaded" });

  const launch = page.locator(".word-cloud-launch");
  const composer = page.getByLabel("Your one word");
  const primary = page.getByRole("button", { name: "Write your word" });

  await expect(launch).toBeVisible();
  await expect(composer).toBeVisible();
  await expect(primary).toBeVisible();
  await expectWithinViewport(page, composer);
  await expectWithinViewport(page, primary);
  expect(
    await page.evaluate(
      () => document.documentElement.scrollWidth <= document.documentElement.clientWidth,
    ),
  ).toBe(true);
});

test("desktop launch keeps the primary reflection action above the fold", async ({ page }) => {
  await page.setViewportSize({ width: 1141, height: 602 });
  await page.goto("./", { waitUntil: "domcontentloaded" });

  const primary = page.getByRole("button", { name: "Write your word" });
  await expect(page.locator(".word-cloud-stage")).toBeVisible();
  await expect(primary).toBeVisible();
  await expectWithinViewport(page, primary);
});
