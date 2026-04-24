import axios from "axios";

const publicApiNew = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

const SESSION_CODES = new Set([
  "PUBLIC_SESSION_INVALID",
  "PUBLIC_SESSION_NOT_FOUND",
  "PUBLIC_SESSION_EXPIRED",
]);

publicApiNew.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const code = error.response?.data?.code;

    if (status === 401 && SESSION_CODES.has(code)) {
      const path = window.location.pathname;

      if (path !== "/auth" && path !== "/auth/expired") {
        window.location.href = "/auth/expired";
      }
    }

    return Promise.reject(error);
  }
);

export default publicApiNew;