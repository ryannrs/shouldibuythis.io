import Nav from "@/components/Nav";
import ResultsDisplay from "@/components/ResultsDisplay";

export const metadata = {
  title: "Analysis · ShouldIBuyThis.io",
};

export default async function ResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; owns?: string; job_id?: string }>;
}) {
  const params = await searchParams;
  const product = params.q || "Sony WH-1000XM5 Headphones";
  const existingProduct = params.owns;
  const jobId = params.job_id;

  return (
    <>
      <Nav />
      <main>
        <ResultsDisplay product={product} existingProduct={existingProduct} jobId={jobId} />
      </main>
    </>
  );
}
