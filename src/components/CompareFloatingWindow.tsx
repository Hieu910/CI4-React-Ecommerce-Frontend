import { Link } from "react-router-dom";
import { X, GitCompare } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { removeFromCompare, clearCompare } from "@/store/compareSlice";

import { Button } from "@/components/ui/button";

const CompareFloatingWindow = () => {
  const dispatch = useAppDispatch();
  const compareProducts = useAppSelector((state) => state.compare.products);

  if (compareProducts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 bg-card rounded-xl shadow-lg p-4 w-80 animate-slide-in">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <GitCompare className="w-5 h-5 text-primary" />
          <span className="font-medium text-foreground">
            Compare ({compareProducts.length}/2)
          </span>
        </div>
        <button
          onClick={() => dispatch(clearCompare())}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          Clear all
        </button>
      </div>

      <div className="flex gap-3 mb-4">
        {compareProducts.map((product) => (
          <div key={product!.id} className="relative flex-1">
            <div className="aspect-square rounded-lg overflow-hidden bg-secondary">
              <img
                src={product?.image_url}
                alt={product?.name}
                className="w-full h-full object-cover"
              />
            </div>
            <button
              onClick={() => dispatch(removeFromCompare(product!.id))}
              className="absolute -top-2 -right-2 p-1 rounded-full bg-card shadow-md text-foreground hover:text-destructive"
            >
              <X className="w-3 h-3" />
            </button>
            <p className="text-xs text-foreground mt-1 truncate">
              {product?.name}
            </p>
            <p className="text-xs font-medium text-primary">
              {product.min_price === product.max_price
                ? product.min_price.toFixed(2)
                : `${product.min_price.toFixed(
                    2
                  )} - ${product.max_price.toFixed(2)}`}
            </p>
          </div>
        ))}

        {compareProducts.length < 2 && (
          <div className="flex-1 aspect-square rounded-lg bg-secondary flex items-center justify-center">
            <span className="text-xs text-muted-foreground">Add product</span>
          </div>
        )}
      </div>

      <Button
        asChild
        disabled={compareProducts.length < 2}
        className="w-full rounded-lg"
      >
        <Link to="/compare">Compare Now</Link>
      </Button>
    </div>
  );
};

export default CompareFloatingWindow;
