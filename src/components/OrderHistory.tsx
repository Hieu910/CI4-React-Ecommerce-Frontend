import { useEffect } from "react";
import { Order } from "@/data/mockData";
import { Package, Eye } from "lucide-react";
import { Button } from "./ui/button";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { fetchUserOrders } from "@/store/orderSlice";
import { toast } from "sonner";

interface OrderHistoryProps {
  handleOrderClick: (order: Order) => void;
}

const statusColors = {
  0: { color: "bg-yellow-100 text-yellow-800", label: "Pending" },
  1: { color: "bg-blue-100 text-blue-800", label: "Confirmed" },
  2: { color: "bg-primary/10 text-primary", label: "Shipped" },
  3: { color: "bg-destructive/10 text-destructive", label: "Cancelled" },
};

const OrderHistory = ({ handleOrderClick }: OrderHistoryProps) => {
  const dispatch = useAppDispatch();
  const { userOrders, hasUserFetched } = useAppSelector((state) => state.order);

  useEffect(() => {
    const fecthOrders = async () => {
      if (!hasUserFetched) {
        try {
          await dispatch(fetchUserOrders()).unwrap();
        } catch (error) {
          toast.error("Failed to load orders");
        }
      }
    };

    fecthOrders();
  }, [dispatch, hasUserFetched]);

  return (
    <div className="bg-card rounded-xl p-6">
      <h2 className="text-lg font-bold text-foreground mb-4">Order History</h2>

      {userOrders.length === 0 ? (
        <div className="text-center py-8">
          <Package className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No orders yet</p>
        </div>
      ) : (
        <div className="space-y-4">
          {userOrders.map((order) => (
            <div key={order.id} className="bg-secondary rounded-lg p-4">
              <div className="grid grid-cols-[1fr_auto_auto_auto_auto] items-center gap-4 min-w-0">
                <p className="font-medium text-foreground truncate min-w-0">
                  #{order.id}
                </p>

                <p className="text-sm text-muted-foreground whitespace-nowrap">
                  {order.created_at}
                </p>

                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleOrderClick(order)}
                  className="text-primary hover:text-primary/80 shrink-0"
                >
                  <Eye className="w-4 h-4 mr-1" />
                  Detail
                </Button>

                <p className="font-bold text-foreground whitespace-nowrap">
                  {order.total_amount}
                </p>

                <span
                  className={`inline-block px-2 py-1 text-xs rounded-full text-success capitalize whitespace-nowrap ${
                    statusColors[order.status_code]?.color
                  }`}
                >
                  {order.status_label}
                </span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OrderHistory;
