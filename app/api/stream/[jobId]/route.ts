// Force dynamic so Next.js never tries to cache or prerender this route
export const dynamic = "force-dynamic";

export async function GET(
  _: Request,
  { params }: { params: Promise<{ jobId: string }> }
) {
  const { jobId } = await params;
  const upstream = await fetch(`${process.env.API_URL}/stream/${jobId}`, {
    headers: { Accept: "text/event-stream" },
  });
  return new Response(upstream.body, {
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      "X-Accel-Buffering": "no",
    },
  });
}
