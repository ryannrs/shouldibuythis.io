"use client";

import { useState, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface WaitlistFormProps {
  buttonText?: string;
}

export default function WaitlistForm({
  buttonText = "Join the Waitlist →",
}: WaitlistFormProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (status === "loading") return;

    setStatus("loading");
    setMessage("");

    try {
      const res = await fetch("/api/waitlist", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setStatus("success");
        setMessage(data.message ?? "You're on the list!");
        setEmail("");
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  if (status === "success") {
    return (
      <div className="flex flex-col items-center gap-2 py-3">
        <div className="flex items-center gap-2 text-emerald-400">
          <svg
            className="w-5 h-5 flex-shrink-0"
            fill="none"
            stroke="currentColor"
            strokeWidth={2.5}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span className="font-semibold text-sm">{message}</span>
        </div>
        <p className="text-xs text-zinc-600">No spam, ever.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto"
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="your@email.com"
          required
          disabled={status === "loading"}
          className="flex-1 bg-zinc-900 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm transition-colors disabled:opacity-60"
        />
        <button
          type="submit"
          disabled={status === "loading"}
          style={{
            background:
              "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
          }}
          className="flex-shrink-0 hover:opacity-90 active:opacity-80 text-white font-semibold px-6 py-3.5 rounded-xl transition-opacity whitespace-nowrap text-sm disabled:opacity-60"
        >
          {status === "loading" ? (
            <span className="flex items-center gap-2 justify-center">
              <svg
                className="w-4 h-4 animate-spin"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                />
              </svg>
              Joining...
            </span>
          ) : (
            buttonText
          )}
        </button>
      </form>

      {status === "error" && (
        <p className="text-rose-400 text-xs mt-2.5 text-center">{message}</p>
      )}
    </div>
  );
}
