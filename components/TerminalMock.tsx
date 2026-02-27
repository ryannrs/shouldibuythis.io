"use client";

import { useState, useEffect } from "react";

const PRODUCT = "AirPods Pro 4";

const AGENTS = [
  {
    key: "advocate",
    label: "Advocate",
    color: "text-emerald-400",
    dotColor: "bg-emerald-400",
    searches: ["AirPods Pro 4 review", "AirPods Pro 4 noise cancellation test"],
    analysis:
      "Best-in-class ANC with Adaptive Audio. Personalized Spatial Audio and a compact case set it apart from every competitor in this tier.",
  },
  {
    key: "skeptic",
    label: "Skeptic",
    color: "text-rose-400",
    dotColor: "bg-rose-400",
    searches: ["AirPods Pro 4 problems reddit", "AirPods Pro 4 battery complaints"],
    analysis:
      "Battery replacement is expensive post-warranty. ANC inconsistency in windy conditions flagged across multiple owner threads.",
  },
  {
    key: "economist",
    label: "Economist",
    color: "text-indigo-400",
    dotColor: "bg-indigo-400",
    searches: ["AirPods Pro 4 best price", "AirPods Pro alternatives"],
    analysis:
      "Currently at standard retail. Bose QuietComfort Earbuds II offer comparable ANC at a similar price point — worth comparing.",
  },
] as const;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function TerminalMock() {
  const [visibleAgents, setVisibleAgents] = useState(0);
  const [searchCounts, setSearchCounts] = useState([0, 0, 0]);
  const [analysisLengths, setAnalysisLengths] = useState([0, 0, 0]);
  const [showVerdict, setShowVerdict] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function animate() {
      await sleep(1000);
      if (cancelled) return;

      for (let agentIdx = 0; agentIdx < AGENTS.length; agentIdx++) {
        if (cancelled) return;
        setVisibleAgents(agentIdx + 1);

        const agent = AGENTS[agentIdx];

        for (let s = 0; s < agent.searches.length; s++) {
          await sleep(600);
          if (cancelled) return;
          setSearchCounts((prev) => {
            const next = [...prev];
            next[agentIdx] = s + 1;
            return next;
          });
        }

        await sleep(350);
        if (cancelled) return;

        for (let charIdx = 1; charIdx <= agent.analysis.length; charIdx++) {
          if (cancelled) return;
          setAnalysisLengths((prev) => {
            const next = [...prev];
            next[agentIdx] = charIdx;
            return next;
          });
          await sleep(15);
        }

        await sleep(280);
      }

      await sleep(450);
      if (cancelled) return;
      setShowVerdict(true);
    }

    animate();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-14 max-w-2xl mx-auto">
      <div className="bg-zinc-900/80 border border-zinc-800 rounded-2xl overflow-hidden shadow-[0_0_60px_rgba(99,102,241,0.1),0_0_0_1px_rgba(99,102,241,0.08)]">
        {/* Browser chrome */}
        <div className="flex items-center gap-2 px-4 py-3 border-b border-zinc-800">
          <div className="flex gap-1.5">
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
            <div className="w-3 h-3 rounded-full bg-zinc-700" />
          </div>
          <div className="flex-1 mx-2 bg-zinc-800 rounded-md px-3 py-1 text-xs text-zinc-500 font-mono truncate">
            shouldibuythis.io/results?q=AirPods+Pro+4
          </div>
        </div>

        {/* Content */}
        <div className="p-5 space-y-3">
          <p className="text-zinc-600 text-xs font-mono mb-1">
            Analyzing: <span className="text-zinc-400">{PRODUCT}</span>
          </p>

          {AGENTS.map((agent, idx) =>
            visibleAgents > idx ? (
              <div key={agent.key} className="border border-zinc-800 rounded-xl p-4">
                <div className="flex items-center gap-2 mb-3">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${agent.dotColor}`} />
                  <span className={`text-xs font-bold uppercase tracking-widest ${agent.color}`}>
                    {agent.label}
                  </span>
                </div>

                <div className="space-y-1.5 mb-3">
                  {agent.searches.slice(0, searchCounts[idx]).map((s) => (
                    <div key={s} className="flex items-center gap-2 text-xs text-zinc-600 font-mono">
                      <svg
                        className="w-3 h-3 flex-shrink-0"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth={2}
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                        />
                      </svg>
                      <span className="truncate">{s}</span>
                    </div>
                  ))}
                </div>

                {analysisLengths[idx] > 0 && (
                  <p className="text-zinc-400 text-xs leading-relaxed">
                    {agent.analysis.slice(0, analysisLengths[idx])}
                    {analysisLengths[idx] < agent.analysis.length && (
                      <span className="text-zinc-600 animate-pulse">▌</span>
                    )}
                  </p>
                )}
              </div>
            ) : null
          )}

          {showVerdict && (
            <div className="border border-emerald-500/20 bg-emerald-500/5 rounded-xl overflow-hidden animate-in fade-in duration-500">
              <div className="h-[2px] bg-emerald-500/50" />
              <div className="p-4">
                <div className="flex items-baseline gap-3 mb-3">
                  <span className="text-emerald-400 text-lg font-black tracking-tight">BUY</span>
                  <span className="text-emerald-400 text-sm font-bold">87%</span>
                  <span className="text-zinc-600 text-xs">Director confidence</span>
                </div>
                <ul className="space-y-1.5">
                  {[
                    "Top-rated ANC in its category",
                    "No critical failure patterns found",
                    "Price is fair for the feature set",
                  ].map((b) => (
                    <li key={b} className="flex items-start gap-2 text-xs text-zinc-500">
                      <span className="text-emerald-500 flex-shrink-0 mt-0.5">✓</span>
                      {b}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
