import { getWaitlistCount } from "@/lib/getWaitlistCount";

const STATIC_ITEMS = [
  {
    label: "No affiliate links, ever",
    iconPath:
      "M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.955 11.955 0 003 10c0 5.591 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z",
  },
  {
    label: "Will tell you to buy nothing",
    iconPath:
      "M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z",
  },
] as const;

const PEOPLE_ICON_PATH =
  "M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197";

export default async function TrustBar() {
  const count = await getWaitlistCount();
  const countLabel =
    count > 0 ? `${count.toLocaleString()} on the waitlist` : null;

  return (
    <div className="border-y border-zinc-800/60 bg-zinc-900/20 py-5">
      <div className="max-w-4xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-14 text-zinc-600 text-sm">
        {STATIC_ITEMS.map(({ label, iconPath }) => (
          <div key={label} className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-zinc-700 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d={iconPath} />
            </svg>
            {label}
          </div>
        ))}

        {countLabel && (
          <div className="flex items-center gap-2">
            <svg
              className="w-4 h-4 text-zinc-700 flex-shrink-0"
              fill="none"
              stroke="currentColor"
              strokeWidth={2}
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d={PEOPLE_ICON_PATH}
              />
            </svg>
            {countLabel}
          </div>
        )}
      </div>
    </div>
  );
}
