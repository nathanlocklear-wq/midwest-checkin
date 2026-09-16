"use client";

import { useState } from "react";

type Props = {
  onSuccess: () => void;
};

export default function AdminLogin({ onSuccess }: Props) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  async function handleLogin() {
    const response = await fetch("/api/admin-login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ password }),
    });

    if (response.ok) {
      onSuccess();
    } else {
      setError("Incorrect password");
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#02112f]">
      <div className="w-full max-w-md rounded-3xl bg-white p-8 shadow-2xl">

        <h1 className="text-center text-3xl font-black text-[#02112f]">
          Admin Access
        </h1>

        <p className="mt-3 text-center text-slate-500">
          Enter the admin password
        </p>

        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              handleLogin();
            }
          }}
          className="mt-6 w-full rounded-xl border p-4 text-lg"
          placeholder="Password"
        />

        {error && (
          <p className="mt-3 text-center font-bold text-red-600">
            {error}
          </p>
        )}

        <button
          onClick={handleLogin}
          className="mt-6 w-full rounded-xl bg-[#e02427] py-4 text-xl font-black text-white"
        >
          LOGIN
        </button>

      </div>
    </div>
  );
}