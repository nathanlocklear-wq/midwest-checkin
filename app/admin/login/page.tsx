"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const router = useRouter();

  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function login() {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        password,
      }),
    });

    if (response.ok) {

      router.replace("/admin");
      router.refresh();
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02112f]">

      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <h1 className="text-center text-3xl font-black text-[#02112f]">
          Admin Login
        </h1>

        <p className="mt-3 text-center text-slate-500">
          MidwestTechTalk Check-In
        </p>

        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) =>
            setPassword(e.target.value)
          }
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              login();
            }
          }}
          className="mt-6 w-full rounded-xl border p-4"
        />

        {error && (
          <p className="mt-3 text-center font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={login}
          className="mt-6 w-full rounded-xl bg-[#e02427] py-4 font-black text-white"
        >
          LOGIN
        </button>

      </div>

    </div>
  );
}