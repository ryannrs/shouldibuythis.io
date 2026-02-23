const objections = [
  {
    title: "Review sites rely on affiliate revenue",
    body: "Affiliate commissions mean \"best of\" lists often rank products by payout, not by how well they actually perform.",
  },
  {
    title: "Reddit takes time to parse",
    body: "Useful signal exists in threads and owner forums, but it's buried under noise and posts about discontinued hardware.",
  },
  {
    title: "YouTube is entertainment, not analysis",
    body: "Production value is high, but sponsored integrations are common and engagement tends to be optimized over accuracy.",
  },
  {
    title: "General AI lacks live product data",
    body: "Most AI assistants don't scrape current reviews, track price history, or run a structured analysis against a specific product.",
  },
] as const;

export default function WhySection() {
  return (
    <section className="max-w-4xl mx-auto px-6 py-24">
      <div className="text-center mb-14">
        <h2 className="text-3xl sm:text-4xl font-black text-white mb-4">
          How this compares to existing research tools
        </h2>
        <p className="text-zinc-400 text-base max-w-xl mx-auto">
          It pulls from the same sources you'd check anyway. The difference
          is that it synthesizes those into a single structured recommendation,
          with the reasoning shown.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {objections.map(({ title, body }) => (
          <div
            key={title}
            className="bg-zinc-900/60 border border-zinc-800 rounded-xl p-5 flex gap-4"
          >
            <div className="w-8 h-8 rounded-lg bg-zinc-800 flex items-center justify-center flex-shrink-0 mt-0.5">
              <svg
                className="w-4 h-4 text-rose-400"
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
            </div>
            <div>
              <div className="font-semibold text-white text-sm mb-1">
                {title}
              </div>
              <div className="text-zinc-500 text-sm leading-relaxed">{body}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
