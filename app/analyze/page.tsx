import Nav from "@/components/Nav";
import AnalyzeForm from "@/components/AnalyzeForm";

export const metadata = {
  title: "Analyze a Product · ShouldIBuyThis.io",
};

export default function AnalyzePage() {
  return (
    <>
      <Nav />
      <main className="min-h-[calc(100vh-65px)] flex flex-col items-center justify-center px-6">
        {/* Ambient glow matching landing page */}
        <div
          className="fixed inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(ellipse at 50% 0%, rgba(99,102,241,0.10) 0%, transparent 70%)",
          }}
        />
        <div className="fixed top-20 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-indigo-600/[0.06] rounded-full blur-[140px] pointer-events-none" />

        <div className="max-w-3xl w-full relative z-10">
          <AnalyzeForm />
        </div>
      </main>
    </>
  );
}
