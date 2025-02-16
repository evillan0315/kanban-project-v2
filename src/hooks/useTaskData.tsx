import { useState, useEffect } from "react";
import { Color, Priority, Status, Task } from "@prisma/client";
import { UniqueIdentifier } from "@dnd-kit/core";


type Items = Record<UniqueIdentifier, UniqueIdentifier[]>;
export const useTaskData = () => {
  const [tasks, setTasks] = useState<Task[] | null>(null); // Initialize as null
  const [status, setStatus] = useState<Status[] | null>(null); // Initialize as null
  const [priority, setPriority] = useState<Priority[] | null>(null); // Initialize as null
  const [color, setColor] = useState<Color[] | null>(null); // Initialize as null
  const [items, setItems] = useState<Items>({});
  const [containers, setContainers] = useState(
    Object.keys(items as Items) as UniqueIdentifier[]
  );
  //const [containers, setContainers] = useState<string[] | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add a loading state
  const [error, setError] = useState<string | null>(null); // Add an error state

  const loadItems = async (): Promise<Record<string, string[]>> => {
    setLoading(true); // Set loading to true before fetching
    setError(null); // Clear any previous errors

    try {
      const [tasksResponse, statusResponse, priorityResponse, colorResponse] = await Promise.all([
        fetch("/api/task"),
        fetch("/api/status"),
        fetch("/api/priority"),
        fetch("/api/color"),
      ]);

      if (!tasksResponse.ok || !statusResponse.ok) {
        const errorText = await (tasksResponse.ok
          ? statusResponse.text()
          : tasksResponse.text());
        throw new Error(`Failed to fetch tasks or columns: ${errorText}`);
      }
      
      const t: Task[] = await tasksResponse.json();
      setTasks(t);
      const st: Status[] = await statusResponse.json();
      setStatus(st);
      const p: Priority[] = await priorityResponse.json();
      setPriority(p);
      const c: Color[] = await colorResponse.json();
      setColor(c);

      return st.reduce<Record<string, string[]>>((acc, stat) => {
        acc[stat.id] =
          t
            .filter((task) => task.statusId === stat.id)
            .map((task) => task.id) || [];
        return acc;
      }, {});
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (err: any) {
      // Type the error
      console.error("Error fetching data:", err);
      setError(String(err?.message)); // Set the error message
      return {}; // Return empty object in case of error, to not break the app
    } finally {
      setLoading(false); // Set loading to false after fetch, regardless of success/failure
    }
  };
  const getColor = (id: UniqueIdentifier) => {
    const taskStat =  findTaskById(id as string)?.statusId;
    if(color){
      if(taskStat){
        
      }
      const s =color.find((c) => c.id === findStatusById(taskStat as string)?.colorId);
      console.log(s,)
      return s?.color || '#f5f5f5';
    }
  };
  const findTaskById = (id: string) => {
    if(tasks){
      return tasks.find((task) => task.id === id);
    }
  };
  const findStatusById = (id: string) => {
    if(status){
      return status.find((stat) => stat.id === id);
    }
  };
  useEffect(() => {
    loadItems().then((data) => {
      //console.log(data, 'items');
      setItems(data);
      setContainers(Object.keys(data)); // No need for casting if keys are strings
    });
  }, []);

  return { color,tasks, status, priority, items, containers, loading, error, loadItems, setItems, getColor, findStatusById, findTaskById, setContainers }; 

};