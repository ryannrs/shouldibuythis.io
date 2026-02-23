const agents = [
  {
    id: "advocate",
    number: "01",
    label: "The Advocate",
    accentColor: "emerald",
    heading: "Builds the case for buying.",
    body: "Pulls verified purchase reviews, editorial roundups, and spec sheets. Surfaces the product's performance data and most praised real-world use cases so you know what you'd be getting at its best.",
    bullets: [
      "Top-rated review synthesis",
      "Spec benchmarking vs. category leaders",
      "Use-case fit scoring",
    ],
    iconPath:
      "M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48a4.53 4.53 0 01-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904",
  },
  {
    id: "skeptic",
    number: "02",
    label: "The Skeptic",
    accentColor: "rose",
    heading: "Looks for red flags and failure modes.",
    body: "Mines Reddit threads, one-star reviews, and owner forums for failure modes that marketing buries. Focuses on what breaks over time, what owners regret, and what the spec sheet leaves out.",
    bullets: [
      "Reddit & forum fail-point mining",
      "Long-term durability signals",
      "Common post-purchase regret patterns",
    ],
    iconPath:
      "M7.5 15h2.25m8.024-9.75c.011.05.028.1.052.148.591 1.2.924 2.55.924 3.977a8.96 8.96 0 01-.999 4.125m.023-8.25c-.076-.365.183-.75.575-.75h.908c.889 0 1.713.518 1.972 1.368.339 1.11.521 2.287.521 3.507 0 1.553-.295 3.036-.831 4.398C20.613 14.547 19.833 15 19 15h-1.053A72.77 72.77 0 0118 19.5M4.62 6.75L3.75 16.5c0 1.036.84 1.875 1.875 1.875H9M4.62 6.75h8.758M4.62 6.75C4.62 5.784 3.835 5 2.87 5h-.12M9 18.375a1.125 1.125 0 000 2.25M9 18.375v2.25",
  },
  {
    id: "economist",
    number: "03",
    label: "The Economist",
    accentColor: "indigo",
    heading: "Checks the price and finds alternatives.",
    body: "Analyzes 90 days of price history to tell you whether now is a good time to buy. Then searches the market for alternatives that offer better value per dollar, with a specific product recommendation.",
    bullets: [
      "90-day price history & trend analysis",
      "Value-per-dollar alternative ranking",
      "Buy now vs. wait recommendation",
    ],
    iconPath:
      "M2.25 18L9 11.25l4.306 4.307a11.95 11.95 0 015.814-5.519l2.74-1.22m0 0l-5.94-2.28m5.94 2.28l-2.28 5.941",
  },
] as const;

const colorMap = {
  emerald: {
    label: "text-emerald-400",
    icon: "text-emerald-400",
    iconBg: "bg-emerald-500/10 border-emerald-500/20",
    border: "hover:border-emerald-500/40",
    bullet: "bg-emerald-500/10 text-emerald-500",
    glow: "hover:shadow-[0_8px_40px_rgba(52,211,153,0.08)]",
  },
  rose: {
    label: "text-rose-400",
    icon: "text-rose-400",
    iconBg: "bg-rose-500/10 border-rose-500/20",
    border: "hover:border-rose-500/40",
    bullet: "bg-rose-500/10 text-rose-500",
    glow: "hover:shadow-[0_8px_40px_rgba(251,113,133,0.08)]",
  },
  indigo: {
    label: "text-indigo-400",
    icon: "text-indigo-400",
    iconBg: "bg-indigo-500/10 border-indigo-500/20",
    border: "hover:border-indigo-500/40",
    bullet: "bg-indigo-500/10 text-indigo-500",
    glow: "hover:shadow-[0_8px_40px_rgba(129,140,248,0.08)]",
  },
};

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="max-w-6xl mx-auto px-6 py-28">
      <div className="text-center mb-16">
        <p className="text-indigo-400 text-sm font-semibold uppercase tracking-widest mb-3">
          Under the Hood
        </p>
        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-white mb-5 leading-tight">
          Three agents. One structured analysis.
        </h2>
        <p className="text-zinc-400 text-lg max-w-xl mx-auto leading-relaxed">
          Each product goes through a three-stage analysis pulling from
          reviews, forums, and price data. You get a clear recommendation
          with the sources to back it up.
        </p>
      </div>

      {/* Preliminary check callout */}
      <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-4 mb-8 flex gap-3 items-start max-w-2xl mx-auto">
        <span className="text-violet-400 font-bold flex-shrink-0 mt-0.5 text-sm">
          →
        </span>
        <p className="text-violet-300/80 text-sm leading-relaxed">
          Before these agents run, a preliminary check asks whether the
          purchase makes sense at all. If you already own a solution or the
          category doesn&apos;t fit your situation, you get a{" "}
          <span className="text-violet-300 font-semibold">
            You Don&apos;t Need It
          </span>{" "}
          verdict immediately.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {agents.map((agent) => {
          const c = colorMap[agent.accentColor];
          return (
            <div
              key={agent.id}
              className={`bg-zinc-900 border border-zinc-800 ${c.border} ${c.glow} rounded-2xl p-7 transition-all duration-200 hover:-translate-y-1`}
            >
              <div
                className={`w-11 h-11 rounded-xl border ${c.iconBg} flex items-center justify-center mb-6`}
              >
                <svg
                  className={`w-5 h-5 ${c.icon}`}
                  fill="none"
                  stroke="currentColor"
                  strokeWidth={2}
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d={agent.iconPath}
                  />
                </svg>
              </div>

              <div
                className={`text-xs font-bold ${c.label} uppercase tracking-widest mb-2`}
              >
                Agent {agent.number}: {agent.label}
              </div>

              <h3 className="text-xl font-bold text-white mb-3 leading-snug">
                {agent.heading}
              </h3>

              <p className="text-zinc-400 text-sm leading-relaxed mb-5">
                {agent.body}
              </p>

              <ul className="space-y-2 text-sm text-zinc-500">
                {agent.bullets.map((bullet) => (
                  <li key={bullet} className="flex items-center gap-2.5">
                    <span
                      className={`w-4 h-4 rounded ${c.bullet} flex items-center justify-center text-xs flex-shrink-0`}
                    >
                      →
                    </span>
                    {bullet}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </section>
  );
}
