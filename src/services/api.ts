import apiClient from "@/lib/interceptor";
import {
  ProductListParams,
  ProductListResponse,
  AuthResponse,
  CartResponse,
} from "@/data/mockData";

export const getProducts = async (
  params?: ProductListParams,
): Promise<ProductListResponse> => {
  return (await apiClient.get("/products", { params })) as ProductListResponse;
};

export const getProductById = async <T = any>(id: number): Promise<T> => {
  return await apiClient.get(`/products/${id}`);
};

export const getProductsByTag = async <T = any>(
  tag: "is_best_sell" | "is_new" | "is_featured",
): Promise<T> => {
  return await apiClient.get("/products/tag", { params: { tag } });
};

export const getNewProducts = async <T = any>(): Promise<T> => {
  return await getProductsByTag<T>("is_new");
};

export const getBestSell = async <T = any>(): Promise<T> => {
  return await getProductsByTag<T>("is_best_sell");
};

export const getFeaturedProducts = async <T = any>(): Promise<T> => {
  return await getProductsByTag<T>("is_featured");
};

export const getProductVariants = async <T = any>(
  productId: number,
): Promise<T> => {
  return (await apiClient.get(`/admin/products/variants/${productId}`)) as T;
};

export const getRelatedProducts = async <T = any>(
  productId: number,
  limit: number = 4,
): Promise<T> => {
  return (await apiClient.get(`/products/${productId}/related`, {
    params: { limit },
  })) as T;
};

export const createProduct = async <T = any>(
  productData: FormData,
): Promise<T> => {
  return (await apiClient.post("/admin/products/create", productData)) as T;
};

export const updateProduct = async <T = any>(
  id: number,
  productData: FormData,
): Promise<T> => {
  return (await apiClient.post(`/admin/products/update/${id}`, productData, {
    headers: { "Content-Type": "multipart/form-data" },
  })) as T;
};

export const deleteProduct = async <T = any>(id: number): Promise<T> => {
  return (await apiClient.post(`/admin/products/delete/${id}`)) as T;
};

export const getCategories = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/categories")) as T;
};

export const getUserProfile = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/user/profile")) as T;
};

export const updateUserProfile = async <T = any>(name: string): Promise<T> => {
  return (await apiClient.post("/user/profile/update", { name })) as T;
};

export const changeUserPassword = async <T = any>(
  old_password: string,
  new_password: string,
): Promise<T> => {
  return (await apiClient.post("/user/change-password", {
    old_password,
    new_password,
  })) as T;
};

export const loginUser = async (
  email: string,
  password: string,
): Promise<AuthResponse> => {
  return (await apiClient.post("/login", { email, password })) as AuthResponse;
};

export const registerUser = async (
  name: string,
  email: string,
  password: string,
  confirm_password: string,
): Promise<AuthResponse> => {
  return (await apiClient.post("/register", {
    name,
    email,
    password,
    confirm_password,
  })) as AuthResponse;
};

export const logoutUser = async <T = any>(): Promise<T> => {
  return (await apiClient.post("/logout")) as T;
};

export const getCart = async (): Promise<CartResponse> => {
  return (await apiClient.get("/cart")) as CartResponse;
};

export const saveCartItem = async (
  variant_id: number,
  quantity: number,
): Promise<any> => {
  return await apiClient.post("/cart/save", {
    variant_id,
    quantity,
  });
};

export const deleteCartItem = async (cartId: number): Promise<any> => {
  return await apiClient.delete(`/cart/delete/${cartId}`);
};

export const getUserOrders = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/user/orders")) as T;
};
export const getUserOrderById = async <T = any>(id: number): Promise<T> => {
  return (await apiClient.get(`/user/orders/${id}`)) as T;
};

export const getAdminOrders = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/admin/orders")) as T;
};

export const getAdminOrderById = async <T = any>(id: number): Promise<T> => {
  return (await apiClient.get(`/admin/orders/${id}`)) as T;
};

export const createOrder = async <T = any>(): Promise<T> => {
  return (await apiClient.post("/user/checkout")) as T;
};

export const updateOrderStatus = async <T = any>(
  id: number,
  status: number,
): Promise<T> => {
  return (await apiClient.post(`/admin/orders/update-status/${id}`, {
    status,
  })) as T;
};

export const getAdminUsers = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/admin/users")) as T;
};

export const getUsers = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/users")) as T;
};

export const getUserById = async <T = any>(id: number): Promise<T> => {
  return (await apiClient.get(`/users/${id}`)) as T;
};

export const updateUserRole = async <T = any>(
  id: number,
  role: number,
): Promise<T> => {
  return (await apiClient.post(`/admin/users/update/${id}`, { role })) as T;
};

export const getDashboardStats = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/admin/dashboard-stats")) as T;
};

export const getRevenueChart = async <T = any>(): Promise<T> => {
  return (await apiClient.get("/dashboard/revenue")) as T;
};

export default apiClient;
