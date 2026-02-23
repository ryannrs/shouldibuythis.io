"use client";

import { useState, useEffect } from "react";

const QUERY = 'analyze "Sony WH-1000XM5 Headphones"';

const LINES = [
  {
    agent: "ADVOCATE",
    color: "text-emerald-400",
    text: "Best-in-class ANC, 30hr battery, #1 rated by Wirecutter & RTINGS for 3 consecutive years.",
  },
  {
    agent: "SKEPTIC",
    color: "text-rose-400",
    text: "847 Reddit threads: plastic hinge cracks around 14 months. Mic quality heavily criticized on calls.",
  },
  {
    agent: "ECONOMIST",
    color: "text-indigo-400",
    text: "Currently $50 above 90-day low. Anker Q45 delivers 85% of performance at 38% of the cost ($59.99).",
  },
] as const;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

export default function TerminalMock() {
  const [queryLength, setQueryLength] = useState(0);
  const [agentLengths, setAgentLengths] = useState([0, 0, 0]);
  const [visibleLines, setVisibleLines] = useState(0);
  const [showVerdict, setShowVerdict] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function animate() {
      // Give the page a moment to settle before starting
      await sleep(1500);
      if (cancelled) return;

      // Simulate typing the query character by character
      for (let i = 1; i <= QUERY.length; i++) {
        if (cancelled) return;
        setQueryLength(i);
        await sleep(38);
      }

      await sleep(450);
      if (cancelled) return;

      // Stream each agent line like generated text
      for (let lineIdx = 0; lineIdx < LINES.length; lineIdx++) {
        if (cancelled) return;
        setVisibleLines(lineIdx + 1);

        const lineText = LINES[lineIdx].text;
        for (let charIdx = 1; charIdx <= lineText.length; charIdx++) {
          if (cancelled) return;
          setAgentLengths((prev) => {
            const next = [...prev];
            next[lineIdx] = charIdx;
            return next;
          });
          await sleep(14);
        }

        if (lineIdx < LINES.length - 1) {
          await sleep(280);
        }
      }

      await sleep(500);
      if (cancelled) return;
      setShowVerdict(true);
    }

    animate();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <div className="mt-14 bg-zinc-900/80 border border-zinc-800 rounded-2xl p-6 text-left max-w-2xl mx-auto shadow-[0_0_60px_rgba(99,102,241,0.1),0_0_0_1px_rgba(99,102,241,0.08)]">
      {/* Window chrome */}
      <div className="flex items-center gap-1.5 mb-5">
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <div className="w-3 h-3 rounded-full bg-zinc-700" />
        <span className="text-zinc-600 text-xs ml-2 font-mono">
          shouldibuythis.io · analysis engine
        </span>
      </div>

      {/* Prompt with typing cursor */}
      <p className="text-zinc-500 text-xs font-mono mb-4">
        ${" "}
        <span className="text-zinc-200">{QUERY.slice(0, queryLength)}</span>
        {queryLength < QUERY.length && (
          <span className="text-indigo-400 animate-pulse">▌</span>
        )}
      </p>

      {/* Agent output lines with streaming cursor */}
      {visibleLines > 0 && (
        <div className="space-y-3 font-mono text-xs">
          {LINES.map((line, i) =>
            visibleLines > i ? (
              <div key={i} className="flex items-start gap-3">
                <span className={`${line.color} flex-shrink-0 mt-0.5 inline-block min-w-[11ch]`}>
                  [{line.agent}]
                </span>
                <span className="text-zinc-400 leading-relaxed">
                  {line.text.slice(0, agentLengths[i])}
                  {agentLengths[i] < line.text.length && (
                    <span className="text-zinc-500 animate-pulse">▌</span>
                  )}
                </span>
              </div>
            ) : null
          )}
        </div>
      )}

      {/* Verdict */}
      {showVerdict && (
        <div className="border-t border-zinc-800 pt-4 mt-4 animate-in fade-in duration-500">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
            <span className="text-zinc-600 font-mono text-xs tracking-widest uppercase">
              Verdict
            </span>
            <span className="text-amber-400 font-bold text-sm tracking-wide">
              BUY THE ALTERNATIVE
            </span>
            <span className="text-zinc-500 text-xs">
              Anker Q45 · $59.99 · 94% confidence
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
