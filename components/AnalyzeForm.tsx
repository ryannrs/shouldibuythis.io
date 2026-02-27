"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "dont", label: "don't own" },
  { value: "have", label: "already own" },
] as const;

export default function AnalyzeForm() {
  const [product, setProduct] = useState("");
  const [ownership, setOwnership] = useState<"have" | "dont">("dont");
  const [existing, setExisting] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!product.trim() || loading) return;
    setLoading(true);
    setLimitError(null);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          product: product.trim(),
          owns: ownership === "have" ? existing.trim() || null : null,
        }),
      });
      if (res.status === 429) {
        const data = await res.json().catch(() => ({}));
        setLimitError(data.error ?? "You've used all your analyses. Reach out for more access.");
        setLoading(false);
        return;
      }
      if (!res.ok) {
        setLoading(false);
        return;
      }
      const { job_id } = await res.json();
      const params = new URLSearchParams({ q: product.trim(), job_id });
      if (ownership === "have" && existing.trim()) params.set("owns", existing.trim());
      router.push(`/results?${params.toString()}`);
    } catch {
      setLoading(false);
    }
  }

  const selectedLabel = OPTIONS.find((o) => o.value === ownership)?.label;

  return (
    <form onSubmit={handleSubmit} className="flex flex-col items-start gap-10">
      <p className="text-2xl sm:text-3xl font-medium leading-relaxed text-zinc-400 flex flex-wrap items-baseline gap-x-2.5 gap-y-4">
        <span>I&apos;m thinking about buying</span>

        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder="product name"
          autoFocus
          className="bg-transparent border-b border-zinc-600 focus:border-indigo-400 outline-none text-white placeholder-zinc-600 pb-0.5 px-1 transition-colors min-w-[18ch]"
          style={{ width: `${Math.max(product.length + 2, 18)}ch` }}
        />

        <span>and I</span>

        {/* Custom dropdown */}
        <div ref={dropdownRef} className="relative inline-block">
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="border-b border-zinc-600 hover:border-indigo-400 text-white pb-0.5 px-1 transition-colors inline-flex items-center gap-1.5 font-medium"
          >
            {selectedLabel}
            <svg
              className={`w-3.5 h-3.5 text-zinc-500 transition-transform duration-150 ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {open && (
            <div className="absolute top-full left-0 mt-2 bg-zinc-900 border border-zinc-700 rounded-lg overflow-hidden shadow-xl z-50 min-w-[10rem]">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setOwnership(opt.value);
                    setOpen(false);
                    if (opt.value === "dont") setExisting("");
                  }}
                  className={`w-full text-left px-4 py-2.5 text-sm transition-colors hover:bg-zinc-800 ${
                    ownership === opt.value
                      ? "text-indigo-400 font-medium"
                      : "text-zinc-300"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        <span>a similar product</span>

        {ownership === "have" && (
          <>
            <span>, mine is the</span>
            <input
              value={existing}
              onChange={(e) => setExisting(e.target.value)}
              placeholder="your current product"
              className="bg-transparent border-b border-zinc-600 focus:border-indigo-400 outline-none text-white placeholder-zinc-600 pb-0.5 px-1 transition-colors min-w-[18ch]"
              style={{ width: `${Math.max(existing.length + 2, 18)}ch` }}
            />
          </>
        )}

        <span>.</span>
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!product.trim() || loading}
          className="text-sm font-semibold text-white px-5 py-2.5 rounded-lg transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 self-start"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
          }}
        >
          {loading ? "Starting…" : "Analyze →"}
        </button>
        {limitError && (
          <p className="text-sm text-red-400">{limitError}</p>
        )}
      </div>
    </form>
  );
}
