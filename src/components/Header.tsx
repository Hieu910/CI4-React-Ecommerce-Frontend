import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { ChevronDown, User, ShoppingCart, Menu } from "lucide-react";
import { useAppSelector, useAppDispatch } from "@/hooks/useAppDispatch";
import { logout } from "@/store/authSlice";
import { clearCart, fetchCart } from "@/store/cartSlice";
import { toast } from "sonner";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { fetchCategory } from "@/store/categorySlice";
import { fetchUserProfile } from "@/store/authSlice";

const Header = () => {
  const dispatch = useAppDispatch();
  const { isLoggedIn, user } = useAppSelector((state) => state.auth);
  const { items: cartItems } = useAppSelector((state) => state.cart);
  const { categories, hasFetched } = useAppSelector((state) => state.category);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!hasFetched) {
        try {
          await dispatch(fetchCategory()).unwrap();
        } catch (error) {
          toast.error("Failed to load categories");
        }
      }
    };

    fetchData();
  }, [dispatch, hasFetched]);

  useEffect(() => {
    const fetchData = async () => {
      if (isLoggedIn) {
        try {
          await dispatch(fetchCart()).unwrap();
        } catch (error) {
          toast.error("Failed to load cart");
        }
        try {
          await dispatch(fetchUserProfile()).unwrap();
        } catch (error) {
          toast.error("Failed to load user profile");
        }
      }
    };

    fetchData();
  }, [isLoggedIn, dispatch]);

  const handleLogout = () => {
    dispatch(logout());
    dispatch(clearCart());
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card shadow-sm">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center gap-6">
            {/* Mobile Menu Button */}
            <button
              className="lg:hidden p-2 rounded-lg bg-secondary"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <Menu className="w-5 h-5 text-foreground" />
            </button>

            <Link to="/" className="text-xl font-bold text-foreground">
              STYLISH
            </Link>

            {/* Categories Desktop */}
            <div className="hidden lg:block">
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 px-4 py-2 rounded-lg bg-secondary text-foreground font-medium hover:bg-muted transition-colors">
                    Categories
                    <ChevronDown className="w-4 h-4" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-card">
                  {categories.map((category) => (
                    <DropdownMenuItem key={category.id} asChild>
                      <Link
                        to={`/products?category=${category.id}`}
                        className="cursor-pointer"
                      >
                        {category.name}
                      </Link>
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/products" className="cursor-pointer font-medium">
                      All Products
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {isLoggedIn ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors">
                    <User className="w-5 h-5 text-foreground" />
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48 bg-card">
                  <div className="px-3 py-2">
                    <p className="text-sm font-medium text-foreground truncate">
                      {user?.name}
                    </p>
                    <p className="text-xs text-muted-foreground truncate">
                      {user?.email}
                    </p>
                  </div>
                  {user?.role === 1 && (
                    <>
                      <DropdownMenuSeparator />
                      <DropdownMenuItem asChild>
                        <Link to="/admin" className="cursor-pointer">
                          Admin Page
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}

                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild>
                    <Link to="/account" className="cursor-pointer">
                      My Account
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/account?tab=orders" className="cursor-pointer">
                      Order History
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-destructive"
                  >
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Popover>
                <PopoverTrigger asChild>
                  <button className="p-2 rounded-lg bg-secondary hover:bg-muted transition-colors">
                    <User className="w-5 h-5 text-foreground" />
                  </button>
                </PopoverTrigger>
                <PopoverContent className="w-64 bg-card p-4">
                  <p className="text-sm text-muted-foreground mb-4">
                    Sign in to access your account and cart.
                  </p>
                  <div className="flex flex-col gap-2">
                    <Button asChild className="rounded-lg">
                      <Link to="/login">Login</Link>
                    </Button>
                    <Button asChild variant="secondary" className="rounded-lg">
                      <Link to="/register">Register</Link>
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            )}

            {isLoggedIn && (
              <Link
                to="/cart"
                className="relative p-2 rounded-lg bg-secondary hover:bg-muted transition-colors"
              >
                <ShoppingCart className="w-5 h-5 text-foreground" />
                {cartItems.length > 0 && (
                  <Badge
                    variant="default"
                    className="absolute -top-1 -right-1 h-4 min-w-4 px-1 flex items-center justify-center text-xs font-medium rounded-full"
                  ></Badge>
                )}
              </Link>
            )}
          </div>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-4 animate-fade-in">
            <div className="flex flex-col gap-2">
              <p className="text-sm font-medium text-muted-foreground px-2">
                Categories
              </p>
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products?category=${category.code}`}
                  className="px-4 py-2 rounded-lg bg-secondary text-foreground hover:bg-muted transition-colors"
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}
              <Link
                to="/products"
                className="px-4 py-2 rounded-lg bg-primary text-primary-foreground font-medium"
                onClick={() => setIsMobileMenuOpen(false)}
              >
                All Products
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
