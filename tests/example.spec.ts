import { test, expect } from "@playwright/test";

test("Knowly homepage loads", async ({ page }) => {
  await page.goto("http://localhost:3000");

  await expect(page).toHaveTitle(/Knowly/i);
});