import Header from "@/components/Header";
import HeroSection from "@/components/HeroSection";
import StatsSection from "@/components/StatsSection";
import StoriesSection from "@/components/StoriesSection";
import VisionSection from "@/components/VisionSection";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main>
        <HeroSection />
        <StatsSection />
        <StoriesSection />
        <VisionSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
