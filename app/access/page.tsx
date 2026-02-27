"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Nav from "@/components/Nav";

function AccessForm() {
  const [code, setCode] = useState("");
  const [error, setError] = useState(false);
  const [loading, setLoading] = useState(false);
  const searchParams = useSearchParams();
  const next = searchParams.get("next") || "/analyze";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!code.trim() || loading) return;
    setLoading(true);
    setError(false);

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code.trim(), next }),
    });

    if (res.ok) {
      window.location.href = next;
    } else {
      setError(true);
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-8">
      <div className="flex flex-col gap-2">
        <p className="text-2xl sm:text-3xl font-medium text-zinc-400">
          Enter your access code
        </p>
        <p className="text-sm text-zinc-600">
          ShouldIBuyThis.io is currently invite-only.
        </p>
      </div>

      <div className="flex flex-col gap-3 w-full max-w-sm">
        <input
          type="password"
          value={code}
          onChange={(e) => { setCode(e.target.value); setError(false); }}
          placeholder="access code"
          autoFocus
          className={`bg-transparent border-b ${
            error ? "border-rose-500" : "border-zinc-600 focus:border-indigo-400"
          } outline-none text-white placeholder-zinc-600 pb-1 px-1 transition-colors text-lg w-full`}
        />
        {error && (
          <p className="text-rose-400 text-xs font-mono">incorrect code</p>
        )}
      </div>

      <button
        type="submit"
        disabled={!code.trim() || loading}
        className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90"
        style={{
          background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
        }}
      >
        {loading ? "Checking…" : "Continue →"}
      </button>
    </form>
  );
}

export default function AccessPage() {
  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-6">
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background: "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="max-w-3xl w-full relative z-10">
          <Suspense>
            <AccessForm />
          </Suspense>
        </div>
      </main>
    </>
  );
}
