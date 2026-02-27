"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

// ─── Types ────────────────────────────────────────────────────────────────────

type AgentKey = "advocate" | "skeptic" | "economist";
type AgentPhase = "idle" | "searching" | "pre-writing" | "writing" | "done";

type Step = { type: "think"; text: string } | { type: "search"; query: string };

type Alternative = { name: string; price: string; note: string };

type VerdictData = {
  decision: string;
  confidence: number;
  reasoning: string;
  alternative?: string | null;
};

type AgentMeta = {
  key: AgentKey;
  label: string;
  borderColor: string;
  activeBorderColor: string;
  badgeText: string;
  dotColor: string;
  glowColor: string;
};

const AGENTS: AgentMeta[] = [
  { key: "advocate",  label: "ADVOCATE",  borderColor: "border-emerald-500/20", activeBorderColor: "border-emerald-500/50", badgeText: "text-emerald-400", dotColor: "bg-emerald-400", glowColor: "rgba(16,185,129,0.2)"   },
  { key: "skeptic",   label: "SKEPTIC",   borderColor: "border-rose-500/20",    activeBorderColor: "border-rose-500/50",    badgeText: "text-rose-400",    dotColor: "bg-rose-400",    glowColor: "rgba(244,63,94,0.2)"   },
  { key: "economist", label: "ECONOMIST", borderColor: "border-indigo-500/20",  activeBorderColor: "border-indigo-500/50",  badgeText: "text-indigo-400",  dotColor: "bg-indigo-400",  glowColor: "rgba(99,102,241,0.2)"  },
];

const VERDICT_COLORS: Record<string, string> = {
  BUY: "text-emerald-400",
  WAIT: "text-amber-400",
  "CONSIDER ALTERNATIVES": "text-indigo-400",
  SKIP: "text-rose-400",
};

// ─── Streaming hook ───────────────────────────────────────────────────────────

function useStreamText(fullText: string, active: boolean, onDone: () => void) {
  const [charIdx, setCharIdx] = useState(0);
  const onDoneRef = useRef(onDone);
  useEffect(() => { onDoneRef.current = onDone; });

  useEffect(() => {
    if (!active || !fullText) return;
    setCharIdx(0);
    const interval = setInterval(() => {
      setCharIdx((i) => {
        const next = i + 3;
        if (next >= fullText.length) {
          clearInterval(interval);
          setTimeout(() => onDoneRef.current(), 350);
          return fullText.length;
        }
        return next;
      });
    }, 10);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active, fullText]);

  const displayed = fullText.slice(0, charIdx);
  const done = charIdx >= fullText.length;
  return { displayed, done };
}

// ─── Text rendering ───────────────────────────────────────────────────────────

function renderWithBold(text: string) {
  const parts = text.split(/\*\*(.*?)\*\*/g);
  return parts.map((part, i) =>
    i % 2 === 1 ? (
      <strong key={i} className="text-white font-semibold">{part}</strong>
    ) : (
      part
    )
  );
}

function StreamingText({ displayed, done }: { displayed: string; done: boolean }) {
  const paragraphs = displayed.split("\n\n");
  return (
    <div className="text-zinc-300 text-sm leading-relaxed space-y-3">
      {paragraphs.map((para, i) => {
        const isLast = i === paragraphs.length - 1;
        return (
          <p key={i}>
            {isLast && !done ? (
              <>
                {para.replace(/\*\*/g, "")}
                <span className="text-zinc-500 animate-pulse">▌</span>
              </>
            ) : (
              renderWithBold(para)
            )}
          </p>
        );
      })}
    </div>
  );
}

// ─── Agent section ────────────────────────────────────────────────────────────

