import { useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import ProductCard from "./ProductCard";
import { Product } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface ProductTabsProps {
  newProducts: Product[];
  bestSell: Product[];
  featuredProducts: Product[];
  onQuickView: (product: Product) => void;
}

const ProductTabs = ({
  newProducts,
  bestSell,
  featuredProducts,
  onQuickView,
}: ProductTabsProps) => {
  const [activeTab, setActiveTab] = useState<string>("new");
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const tabs = [
    { id: "new", label: "New Arrivals", products: newProducts },
    {
      id: "bestSell",
      label: "Best Sell",
      products: bestSell,
    },
    {
      id: "featured",
      label: "Featured",
      products: featuredProducts,
    },
  ];

  const currentProducts =
    tabs.find((tab) => tab.id === activeTab)?.products || [];

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: -300, behavior: "smooth" });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      scrollContainerRef.current.scrollBy({ left: 300, behavior: "smooth" });
    }
  };

  return (
    <div className="py-12">
      {/* Tabs */}
      <div className="flex items-center justify-center gap-4 mb-8">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`px-6 py-3 rounded-xl font-medium transition-colors ${
              activeTab === tab.id
                ? "bg-primary text-primary-foreground"
                : "bg-secondary text-foreground hover:bg-muted"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Products Carousel */}
      <div className="relative">
        {/* Navigation Arrows */}
        <button
          onClick={scrollLeft}
          className="absolute -left-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card shadow-md text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronLeft className="w-5 h-5" />
        </button>
        <button
          onClick={scrollRight}
          className="absolute -right-4 top-1/2 -translate-y-1/2 z-10 p-3 rounded-full bg-card shadow-md text-foreground hover:bg-secondary transition-colors"
        >
          <ChevronRight className="w-5 h-5" />
        </button>

        {/* Products Container */}
        <div
          ref={scrollContainerRef}
          className="flex gap-6 overflow-x-auto scrollbar-hide scroll-smooth px-2 pb-4"
          style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
        >
          {currentProducts.map((product) => (
            <div key={product.id} className="flex-shrink-0 w-64">
              <ProductCard product={product} onQuickView={onQuickView} />
            </div>
          ))}
        </div>
      </div>

      {/* View All Button */}
      <div className="flex justify-center mt-8">
        <Button asChild variant="secondary" size="lg" className="rounded-xl">
          <Link to="/products">View All Products</Link>
        </Button>
      </div>
    </div>
  );
};

export default ProductTabs;
