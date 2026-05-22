"use client";

import { Todo } from "@/types/todo";

type TodoItemProps = {
  todo: Todo;
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
};

export default function TodoItem({
  todo,
  deleteTodo,
  toggleComplete,

  editingId,
  editingText,

  setEditingId,
  setEditingText,

  saveEdit,

}: TodoItemProps) {

  return (

    <div className="bg-gray-100 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4">

      <div className="flex items-start gap-4 flex-1 w-full">

        <input
          type="checkbox"
          checked={todo.completed}
          onChange={() => toggleComplete(todo.id)}
          className="w-5 h-5"
        />

        <div className="flex-1">

          {editingId === todo.id ? (

            <input
              type="text"
              value={editingText}
              onChange={(e) =>
                setEditingText(e.target.value)
              }
              className="w-full px-4 py-2 rounded-xl border border-gray-300 outline-none"
            />

          ) : (

            <>

              <p
                className={
                  todo.completed
                    ? "text-lg line-through text-gray-400"
                    : "text-base sm:text-lg break-words"
                }
              >
                {todo.text}
              </p>

              <div className="text-sm text-gray-500 mt-1">

                📅 {todo.date} • ⏰ {todo.time}

              </div>

              <div className="mt-2">

                <span
                    className={`px-3 py-1 rounded-full text-sm font-semibold
                    ${
                    todo.priority === "High"
                        ? "bg-red-100 text-red-600"

                        : todo.priority === "Medium"
                        ? "bg-yellow-100 text-yellow-600"

                        : "bg-green-100 text-green-600"
                    }`}
                >

                    {todo.priority === "High" && "🔥 High"}

                    {todo.priority === "Medium" && "⚡ Medium"}

                    {todo.priority === "Low" && "🌿 Low"}

                </span>

                </div>

            </>

          )}

        </div>

      </div>

      <div className="flex items-center gap-4 ml-0 sm:ml-4 flex-wrap">

        {editingId === todo.id ? (

          <>

            <button
              onClick={() => saveEdit(todo.id)}
              className="text-green-600 font-semibold"
            >
              Save
            </button>

            <button
              onClick={() => setEditingId(null)}
              className="text-gray-500 font-semibold"
            >
              Cancel
            </button>

          </>

        ) : (

          <button
            onClick={() => {

              setEditingId(todo.id);

              setEditingText(todo.text);

            }}
            className="text-blue-500 font-semibold"
          >
            Edit
          </button>

        )}

        <button
          onClick={() => deleteTodo(todo.id)}
          className="text-red-500 font-semibold"
        >
          Delete
        </button>

      </div>

    </div>
  );
}