function AgentSection({
  agent,
  steps,
  analysis,
  phase,
  onWriteDone,
}: {
  agent: AgentMeta;
  steps: Step[];
  analysis: string;
  phase: AgentPhase;
  onWriteDone: () => void;
}) {
  const [collapsed, setCollapsed] = useState(true);

  const writeActive = phase === "writing" || phase === "done";
  const { displayed, done: writeDone } = useStreamText(analysis, writeActive, onWriteDone);

  const isActive = phase === "searching" || phase === "pre-writing" || (phase === "writing" && !writeDone);
  const lastStep = steps[steps.length - 1];
  const searchCount = steps.filter((s) => s.type === "search").length;

  type StatusState = "thinking" | "researching" | "analyzing";
  const statusState: StatusState | null =
    phase === "searching" && lastStep?.type === "think" ? "thinking" :
    phase === "searching" ? "researching" :
    phase === "pre-writing" ? "analyzing" :
    phase === "writing" && !writeDone ? "analyzing" :
    null;

  const statusConfig: Record<StatusState, { text: string; dotClass: string; textClass: string }> = {
    thinking:    { text: "Thinking",    dotClass: "bg-amber-400",  textClass: "text-amber-400"  },
    researching: { text: "Researching", dotClass: agent.dotColor,  textClass: agent.badgeText   },
    analyzing:   { text: "Analyzing",   dotClass: "bg-violet-400", textClass: "text-violet-400" },
  };

  let searchIdx = 0;

  return (
    <div className="relative">
      {/* Breathing glow — pulses only while the agent is actively working */}
      {isActive && (
        <div
          className="absolute inset-0 rounded-2xl pointer-events-none animate-pulse"
          style={{ boxShadow: `0 0 0 1px ${agent.glowColor}, 0 0 24px 0 ${agent.glowColor}` }}
        />
      )}

      <div className={`bg-zinc-900/60 border ${isActive ? agent.activeBorderColor : agent.borderColor} rounded-2xl overflow-hidden transition-colors duration-500`}>
        {/* Header */}
        <div className={`px-5 py-3 border-b ${isActive ? agent.activeBorderColor : agent.borderColor} flex items-center justify-between transition-colors duration-500`}>

          {/* Left: label + live status pill */}
          <div className="flex items-center gap-2">
            {statusState ? (
              <>
                <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 animate-pulse ${statusConfig[statusState].dotClass}`} />
                <span className={`text-xs font-bold tracking-widest ${agent.badgeText}`}>{agent.label}</span>
                <span className="text-xs text-zinc-700">·</span>
                <span className={`text-xs font-semibold ${statusConfig[statusState].textClass}`}>
                  {statusConfig[statusState].text}
                </span>
              </>
            ) : (
              <span className={`text-xs font-bold tracking-widest ${agent.badgeText}`}>{agent.label}</span>
            )}
          </div>

          {/* Right: search count + collapse toggle */}
          {steps.length > 0 && (
            <button
              onClick={() => setCollapsed((c) => !c)}
              className="flex items-center gap-1.5 text-xs font-mono text-zinc-600 hover:text-zinc-400 transition-colors"
            >
              {!statusState && <span>{searchCount} searches</span>}
              <svg
                className={`w-3 h-3 transition-transform duration-150 ${collapsed ? "-rotate-90" : ""}`}
                fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
          )}
        </div>

        {/* Step log */}
        {steps.length > 0 && !collapsed && (
          <div className={`px-5 pt-3 pb-3 space-y-1.5 text-xs${writeActive ? " border-b border-zinc-800/60" : ""}`}>
            {steps.map((step, i) => {
              const isLast = i === steps.length - 1;
              const showCursor = isLast && phase === "searching";

              if (step.type === "think") {
                return (
                  <div key={i} className="text-zinc-600 italic pl-1 py-px">
                    {step.text}
                    {showCursor && <span className="text-zinc-700 animate-pulse ml-0.5">▌</span>}
                  </div>
                );
              }

              searchIdx++;
              return (
                <div key={i} className="flex items-start gap-3 font-mono">
                  <span className="text-zinc-700 flex-shrink-0 select-none">
                    {String(searchIdx).padStart(2, "0")}
                  </span>
                  <span className={`text-zinc-500${isLast && phase === "searching" ? " text-zinc-400" : ""}`}>
                    &quot;{step.query}&quot;
                    {showCursor && <span className="text-zinc-600 animate-pulse ml-0.5">▌</span>}
                  </span>
                </div>
              );
            })}
          </div>
        )}

        {/* Analysis */}
        {writeActive && (
          <div className="px-5 pt-4 pb-5">
            <StreamingText displayed={displayed} done={writeDone} />
          </div>
        )}
      </div>
    </div>
  );
}

// ─── Alternatives card ────────────────────────────────────────────────────────

function AlternativesCard({ alternatives }: { alternatives: Alternative[] }) {
  const router = useRouter();
  const [running, setRunning] = useState<number | null>(null);

  async function runAnalysis(productName: string, idx: number) {
    if (running !== null) return;
    setRunning(idx);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productName }),
      });
      const { job_id } = await res.json();
      router.push(`/results?${new URLSearchParams({ q: productName, job_id }).toString()}`);
    } catch {
      setRunning(null);
    }
  }

  return (
    <div className="bg-zinc-900/60 border border-zinc-700/40 rounded-2xl overflow-hidden">
      <div className="px-5 py-3 border-b border-zinc-700/40">
        <span className="text-xs font-bold tracking-widest text-zinc-500">ALTERNATIVES</span>
      </div>
      <div className="px-5 py-4 space-y-4">
        {alternatives.map((alt, i) => (
          <div key={i} className="flex items-start justify-between gap-4">
            <div className="flex flex-col gap-0.5">
              <div className="flex items-baseline gap-2">
                <span className="text-sm font-medium text-zinc-200">{alt.name}</span>
                <span className="text-sm text-zinc-500 font-mono">{alt.price}</span>
              </div>
              <p className="text-xs text-zinc-500 leading-relaxed">{alt.note}</p>
            </div>
            <button
              onClick={() => runAnalysis(alt.name, i)}
              disabled={running !== null}
              className="flex-shrink-0 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40 hover:opacity-90 self-center"
              style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)" }}
            >
              {running === i ? "Starting…" : "Analyze →"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Verdict card ─────────────────────────────────────────────────────────────

function VerdictCard({ verdict }: { verdict: VerdictData }) {
  const verdictColor = VERDICT_COLORS[verdict.decision] ?? "text-white";
  const router = useRouter();
  const [running, setRunning] = useState(false);
  const [displayConfidence, setDisplayConfidence] = useState(0);

  useEffect(() => {
    const target = verdict.confidence;
    let current = 0;
    const interval = setInterval(() => {
      current = Math.min(current + 2, target);
      setDisplayConfidence(current);
      if (current >= target) clearInterval(interval);
    }, 16);
    return () => clearInterval(interval);
  }, [verdict.confidence]);

  async function runAlternative(productName: string) {
    if (running) return;
    setRunning(true);
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ product: productName }),
      });
      const { job_id } = await res.json();
      router.push(`/results?${new URLSearchParams({ q: productName, job_id }).toString()}`);
    } catch {
      setRunning(false);
    }
  }

  return (
    <div className="bg-zinc-900/80 border border-zinc-700/60 rounded-2xl p-6 flex flex-col gap-3 shadow-[0_0_60px_rgba(99,102,241,0.08)]">
      <span className="text-zinc-600 text-xs font-mono tracking-widest uppercase">Verdict</span>
      <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <span className={`text-2xl font-black tracking-wide ${verdictColor}`}>{verdict.decision}</span>
        <span className="text-zinc-500 text-sm">{displayConfidence}% confidence</span>
      </div>
      <p className="text-zinc-400 text-sm leading-relaxed">{verdict.reasoning}</p>
      {verdict.alternative && (
        <div className="border-t border-zinc-800 pt-3 mt-1 flex items-start justify-between gap-4">
          <div>
            <span className="text-xs text-zinc-600 uppercase tracking-widest font-mono">Consider</span>
            <p className="text-indigo-300 text-sm font-medium mt-1">{verdict.alternative}</p>
          </div>
          <button
            onClick={() => runAlternative(verdict.alternative!)}
            disabled={running}
            className="flex-shrink-0 text-xs font-semibold text-white px-3 py-1.5 rounded-lg transition-opacity disabled:opacity-40 hover:opacity-90 mt-5"
            style={{ background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)" }}
          >
            {running ? "Starting…" : "Run analysis →"}
          </button>
        </div>
      )}
    </div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

export default function ResultsDisplay({
  product,
  existingProduct,
  jobId,
}: {
  product: string;
  existingProduct?: string;
  jobId?: string;
}) {
  const [agentSteps, setAgentSteps] = useState<Record<AgentKey, Step[]>>({
    advocate: [], skeptic: [], economist: [],
  });
  const [agentAnalysis, setAgentAnalysis] = useState<Record<AgentKey, string>>({
    advocate: "", skeptic: "", economist: "",
  });
  const [agentPhase, setAgentPhase] = useState<Record<AgentKey, AgentPhase>>({
    advocate: "idle", skeptic: "idle", economist: "idle",
  });
  const [alternatives, setAlternatives] = useState<Alternative[] | null>(null);
  const [verdict, setVerdict] = useState<VerdictData | null>(null);
  const [pipelineError, setPipelineError] = useState<string | null>(null);

  useEffect(() => {
    if (!jobId) return;
    const es = new EventSource(`/api/stream/${jobId}`);

    es.onmessage = (e) => {
      if (e.data === "[DONE]") {
        es.close();
        return;
      }
      try {
        const event = JSON.parse(e.data);
        if (event.type === "step") {
          const agent = event.agent as AgentKey;
          setAgentSteps((p) => ({ ...p, [agent]: [...p[agent], event.step] }));
          setAgentPhase((p) => ({ ...p, [agent]: "searching" }));
        } else if (event.type === "writing_start") {
          const agent = event.agent as AgentKey;
          setAgentPhase((p) => ({ ...p, [agent]: "pre-writing" }));
        } else if (event.type === "analysis") {
          const agent = event.agent as AgentKey;
          setAgentAnalysis((p) => ({ ...p, [agent]: event.text }));
          setAgentPhase((p) => ({ ...p, [agent]: "writing" }));
        } else if (event.type === "alternatives") {
          setAlternatives(event.data);
        } else if (event.type === "verdict") {
          setVerdict(event.data);
        } else if (event.type === "error") {
          setPipelineError(event.message ?? "Something went wrong.");
          es.close();
        }
      } catch {
        // malformed event — skip
      }
    };

    es.onerror = () => es.close();

    return () => es.close();
  }, [jobId]);

  return (
    <div className="min-h-[calc(100vh-65px)] px-6 py-12">
      <div className="max-w-3xl mx-auto space-y-6">
        <Link href="/analyze" className="text-xs text-zinc-600 hover:text-zinc-400 transition-colors font-mono">
          ← new analysis
        </Link>

        <p className="text-xl sm:text-2xl font-medium leading-relaxed text-zinc-400 flex flex-wrap items-baseline gap-x-2 gap-y-2 pb-2">
          <span>I&apos;m thinking about buying</span>
          <span className="text-white">{product}</span>
          <span>and I</span>
          <span className="text-white">{existingProduct ? "already own" : "don't own"}</span>
          <span>a similar product</span>
          {existingProduct && (
            <>
              <span>, mine is the</span>
              <span className="text-white">{existingProduct}</span>
            </>
          )}
          <span>.</span>
        </p>

        {AGENTS.map((agent) =>
          agentPhase[agent.key] !== "idle" ? (
            <AgentSection
              key={agent.key}
              agent={agent}
              steps={agentSteps[agent.key]}
              analysis={agentAnalysis[agent.key]}
              phase={agentPhase[agent.key]}
              onWriteDone={() =>
                setAgentPhase((p) => ({ ...p, [agent.key]: "done" }))
              }
            />
          ) : null
        )}

        {pipelineError && (
          <div className="bg-rose-950/40 border border-rose-500/30 rounded-2xl px-5 py-4 flex flex-col gap-1.5">
            <span className="text-xs font-bold tracking-widest text-rose-400 font-mono">PIPELINE ERROR</span>
            <p className="text-rose-300/80 text-sm">{pipelineError}</p>
            <Link href="/analyze" className="text-xs text-rose-400/60 hover:text-rose-400 transition-colors mt-1 font-mono">
              ← try again
            </Link>
          </div>
        )}

        {agentPhase.economist === "done" && verdict && <VerdictCard verdict={verdict} />}
        {agentPhase.economist === "done" && verdict && alternatives && <AlternativesCard alternatives={alternatives} />}
      </div>
    </div>
  );
}
