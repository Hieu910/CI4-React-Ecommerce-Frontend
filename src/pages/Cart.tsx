import { useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Trash2, Minus, Plus, ShoppingBag, Loader2 } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import {
  fetchCart,
  removeFromCartAsync,
  updateQuantityAsync,
  updateQuantityLocal,
  clearCart,
} from "@/store/cartSlice";
import { addOrderAsync } from "@/store/orderSlice";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

const Cart = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { isLoggedIn } = useAppSelector((state) => state.auth);
  const {
    items: cartItems,
    totalAmount,
    isLoading,
  } = useAppSelector((state) => state.cart);

  const debounceTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

  useEffect(() => {
    if (isLoggedIn) {
      dispatch(fetchCart());
    }
    return () => {
      Object.values(debounceTimers.current).forEach(clearTimeout);
    };
  }, [dispatch, isLoggedIn]);

  const handleRemoveItem = (cartId: number) => {
    if (debounceTimers.current[cartId]) {
      clearTimeout(debounceTimers.current[cartId]);
      delete debounceTimers.current[cartId];
    }

    dispatch(removeFromCartAsync(cartId))
      .unwrap()
      .then(() => toast.success("Item removed from cart"))
      .catch((error) => toast.error(error || "Failed to remove item"));
  };

  const handleUpdateQuantity = (
    cartId: number,
    variantId: number,
    newQuantity: number
  ) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantityLocal({ cartId, quantity: newQuantity }));
    if (debounceTimers.current[cartId]) {
      clearTimeout(debounceTimers.current[cartId]);
    }

    debounceTimers.current[cartId] = setTimeout(() => {
      dispatch(
        updateQuantityAsync({
          variant_id: variantId,
          quantity: newQuantity,
        })
      )
        .unwrap()
        .catch((error) => {
          toast.error(error || "Failed to update quantity");
          dispatch(fetchCart());
        })
        .finally(() => {
          delete debounceTimers.current[cartId];
        });
    }, 500);
  };

  const handleConfirmOrder = async () => {
    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return;
    }

    Object.values(debounceTimers.current).forEach(clearTimeout);
    debounceTimers.current = {};

    try {
      await dispatch(addOrderAsync()).unwrap();
      dispatch(clearCart());

      toast.success("Order confirmed successfully!");
      navigate("/order-success");
    } catch (error: any) {
      toast.error(error?.message || "Failed to process order");
    }
  };

  if (!isLoggedIn) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Please login to view your cart
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/login">Login</Link>
              </Button>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="pt-20 pb-12">
          <div className="container mx-auto px-4">
            <div className="flex flex-col items-center justify-center h-96 gap-4">
              <Loader2 className="w-8 h-8 animate-spin text-primary" />
              <p className="text-muted-foreground">Loading your cart...</p>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="pt-20 pb-12">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl md:text-3xl font-bold text-foreground mb-8">
            Shopping Cart
          </h1>

          {cartItems.length === 0 ? (
            <div className="text-center py-16">
              <ShoppingBag className="w-16 h-16 text-muted-foreground mx-auto mb-4" />
              <p className="text-lg text-muted-foreground mb-4">
                Your cart is empty
              </p>
              <Button asChild className="rounded-lg">
                <Link to="/products">Continue Shopping</Link>
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-2 space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.cart_id}
                    className="bg-card rounded-xl p-4 flex gap-4"
                  >
                    <div className="w-24 h-24 rounded-lg overflow-hidden bg-secondary flex-shrink-0">
                      <img
                        src={item.image_url}
                        alt={item.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">
                        {item.name}
                      </h3>
                      <p className="text-sm text-muted-foreground mt-1 flex align-center gap-1">
                        Size: {item.size} • Color:
                        <span
                          className="w-5 h-5 rounded-full inline-block"
                          style={{
                            backgroundColor: item.color,
                            border:
                              item.color === "#FFFFFF" ||
                              item.color === "#ffffff"
                                ? "1px solid #e5e7eb"
                                : "none",
                          }}
                        />
                      </p>
                      <p className="text-lg font-bold text-primary mt-2">
                        {item.price.toFixed(2)}
                      </p>
                    </div>

                    <div className="flex flex-col items-end justify-between">
                      <button
                        onClick={() => handleRemoveItem(item.cart_id)}
                        className="p-2 rounded-lg bg-secondary text-muted-foreground hover:text-destructive hover:bg-destructive/10 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>

                      <div className="flex items-center gap-2">
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_id,
                              item.variant_id,
                              item.quantity - 1
                            )
                          }
                          disabled={item.quantity <= 1}
                          className="p-1 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors disabled:opacity-50"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-8 text-center font-medium text-foreground">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() =>
                            handleUpdateQuantity(
                              item.cart_id,
                              item.variant_id,
                              item.quantity + 1
                            )
                          }
                          className="p-1 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="lg:col-span-1">
                <div className="bg-card rounded-xl p-6 sticky top-24">
                  <h2 className="text-lg font-bold text-foreground mb-4">
                    Order Summary
                  </h2>

                  <div className="space-y-3 mb-6">
                    <div className="flex justify-between text-muted-foreground">
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-muted-foreground">
                      <span>Shipping</span>
                      <span>Free</span>
                    </div>
                    <div className="border-t border-border pt-3">
                      <div className="flex justify-between font-bold text-foreground text-lg">
                        <span>Total</span>
                        <span>${totalAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>

                  <Button
                    onClick={handleConfirmOrder}
                    size="lg"
                    className="w-full rounded-xl"
                  >
                    Confirm Order
                  </Button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Cart;
