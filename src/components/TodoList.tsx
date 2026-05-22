import TodoItem from "./TodoItem";

import { Todo } from "@/types/todo";

interface TodoListProps {

  todos: Todo[];

  deleteTodo: (id: string) => void;

  toggleComplete: (id: string) => void;

  editingId: string | null;

  editingText: string;

  setEditingId: (
    id: string | null
  ) => void;

  setEditingText: (
    text: string
  ) => void;

  saveEdit: (id: string) => void;
}

export default function TodoList({

  todos,

  deleteTodo,

  toggleComplete,

  editingId,

  editingText,

  setEditingId,

  setEditingText,

  saveEdit,

}: TodoListProps) {

  return (

    <div className="space-y-4">

      {todos.map((todo) => (

        <TodoItem
          key={todo.id}

          todo={todo}

          deleteTodo={deleteTodo}

          toggleComplete={toggleComplete}

          editingId={editingId}

          editingText={editingText}

          setEditingId={setEditingId}

          setEditingText={setEditingText}

          saveEdit={saveEdit}
        />

      ))}

    </div>
  );
}