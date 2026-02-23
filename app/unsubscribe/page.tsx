import Link from "next/link";

export default async function UnsubscribePage({
  searchParams,
}: {
  searchParams: Promise<{ status?: string }>;
}) {
  const { status } = await searchParams;

  const content =
    status === "success"
      ? {
          icon: (
            <svg
              className="w-8 h-8 text-emerald-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
          ),
          iconBg: "bg-emerald-500/10 border-emerald-500/20",
          heading: "You've been removed.",
          body: "Your email has been deleted from the waitlist. You won't hear from us again.",
        }
      : status === "invalid"
      ? {
          icon: (
            <svg
              className="w-8 h-8 text-rose-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ),
          iconBg: "bg-rose-500/10 border-rose-500/20",
          heading: "Invalid link.",
          body: "This unsubscribe link is not valid or has already been used. Email us at hello@shouldibuythis.io if you need help.",
        }
      : {
          icon: (
            <svg
              className="w-8 h-8 text-rose-400"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
              />
            </svg>
          ),
          iconBg: "bg-rose-500/10 border-rose-500/20",
          heading: "Something went wrong.",
          body: "Something went wrong on my end. Email me at hello@shouldibuythis.io and I'll remove you manually.",
        };

  return (
    <main className="min-h-screen bg-zinc-950 flex items-center justify-center p-6">
      <div className="w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-10 text-center shadow-2xl shadow-black/60">
        <div
          className={`w-16 h-16 rounded-full border flex items-center justify-center mx-auto mb-6 ${content.iconBg}`}
        >
          {content.icon}
        </div>
        <h1 className="text-white font-bold text-2xl mb-3">{content.heading}</h1>
        <p className="text-zinc-400 text-sm leading-relaxed mb-8">
          {content.body}
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
