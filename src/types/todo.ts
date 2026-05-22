export interface Todo {
  id: string;

  text: string;

  completed: boolean;

  date: string;

  time: string;

  priority: "High" | "Medium" | "Low";
}