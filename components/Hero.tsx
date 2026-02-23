import WaitlistForm from "./WaitlistForm";
import TerminalMock from "./TerminalMock";

export default function Hero() {
  return (
    <section className="relative overflow-hidden">
      {/* Ambient glow */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          background:
            "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.13) 0%, transparent 70%)",
        }}
      />
      <div className="absolute top-20 left-1/2 -translate-x-1/2 w-[900px] h-[550px] bg-indigo-600/[0.07] rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-4xl mx-auto px-6 pt-24 pb-20 text-center relative z-10">
        {/* Beta badge */}
        <div className="inline-flex items-center gap-2 bg-zinc-900 border border-zinc-700/80 rounded-full px-4 py-1.5 text-sm text-zinc-400 mb-10">
          <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full animate-pulse" />
          Private beta, now accepting signups
        </div>

        {/* Headline */}
        <h1 className="text-5xl sm:text-6xl lg:text-7xl font-black tracking-tight leading-[1.05] mb-7">
          <span
            className="block"
            style={{
              background: "linear-gradient(135deg, #ffffff 0%, #94a3b8 100%)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              backgroundClip: "text",
            }}
          >
            Forty-seven tabs.
          </span>
          <span className="text-white">Still not sure?</span>
        </h1>

        {/* Subheadline */}
        <p className="text-xl text-zinc-400 max-w-2xl mx-auto mb-3 leading-relaxed">
          ShouldIBuyThis.io runs a structured analysis on any product you&apos;re
          considering. It builds the case for buying, hunts for red flags,
          checks whether you&apos;re getting fair value, and asks whether you
          actually need it at all.
        </p>
        <p className="text-base text-zinc-500 mb-10">
          You get a{" "}
          <strong className="text-white font-semibold">Buy</strong>,{" "}
          <strong className="text-white font-semibold">Skip</strong>,{" "}
          <strong className="text-white font-semibold">Buy Better</strong>, or{" "}
          <strong className="text-white font-semibold">
            You Don&apos;t Need It
          </strong>{" "}
          verdict with the full reasoning and sources behind it.
        </p>

        {/* Email capture */}
        <div id="waitlist">
          <WaitlistForm buttonText="Join the Waitlist →" />
          <p className="text-xs text-zinc-700 mt-3">
            No spam. No nonsense. Unsubscribe anytime.
          </p>
        </div>

        {/* Animated terminal preview */}
        <TerminalMock />
      </div>
    </section>
  );
}
