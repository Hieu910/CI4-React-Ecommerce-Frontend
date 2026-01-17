import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Upload, Link, X, ImageIcon } from "lucide-react";
import { Product, ProductFormData, Variant } from "@/data/mockData";
import { groupVariantsByColor } from "@/lib/utils";
import {
  getProductVariants,
  updateProduct,
  createProduct,
} from "@/services/api";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { toast } from "sonner";
import ProductVariantTable from "./ProductVariantTable";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";

interface ProductFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  editingProduct: Product | null;
  onSubmit: (data: any) => void;
}

const TAG_OPTIONS = [
  { value: "new", label: "New" },
  { value: "bestsell", label: "Best Sell" },
  { value: "featured", label: "Featured" },
];

const getProductTags = (product: Product): string[] => {
  const tags: string[] = [];
  if (product.isNew) tags.push("new");
  if (product.isBestSell) tags.push("bestsell");
  if (product.isFeatured) tags.push("featured");
  return tags;
};

const ProductFormDialog = ({
  open,
  onOpenChange,
  editingProduct,
  onSubmit,
}: ProductFormDialogProps) => {
  const { categories } = useAppSelector((state) => state.category);
  const [imageInputType, setImageInputType] = useState<"url" | "file">("url");
  const [imageFile, setImageFile] = useState<File | null>(null);

  const [formData, setFormData] = useState<ProductFormData>({
    name: "",
    category: "",
    description: "",
    tags: [],
    image: "",
  });

  const [variants, setVariants] = useState<Variant[]>([]);

  useEffect(() => {
    const fetchVariants = async () => {
      try {
        const variants = await getProductVariants(editingProduct.id);
        setVariants(variants);
      } catch (error) {
        toast.error(error.message || "Failed to fetch variants");
      }
    };
    if (editingProduct) {
      setFormData({
        name: editingProduct.name,
        category: String(editingProduct.category_id),
        description: editingProduct.description,
        tags: getProductTags(editingProduct),
        image: editingProduct.image_url,
      });

      fetchVariants();
    } else {
      resetForm();
    }
  }, [editingProduct, open]);

  const resetForm = () => {
    setFormData({
      name: "",
      category: "",
      description: "",
      tags: [],
      image: "",
    });
    setVariants([]);
    setImageInputType("url");
    setImageFile(null);
  };

  const clearImage = () => {
    setFormData({ ...formData, image: "" });
    setImageFile(null);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({ ...formData, image: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleTagToggle = (tagValue: string) => {
    if (formData.tags.includes(tagValue)) {
      setFormData({
        ...formData,
        tags: formData.tags.filter((t) => t !== tagValue),
      });
    } else {
      setFormData({ ...formData, tags: [...formData.tags, tagValue] });
    }
  };

  const handleSubmit = async () => {
    if (!formData.name || !formData.category) {
      toast.error("Please fill in all required fields (Name, Category)");
      return;
    }

    if (!checkVariants(variants)) {
      return;
    }

    const apiFormData = new FormData();

    apiFormData.append("name", formData.name);
    apiFormData.append("category", formData.category);
    apiFormData.append("description", formData.description || "");

    apiFormData.append("isNew", formData.tags.includes("new") ? "1" : "0");
    apiFormData.append(
      "isBestSell",
      formData.tags.includes("bestsell") ? "1" : "0"
    );
    apiFormData.append(
      "isFeatured",
      formData.tags.includes("featured") ? "1" : "0"
    );

    // Handle image
    if (imageFile) {
      // If file is uploaded, send as 'image'
      apiFormData.append("image", imageFile);
    } else if (formData.image && imageInputType === "url") {
      // If URL is provided, send as 'image_url'
      apiFormData.append("image_url", formData.image);
    }

    const formattedVariants = variants.map((v) => ({
      ...v,
      color: v.color,
      size: v.size,
      price: v.price || 0,
      stock: v.stock || 0,
    }));

    apiFormData.append("variants", JSON.stringify(formattedVariants));

    const productData = {
      name: formData.name,
      category: formData.category,
      description: formData.description,
      image:
        formData.image ||
        "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?w=400",
      variants: formattedVariants,
      isNew: formData.tags.includes("new"),
      isBestSell: formData.tags.includes("bestsell"),
      isFeatured: formData.tags.includes("featured"),
    };

    console.log("FormData prepared for backend API:", {
      formDataEntries: Array.from(apiFormData.entries()),
      variants: formattedVariants,
      hasImageFile: !!imageFile,
      imageUrl: formData.image,
    });

    try {
      if (editingProduct) {
        await updateProduct(editingProduct.id, apiFormData);
        toast.success("Product updated successfully");
      } else {
        await createProduct(apiFormData);
        toast.success("Product added successfully");
      }
      onSubmit(productData);
      onOpenChange(false);
      resetForm();
    } catch (error) {
      toast.error(
        error.message || "An error occurred while saving the product"
      );
    }
  };

  const checkVariants = (variants: Variant[]) => {
    if (variants.length === 0) {
      toast.error("Please add at least one product variant");
      return false;
    }

    const invalidVariants = variants.filter((v) => !v.color || !v.size);
    if (invalidVariants.length > 0) {
      toast.error("All variants must have a color and size selected");
      return false;
    }

    const hasDuplicateVariants = variants.some((v, i) => {
      if (
        v.id !==
        variants.find((v2) => v2.color === v.color && v2.size === v.size)?.id
      ) {
        return true;
      }

      return false;
    });
    if (hasDuplicateVariants) {
      toast.error("Duplicate variants are not allowed");
      return false;
    }

    const variantsByColor = groupVariantsByColor(variants);
    for (const [color, colorVariants] of Object.entries(variantsByColor)) {
      const hasOneSize = colorVariants.some((v) => v.size === "One Size");
      const hasOtherSizes = colorVariants.some((v) => v.size !== "One Size");

      if (hasOneSize && hasOtherSizes) {
        toast.error('Color cannot have both "One Size" and other sizes');
        return false;
      }
    }

    return true;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-8 pt-6 pb-4 flex-shrink-0">
          <DialogTitle className="text-xl">
            {editingProduct ? "Edit Product" : "Add New Product"}
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="flex-1 px-6">
          <div className="space-y-6 pb-6 mx-2">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="font-semibold">Basic Information</h3>
              </div>

              <div>
                <Label htmlFor="name">Product Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) =>
                    setFormData({ ...formData, name: e.target.value })
                  }
                  placeholder="Enter product name"
                  className="mt-1.5"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) =>
                      setFormData({ ...formData, category: value })
                    }
                  >
                    <SelectTrigger className="mt-1.5">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat.id} value={String(cat.id)}>
                          {cat.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Tags (optional)</Label>
                  <div className="flex flex-wrap gap-2 mt-1.5">
                    {TAG_OPTIONS.map((tag) => (
                      <button
                        key={tag.value}
                        type="button"
                        onClick={() => handleTagToggle(tag.value)}
                        className={`px-3 py-1.5 rounded-full border text-sm transition-colors ${
                          formData.tags.includes(tag.value)
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-muted border-border hover:border-primary/50"
                        }`}
                      >
                        {tag.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) =>
                    setFormData({ ...formData, description: e.target.value })
                  }
                  className="mt-1.5 min-h-[80px] resize-none"
                  placeholder="Enter product description..."
                />
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="font-semibold">Media</h3>
              </div>

              <div className="flex gap-4 items-start">
                <div className="relative w-28 h-28 flex-shrink-0 rounded-lg border border-border overflow-hidden bg-muted">
                  {formData.image ? (
                    <>
                      <img
                        src={formData.image}
                        alt="Preview"
                        className="w-full h-full object-cover"
                      />
                      <button
                        type="button"
                        onClick={clearImage}
                        className="absolute top-1 right-1 p-1 rounded-full bg-background/80 hover:bg-background transition-colors"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <ImageIcon className="h-10 w-10 text-muted-foreground" />
                    </div>
                  )}
                </div>

                <div className="flex-1 space-y-3">
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      variant={imageInputType === "url" ? "default" : "outline"}
                      size="sm"
                      onClick={() => setImageInputType("url")}
                    >
                      <Link className="h-4 w-4 mr-1.5" />
                      URL
                    </Button>
                    <Button
                      type="button"
                      variant={
                        imageInputType === "file" ? "default" : "outline"
                      }
                      size="sm"
                      onClick={() => setImageInputType("file")}
                    >
                      <Upload className="h-4 w-4 mr-1.5" />
                      Upload
                    </Button>
                  </div>
                  {imageInputType === "url" ? (
                    <Input
                      placeholder="https://example.com/image.jpg"
                      value={formData.image}
                      onChange={(e) =>
                        setFormData({ ...formData, image: e.target.value })
                      }
                    />
                  ) : (
                    <div className="border-2 border-dashed rounded-lg p-4 text-center hover:border-primary/50 transition-colors">
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleFileUpload}
                        className="hidden"
                        id="image-upload"
                      />
                      <label htmlFor="image-upload" className="cursor-pointer">
                        <Upload className="h-6 w-6 mx-auto text-muted-foreground mb-2" />
                        <p className="text-sm text-muted-foreground">
                          Click to upload or drag and drop
                        </p>
                        <p className="text-xs text-muted-foreground mt-1">
                          PNG, JPG, WEBP up to 5MB
                        </p>
                      </label>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <Separator />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <div className="h-6 w-1 bg-primary rounded-full" />
                <h3 className="font-semibold">Variants</h3>
              </div>

              <ProductVariantTable
                variants={variants}
                onVariantsChange={setVariants}
              />
            </div>
          </div>
        </ScrollArea>

        <div className="flex justify-end gap-3 px-8 py-4 border-t bg-muted/30 flex-shrink-0">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit}>
            {editingProduct ? "Update Product" : "Create Product"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ProductFormDialog;
