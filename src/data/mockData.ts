export interface Product {
  id: number;
  name: string;
  min_price: number;
  max_price: number;
  image_url: string;
  category_id: number;
  description: string;
  total_stock: number;
  isNew: boolean;
  isBestSell: boolean;
  isFeatured: boolean;
}

export interface ProductDetail extends Product {
  variants: {
    [key: string]: Variant[];
  };
}

export interface ProductFormData {
  name: string;
  category: string;
  description: string;
  tags: string[];
  image: string;
}

export interface User {
  id: number;
  email: string;
  password: string;
  name: string;
}

export interface Category {
  id: number;
  name: string;
  code: string;
}

export interface Variant {
  id: number;
  size: string;
  color: string;
  stock: number;
  price: number;
}

export interface HeroSlide {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

export interface CustomerReview {
  id: number;
  name: string;
  avatar: string;
  comment: string;
  date: string;
}

export const availableSizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"];

export const availableColors = [
  { name: "Black", hex: "#000000" },
  { name: "White", hex: "#ffffff" },
  { name: "Red", hex: "#dc2626" },
  { name: "Blue", hex: "#2563eb" },
  { name: "Green", hex: "#16a34a" },
  { name: "Yellow", hex: "#facc15" },
  { name: "Pink", hex: "#db2777" },
  { name: "Navy", hex: "#1e40af" },
];

export interface OrderItem {
  id: number;
  product_id: number;
  name: string;
  price: number;
  image_url: string;
  quantity: number;
  variant_info: string;
}

export interface Order {
  id: number;
  items: OrderItem[];
  total_amount: number;
  created_at: string;
  customer_name: string;
  status_label: "pending" | "confirmed" | "shipped" | "cancelled";
  status_code: number;
}

export interface OrderDetail extends Order {
  items: OrderItem[];
}

export interface User {
  id: number;
  email: string;
  name: string;
  role: number;
}

export interface AuthResponse {
  user: User;
  access_token: string;
}

export interface ProductListResponse {
  items: any[];
  total: number;
}

export interface ProductListParams {
  page?: number;
  limit?: number;
  categories?: string[];
  stock_status?: string;
  sizes?: string[];
  min_price?: number;
  max_price?: number;
  search?: string;
  sort_by?: string;
  sort_order?: string;
}

export interface CartItemResponse {
  cart_id: number;
  quantity: number;
  name: string;
  image_url: string;
  variant_id: number;
  size: string;
  color: string;
  price: number;
  product_id?: number;
}

export interface CartResponse {
  items: CartItemResponse[];
  total_amount: number;
}

export const heroSlides: HeroSlide[] = [
  {
    id: 1,
    title: "New Collection 2025",
    subtitle: "Discover the latest trends in fashion",
    image:
      "https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=1200",
  },
  {
    id: 2,
    title: "Summer Sale",
    subtitle: "Up to 50% off on selected items",
    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?w=1200",
  },
  {
    id: 3,
    title: "Premium Quality",
    subtitle: "Handcrafted with love and care",
    image:
      "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=1200",
  },
];

export const customerReviews: CustomerReview[] = [
  {
    id: 1,
    name: "Sarah Doe",
    avatar:
      "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100",
    comment:
      "Amazing quality and fast delivery! I'm very happy with my purchase.",
    date: "Dec 15, 2025",
  },
  {
    id: 2,
    name: "Michael Doe",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100",
    comment:
      "Great customer service and the products are exactly as described.",
    date: "Dec 10, 2025",
  },
  {
    id: 3,
    name: "Emily Doe",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100",
    comment: "Love the designs! Will definitely order again.",
    date: "Dec 5, 2025",
  },
  {
    id: 4,
    name: "John Warhammer",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=100",
    comment: "The best online shopping experience I've had.",
    date: "Nov 28, 2025",
  },
];

export const bannerData = {
  title: "Free Shipping",
  subtitle: "On orders over $100",
  image: "https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?w=1200",
};
