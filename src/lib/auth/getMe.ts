import api from "@/lib/axiosClient";

export type UserSession = {
  id: string;
  email: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN"; // ajusta según tus roles
  name?: string;
};

export async function getMe(): Promise<UserSession | null> {
  try {
    const { data } = await api.get("/auth/me");
    return data.user ?? data;
  } catch {
    return null;
  }
}