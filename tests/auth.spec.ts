import { test as setup, expect } from "@playwright/test";

const authFile = "playwright/.auth/google-user.json";

setup("authenticate with Google", async ({ page }) => {
  await page.goto("http://localhost:3000/login");

  await page.getByRole("button", {
    name: "Continue with Google",
  }).click();

  // Google login manually complete karo.
  // Playwright browser ko open rakhega.
  await page.pause();

  await expect(page).toHaveURL(/\/dashboard/);

  await page.context().storageState({ path: authFile });
});