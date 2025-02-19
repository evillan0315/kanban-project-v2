import { v4 as uuidv4 } from "uuid";
const defaultInitializer = (index: number) => index;

export function createRange<T = number>(
  length: number,
  initializer: (index: number) => any = defaultInitializer
): T[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}



const statuses = ["Todo", "In Progress", "Done"];

interface Task {
  id: string;
  status: string;
  taskName: string;
}

const defaultTaskInitializer = (index: number): Task => ({
  id: uuidv4(),
  status: statuses[index % statuses.length], // Cycles through statuses
  taskName: `Task ${index + 1}`,
});

export function createTaskRange(
  length: number,
  initializer: (index: number) => Task = defaultTaskInitializer
): Task[] {
  return [...new Array(length)].map((_, index) => initializer(index));
}



