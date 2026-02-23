import WaitlistForm from "./WaitlistForm";
import { getWaitlistCount } from "@/lib/getWaitlistCount";

export default async function FinalCTA() {
  const count = await getWaitlistCount();

  return (
    <section className="border-t border-zinc-800/60 bg-zinc-900/30 py-24">
      <div className="max-w-2xl mx-auto px-6 text-center">
        <h2 className="text-4xl sm:text-5xl font-black text-white mb-4 leading-tight">
          Get a verdict before you spend a dollar.
        </h2>
        <p className="text-zinc-400 text-lg mb-10 leading-relaxed">
          ShouldIBuyThis.io is in private beta. Sign up for early access.
          Sometimes the verdict is buy it. Sometimes it&apos;s skip the
          purchase entirely. Either way, you&apos;ll know why.
        </p>

        <WaitlistForm buttonText="Get Early Access →" />

        <p className="text-xs text-zinc-700 mt-3">
          {count > 0
            ? `${count.toLocaleString()} people on the list. No spam, ever.`
            : "No spam, ever."}
        </p>
      </div>
    </section>
  );
}
