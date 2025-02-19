/* eslint-disable @typescript-eslint/no-explicit-any */
import { Color, Priority, Status, Task } from "@prisma/client";
import { UniqueIdentifier } from "@dnd-kit/core";
import { create } from "zustand";
import { randomUUID } from "crypto";
import { persist, createJSONStorage } from "zustand/middleware";

// Create a safe storage fallback for SSR
// const safeStorage = typeof window !== "undefined" ? localStorage : {
//   getItem: () => null,
//   setItem: () => {},
//   removeItem: () => {},
// };

export type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
export type Containers = UniqueIdentifier[];
export interface TaskState {
  tasks: Task[] | null;
  status: Status[] | null;
  priority: Priority[] | null;
  color: Color[] | null;
  items: Items;
  containers: Containers;
  loading: boolean;
  error: string | null;
  activeId: UniqueIdentifier | null; // Added activeId state
  loadItems: () => Promise<void>;
  setItems: (items: Items) => void;
  setContainers: (containers: Containers) => void;
  setActiveId: (id: UniqueIdentifier | null) => void; // Added setActiveId function
  findTaskById: (id: string) => Task | undefined;
  findStatusById: (id: string) => Status | undefined;
  findPriorityById: (id: string) => Priority | undefined;
  findColorById: (id: string) => Color | undefined;
  getColor: (id: UniqueIdentifier) => string;
  findContainer: (id: UniqueIdentifier) => UniqueIdentifier | undefined;
  getNextContainerId: () => string; // Added getNextContainerId function
}
export const TRASH_ID = "void";
export const PLACEHOLDER_ID = "placeholder";
export const empty: UniqueIdentifier[] = [];
// Safe localStorage wrapper for Next.js
const safeLocalStorage = {
  getItem: (key: string): string | null =>
    typeof window !== "undefined" ? localStorage.getItem(key) : null,
  setItem: (key: string, value: string): void => {
    if (typeof window !== "undefined") localStorage.setItem(key, value);
  },
  removeItem: (key: string): void => {
    if (typeof window !== "undefined") localStorage.removeItem(key);
  },
};

const useTaskData = create<TaskState>()(
  persist(
    (set, get) => ({
      tasks: null,
      status: null,
      priority: null,
      color: null,
      items: {} as Items,
      containers: [],
      loading: true,
      error: null,
      activeId: null, // Added activeId state to store
      loadItems: async () => {
        set({ loading: true, error: null });
        try {
          const [
            tasksResponse,
            statusResponse,
            priorityResponse,
            colorResponse,
          ] = await Promise.all([
            fetch("/api/task"),
            fetch("/api/status"),
            fetch("/api/priority"),
            fetch("/api/color"),
          ]);

          if (
            !tasksResponse.ok ||
            !statusResponse.ok ||
            !priorityResponse.ok ||
            !colorResponse.ok
          ) {
            const errorText = await (tasksResponse.ok
              ? statusResponse.text()
              : tasksResponse.text());
            throw new Error(`Failed to fetch data: ${errorText}`);
          }

          const tasks: Task[] = await tasksResponse.json();
          const status: Status[] = await statusResponse.json();
          const priority: Priority[] = await priorityResponse.json();
          const color: Color[] = await colorResponse.json();

          // Transform API data into the required format
          const items = tasks.reduce((acc: Items, task: Task) => {
            const containerId = task.statusId || randomUUID(); // Use API-provided ID or generate one
            if (!acc[containerId]) acc[containerId] = [];
            acc[containerId].push(task.id);
            return acc;
          }, {});
          set({
            tasks,
            status,
            priority,
            color,
            items,
            containers: Object.keys(items),
            loading: false,
          });
        } catch (err: any) {
          console.error("Error fetching data:", err);
          set({
            error: String(err?.message),
            loading: false,
            items: {},
            containers: [],
          });
        }
      },
      setItems: (newItems: Items) => {
        set((items) => ({
          ...items,
          items: newItems,
        }));
      },
      setContainers: (containers: Containers) => set({ containers }),
      getNextContainerId: () => {
        const items = get().items;
        const containerIds = Object.keys(items);
        const lastContainerId = containerIds[containerIds.length - 1];

        // Return the next container ID based on the last one
        return String.fromCharCode(lastContainerId.charCodeAt(0) + 1);
      },
      setActiveId: (id: UniqueIdentifier | null) => set({ activeId: id }), // Added setActiveId function
      findTaskById: (id: UniqueIdentifier): Task | undefined =>
        get().tasks?.find((task) => task.id === id),
      findStatusById: (id: UniqueIdentifier): Status | undefined =>
        get().status?.find((stat) => stat.id === id),
      findPriorityById: (id: UniqueIdentifier): Priority | undefined =>
        get().priority?.find((p) => p.id === id),
      findColorById: (id: UniqueIdentifier): Color | undefined =>
        get().color?.find((c) => c.id === id),
      getColor: (id: UniqueIdentifier): string => {
        const color = get().findColorById(id as string);
        return color?.color || "#f5f5f5";
      },
      // Adding the findContainer function
      findContainer: (id: UniqueIdentifier): UniqueIdentifier | undefined => {
        const { items } = get();
        // If the ID is a container
        if (id in items) {
          return id;
        }

        // Otherwise, search for the container that includes the item
        return Object.keys(items).find((key) => items[key].includes(id));
      },
    }),
    {
      name: "task-storage",
      storage: createJSONStorage(() => safeLocalStorage), // ✅ Correctly wraps localStorage
    }
  )
);

export default useTaskData;

