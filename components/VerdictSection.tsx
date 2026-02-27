const verdicts = [
  {
    id: "buy",
    outcome: "BUY",
    stripeColor: "bg-emerald-500/50",
    cardStyle: "bg-emerald-500/5 border-zinc-800 hover:border-emerald-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(52,211,153,0.07)]",
    outcomeColor: "text-emerald-400",
    checkColor: "text-emerald-500",
    confidence: "91%",
    query: "Premium E-Reader",
    insight:
      "Top-rated in its category for three years. Common complaints are minor and price is fair.",
    bullets: [
      "Consistently top-rated across major review outlets",
      "No critical failure patterns in owner forums",
      "Currently at its historical average price",
    ],
  },
  {
    id: "wait",
    outcome: "WAIT",
    stripeColor: "bg-amber-500/50",
    cardStyle: "bg-amber-500/5 border-zinc-800 hover:border-amber-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(251,191,36,0.07)]",
    outcomeColor: "text-amber-400",
    checkColor: "text-amber-500",
    confidence: "85%",
    query: "Cordless Stick Vacuum (Premium)",
    insight:
      "Excellent performance, but the timing isn't right. Price is elevated — worth holding off for now.",
    bullets: [
      "Current price above recent market low",
      "No next-gen successor currently announced",
      "No urgent failure risk in your current setup",
    ],
  },
  {
    id: "alternatives",
    outcome: "CONSIDER ALTERNATIVES",
    stripeColor: "bg-indigo-500/50",
    cardStyle: "bg-indigo-500/5 border-zinc-800 hover:border-indigo-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(129,140,248,0.07)]",
    outcomeColor: "text-indigo-400",
    checkColor: "text-indigo-500",
    confidence: "88%",
    query: "Premium Noise-Cancelling Headphones",
    insight:
      "Strong product, but a mid-range alternative delivers 85% of the experience at 38% of the cost.",
    bullets: [
      "Price above recent market low",
      "Durability concerns flagged in owner forums",
      "Mid-range alternative recommended at ~$60",
    ],
  },
  {
    id: "skip",
    outcome: "SKIP",
    stripeColor: "bg-rose-500/50",
    cardStyle: "bg-rose-500/5 border-zinc-800 hover:border-rose-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(251,113,133,0.07)]",
    outcomeColor: "text-rose-400",
    checkColor: "text-rose-500",
    confidence: "87%",
    query: "Dual-Zone Air Fryer",
    insight:
      "Widespread coating failure reported within months of purchase. Better-built options exist for less.",
    bullets: [
      "High volume of post-warranty failure reports",
      "Poor customer service documented across forums",
      "Comparable performance available at lower price",
    ],
  },
  {
    id: "noneed",
    outcome: "YOU DON'T NEED IT",
    stripeColor: "bg-violet-500/50",
    cardStyle: "bg-violet-500/5 border-zinc-800 hover:border-violet-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(167,139,250,0.07)]",
    outcomeColor: "text-violet-400",
    checkColor: "text-violet-500",
    confidence: "93%",
    query: "Multi-Function Pressure Cooker",
    insight:
      "You already own a Dutch oven, skillet, and pot. They cover everything this claims to do.",
    bullets: [
      "All advertised use cases covered by existing cookware",
      "Most owners report using only 1–2 of the functions",
      "Counter space cost outweighs any convenience gain",
    ],
  },
] as const;

export default function VerdictSection() {
  return (
    <section className="relative border-y border-zinc-800/60 bg-zinc-900/30 py-28 overflow-hidden">
      {/* Ambient glow */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-indigo-700/[0.06] rounded-full blur-[120px] pointer-events-none" />

      <div className="max-w-5xl mx-auto px-6 relative z-10">
        {/* Header */}
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 bg-indigo-500/10 border border-indigo-500/20 rounded-full px-4 py-1.5 text-sm text-indigo-400 mb-8">
            <svg
              className="w-3.5 h-3.5"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"
              />
            </svg>
            The Verdict Engine
          </div>

          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-white mb-5 leading-tight">
            Not all purchases deserve a yes.
          </h2>

          <p className="text-zinc-400 text-lg max-w-2xl mx-auto leading-relaxed">
            After the analysis, one of five verdicts comes back with full
            reasoning and source links. Sometimes the right call is to wait,
            buy something else, or realize you already have what you need.
          </p>
        </div>

        {/* Verdict cards — flex so the 5th card centers on the last row */}
        <div className="flex flex-wrap justify-center gap-4">
          {verdicts.map((v) => (
            <div
              key={v.id}
              className={`relative border rounded-2xl overflow-hidden p-7 pt-9 transition-all duration-200 hover:-translate-y-1 w-full sm:w-[calc(50%-8px)] lg:w-[calc(33.333%-11px)] ${v.cardStyle} ${v.glowStyle}`}
            >
              {/* Colored accent stripe */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] ${v.stripeColor}`}
              />

              {/* Query label */}
              <div className="font-mono text-xs mb-5 flex items-center gap-2 min-w-0">
                <span className="uppercase tracking-widest text-zinc-700 flex-shrink-0">
                  example
                </span>
                <span className="text-zinc-800 flex-shrink-0">·</span>
                <span className="text-zinc-500 truncate">{v.query}</span>
              </div>

              {/* Outcome */}
              <div className={`text-2xl font-black tracking-tight leading-tight mb-1 ${v.outcomeColor}`}>
                {v.outcome}
              </div>
              {/* Confidence below verdict — avoids layout breaking on long verdict names */}
              <div className="flex items-baseline gap-2 mb-4">
                <span className={`text-sm font-black ${v.outcomeColor}`}>{v.confidence}</span>
                <span className="text-xs text-zinc-700">director confidence</span>
              </div>

              {/* Insight */}
              <p className="text-zinc-300 text-sm leading-relaxed mb-5">
                {v.insight}
              </p>

              {/* Bullets */}
              <ul className="space-y-2">
                {v.bullets.map((bullet) => (
                  <li
                    key={bullet}
                    className="flex items-start gap-2.5 text-sm text-zinc-500"
                  >
                    <span
                      className={`mt-0.5 flex-shrink-0 text-xs ${v.checkColor}`}
                    >
                      ✓
                    </span>
                    <span>{bullet}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="text-zinc-700 text-sm text-center mt-8">
          Every verdict includes a full debate transcript, confidence score, and
          source links.
        </p>
      </div>
    </section>
  );
}
