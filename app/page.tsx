import { Navbar } from "@/components/Navbar";
import { Hero } from "@/components/Hero";
import { ShopByUsage } from "@/components/ShopByUsage";
import { BestSellers } from "@/components/BestSellers";
import { RequestSample } from "@/components/RequestSample";
import { FeaturedProducts } from "@/components/FeaturedProducts";
import { TrustSection } from "@/components/TrustSection";
import { CustomDesign } from "@/components/CustomDesign";
import { Testimonials } from "@/components/Testimonials";
import { ClientMarquee } from "@/components/ClientMarquee";
import { Newsletter } from "@/components/Newsletter";
import { ShopByStyles } from "@/components/ShopByStyles";
import { ProductGrid } from "@/components/ProductGrid";
import { Footer } from "@/components/Footer";

// Home page with all sections integrated
export default function Home() {
  return (
    <div className="min-h-screen bg-black selection:bg-white selection:text-black">
      <Navbar />
      <main>
        <Hero />
        <ShopByUsage />
        <BestSellers />
        <RequestSample />
        <FeaturedProducts />
        <ShopByStyles />
        <TrustSection />
        <CustomDesign />
        <Testimonials />
        <ClientMarquee />
        <Newsletter />
        <ProductGrid />
      </main>
      <Footer />
    </div>
  );
}
