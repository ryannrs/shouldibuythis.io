"use client";

import { useState, useEffect, type FormEvent } from "react";

type Status = "idle" | "loading" | "success" | "error";

interface WaitlistModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function WaitlistModal({ isOpen, onClose }: WaitlistModalProps) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState("");

  // Close on Escape key
  useEffect(() => {
    if (!isOpen) return;
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen, onClose]);

  // Reset state each time the modal opens
  useEffect(() => {
    if (isOpen) {
      setEmail("");
      setStatus("idle");
      setMessage("");
    }
  }, [isOpen]);

  // Auto-close after success
  useEffect(() => {
    if (status === "success") {
      const t = setTimeout(onClose, 2800);
      return () => clearTimeout(t);
    }
  }, [status, onClose]);

  if (!isOpen) return null;

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
      } else {
        setStatus("error");
        setMessage(data.error ?? "Something went wrong. Please try again.");
      }
    } catch {
      setStatus("error");
      setMessage("Network error. Please try again.");
    }
  }

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Card */}
      <div className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-8 shadow-2xl shadow-black/60">
        {/* Subtle top glow */}
        <div
          className="absolute inset-x-0 top-0 h-px rounded-t-2xl"
          style={{
            background:
              "linear-gradient(90deg, transparent, rgba(99,102,241,0.4), transparent)",
          }}
        />

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-zinc-600 hover:text-zinc-300 transition-colors"
          aria-label="Close"
        >
          <svg
            className="w-5 h-5"
            fill="none"
            stroke="currentColor"
            strokeWidth={2}
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>

        {status === "success" ? (
          <div className="text-center py-4">
            <div className="w-14 h-14 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center mx-auto mb-5">
              <svg
                className="w-7 h-7 text-emerald-400"
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
            </div>
            <h3 className="text-white font-bold text-xl mb-2">{message}</h3>
            <p className="text-zinc-400 text-sm leading-relaxed">
              Check your inbox for a confirmation. This window will close
              shortly.
            </p>
          </div>
        ) : (
          <>
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <div
                  className="w-6 h-6 rounded-md flex items-center justify-center flex-shrink-0"
                  style={{
                    background:
                      "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
                  }}
                >
                  <svg
                    className="w-3.5 h-3.5 text-white"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth={2.5}
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
                    />
                  </svg>
                </div>
                <span className="font-bold text-white text-base tracking-tight">
                  ShouldIBuyThis<span className="text-indigo-400">.io</span>
                </span>
              </div>
              <h3 className="text-white font-bold text-xl mb-1.5">
                Join the waitlist
              </h3>
              <p className="text-zinc-400 text-sm leading-relaxed">
                Get early access and help shape what gets built.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                required
                autoFocus
                disabled={status === "loading"}
                className="bg-zinc-950 border border-zinc-700 hover:border-zinc-600 focus:border-indigo-500 focus:outline-none text-white placeholder-zinc-600 rounded-xl px-4 py-3.5 text-sm transition-colors disabled:opacity-60"
              />
              <button
                type="submit"
                disabled={status === "loading"}
                style={{
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
                }}
                className="hover:opacity-90 active:opacity-80 text-white font-semibold px-6 py-3.5 rounded-xl transition-opacity text-sm disabled:opacity-60"
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
                  "Get Early Access →"
                )}
              </button>
            </form>

            {status === "error" && (
              <p className="text-rose-400 text-xs mt-2.5">{message}</p>
            )}

            <p className="text-zinc-700 text-xs mt-4 text-center">
              No spam, ever. Unsubscribe anytime.
            </p>
          </>
        )}
      </div>
    </div>
  );
}
