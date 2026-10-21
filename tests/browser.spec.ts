import { test, expect } from "@playwright/test";
for (const width of [375, 768, 1440]) {
  test(`archive navigation and layouts at ${width}px`, async ({ page }) => {
    await page.setViewportSize({ width, height: 900 });
    const errors: string[] = [];
    page.on("pageerror", (error) => errors.push(error.message));
    await page.goto("/rx78-portal/");
    await expect(
      page.getByRole("heading", { name: /One mobile suit/ }),
    ).toBeVisible();
    await expect(page.locator(".hero-art img")).toBeVisible();
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.getByRole("link", { name: /Explore the archive/ }).click();
    await expect(page.getByRole("status")).toContainText("16");
    await page.getByRole("searchbox").fill("real grade 2.0");
    await expect(page.getByRole("status")).toContainText("02");
    await page
      .getByRole("combobox", { name: "VARIANT TYPE", exact: true })
      .selectOption("Exclusive");
    await expect(page.getByRole("status")).toContainText("01");
    await page.locator(".kit-card").click();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Titanium finish study",
    );
    await expect(
      page.getByRole("navigation", { name: "Breadcrumb" }),
    ).toContainText("RG Ver. 2.0");
    await expect(page.locator(".detail-copy")).toContainText("Fictional");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.reload();
    await expect(page.getByRole("heading", { level: 1 })).toHaveText(
      "Titanium finish study",
    );
    await page.getByRole("link", { name: /Return to this version/ }).click();
    await expect(page.getByRole("status")).toContainText("02");
    await page.getByRole("searchbox").fill("nothing-here");
    await expect(
      page.getByRole("heading", { name: "No matching transmissions." }),
    ).toBeVisible();
    await page
      .getByRole("button", { name: "Reset filters", exact: true })
      .click();
    await expect(page.getByRole("status")).toContainText("16");
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= innerWidth,
      ),
    ).toBeTruthy();
    await page.goto("/rx78-portal/#/unknown");
    await expect(
      page.getByRole("heading", { name: "Signal lost." }),
    ).toBeVisible();
    expect(errors).toEqual([]);
  });
}
test("keyboard skip link focuses main; grade clears dependent version", async ({
  page,
}) => {
  await page.goto("/rx78-portal/#/archive?grade=rg&version=rg-2");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Skip to content" }),
  ).toBeFocused();
  await page.keyboard.press("Enter");
  await expect(page.locator("main")).toBeFocused();
  await page
    .getByRole("combobox", { name: "GRADE", exact: true })
    .selectOption("hg");
  await expect(
    page.getByRole("combobox", { name: "MOLD / RELEASE VERSION", exact: true }),
  ).toHaveValue("");
  await expect(page.getByRole("status")).toContainText("04");
});
