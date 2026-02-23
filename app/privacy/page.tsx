import Link from "next/link";

export const metadata = {
  title: "Privacy Policy · ShouldIBuyThis.io",
};

export default function PrivacyPage() {
  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg bg-zinc-900 border border-zinc-800 rounded-2xl p-10 shadow-2xl shadow-black/60">
        <h1 className="text-white font-bold text-2xl mb-6">Privacy Policy</h1>

        <p className="text-zinc-400 text-sm leading-relaxed mb-6">
          Your email address is collected solely to notify you when
          ShouldIBuyThis.io launches. I don&apos;t sell it, share it
          with third parties, or use it for any other purpose. You can request
          deletion at any time by emailing{" "}
          <a
            href="mailto:hello@shouldibuythis.io"
            className="text-indigo-400 hover:text-indigo-300 transition-colors"
          >
            hello@shouldibuythis.io
          </a>{" "}
          or clicking the unsubscribe link in any email I send.
        </p>

        <p className="text-zinc-600 text-xs leading-relaxed mb-8">
          Last updated: February 2026
        </p>

        <Link
          href="/"
          className="text-sm text-zinc-600 hover:text-zinc-400 transition-colors"
        >
          ← Back to ShouldIBuyThis.io
        </Link>
      </div>
    </main>
  );
}
