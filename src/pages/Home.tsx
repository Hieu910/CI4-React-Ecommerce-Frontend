import { useState, useEffect } from "react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import HeroSlider from "@/components/HeroSlider";
import ProductTabs from "@/components/ProductTabs";
import Banner from "@/components/Banner";
import CustomerReviews from "@/components/CustomerReviews";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import CompareFloatingWindow from "@/components/CompareFloatingWindow";
import {
  Product,
  heroSlides as mockHeroSlides,
  customerReviews as mockCustomerReviews,
} from "@/data/mockData";
import {
  getNewProducts,
  getBestSell,
  getFeaturedProducts,
} from "@/services/api";
import ServerWarning from "@/components/ServerWarning";

const Home = () => {
  const [newProducts, setNewProducts] = useState<Product[]>([]);
  const [bestSell, setBestSell] = useState<Product[]>([]);
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null,
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const [newProds, bestProds, featuredProds] = await Promise.all([
          getNewProducts(),
          getBestSell(),
          getFeaturedProducts(),
        ]);

        setNewProducts(newProds);
        setBestSell(bestProds);
        setFeaturedProducts(featuredProds);
      } catch (error) {
        console.error("Error fetching home data:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const handleCloseQuickView = () => {
    setIsQuickViewOpen(false);
    setQuickViewProduct(null);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <section className="mb-12">
            <HeroSlider slides={mockHeroSlides} />
          </section>

          <section className="mb-12">
            <ProductTabs
              newProducts={newProducts}
              bestSell={bestSell}
              featuredProducts={featuredProducts}
              onQuickView={handleQuickView}
            />
          </section>
          <section className="mb-12">
            <Banner />
          </section>
          <section>
            <CustomerReviews reviews={mockCustomerReviews} />
          </section>
        </div>
      </main>

      <Footer />

      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={handleCloseQuickView}
      />
      <ServerWarning />
      <CompareFloatingWindow />
    </div>
  );
};

export default Home;
