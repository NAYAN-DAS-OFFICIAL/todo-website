"use client";

import { useState } from "react";

import { signup, login } from "@/auth/auth";

import { useRouter } from "next/navigation";

export default function LoginPage() {

  const router = useRouter();

  const [email, setEmail] = useState("");

  const [password, setPassword] =
    useState("");

  const [isLogin, setIsLogin] =
    useState(true);

  const [loading, setLoading] =
    useState(false);

  // HANDLE LOGIN / SIGNUP
  const handleSubmit = async () => {

    try {

      setLoading(true);

      if (isLogin) {

        await login(
          email,
          password
        );

        router.push("/");

      } else {

        await signup(
          email,
          password
        );

        alert(
          "Signup Successful 🚀"
        );

        setIsLogin(true);

        router.push("/login");
      }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {

      alert(error.message);

    } finally {

      setLoading(false);
    }
  };

  return (

    <main className="min-h-screen flex items-center justify-center bg-gray-100 p-4 sm:p-6">

      <div className="w-full max-w-md bg-white rounded-3xl shadow-xl p-5 sm:p-8">

        <h1 className="text-3xl sm:text-4xl font-bold text-center mb-6 sm:mb-8">

          {isLogin
            ? "Login 🔐"
            : "Signup 🚀"}

        </h1>

        <div className="flex flex-col gap-4">

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) =>
              setEmail(
                e.target.value
              )
            }
            className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-gray-300 outline-none"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) =>
              setPassword(
                e.target.value
              )
            }
            className="px-4 sm:px-5 py-3 sm:py-4 rounded-2xl border border-gray-300 outline-none"
          />

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-black text-white py-3 sm:py-4 rounded-2xl font-semibold"
          >

            {loading
              ? "Please wait..."
              : isLogin
              ? "Login"
              : "Create Account"}

          </button>

          <button
            onClick={() =>
              setIsLogin(
                !isLogin
              )
            }
            className="text-blue-600 text-sm sm:text-base"
          >

            {isLogin
              ? "Create new account"
              : "Already have account?"}

          </button>

        </div>

      </div>

    </main>
  );
}