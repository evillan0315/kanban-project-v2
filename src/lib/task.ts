// taskApi.ts

import { Task } from "@prisma/client";

export const handleGetTasks = async (): Promise<Task[] | null> => {
    try {
      const response = await fetch(`/api/task`, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to fetch tasks: ${response.statusText}`);
      }
  
      const tasks: Task[] = await response.json();
      return tasks;
    } catch (error) {
      console.error("Fetch error:", error);
      return null; // ❌ Return null on failure
    }
  };
  
  export const handleCreateTask = async (taskData: Omit<Task, "id">): Promise<Task | null> => {
    try {
      const response = await fetch(`/api/task`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(taskData),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to create task: ${response.statusText}`);
      }
  
      const newTask: Task = await response.json();
      return newTask;
    } catch (error) {
      console.error("Creation error:", error);
      return null;
    }
  };
  
  export const handleUpdateTask = async (newRow: Task, oldRow: Task): Promise<Task> => {
    try {
      const response = await fetch(`/api/task`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });
  
      if (!response.ok) {
        throw new Error(`Failed to update task: ${response.statusText}`);
      }
  
      return newRow; // ✅ UI will update with newRow
    } catch (error) {
      console.error("Update error:", error);
      return oldRow; // ❌ Revert to oldRow if API update fails
    }
  };
  
  export const handleDeleteTask = async (taskId: string): Promise<boolean> => {
    try {
      const response = await fetch(`/api/task/${taskId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
      });
  
      if (!response.ok) {
        throw new Error(`Failed to delete task: ${response.statusText}`);
      }
  
      return true; // ✅ Successfully deleted
    } catch (error) {
      console.error("Delete error:", error);
      return false; // ❌ Handle deletion failure
    }
  };
  