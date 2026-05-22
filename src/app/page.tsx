"use client";

import { db, auth } from "@/firebase/firebase";
import {
  collection,
  addDoc,
  getDocs,
  query,
  where,
  deleteDoc,
  doc,
} from "firebase/firestore";
import { logout } from "@/auth/auth";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import TodoForm from "@/components/TodoForm";
import TodoList from "@/components/TodoList";
import { Todo } from "@/types/todo";
import { format } from "date-fns";
import toast, { Toaster } from "react-hot-toast";

export default function Home() {
  const router = useRouter();

  const [task, setTask] = useState("");

  const [date, setDate] = useState("");

  const [time, setTime] = useState("");

  const [priority, setPriority] = useState<
    "High" |
    "Medium" |
    "Low"
  >("Medium");

  const [search, setSearch] =
  useState("");

  const [selectedDate, setSelectedDate] =
    useState(
      format(new Date(), "yyyy-MM-dd")
    );

  const [loading, setLoading] = useState(false);
  
  const [filter, setFilter] = useState<
    "all" |
    "today" |
    "completed" |
    "pending" |
    "date"
  >("all");
 
  const user = auth.currentUser;

  const [todos, setTodos] = useState<Todo[]>([]);

  const [editingId, setEditingId] =
    useState<string | null>(null);

  const [editingText, setEditingText] =
    useState("");

  useEffect(() => {
    if (Notification.permission !== "granted") {
      Notification.requestPermission();
    }
  }, []);


  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(
      async (currentUser) => {
        if (!currentUser) return;

        const q = query(
          collection(db, "todos"),
          where("userId", "==", currentUser.uid)
        );

        const querySnapshot = await getDocs(q);

        const userTodos: Todo[] = [];

        querySnapshot.forEach((doc) => {
          userTodos.push({
            id: doc.id,
            ...doc.data(),
          } as Todo);
        });

        setTodos(userTodos);

        setDate(format(new Date(), "yyyy-MM-dd"));

        setTime(
          new Date().toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: false,
          })
        );
      }
    );

    return () => unsubscribe();
  }, []);

  /* NOTIFICATION EFFECT */
  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      todos.forEach((todo) => {
        if (todo.completed) return;

        const taskDateTime = new Date(`${todo.date} ${todo.time}`);

        const diff =
          taskDateTime.getTime() - now.getTime();

        const thirtyMinutes = 30 * 60 * 1000;

        const twentyNineMinutes = 29 * 60 * 1000;

        if (
          diff > twentyNineMinutes &&
          diff <= thirtyMinutes
        ) {

          const notifiedKey = `notified-${todo.id}`;

          if (localStorage.getItem(notifiedKey)) return;

          new Notification("⏰ Task Reminder", {
            body: `${todo.text} starts in 30 minutes`,
          });

          localStorage.setItem(notifiedKey, "true");
        }
      });
    }, 60000);

    return () => clearInterval(interval);
  }, [todos]);
  
  const handleLogout = async () => {
    await logout();

    router.push("/login");
  };


  // ADD TODO
  const addTodo = async () => {
    setLoading(true);
    if (!task.trim() || !date || !time) return;

    if (!user) return;

    const docRef = await addDoc(collection(db, "todos"), {
      userId: user.uid,
      text: task,
      completed: false,
      date,
      time: new Date(
        `1970-01-01T${time}`
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      priority,
      
    });

    setLoading(false);

    // ADD TODO TO STATE
    const newTodo = {
      id: docRef.id,
      userId: user.uid,
      text: task,
      completed: false,
      date,
      time: new Date(
        `1970-01-01T${time}`
      ).toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }),
      priority,
    };

    setTodos((prev) => [...prev, newTodo]);
    toast.success("Todo added successfully!");

    setTask("");
    setPriority("Medium");

    // RESET DATE
    setDate(format(new Date(), "yyyy-MM-dd"));

    // RESET TIME
    setTime(
      new Date().toLocaleTimeString("en-IN", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      })
    );
  };

  // DELETE TODO
  const deleteTodo = async (id: string) => {
    await deleteDoc(doc(db, "todos", id));

    setTodos((prev) =>
      prev.filter((todo) => todo.id !== id)
    );
  };

  // TOGGLE COMPLETE
  const toggleComplete = (id: string) => {

    const updatedTodos = todos.map((todo) => {

      if (todo.id === id) {

        return {
          ...todo,
          completed: !todo.completed,
        };
      }

      return todo;

    });

    setTodos(updatedTodos);
  };

  // SAVE EDIT
  const saveEdit = (id: string) => {

    if (!editingText.trim()) return;

    const updatedTodos = todos.map((todo) => {

      if (todo.id === id) {

        return {
          ...todo,
          text: editingText,
        };
      }

      return todo;
    });

    setTodos(updatedTodos);

    setEditingId(null);

    setEditingText("");
  };

  // FILTER TODOS
  const filteredTodos = todos.filter(
    (todo) => {

      // TODAY
      if (filter === "today") {

        return (
          todo.date ===
          format(new Date(), "yyyy-MM-dd")
        );
      }

      // COMPLETED
      if (filter === "completed") {

        return todo.completed;
      }

      // PENDING
      if (filter === "pending") {

        return !todo.completed;
      }

      // DATE FILTER
      if (filter === "date") {

        return (
          todo.date === selectedDate
        );
      }

      // SEARCH
      if (
        !todo.text
          .toLowerCase()
          .includes(search.toLowerCase())
      ) {
        return false;
      }

      // ALL
      return true;
    }
  );

  return (
    <main className="min-h-screen bg-gray-100 flex items-center justify-center p-2 sm:p-6">

      <Toaster position="top-right" />

      <div className="w-full max-w-2xl bg-white rounded-3xl shadow-xl p-4 sm:p-8">

        <h1 className="text-2xl sm:text-4xl font-bold text-center mb-8">
          Todo Website 🚀
        </h1>

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-8">
          <h1 className="text-xl sm:text-2xl font-bold text-center sm:text-left">
            List Your Daily Plan Here 🗓️
          </h1>

          {/* LOGOUT BUTTON */}
          <button
            onClick={handleLogout}
            className="bg-red-500 text-white px-4 py-2 rounded-xl"
          >
            Logout
          </button>
        </div>

        {/* TASK INPUT */}
        <div className="flex flex-col gap-4 mb-8">

          <TodoForm
            task={task}
            setTask={setTask}
            addTodo={addTodo}
            loading={loading}
          />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">

            <input
              type="date"
              value={date}
              onChange={(e) =>
                setDate(e.target.value)
              }
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 outline-none"
            />

            <input
              type="time"
              value={time}
              onChange={(e) =>
                setTime(e.target.value)
              }
              className="flex-1 px-5 py-4 rounded-2xl border border-gray-300 outline-none"
            />

            <select
              value={priority}
              onChange={(e) =>
                setPriority(
                  e.target.value as
                    | "High"
                    | "Medium"
                    | "Low"
                )
              }
              className="w-full px-5 py-4 rounded-2xl border border-gray-300 outline-none"
            >

              <option value="High">
                🔥 High
              </option>

              <option value="Medium">
                ⚡ Medium
              </option>

              <option value="Low">
                🌿 Low
              </option>

            </select>

          </div>

        </div>

        {/* SEARCH BAR */}

        <input
          type="text"
          placeholder="🔎 Search tasks..."
          value={search}
          onChange={(e) =>
            setSearch(e.target.value)
          }
          className="w-full px-5 py-4 mb-6 rounded-2xl border border-gray-300 outline-none focus:ring-2 text-sm sm:text-base"
        />

        {/* FILTER BUTTONS */}
        <div className="flex flex-wrap gap-2 sm:gap-3 mb-6 justify-center">

          <button
            onClick={() => setFilter("all")}
            className={`px-4 sm:px-5 py-2 rounded-xl transition text-sm sm:text-base ${
              filter === "all"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            All
          </button>

          <button
            onClick={() => setFilter("today")}
            className={`px-4 sm:px-5 py-2 rounded-xl transition text-sm sm:text-base ${
              filter === "today"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Today
          </button>

          <button
            onClick={() => setFilter("completed")}
            className={`px-4 sm:px-5 py-2 rounded-xl transition text-sm sm:text-base ${
              filter === "completed"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Completed
          </button>

          <button
            onClick={() => setFilter("pending")}
            className={`px-4 sm:px-5 py-2 rounded-xl transition text-sm sm:text-base ${
              filter === "pending"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Pending
          </button>

          <button
            onClick={() => setFilter("date")}
            className={`px-4 sm:px-5 py-2 rounded-xl transition text-sm sm:text-base ${
              filter === "date"
                ? "bg-black text-white"
                : "bg-gray-200"
            }`}
          >
            Date Filter
          </button>

        </div>

        {/* DATE FILTER INPUT */}
        {filter === "date" && (

          <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
              setSelectedDate(
                e.target.value
              )
            }
            className="w-full mb-8 px-5 py-4 rounded-2xl border border-gray-300 outline-none"
          />

        )}

        {/* TODO LIST */}
        <TodoList
          todos={filteredTodos}
          deleteTodo={deleteTodo}
          toggleComplete={toggleComplete}

          editingId={editingId}
          editingText={editingText}

          setEditingId={setEditingId}
          setEditingText={setEditingText}

          saveEdit={saveEdit}
        />

      </div>

    </main>
  );
}