import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2 } from "lucide-react";
import { Product, ProductListParams } from "@/data/mockData";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { getProducts, deleteProduct } from "@/services/api";
import { toast } from "sonner";
import Pagination from "@/components/Pagination";
import ProductFormDialog from "@/components/admin/ProductFormDialog";
import ProductFilters from "@/components/ProductFilters";

const PER_PAGE = 10;

const AdminProducts = () => {
  const { categories } = useAppSelector((state) => state.category);
  const [products, setProducts] = useState<Product[]>([]);
  const [totalProducts, setTotalProducts] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [stockFilter, setStockFilter] = useState<
    "all" | "in_stock" | "out_of_stock"
  >("all");
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [sortBy, setSortBy] = useState("name-asc");
  const [searchQuery, setSearchQuery] = useState("");

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (customParams?: any) => {
    try {
      setIsLoading(true);
      const params: ProductListParams = {
        page: currentPage,
        limit: PER_PAGE,
        categories:
          selectedCategories.length > 0 ? selectedCategories : undefined,
        sizes: selectedSizes.length > 0 ? selectedSizes : undefined,
        stock_status: stockFilter !== "all" ? stockFilter : undefined,
        min_price: minPrice ? parseFloat(minPrice) : undefined,
        max_price: maxPrice ? parseFloat(maxPrice) : undefined,
        search: searchQuery || undefined,
        sort_by: sortBy.split("-")[0] as any,
        sort_order: sortBy.split("-")[1] as any,
        ...customParams,
      };
      const response = await getProducts(params);
      setProducts(response.items || []);
      setTotalProducts(response.total || 0);
    } catch (error) {
      toast.error("Error fetching products");
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
    setSortBy("name-asc");
    setSearchQuery("");
    setCurrentPage(1);
    fetchProducts({ page: 1 });
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    fetchProducts({ page });
  };

  const handleOpenDialog = (product?: Product) => {
    setEditingProduct(product || null);
    setIsDialogOpen(true);
  };

  const handleSubmitForm = async () => {
    try {
      setIsDialogOpen(false);
      setEditingProduct(null);
      fetchProducts();
    } catch (error) {
      toast.error(error?.message || "Failed to save product");
    }
  };

  const handleDelete = async (productId: number) => {
    try {
      await deleteProduct(productId);
      toast.success("Product deleted successfully");
      fetchProducts();
    } catch (error) {
      toast.error(error?.message || "Failed to delete product");
    }
  };

  const getProductTags = (product: Product): string[] => {
    const tags: string[] = [];
    if (product.isNew) tags.push("New");
    if (product.isBestSell) tags.push("Best Sell");
    if (product.isFeatured) tags.push("Featured");
    return tags;
  };

  if (isLoading) {
    return (
      <div>
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold">Products</h1>
          <Button onClick={() => handleOpenDialog()}>
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Button>
        </div>
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
        </div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Button onClick={() => handleOpenDialog()}>
          <Plus className="h-4 w-4 mr-2" />
          Add Product
        </Button>
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

      <ProductFormDialog
        open={isDialogOpen}
        onOpenChange={setIsDialogOpen}
        editingProduct={editingProduct}
        onSubmit={handleSubmitForm}
      />

      {products.length > 0 ? (
        <div className="bg-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Image</TableHead>
                <TableHead>Name</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Stock</TableHead>
                <TableHead>Tags</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.map((product) => (
                <TableRow key={product.id}>
                  <TableCell>
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                  </TableCell>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>
                    {categories.find((c) => c.id === product.category_id)?.name}
                  </TableCell>
                  <TableCell>
                    {product.min_price === product.max_price
                      ? product.min_price.toFixed(2)
                      : `${product.min_price.toFixed(
                          2
                        )} - ${product.max_price.toFixed(2)}`}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-2 py-1 rounded-full text-xs ${
                        product.total_stock > 0
                          ? "bg-primary/10 text-primary"
                          : "bg-destructive/10 text-destructive"
                      }`}
                    >
                      {product.total_stock}
                    </span>
                  </TableCell>
                  <TableCell>
                    <div className="flex flex-wrap gap-1">
                      {getProductTags(product).map((tag) => (
                        <span
                          key={tag}
                          className="px-2 py-0.5 bg-muted text-muted-foreground rounded text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleOpenDialog(product)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => handleDelete(product.id)}
                      >
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
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
  );
};

export default AdminProducts;
