import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-zinc-800/60 py-8 bg-zinc-950">
      <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div
            className="w-6 h-6 rounded-lg flex items-center justify-center flex-shrink-0"
            style={{
              background:
                "linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #7c3aed 100%)",
            }}
          >
            <svg
              className="w-3 h-3 text-white"
              fill="none"
              stroke="currentColor"
              strokeWidth={2.5}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
              />
            </svg>
          </div>
          <span className="text-zinc-500 text-sm">
            ShouldIBuyThis.io: AI-assisted purchase research
          </span>
        </div>

        {/* Links */}
        <div className="flex items-center gap-6 text-sm text-zinc-600">
          <a
            href="mailto:hello@shouldibuythis.io"
            className="hover:text-zinc-400 transition-colors"
          >
            hello@shouldibuythis.io
          </a>
          <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
            Privacy
          </Link>
          <span>© {new Date().getFullYear()} ShouldIBuyThis.io</span>
        </div>
      </div>
      {/* Disclaimer */}
      <div className="max-w-6xl mx-auto px-6 pt-4 border-t border-zinc-900 mt-4">
        <p className="text-zinc-700 text-xs text-center leading-relaxed">
          This is an early-stage project. Features, pricing, and availability are not final and subject to change. Emails collected are used only to notify you when early access opens.
        </p>
      </div>
    </footer>
  );
}
