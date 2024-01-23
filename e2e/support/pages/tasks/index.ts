import { Locator, Page, expect } from "@playwright/test";

import { TaskModel } from "../../../fixtures/task.model";

export class TaskPage {
  readonly page: Page;
  readonly inputTaskName: Locator;

  constructor(page: Page) {
    this.page = page;
    this.inputTaskName = page.locator("input[class*=InputNewTask]");
  }

  // Actions
  async go() {
    await this.page.goto("/");
  }

  async create(task: TaskModel) {
    await this.inputTaskName.fill(task.name);

    await this.page.click("css=button >> text=Create");
  }

  async updateTask(taskName: string) {
    const target = this.page.locator(
      `xpath=//p[text()='${taskName}']/..//button[contains(@class, "Toggle")]`
    );
    await target.click();
  }

  async deleteTask(taskName: string) {
    const target = this.page.locator(
      `xpath=//p[text()='${taskName}']/..//button[contains(@class, "Delete")]`
    );
    await target.click();
  }

  // Validations
  async validateTaskCreation(taskName: string) {
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`);
    await expect(target).toBeVisible();
  }

  async alertHaveText(taskName: string) {
    const target = this.page.locator(".swal2-html-container");
    await expect(target).toHaveText(taskName);
  }

  async validateEmptyInput(message: string) {
    const validationMessage = await this.inputTaskName.evaluate(
      (e) => (e as HTMLInputElement).validationMessage
    );

    expect(validationMessage).toEqual(message);
  }

  async shouldBeDone(taskName: string) {
    const target = this.page.getByText(taskName);
    await expect(target).toHaveCSS("text-decoration-line", "line-through");
  }

  async shouldNotExist(taskName: string) {
    const target = this.page.locator(`css=.task-item p >> text=${taskName}`);
    await expect(target).not.toBeVisible();
  }
}
