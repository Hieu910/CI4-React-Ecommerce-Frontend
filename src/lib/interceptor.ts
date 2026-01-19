import axios from "axios";
import { toast } from "sonner";
import { store } from "@/store";
import { login, logout } from "@/store/authSlice";
import { sleep, shouldRetry } from "./utils";

const API_URL = import.meta.env.VITE_API_URL;
const MAX_RETRIES = 3;
const RETRY_DELAY = 1000;

const apiClient = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  withCredentials: true,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

apiClient.interceptors.request.use((config) => {
  const state = store.getState();
  const token = state.auth.accessToken || localStorage.getItem("auth_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  if (!config.headers["X-Retry-Count"]) {
    config.headers["X-Retry-Count"] = "0";
  }

  return config;
});

apiClient.interceptors.response.use(
  (response) => {
    const { code, data } = response.data;

    if (code === 1) {
      return Promise.reject(new Error(data?.message || "Error occurred"));
    }

    return data;
  },
  async (error) => {
    const originalRequest = error.config;
    const retryCount = parseInt(originalRequest.headers["X-Retry-Count"]);

    if (error.response?.status === 401 && !originalRequest._retry) {
      const skipUrls = ["/login", "/register", "/refresh"];
      if (skipUrls.some((url) => originalRequest.url?.includes(url))) {
        return Promise.reject(error);
      }

      originalRequest._retry = true;

      try {
        const newToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newToken}`;
        return apiClient(originalRequest);
      } catch (refreshError) {
        store.dispatch(logout());
        localStorage.removeItem("auth_token");
        localStorage.removeItem("user");
        window.location.href = "/login";
        return Promise.reject(refreshError);
      }
    }

    if (error.response?.status === 403) {
      window.location.href = "/forbidden";
    }

    if (shouldRetry(error) && retryCount < MAX_RETRIES) {
      originalRequest.headers["X-Retry-Count"] = `${retryCount + 1}`;
      const delay = RETRY_DELAY * Math.pow(2, retryCount);
      await sleep(delay);
      return apiClient(originalRequest);
    }

    if (!error.response || error.response.status >= 500) {
      toast.error(error.message || "Server error");
    }

    const errorMessage =
      error.response?.data?.data?.message || error.message || "Error occurred";
    return Promise.reject(new Error(errorMessage));
  },
);

async function refreshAccessToken(): Promise<string> {
  if (isRefreshing && refreshPromise) {
    return refreshPromise;
  }

  isRefreshing = true;
  refreshPromise = performRefresh();

  try {
    const token = await refreshPromise;
    return token;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
}

async function performRefresh(): Promise<string> {
  const response = await axios.post(
    "http://localhost:8080/api/refresh",
    {},
    { withCredentials: true },
  );

  const { code, data } = response.data;

  if (code !== 0 || !data?.access_token) {
    throw new Error("Refresh token failed");
  }

  const newToken = data.access_token;

  const currentUser = store.getState().auth.user;
  store.dispatch(
    login({
      user: currentUser || data.user,
      access_token: newToken,
    }),
  );
  localStorage.setItem("auth_token", newToken);

  return newToken;
}

export default apiClient;
