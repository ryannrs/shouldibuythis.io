"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";

const OPTIONS = [
  { value: "dont", label: "don't own" },
  { value: "have", label: "already own" },
] as const;

const PLACEHOLDERS = [
  "e.g. AirPods Pro 4",
  "e.g. Sony WH-1000XM5",
  "e.g. iPad Air M2",
  "e.g. Dyson V15 Detect",
  "e.g. Kindle Paperwhite 16GB",
  "e.g. Apple Watch Series 10",
  "e.g. Vitamix A3500",
  "e.g. Oura Ring Gen 4",
  "e.g. LG C4 OLED 65\"",
  "e.g. Theragun Pro",
  "e.g. Garmin Fenix 8",
  "e.g. Ninja Creami",
];

export default function AnalyzeForm() {
  const [product, setProduct] = useState("");
  const [ownership, setOwnership] = useState<"have" | "dont">("dont");
  const [existing, setExisting] = useState("");
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [limitError, setLimitError] = useState<string | null>(null);
  const [placeholder, setPlaceholder] = useState("e.g. AirPods Pro 4");
  const [mounted, setMounted] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  // Pick a random placeholder and mark mounted (both avoid SSR hydration mismatch)
  useEffect(() => {
    setPlaceholder(PLACEHOLDERS[Math.floor(Math.random() * PLACEHOLDERS.length)]);
    setMounted(true);
  }, []);

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
    <form onSubmit={handleSubmit} className={`flex flex-col items-start gap-10 transition-opacity duration-500 ${mounted ? "opacity-100" : "opacity-0"}`}>
      <p className="text-4xl sm:text-5xl lg:text-7xl font-medium leading-relaxed text-zinc-400 flex flex-wrap items-baseline gap-x-4 gap-y-5">
        <span>I&apos;m thinking about buying the</span>

        <input
          value={product}
          onChange={(e) => setProduct(e.target.value)}
          placeholder={placeholder}
          autoFocus
          className="bg-transparent border-b border-zinc-600 focus:border-indigo-400 outline-none text-white placeholder-zinc-600 pb-0.5 px-1 transition-colors"
          style={{ width: `${product.length > 0 ? Math.max(product.length + 2, 12) : placeholder.length}ch` }}
        />

        <span>and I</span>

        {/* Custom dropdown */}
        <div ref={dropdownRef} className="relative inline-flex items-baseline">
          {/* Trigger — hidden behind overlay when open */}
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            className="text-4xl sm:text-5xl lg:text-7xl font-medium outline-none text-white pb-0.5 px-1 transition-colors inline-flex items-center gap-2 border-b border-zinc-600 hover:border-indigo-400"
          >
            {selectedLabel}
            <svg
              className={`w-8 h-8 sm:w-10 sm:h-10 text-zinc-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
            </svg>
          </button>

          {/* Panel — drops below the trigger */}
          {open && (
            <div className="absolute top-full left-0 mt-3 z-50 flex flex-col rounded-xl bg-zinc-950/80 backdrop-blur-md px-2 py-2">
              {OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  type="button"
                  onClick={() => {
                    setOwnership(opt.value);
                    setOpen(false);
                    if (opt.value === "dont") setExisting("");
                  }}
                  className={`text-4xl sm:text-5xl lg:text-7xl font-medium text-left outline-none px-1 whitespace-nowrap transition-all duration-150 ${
                    ownership === opt.value
                      ? "text-white"
                      : "text-zinc-500 hover:text-white hover:[text-shadow:0_0_30px_rgba(255,255,255,0.5)]"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          )}
        </div>

        {ownership === "dont" ? (
          <span>a similar product.</span>
        ) : (
          <>
            <span>a similar product, mine is the</span>
            <span className="inline-flex items-baseline">
              <input
                value={existing}
                onChange={(e) => setExisting(e.target.value)}
                placeholder="your current product"
                className="bg-transparent border-b border-zinc-600 focus:border-indigo-400 outline-none text-white placeholder-zinc-600 pb-0.5 px-1 transition-colors"
                style={{ width: `${existing.length > 0 ? Math.max(existing.length + 2, 12) : 19}ch` }}
              />
              <span>.</span>
            </span>
          </>
        )}
      </p>

      <div className="flex flex-col gap-3">
        <button
          type="submit"
          disabled={!product.trim() || loading}
          className="text-base sm:text-lg font-semibold text-white px-7 py-3.5 rounded-xl transition-opacity disabled:opacity-30 disabled:cursor-not-allowed hover:opacity-90 self-start"
          style={{
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
          }}
        >
          {loading ? "Starting…" : "Analyze →"}
        </button>
        {product.trim().length > 0 && !product.trim().includes(" ") && (
          <p className="text-xs text-zinc-600">
            Being more specific (e.g. model number) leads to better results.
          </p>
        )}
        {limitError && (
          <p className="text-sm text-red-400">{limitError}</p>
        )}
      </div>
    </form>
  );
}
