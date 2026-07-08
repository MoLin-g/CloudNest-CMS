import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Slider from "@/components/Slider";
import Solutions from "@/components/Solutions";
import UseCases from "@/components/UseCases";
import Features from "@/components/Features";
import ProductFeatures from "@/components/ProductFeatures";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

const Index = () => {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar />
      <Hero />
      <Slider />
      <Solutions />
      <UseCases />
      <Features />
      <ProductFeatures />
      <CTA />
      <Footer />
    </div>
  );
};

export default Index;
