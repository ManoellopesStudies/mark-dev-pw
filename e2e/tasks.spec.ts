import { createTask, deleteTaskByHelper } from "./support/helpers";

import { TaskModel } from "./fixtures/task.model";
import { TaskPage } from "./support/pages/tasks";
import data from "./fixtures/tasks.json";
import { test } from "@playwright/test";

let tasksPage: TaskPage;

test.beforeEach(({ page }) => {
  tasksPage = new TaskPage(page);
});

test.describe("Tasks Creation", async () => {
  test("must be able to add a new task", async ({ request }) => {
    const task = data.success as TaskModel;
    await deleteTaskByHelper(request, task.name);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.validateTaskCreation(task.name);
  });

  test("must not accept duplicated tasks", async ({ request }) => {
    const task = data.duplicated as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await createTask(request, task);

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.alertHaveText("Task already exists!");
  });

  test("must not accept empty task name", async () => {
    const task = data.required as TaskModel;

    await tasksPage.go();
    await tasksPage.create(task);
    await tasksPage.validateEmptyInput("This is a required field");
  });
});
test.describe("Tasks Update", async () => {
  test("Must complete a task", async ({ request }) => {
    const task = data.update as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await createTask(request, task);

    await tasksPage.go();
    await tasksPage.updateTask(task.name);
    await tasksPage.shouldBeDone(task.name);
  });
});

test.describe("Tasks Deletion", async () => {
  test("Must delete a task", async ({ request }) => {
    const task = data.delete as TaskModel;

    await deleteTaskByHelper(request, task.name);
    await createTask(request, task);

    await tasksPage.go();
    await tasksPage.deleteTask(task.name);
    await tasksPage.shouldNotExist(task.name);
  });
});
