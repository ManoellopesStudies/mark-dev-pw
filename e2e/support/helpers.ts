import "dotenv/config";

import { APIRequestContext, expect } from "@playwright/test";

import { TaskModel } from "../fixtures/task.model";

const BASE_API = process.env.BASE_API;

export async function deleteTaskByHelper(
  request: APIRequestContext,
  taskName: string
) {
  await request.delete(`${BASE_API}/helper/tasks/${taskName}`);
}

export async function createTask(request: APIRequestContext, task: TaskModel) {
  const newTask = await request.post(`${BASE_API}/tasks`, {
    data: task,
  });
  await expect(newTask.ok()).toBeTruthy();
}
