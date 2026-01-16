import { Link } from "react-router-dom";
import { Eye, GitCompare, Package } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { toggleCompare } from "@/store/compareSlice";
import { Product } from "@/data/mockData";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  onQuickView: (product: Product) => void;
}

const ProductCard = ({ product, onQuickView }: ProductCardProps) => {
  const dispatch = useAppDispatch();
  const compareItems = useAppSelector((state) => state.compare.products);

  const isInCompare = compareItems.some((p) => p.id === product.id);

  const handleCompareClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (compareItems.length >= 2 && !isInCompare) {
      toast.error("You can only compare 2 products at a time");
      return;
    }

    dispatch(toggleCompare(product));
    if (isInCompare) {
      toast.success("Removed from compare");
    } else {
      toast.success("Added to compare");
    }
  };

  const handleQuickView = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onQuickView(product);
  };

  return (
    <Link to={`/product/${product.id}`} className="group block">
      <div className="relative bg-card rounded-xl overflow-hidden transition-all duration-300 hover:shadow-lg">
        <div className="relative aspect-[3/4] overflow-hidden bg-secondary">
          <img
            src={product.image_url}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute top-3 left-3 flex flex-col gap-2">
            {product.isNew ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-primary text-primary-foreground rounded-lg">
                <Package className="w-3 h-3" />
                New
              </span>
            ) : null}
            {product.total_stock === 0 ? (
              <span className="flex items-center gap-1 px-2 py-1 text-xs font-medium bg-muted text-muted-foreground rounded-lg">
                <Package className="w-3 h-3" />
                Out of Stock
              </span>
            ) : null}
          </div>

          <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              onClick={handleQuickView}
              className="p-2 rounded-full bg-card border border-foreground/20 text-foreground hover:text-primary transition-colors"
            >
              <Eye className="w-4 h-4" />
            </button>

            <button
              onClick={handleCompareClick}
              className={`p-2 rounded-full bg-card border border-foreground/20 transition-colors ${
                isInCompare
                  ? "text-primary bg-primary/10"
                  : "text-foreground hover:text-primary"
              }`}
            >
              <GitCompare className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4">
          <h3 className="text-sm font-medium text-foreground line-clamp-2 mb-2">
            {product.name}
          </h3>

          <p className="text-lg font-bold text-foreground">
            {product.min_price === product.max_price
              ? product.min_price.toFixed(2)
              : `${product.min_price.toFixed(2)} - ${product.max_price.toFixed(
                  2
                )}`}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default ProductCard;
