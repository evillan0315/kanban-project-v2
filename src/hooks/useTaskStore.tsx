import { Status, Task } from "@prisma/client";
import { create } from "zustand";

const TASKS_API_URL = "/api/task"; // Update with actual endpoint
const STATUS_API_URL = "/api/status"; // Endpoint for statuses (containers)

type Items = Record<string, string[]>; // Maps container (status) IDs to task IDs
type Containers = Record<string, string>; // Maps container ID to its status name

interface TaskStore {
  items: Items;
  containers: [];
  setItems: (newItems: Items) => void;
  setContainers: (newContainers: Containers) => void;
  fetchTasks: () => Promise<void>;
  fetchStatuses: () => Promise<void>;
}

const useTaskStore = create<TaskStore>((set) => ({
  items: {},
  containers: [], // ✅ Store containers as an object (id -> name)

  setItems: (newItems: Items) => {
    set((state) => ({
      ...state,
      items: newItems,
    }));
  },

  // setContainers: (newContainers: Containers) => {
  //   set({ containers: newContainers });
  // },

  fetchTasks: async () => {
    try {
      // const [tasksResponse, statusResponse] = await Promise.all([
      //   fetch("/api/task"),
      //   fetch(STATUS_API_URL),
      //   // fetch("/api/priority"),
      //   // fetch("/api/color"),
      // ]);
      const tasksResponse = await fetch(TASKS_API_URL);
      const statusResponse = await fetch(STATUS_API_URL);
      if (!tasksResponse.ok || !statusResponse.ok) {
        const errorText = await (tasksResponse.ok
          ? statusResponse.text()
          : tasksResponse.text());
        throw new Error(`Failed to fetch tasks or columns: ${errorText}`);
      }
      
      const t: Task[] = await tasksResponse.json();
      //setTasks(t);
      const st: Status[] = await statusResponse.json();
      ///setStatus(st);
      //const p: Priority[] = await priorityResponse.json();
      //setPriority(p);
      //const c: Color[] = await colorResponse.json();
      //setColor(c);

      const formattedItems: Items = st.reduce<Record<string, string[]>>((acc, stat) => {
        acc[stat.id] =
          t
            .filter((task) => task.statusId === stat.id)
            .map((task) => task.id) || [];
        return acc;
      }, {});
      console.log(formattedItems, 'formattedItems')
      set((state) => ({
        ...state,
        items: formattedItems,
        ///containers: Object.keys(formattedItems) ,
      }));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Type the error
      console.error("Error fetching data:", err);
      //setError(String(err?.message)); // Set the error message
      return {}; // Return empty object in case of error, to not break the app
    } finally {
      //setLoading(false); // Set loading to false after fetch, regardless of success/failure
    }
   
  },

  fetchStatuses: async () => {
    try {
      const response = await fetch(STATUS_API_URL);
      if (!response.ok) throw new Error("Failed to fetch statuses");

      const data = await response.json();

      const formattedContainers: Containers = data.reduce(
        (acc: Containers, status: any) => {
          acc[status.id] = status.name;
          return acc;
        },
        {}
      );

      set({ containers: Object.keys(formattedContainers) });
    } catch (error) {
      console.error("Error fetching statuses:", error);
    }
  },
}));

export default useTaskStore;
