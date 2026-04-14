import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { forceLogout } from "./logout";
type RetryableRequest = InternalAxiosRequestConfig & {
  _retry?: boolean;
};

const api = axios.create({
  baseURL: "/api",
  withCredentials: true,
});

let isRefreshing = false;

let failedQueue: {
  resolve: () => void;
  reject: (error: unknown) => void;
}[] = [];

const processQueue = (error: unknown = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else {
      promise.resolve();
    }
  });

  failedQueue = [];
};

const AUTH_API_URLS = ["/auth/login", "/auth/refresh", "/auth/logout"];

const shouldSkipRefresh = (url: string) => {
  return AUTH_API_URLS.some((authUrl) => url.includes(authUrl));
};

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryableRequest | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401) {
      return Promise.reject(error);
    }

    const requestUrl = originalRequest.url ?? "";

    if (shouldSkipRefresh(requestUrl)) {
      return Promise.reject(error);
    }

    if (originalRequest._retry) {
      await forceLogout();
      return Promise.reject(error);
    }

    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        failedQueue.push({
          resolve: () => resolve(api(originalRequest)),
          reject,
        });
      });
    }

    originalRequest._retry = true;
    isRefreshing = true;

    try {
      await api.post("/auth/refresh");
      processQueue();
      return api(originalRequest);
    } catch (refreshError) {
      processQueue(refreshError);
      await forceLogout();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
    }
  }
);

export default api;