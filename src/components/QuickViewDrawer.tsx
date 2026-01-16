import { useState, useEffect } from "react";
import { Minus, Plus } from "lucide-react";
import { Product, Variant, ProductDetail } from "@/data/mockData";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { addToCartAsync } from "@/store/cartSlice";
import { getProductById } from "@/services/api";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { groupVariantsByColor } from "@/lib/utils";
import { toast } from "sonner";

interface QuickViewDrawerProps {
  product: Product | null;
  isOpen: boolean;
  onClose: () => void;
}

const QuickViewDrawer = ({
  product,
  isOpen,
  onClose,
}: QuickViewDrawerProps) => {
  const dispatch = useAppDispatch();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const [selectedVariant, setSelectedVariant] = useState<Variant | null>(null);
  const [selectedSize, setSelectedSize] = useState("");
  const [selectedColor, setSelectedColor] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [productDetail, setProductDetail] = useState<ProductDetail | null>(
    null
  );

  const fetchProductById = async (id: number) => {
    try {
      const response = await getProductById(id);
      response.variants = groupVariantsByColor(response.variants);
      setProductDetail(response);
    } catch (error: any) {
      toast.error(error.message || "Failed to fetch product details");
    }
  };

  useEffect(() => {
    if (product) {
      fetchProductById(product.id);
    }
  }, [product]);

  const handleAddToCart = () => {
    if (!isLoggedIn) {
      toast.error("Please login to add items to cart");
      return;
    }
    if (!selectedColor) {
      toast.error("Please select a color");
      return;
    }

    if (!selectedSize) {
      toast.error("Please select a size");
      return;
    }

    if (!selectedVariant) {
      toast.error("Please select a valid variant");
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
        onClose();
      })
      .catch((error) => {
        toast.error(error);
      });
  };

  if (!product || !productDetail) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-full sm:max-w-lg bg-card overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="text-foreground">Quick View</SheetTitle>
        </SheetHeader>

        <div className="mt-6">
          <div className="relative aspect-square rounded-xl overflow-hidden bg-secondary mb-6">
            <img
              src={productDetail.image_url}
              alt={productDetail.name}
              className="w-full h-full object-cover"
            />
          </div>

          <h2 className="text-xl font-bold text-foreground mb-2">
            {productDetail.name}
          </h2>

          <p className="text-2xl font-bold text-primary mb-4">
            {selectedVariant ? selectedVariant.price : "Choose a variant"}
          </p>

          {/* Color Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Color</p>
            <div className="flex gap-3">
              {Object.keys(productDetail.variants).map((color) => (
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

          {/* Size Selection */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Size</p>
            <div className="flex flex-wrap gap-2">
              {selectedColor &&
                productDetail.variants[selectedColor]?.map((variant) => (
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

          {/* Quantity */}
          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-3">Quantity</p>
            <div className="flex items-center gap-4">
              <button
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="p-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
              >
                <Minus className="w-4 h-4" />
              </button>
              <span className="text-lg font-medium text-foreground w-8 text-center">
                {quantity}
              </span>
              <button
                onClick={() => setQuantity(quantity + 1)}
                disabled={selectedVariant && quantity >= selectedVariant.stock}
                className="p-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Plus className="w-4 h-4" />
              </button>
            </div>
            {selectedVariant && (
              <p className="text-xs text-muted-foreground mt-2">
                {selectedVariant.stock} items available
              </p>
            )}
          </div>

          <div className="mb-6">
            <p className="text-sm font-medium text-foreground mb-2">
              Description
            </p>
            <p className="text-sm text-muted-foreground leading-relaxed">
              {productDetail.description}
            </p>
          </div>

          <Button
            onClick={handleAddToCart}
            disabled={!selectedVariant || selectedVariant.stock === 0}
            className="w-full rounded-xl py-6 text-lg"
          >
            {!selectedColor
              ? "Select Color"
              : !selectedSize
              ? "Select Size"
              : selectedVariant.stock === 0
              ? "Out of Stock"
              : "Add to Cart"}
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default QuickViewDrawer;
