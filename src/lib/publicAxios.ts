import axios from "axios";

const publicApiNew = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
});

publicApiNew.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    console.log(error)

    if ((status === 401 || status === 403) && typeof window !== "undefined") {
      const path = window.location.pathname;

      if (path !== "/auth") {
        window.location.href = "/auth/expired";
      }
    }

    return Promise.reject(error);
  }
);

export default publicApiNew;