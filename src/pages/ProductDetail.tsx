import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { Minus, Plus, ChevronLeft } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import QuickViewDrawer from "@/components/QuickViewDrawer";
import ProductCard from "@/components/ProductCard";
import { groupVariantsByColor } from "@/lib/utils";
import CompareFloatingWindow from "@/components/CompareFloatingWindow";
import {
  Product,
  Variant,
  ProductDetail as ProductDetailType,
} from "@/data/mockData";
import { getProductById, getRelatedProducts } from "@/services/api";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { addToCartAsync } from "@/store/cartSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const ProductDetail = () => {
  const { id } = useParams<{ id: string }>();
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [product, setProduct] = useState<ProductDetailType | null>(null);
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(
    null
  );
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      if (!id) return;

      try {
        setIsLoading(true);
        const productData = await getProductById(parseInt(id));
        productData.variants = groupVariantsByColor(productData.variants);
        setProduct(productData);

        const related = await getRelatedProducts(parseInt(id), 4);
        setRelatedProducts(related);
      } catch (error) {
        console.error("Error fetching product:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

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

  if (!product) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <p className="text-lg text-muted-foreground">
                Product not found.
              </p>
              <Button asChild className="mt-4 rounded-lg">
                <Link to="/products">Back to Products</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    dispatch(
      addToCartAsync({
        variant_id: selectedVariant.id,
        quantity,
      })
    )
      .unwrap()
      .then(() => {
        toast.success("Added to cart");
      })
      .catch((error) => {
        toast.error(error || "Failed to add to cart");
      });
  };

  const handleQuickView = (p: Product) => {
    setQuickViewProduct(p);
    setIsQuickViewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
            Back to Products
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-secondary max-w-[400px] mx-auto">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-4">
                {product.name}
              </h1>
              <p className="text-3xl font-bold text-primary mb-6">
                {selectedVariant
                  ? selectedVariant.price.toFixed(2)
                  : "Choose a variant"}
              </p>

              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Color
                </p>
                <div className="flex gap-3">
                  {Object.keys(product.variants).map((color) => (
                    <button
                      key={color}
                      onClick={() => {
                        setSelectedColor(color);
                        setSelectedSize("");
                        setSelectedVariant(null);
                      }}
                      className={`w-8 h-8 rounded-full transition-all ${
                        selectedColor === color
                          ? "ring-2 ring-primary ring-offset-2"
                          : ""
                      }`}
                      style={{
                        backgroundColor: color,
                        border:
                          color === "#FFFFFF" || color === "#ffffff"
                            ? "1px solid #e5e7eb"
                            : "none",
                      }}
                    />
                  ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Size: {selectedSize || "Select a size"}
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedColor &&
                    product.variants[selectedColor]?.map((variant) => (
                      <button
                        key={`size-${variant.id}`}
                        onClick={() => {
                          setSelectedVariant(variant);
                          setSelectedSize(variant.size);
                        }}
                        className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                          selectedSize === variant.size
                            ? "bg-primary text-primary-foreground"
                            : "bg-secondary text-foreground hover:bg-muted"
                        }`}
                      >
                        {variant.size}
                      </button>
                    ))}
                </div>
              </div>

              <div className="mb-6">
                <p className="text-sm font-medium text-foreground mb-3">
                  Quantity
                </p>
                <div className="flex items-center gap-4">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                  >
                    <Minus className="w-5 h-5" />
                  </button>
                  <span className="text-xl font-medium text-foreground w-8 text-center">
                    {quantity}
                  </span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                  >
                    <Plus className="w-5 h-5" />
                  </button>
                </div>
              </div>
              {selectedVariant && (
                <div className="mb-6">
                  <p className="text-sm font-medium text-foreground mb-2">
                    Availability
                  </p>
                  <span
                    className={`inline-block px-3 py-1 rounded-full text-sm ${
                      selectedVariant.stock > 0
                        ? "bg-primary/10 text-primary"
                        : "bg-destructive/10 text-destructive"
                    }`}
                  >
                    {selectedVariant.stock > 0
                      ? `${selectedVariant.stock} in stock`
                      : "Out of Stock"}
                  </span>
                </div>
              )}

              <Button
                onClick={handleAddToCart}
                disabled={!selectedVariant || selectedVariant.stock === 0}
                size="lg"
                className="w-full rounded-xl py-6 text-lg mb-6"
              >
                {!selectedColor
                  ? "Select Color"
                  : !selectedSize
                  ? "Select Size"
                  : selectedVariant.stock === 0
                  ? "Out of Stock"
                  : "Add to Cart"}
              </Button>

              <div>
                <p className="text-sm font-medium text-foreground mb-2">
                  Description
                </p>
                <p className="text-muted-foreground leading-relaxed">
                  {product.description}
                </p>
              </div>
            </div>
          </div>

          {relatedProducts.length > 0 && (
            <section>
              <h2 className="text-xl md:text-2xl font-bold text-foreground mb-6">
                Related Products
              </h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p) => (
                  <ProductCard
                    key={p.id}
                    product={p}
                    onQuickView={handleQuickView}
                  />
                ))}
              </div>
            </section>
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

export default ProductDetail;
