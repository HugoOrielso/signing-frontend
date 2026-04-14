import axios from "axios";

export const forceLogout = async () => {
  try {
    await axios.post(
      "/api/auth/logout",
      {},
      {
        withCredentials: true,
      }
    );
  } catch {
    // ignorar error
  } finally {
    if (typeof window !== "undefined") {
      window.location.href = "/";
    }
  }
};