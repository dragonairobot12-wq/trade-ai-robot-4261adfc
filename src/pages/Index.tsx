import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import HeroSection from "@/components/landing/HeroSection";
import HowItWorksSection from "@/components/landing/HowItWorksSection";
import ProductsSection from "@/components/landing/ProductsSection";
import PartnersSection from "@/components/landing/PartnersSection";
import TeamSection from "@/components/landing/TeamSection";
import FAQSection from "@/components/landing/FAQSection";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <HeroSection />
        <HowItWorksSection />
        <ProductsSection />
        <PartnersSection />
        <TeamSection />
        <FAQSection />
      </main>
      <Footer />
    </div>
  );
};

export default Index;
