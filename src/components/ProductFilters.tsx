import { useState, useEffect } from "react";
import { ChevronDown, X, Search } from "lucide-react";
import { availableSizes } from "@/data/mockData";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchCategory } from "@/store/categorySlice";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Input } from "@/components/ui/input";

interface FiltersProps {
  selectedCategories: number[];
  selectedSizes: string[];
  stockFilter: "all" | "in_stock" | "out_of_stock";
  minPrice: string;
  maxPrice: string;
  sortBy: string;
  searchQuery: string;
  onCategoryChange: (categories: number[]) => void;
  onSizeChange: (sizes: string[]) => void;
  onStockChange: (stock: "all" | "in_stock" | "out_of_stock") => void;
  onPriceChange: (min: string, max: string) => void;
  onSortChange: (sort: string) => void;
  onSearchChange: (query: string) => void;
  onClearFilters: () => void;
  onSubmit: () => void;
}

const ProductFilters = ({
  selectedCategories,
  selectedSizes,
  stockFilter,
  minPrice,
  maxPrice,
  sortBy,
  searchQuery,
  onCategoryChange,
  onSizeChange,
  onStockChange,
  onPriceChange,
  onSortChange,
  onSearchChange,
  onClearFilters,
  onSubmit,
}: FiltersProps) => {
  const dispatch = useAppDispatch();
  const { categories, hasFetched } = useAppSelector((state) => state.category);
  const [tempMinPrice, setTempMinPrice] = useState(minPrice);
  const [tempMaxPrice, setTempMaxPrice] = useState(maxPrice);
  const [isPriceOpen, setIsPriceOpen] = useState(false);

  useEffect(() => {
    setTempMinPrice(minPrice);
    setTempMaxPrice(maxPrice);
  }, [minPrice, maxPrice]);

  useEffect(() => {
    if (categories.length === 0 && !hasFetched) {
      dispatch(fetchCategory());
    }
  }, []);

  const handleCategoryToggle = (categoryId: number) => {
    if (selectedCategories.includes(categoryId)) {
      onCategoryChange(selectedCategories.filter((c) => c !== categoryId));
    } else {
      onCategoryChange([...selectedCategories, categoryId]);
    }
  };

  const handleSizeToggle = (size: string) => {
    if (selectedSizes.includes(size)) {
      onSizeChange(selectedSizes.filter((s) => s !== size));
    } else {
      onSizeChange([...selectedSizes, size]);
    }
  };

  const handlePriceApply = () => {
    onPriceChange(tempMinPrice, tempMaxPrice);
    setIsPriceOpen(false);
  };

  const hasActiveFilters =
    selectedCategories.length > 0 ||
    selectedSizes.length > 0 ||
    stockFilter !== "all" ||
    minPrice ||
    maxPrice ||
    searchQuery;

  return (
    <div className="bg-card rounded-xl p-4 mb-6">
      <div className="flex flex-wrap items-center gap-3">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="pl-9 w-48 md:w-64 bg-secondary rounded-lg"
          />
        </div>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors">
              Category
              {selectedCategories.length > 0 && (
                <span className="w-2 h-2 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full"></span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-card p-3">
            <div className="space-y-2">
              {categories.map((category) => (
                <label
                  key={category.id}
                  className="flex items-center gap-3 cursor-pointer py-1"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategoryToggle(category.id)}
                  />
                  <span className="text-sm text-foreground">
                    {category.name}
                  </span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors">
              Size
              {selectedSizes.length > 0 && (
                <span className="w-2 h-2 flex items-center justify-center text-xs bg-primary text-primary-foreground rounded-full"></span>
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-56 bg-card p-3">
            <div className="space-y-2">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className="flex items-center gap-3 cursor-pointer py-1"
                >
                  <Checkbox
                    checked={selectedSizes.includes(size)}
                    onCheckedChange={() => handleSizeToggle(size)}
                  />
                  <span className="text-sm text-foreground">{size}</span>
                </label>
              ))}
            </div>
          </PopoverContent>
        </Popover>

        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors">
              Stock
              {stockFilter !== "all" && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-card p-3">
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="stock"
                  checked={stockFilter === "all"}
                  onChange={() => onStockChange("all")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">All</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="stock"
                  checked={stockFilter === "in_stock"}
                  onChange={() => onStockChange("in_stock")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">In Stock</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="stock"
                  checked={stockFilter === "out_of_stock"}
                  onChange={() => onStockChange("out_of_stock")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">Out of Stock</span>
              </label>
            </div>
          </PopoverContent>
        </Popover>

        <Popover open={isPriceOpen} onOpenChange={setIsPriceOpen}>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors">
              Price
              {(minPrice || maxPrice) && (
                <span className="w-2 h-2 bg-primary rounded-full" />
              )}
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-64 bg-card p-4">
            <div className="space-y-4">
              <div>
                <label className="text-sm text-foreground mb-1 block">
                  Min Price
                </label>
                <Input
                  type="number"
                  placeholder="0"
                  value={tempMinPrice}
                  onChange={(e) => setTempMinPrice(e.target.value)}
                  className="bg-secondary rounded-lg"
                />
              </div>
              <div>
                <label className="text-sm text-foreground mb-1 block">
                  Max Price
                </label>
                <Input
                  type="number"
                  placeholder="999"
                  value={tempMaxPrice}
                  onChange={(e) => setTempMaxPrice(e.target.value)}
                  className="bg-secondary rounded-lg"
                />
              </div>
              <Button onClick={handlePriceApply} className="w-full rounded-lg">
                Apply
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Sort By */}
        <Popover>
          <PopoverTrigger asChild>
            <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors">
              Sort By
              <ChevronDown className="w-4 h-4" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 bg-card p-3">
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "name-Asc"}
                  onChange={() => onSortChange("name-Asc")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">Name: A-Z</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "name-Desc"}
                  onChange={() => onSortChange("name-Desc")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">Name: Z-A</span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "price-Asc"}
                  onChange={() => onSortChange("price-Asc")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">
                  Price: Low to High
                </span>
              </label>
              <label className="flex items-center gap-3 cursor-pointer py-1">
                <input
                  type="radio"
                  name="sort"
                  checked={sortBy === "price-Desc"}
                  onChange={() => onSortChange("price-Desc")}
                  className="w-4 h-4 text-primary"
                />
                <span className="text-sm text-foreground">
                  Price: High to Low
                </span>
              </label>
            </div>
          </PopoverContent>
        </Popover>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <button
            onClick={onClearFilters}
            className="flex items-center gap-1 px-3 py-2 text-sm text-muted-foreground hover:text-foreground transition-colors"
          >
            <X className="w-4 h-4" />
            Clear filters
          </button>
        )}

        <Button className="rounded-lg text-md" onClick={onSubmit}>
          Search
        </Button>
      </div>
    </div>
  );
};

export default ProductFilters;
