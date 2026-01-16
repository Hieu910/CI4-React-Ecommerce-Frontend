import { useState, useEffect } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Eye } from "lucide-react";
import { getAdminOrderById } from "@/services/api";
import { useAppDispatch, useAppSelector } from "@/hooks/useAppDispatch";
import { Order, OrderDetail } from "@/data/mockData";
import { fetchAdminOrders, updateOrderAsync } from "@/store/orderSlice";

const statusColors = {
  0: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  1: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
  2: { color: "bg-primary/10 text-primary", label: "Shipped" },
  3: { color: "bg-destructive/10 text-destructive", label: "Cancelled" },
};

const AdminOrders = () => {
  const dispatch = useAppDispatch();
  const { adminOrders, hasAdminFetched, isLoading } = useAppSelector(
    (state) => state.order
  );
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const fecthOrders = async () => {
      if (!hasAdminFetched && adminOrders.length === 0) {
        try {
          await dispatch(fetchAdminOrders()).unwrap();
        } catch (error) {
          toast.error("Failed to load orders");
        }
      }
    };

    fecthOrders();
  }, [dispatch, hasAdminFetched]);

  useEffect(() => {
    if (!selectedOrder || !isDetailOpen) {
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        const order = await getAdminOrderById(selectedOrder.id);

        setSelectedOrderDetail(order);
      } catch (error) {
        toast.error("Error fetching order:", error);
      }
    };

    fetchOrderDetail();
  }, [selectedOrder, isDetailOpen]);

  const handleViewDetail = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  const handleStatusChange = (orderId: number, newStatus: string) => {
    try {
      dispatch(
        updateOrderAsync({ id: orderId, status: parseInt(newStatus) })
      ).unwrap();
      toast.success("Order status updated successfully!");
    } catch (error) {
      toast.error("Failed to update order status");
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-center h-96">
              <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Orders</h1>

      {adminOrders.length === 0 ? (
        <div className="bg-card rounded-lg p-8 text-center">
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="bg-card rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Order ID</TableHead>
                <TableHead>Customer Name</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Items</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {adminOrders.map((order) => (
                <TableRow key={order.id}>
                  <TableCell className="font-medium">{order.id}</TableCell>
                  <TableCell>{order.customer_name || "N/A"}</TableCell>
                  <TableCell>{order.created_at}</TableCell>
                  <TableCell>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleViewDetail(order)}
                      className="text-primary hover:text-primary/80"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      Detail
                    </Button>
                  </TableCell>
                  <TableCell>{(order.total_amount || 0).toFixed(2)}</TableCell>
                  <TableCell>
                    <Select
                      value={String(order.status_code)}
                      onValueChange={(value) =>
                        handleStatusChange(order.id, value)
                      }
                    >
                      <SelectTrigger className="w-32">
                        <SelectValue>
                          <span
                            className={`px-2 py-1 rounded-full text-xs capitalize ${
                              statusColors[order.status_code].color
                            }`}
                          >
                            {order.status_label}
                          </span>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="0">Pending</SelectItem>
                        <SelectItem value="1">Confirmed</SelectItem>
                        <SelectItem value="2">Shipped</SelectItem>
                        <SelectItem value="3">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Id: {selectedOrderDetail?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrderDetail && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <div className="text-sm text-muted-foreground">
                Date: {selectedOrder.created_at}
              </div>

              <div className="space-y-3">
                {selectedOrderDetail.items.map((item) => {
                  const [selectedColor, selectedSize] =
                    item.variant_info.split(" - ");
                  return (
                    <div
                      key={item.id}
                      className="flex gap-3 py-2 border-b last:border-0"
                    >
                      {item.image_url && (
                        <img
                          src={item.image_url}
                          alt={item.name}
                          className="w-16 h-16 object-cover rounded"
                        />
                      )}
                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        <p className="text-xs text-muted-foreground">
                          ID: {item.id}
                        </p>

                        <p className="text-sm text-muted-foreground flex items-center gap-1">
                          {selectedColor && `Color:`}{" "}
                          <span
                            className="inline-block w-5 h-5 rounded-full"
                            style={{
                              backgroundColor: selectedColor,
                              border:
                                selectedColor === "#FFFFFF" ||
                                selectedColor === "#ffffff"
                                  ? "1px solid #e5e7eb"
                                  : "none",
                            }}
                          ></span>
                          {selectedColor && selectedSize && " | "}
                          {selectedSize && `Size: ${selectedSize}`}
                        </p>

                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-muted-foreground">
                            {(item.price || 0).toFixed(2)} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {((item.price || 0) * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>
                  {(selectedOrderDetail.total_amount || 0).toFixed(2)}
                </span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AdminOrders;
