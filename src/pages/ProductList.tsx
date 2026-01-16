import { useState, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ProductCard from "@/components/ProductCard";
import ProductFilters from "@/components/ProductFilters";
import Pagination from "@/components/Pagination";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import CompareFloatingWindow from "@/components/CompareFloatingWindow";
import { Product, ProductListParams } from "@/data/mockData";
import { getProducts } from "@/services/api";

const PER_PAGE = 8;

const ProductList = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name-Asc");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get("category");

    if (categoryParam) {
      setSelectedCategories([parseInt(categoryParam)]);
      fetchProducts({ categories: [categoryParam] });
    } else {
      setSelectedCategories([]);
      fetchProducts();
    }
  }, [searchParams]);

  const fetchProducts = async (customParams?: any) => {
    try {
      setIsLoading(true);
      const params: ProductListParams = {
        page: currentPage,
        limit: PER_PAGE,
        categories: selectedCategories,
        sizes: selectedSizes,
        stock_status: stockFilter,
        min_price: minPrice ? parseFloat(minPrice) : null,
        max_price: maxPrice ? parseFloat(maxPrice) : null,
        search: searchQuery,
        sort_by: sortBy.split("-")[0],
        sort_order: sortBy.split("-")[1],
        ...customParams,
      };
      const response = await getProducts(params);
      setProducts(response.items || []);
      setTotalProducts(response.total || 0);
    } catch (error) {
      console.error("Error fetching products:", error);
      setProducts([]);
      setTotalProducts(0);
    } finally {
      setIsLoading(false);
    }
  };

  const totalPages = Math.ceil(totalProducts / PER_PAGE);

  const handleCategoryChange = (categories: number[]) => {
    setSelectedCategories(categories);
  };

  const handleSizeChange = (sizes: string[]) => {
    setSelectedSizes(sizes);
  };

  const handleStockChange = (stock: "all" | "in_stock" | "out_of_stock") => {
    setStockFilter(stock);
  };

  const handlePriceChange = (min: string, max: string) => {
    setMinPrice(min);
    setMaxPrice(max);
  };

  const handleSortChange = (sort: string) => {
    setSortBy(sort);
  };

  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
  };

  const handleSubmit = () => {
    setCurrentPage(1);
    fetchProducts({ page: 1 });
  };

  const handleClearFilters = () => {
    setSelectedCategories([]);
    setSelectedSizes([]);
    setStockFilter("all");
    setMinPrice("");
    setMaxPrice("");
    setSortBy("name-Asc");
    setSearchQuery("");
    setCurrentPage(1);
    setSearchParams({});
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleQuickView = (product: Product) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
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
          <div className="mb-6">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              {searchQuery ? `Search: "${searchQuery}"` : "All Products"}
            </h1>
            <p className="text-muted-foreground mt-1">
              {totalProducts} products found
            </p>
          </div>

          <ProductFilters
            selectedCategories={selectedCategories}
            selectedSizes={selectedSizes}
            stockFilter={stockFilter}
            minPrice={minPrice}
            maxPrice={maxPrice}
            sortBy={sortBy}
            searchQuery={searchQuery}
            onCategoryChange={handleCategoryChange}
            onSizeChange={handleSizeChange}
            onStockChange={handleStockChange}
            onPriceChange={handlePriceChange}
            onSortChange={handleSortChange}
            onSearchChange={handleSearchChange}
            onClearFilters={handleClearFilters}
            onSubmit={handleSubmit}
          />

          {products.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onQuickView={handleQuickView}
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                No products found matching your filters.
              </p>
            </div>
          )}

          {totalPages > 1 && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </div>
      </main>

      <Footer />

      <QuickViewDrawer
        product={quickViewProduct}
        isOpen={isQuickViewOpen}
        onClose={() => {
          setIsQuickViewOpen(false);
          setQuickViewProduct(null);
        }}
      />

      <CompareFloatingWindow />
    </div>
  );
};

export default ProductList;
