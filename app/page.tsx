import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import TrustBar from "@/components/TrustBar";
import HowItWorks from "@/components/HowItWorks";
import VerdictSection from "@/components/VerdictSection";
import WhySection from "@/components/WhySection";
import FinalCTA from "@/components/FinalCTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <TrustBar />
        <HowItWorks />
        <VerdictSection />
        <WhySection />
        <FinalCTA />
      </main>
      <Footer />
    </>
  );
}
