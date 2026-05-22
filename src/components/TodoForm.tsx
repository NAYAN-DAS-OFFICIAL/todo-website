"use client";

interface TodoFormProps {
  task: string;
  setTask: (value: string) => void;
  addTodo: () => void;
  loading: boolean;
}

export default function TodoForm({
  task,
  setTask,
  addTodo,
  loading,
}: TodoFormProps) {

  return (

    <div className="flex gap-3 mb-8">

      <input
        type="text"
        placeholder="Enter a task..."
        value={task}
        onChange={(e) => setTask(e.target.value)}

        onKeyDown={(e) => {

          if (e.key === "Enter") {
            addTodo();
          }

        }}

        className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 outline-none focus:ring-2 focus:ring-black"
      />

      <button
        onClick={addTodo}
        className="px-6 py-4 bg-black text-white rounded-2xl hover:opacity-80 transition"
      >
      {loading ? "Adding..." : "Add"}
      </button>

    </div>

  );
}