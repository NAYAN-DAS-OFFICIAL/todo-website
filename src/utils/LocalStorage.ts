import { Todo } from "@/types/todo";
import { auth } from "@/firebase/firebase";

// GET USER STORAGE KEY
const getStorageKey = () => {

  const user = auth.currentUser;

  if (!user) {
    return "todos_guest";
  }

  return `todos_${user.uid}`;
};

// SAVE TODOS
export const saveTodos = (todos: Todo[]) => {

  if (typeof window === "undefined") {
    return;
  }

  localStorage.setItem(
    getStorageKey(),
    JSON.stringify(todos)
  );
};

// GET TODOS
export const getTodos = (): Todo[] => {

  if (typeof window === "undefined") {
    return [];
  }

  const storedTodos = localStorage.getItem(
    getStorageKey()
  );

  if (!storedTodos) {
    return [];
  }

  return JSON.parse(storedTodos);
};