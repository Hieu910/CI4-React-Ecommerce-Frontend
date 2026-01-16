import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Plus, Trash2 } from "lucide-react";
import {
  availableColors,
  Variant,
  availableSizes as SIZES,
} from "@/data/mockData";

interface ProductVariantTableProps {
  variants: Variant[];
  onVariantsChange: (variants: Variant[]) => void;
}

const ProductVariantTable = ({
  variants,
  onVariantsChange,
}: ProductVariantTableProps) => {
  const addVariant = () => {
    const newVariant = {
      id: `new-variant-${crypto.randomUUID()}`,
      color: "",
      size: "",
      price: 0,
      stock: 0,
    };
    onVariantsChange([...variants, newVariant] as Variant[]);
  };

  const updateVariant = (id: string, field: keyof Variant, value: string) => {
    onVariantsChange(
      variants.map((v) => (String(v.id) === id ? { ...v, [field]: value } : v))
    );
  };

  const removeVariant = (id: string) => {
    onVariantsChange(variants.filter((v) => String(v.id) !== id));
  };

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-medium">Product Variants</h3>
        <Button type="button" variant="outline" size="sm" onClick={addVariant}>
          <Plus className="h-4 w-4 mr-1" />
          Add Variant
        </Button>
      </div>

      {variants.length > 0 ? (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-[25%]">Color</TableHead>
                <TableHead className="w-[20%]">Size</TableHead>
                <TableHead className="w-[20%]">Price</TableHead>
                <TableHead className="w-[20%]">Stock</TableHead>
                <TableHead className="w-[15%] text-center">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {variants.map((variant) => (
                <TableRow key={variant.id}>
                  <TableCell className="py-2">
                    <Select
                      value={variant.color}
                      onValueChange={(value) =>
                        updateVariant(String(variant.id), "color", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Color" />
                      </SelectTrigger>
                      <SelectContent>
                        {availableColors.map((color) => (
                          <SelectItem key={color.name} value={color.hex}>
                            <div className="flex items-center gap-2">
                              <div
                                className="w-3 h-3 rounded-full border"
                                style={{ backgroundColor: color.hex }}
                              />
                              {color.name}
                            </div>
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2">
                    <Select
                      value={variant.size}
                      onValueChange={(value) =>
                        updateVariant(String(variant.id), "size", value)
                      }
                    >
                      <SelectTrigger className="h-9">
                        <SelectValue placeholder="Size" />
                      </SelectTrigger>
                      <SelectContent>
                        {SIZES.map((size) => (
                          <SelectItem key={size} value={size}>
                            {size}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0.00"
                      value={variant.price}
                      onChange={(e) => {
                        if (parseFloat(e.target.value) < 0) {
                          return;
                        }
                        updateVariant(
                          String(variant.id),
                          "price",
                          e.target.value
                        );
                      }}
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="py-2">
                    <Input
                      type="number"
                      min="0"
                      placeholder="0"
                      value={variant.stock}
                      onChange={(e) =>
                        updateVariant(
                          String(variant.id),
                          "stock",
                          e.target.value
                        )
                      }
                      className="h-9"
                    />
                  </TableCell>
                  <TableCell className="py-2 text-center">
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      className="h-8 w-8"
                      onClick={() => removeVariant(String(variant.id))}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      ) : (
        <div className="border border-dashed rounded-lg p-6 text-center text-muted-foreground">
          <p className="text-sm">No variants added yet.</p>
          <p className="text-xs mt-1">
            Click "Add Variant" to create product options.
          </p>
        </div>
      )}
    </div>
  );
};

export default ProductVariantTable;
