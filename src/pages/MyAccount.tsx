import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";
import { User, Package, Eye } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAppSelector } from "@/hooks/useAppDispatch";
import { Order, OrderDetail } from "@/data/mockData";
import { getUserOrderById } from "@/services/api";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

import OrderHistory from "@/components/OrderHistory";
import UserProfileForm from "@/components/UserProfileForm";

const MyAccount = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isLoggedIn } = useAppSelector((state) => state.auth);

  const [activeTab, setActiveTab] = useState("profile");

  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [selectedOrderDetail, setSelectedOrderDetail] =
    useState<OrderDetail | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  useEffect(() => {
    const tab = searchParams.get("tab");
    if (tab === "orders" || tab === "profile") {
      setActiveTab(tab);
    }
  }, [searchParams]);

  useEffect(() => {
    if (!isLoggedIn) {
      navigate("/login");
    }
  }, [isLoggedIn, navigate]);

  useEffect(() => {
    if (!selectedOrder || !isDetailOpen) {
      return;
    }

    const fetchOrderDetail = async () => {
      try {
        const order = await getUserOrderById(selectedOrder.id);

        setSelectedOrderDetail(order);
      } catch (error) {
        console.error("Error fetching order:", error);
      }
    };

    fetchOrderDetail();
  }, [selectedOrder, isDetailOpen]);

  const tabs = [
    { id: "profile", label: "Profile", icon: User },
    { id: "orders", label: "Orders", icon: Package },
  ];

  const handleOrderClick = (order: Order) => {
    setSelectedOrder(order);
    setIsDetailOpen(true);
  };

  if (!isLoggedIn) return null;

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            My Account
          </h1>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1">
              <div className="bg-card rounded-xl p-4 space-y-2">
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setActiveTab(tab.id);
                      setSelectedOrder(null);
                      setIsDetailOpen(false);
                    }}
                    className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-left transition-colors ${
                      activeTab === tab.id
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <tab.icon className="w-5 h-5" />
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="lg:col-span-3">
              {activeTab === "profile" && <UserProfileForm />}

              {activeTab === "orders" && (
                <OrderHistory handleOrderClick={handleOrderClick} />
              )}
            </div>
          </div>
        </div>
      </main>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Order Id: {selectedOrderDetail?.id}</DialogTitle>
          </DialogHeader>

          {selectedOrderDetail && (
            <div className="space-y-3 max-h-60 overflow-y-auto">
              <div className="flex items-center justify-between">
                <div className="text-sm text-muted-foreground">
                  Customer Name: {selectedOrderDetail.customer_name}
                </div>
                <div className="text-sm text-muted-foreground">
                  Date: {selectedOrderDetail.created_at}
                </div>
              </div>

              <div className="space-y-3">
                {selectedOrderDetail.items.map((item, index) => {
                  const [color, size] = item.variant_info.split(" - ");
                  return (
                    <div
                      key={index}
                      className="flex gap-3 py-2 border-b last:border-0"
                    >
                      <img
                        src={
                          item.image_url ||
                          "/public/assets/images/placeholder-image.png"
                        }
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded"
                      />

                      <div className="flex-1">
                        <p className="font-medium">{item.name}</p>
                        {item.variant_info && (
                          <p className="text-sm text-muted-foreground flex items-center gap-1">
                            {color && `Color:`}{" "}
                            <span
                              className="inline-block w-5 h-5 rounded-full"
                              style={{
                                backgroundColor: color,
                                border:
                                  color === "#FFFFFF" || color === "#ffffff"
                                    ? "1px solid #e5e7eb"
                                    : "none",
                              }}
                            ></span>
                            {color && size && " | "}
                            {size && `Size: ${size}`}
                          </p>
                        )}
                        <div className="flex justify-between mt-1">
                          <span className="text-sm text-muted-foreground">
                            {item.price.toFixed(2)} x {item.quantity}
                          </span>
                          <span className="font-medium">
                            {(item.price * item.quantity).toFixed(2)}
                          </span>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="pt-2 flex justify-between font-semibold">
                <span>Total:</span>
                <span>{selectedOrderDetail.total_amount.toFixed(2)}</span>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  );
};

export default MyAccount;
