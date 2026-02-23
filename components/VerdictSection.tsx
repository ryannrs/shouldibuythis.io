const verdicts = [
  {
    id: "buy",
    outcome: "BUY IT",
    stripeColor: "bg-emerald-500/50",
    cardStyle: "bg-emerald-500/5 border-zinc-800 hover:border-emerald-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(52,211,153,0.07)]",
    outcomeColor: "text-emerald-400",
    checkColor: "text-emerald-500",
    confidence: "91%",
    query: "Kindle Paperwhite 16GB",
    insight:
      "Top-rated in its category for three years. Common complaints are minor and price is fair.",
    bullets: [
      "4.7-star average across 28k verified reviews",
      "No critical failure patterns in owner forums",
      "Currently at its historical average price",
    ],
  },
  {
    id: "skip",
    outcome: "SKIP IT",
    stripeColor: "bg-rose-500/50",
    cardStyle: "bg-rose-500/5 border-zinc-800 hover:border-rose-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(251,113,133,0.07)]",
    outcomeColor: "text-rose-400",
    checkColor: "text-rose-500",
    confidence: "87%",
    query: "Ninja DZ201 Dual Air Fryer",
    insight:
      "Basket coating delaminates within 6 months. Better-built alternatives exist at lower prices.",
    bullets: [
      "800+ owner reports of coating failure post-warranty",
      "Poor customer service documented across forums",
      "Comparable performance available for less",
    ],
  },
  {
    id: "better",
    outcome: "BUY BETTER",
    stripeColor: "bg-amber-500/50",
    cardStyle: "bg-amber-500/5 border-zinc-800 hover:border-amber-500/30",
    glowStyle: "hover:shadow-[0_8px_40px_rgba(251,191,36,0.07)]",
    outcomeColor: "text-amber-400",
    checkColor: "text-amber-500",
    confidence: "88%",
    query: "Sony WH-1000XM5 Headphones",
    insight:
      "Strong product, but the Anker Q45 at $59 delivers 85% of the experience.",
    bullets: [
      "Currently $50 above its 90-day price low",
      "Plastic hinge failures reported around 14 months",
      "Anker Q45 recommended: 4.4 stars, $59.99",
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
    query: "Instant Pot Duo 7-in-1",
    insight:
      "A Dutch oven, skillet, and pot already cover everything this claims to do.",
    bullets: [
      "All 7 use cases covered by existing cookware",
      "90% of owners report using only 2 functions",
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
            After the analysis, one of four verdicts comes back with full
            reasoning and source links. Sometimes the right call is to skip the
            purchase or realize you already have what you need.
          </p>
        </div>

        {/* Verdict cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {verdicts.map((v) => (
            <div
              key={v.id}
              className={`relative border rounded-2xl p-7 pt-9 transition-all duration-200 hover:-translate-y-1 ${v.cardStyle} ${v.glowStyle}`}
            >
              {/* Colored accent stripe */}
              <div
                className={`absolute inset-x-0 top-0 h-[2px] rounded-t-2xl ${v.stripeColor}`}
              />

              {/* Query label */}
              <div className="font-mono text-xs mb-5 flex items-center gap-2 min-w-0">
                <span className="uppercase tracking-widest text-zinc-700 flex-shrink-0">
                  analyzed
                </span>
                <span className="text-zinc-800 flex-shrink-0">·</span>
                <span className="text-zinc-500 truncate">{v.query}</span>
              </div>

              {/* Outcome + Confidence */}
              <div className="flex items-start justify-between gap-4 mb-4">
                <div
                  className={`text-2xl font-black tracking-tight leading-tight ${v.outcomeColor}`}
                >
                  {v.outcome}
                </div>
                <div className="text-right flex-shrink-0">
                  <div className={`text-lg font-black ${v.outcomeColor}`}>
                    {v.confidence}
                  </div>
                  <div className="text-xs text-zinc-700">confidence</div>
                </div>
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
