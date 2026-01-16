import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { clearCompare } from "@/store/compareSlice";
import { Product, Variant } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { getProductById } from "@/services/api";

interface ProductDetail extends Product {
  variants: Variant[];
}

const Compare = () => {
  const dispatch = useAppDispatch();
  const [quickViewProduct, setQuickViewProduct] =
    useState<ProductDetail | null>(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [compareProducts, setCompareProducts] = useState<ProductDetail[]>([]);
  const compareItems = useAppSelector((state) => state.compare.products);
  const { categories } = useAppSelector((state) => state.category);

  useEffect(() => {
    const fetchCompareData = async () => {
      if (compareItems.length === 0) {
        setCompareProducts([]);
        return;
      }
      try {
        const requests = compareItems.map((item) => getProductById(item.id));
        const responses = await Promise.all(requests);
        setCompareProducts(responses);
      } catch (error) {
        console.error("Fetch compare error:", error);
      }
    };

    fetchCompareData();
  }, []);

  const handleQuickView = (product: ProductDetail) => {
    setQuickViewProduct(product);
    setIsQuickViewOpen(true);
  };

  const compareFields = [
    {
      label: "Price",
      getValue: (p: ProductDetail) => {
        const prices = p.variants.map((p) => p.price);

        const maxPrice = Math.max(...prices);
        const minPrice = Math.min(...prices);

        if (maxPrice !== minPrice) {
          return `${minPrice} - ${maxPrice}`;
        }

        return minPrice;
      },
    },
    {
      label: "Category",
      getValue: (p: ProductDetail) =>
        categories.find((c) => c.id === p.category_id)?.name,
    },
    {
      label: "Sizes",
      getValue: (p: ProductDetail) => {
        const sizes = p.variants.map((v) => v.size);
        return [...new Set(sizes)].join(", ");
      },
    },
    {
      label: "Colors",
      getValue: (p: ProductDetail) => {
        const colors = p.variants.map((v) => v.color);
        return [...new Set(colors)].map((color) => {
          return (
            <span
              key={color}
              className="inline-block w-5 h-5 rounded-full mr-2"
              style={{
                backgroundColor: color,
                border:
                  color === "#FFFFFF" || color === "#ffffff"
                    ? "1px solid #e5e7eb"
                    : "none",
              }}
            ></span>
          );
        });
      },
    },
    {
      label: "Quantity",
      getValue: (p: ProductDetail) =>
        p.total_stock > 0 ? `${p.total_stock} in stock` : "Out of Stock",
    },
    {
      label: "New Arrival",
      getValue: (p: ProductDetail) => (p.isNew ? "Yes" : "No"),
    },
    {
      label: "Best Seller",
      getValue: (p: ProductDetail) => (p.isBestSell ? "Yes" : "No"),
    },
  ];

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between mb-8">
            <h1 className="text-2xl md:text-3xl font-bold text-foreground">
              Compare Products
            </h1>
            {compareProducts.length > 0 && (
              <Button
                variant="secondary"
                onClick={() => {
                  setCompareProducts([]);
                  dispatch(clearCompare());
                }}
                className="rounded-lg"
              >
                Clear All
              </Button>
            )}
          </div>

          {compareProducts.length === 0 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                No products to compare. Add products from the product list.
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : compareProducts.length === 1 ? (
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground mb-4">
                Add one more product to compare.
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/products">Browse Products</Link>
              </Button>
            </div>
          ) : (
            <div className="bg-card rounded-xl overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr>
                      <th className="text-left p-4 bg-secondary text-foreground font-medium w-32">
                        Details
                      </th>
                      {compareProducts.map((product) => (
                        <th key={product!.id} className="p-4 text-center">
                          <div className="relative">
                            <Link to={`/product/${product!.id}`}>
                              <div className="w-32 h-32 mx-auto rounded-lg overflow-hidden bg-secondary mb-3">
                                <img
                                  src={product!.image_url}
                                  alt={product!.name}
                                  className="w-full h-full object-cover"
                                />
                              </div>
                              <h3 className="font-medium text-foreground hover:text-primary transition-colors text-sm">
                                {product!.name}
                              </h3>
                            </Link>
                          </div>
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {compareFields.map((field, index) => (
                      <tr
                        key={field.label}
                        className={index % 2 === 0 ? "bg-secondary/50" : ""}
                      >
                        <td className="p-4 font-medium text-foreground">
                          {field.label}
                        </td>
                        {compareProducts.map((product) => (
                          <td
                            key={product.id}
                            className="p-4 text-center text-muted-foreground"
                          >
                            {field.getValue(product)}
                          </td>
                        ))}
                      </tr>
                    ))}
                    <tr>
                      <td className="p-4 font-medium text-foreground">
                        Description
                      </td>
                      {compareProducts.map((product) => (
                        <td
                          key={product.id}
                          className="p-4 text-center text-muted-foreground text-sm"
                        >
                          {product!.description}
                        </td>
                      ))}
                    </tr>
                    <tr className="bg-secondary/50">
                      <td className="p-4 font-medium text-foreground">
                        Add to cart
                      </td>
                      {compareProducts.map((product) => (
                        <td key={product.id} className="p-4 text-center">
                          <Button
                            onClick={() => handleQuickView(product!)}
                            disabled={product?.total_stock === 0}
                            size="sm"
                            className="rounded-lg"
                          >
                            Quick View
                          </Button>
                        </td>
                      ))}
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
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
    </div>
  );
};

export default Compare;
