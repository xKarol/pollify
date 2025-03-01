import { expect } from "@playwright/test";

import { routes } from "../config/routes";
import { test } from "./fixtures";

test.beforeEach(({ polls }) => polls.deleteAll());

test.describe("Create Poll", () => {
  test("should create poll", async ({ page, db }) => {
    await page.goto(routes.CREATE_POLL);

    await page.getByPlaceholder("Your question...").fill("test question");
    await page.getByPlaceholder("Option 1").fill("test option 1");
    await page.getByPlaceholder("Option 2").fill("test option 2");
    await page.getByRole("button", { name: "Add option" }).click();
    await page.getByPlaceholder("Option 3").fill("test option 3");
    await page.getByRole("switch").first().click();
    await page.getByRole("button", { name: "Create" }).click();

    await page.getByTestId("toast-success").waitFor();

    const pollData = await db.query.polls.findFirst({
      with: { answers: true },
    });
    if (!pollData) throw new Error("Not found poll.");

    expect(pollData.answers.length).toBe(3);
    expect(pollData.isPublic).toBeFalsy();
    expect(pollData.question).toBe("test question");

    pollData.answers.forEach((answer, index) => {
      expect(answer.text).toBe(`test option ${index + 1}`);
    });
  });
});
