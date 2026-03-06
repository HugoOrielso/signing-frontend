import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/login" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const API_URL = process.env.API_URL;
        console.log("🌐 API_URL:", API_URL);
        console.log("📧 email:", credentials?.email);

        if (!API_URL) return null;

        const email = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "").trim();
        if (!email || !password) return null;

        try {
          const res = await fetch(`${API_URL}/api/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          console.log("📡 Response status:", res.status);
          const data = await res.json();
          console.log("📦 Response data:", data);

          if (!res.ok) return null;
          if (!data?.admin?.id || !data?.accessToken || !data?.refreshToken) return null;

          return {
            id: data.admin.id,
            email: data.admin.email,
            name: data.admin.name,
            profile: data.admin,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: Date.now() + 60 * 60 * 1000,
          };
        } catch (err) {
          console.error("❌ Error:", err);
          return null;
        }
      },
    }),
  ],
  session: { strategy: "jwt" },
  callbacks: {
    async jwt({ token, user }) {
      const API_URL = process.env.API_URL;

      if (user) {
        token.accessToken = (user as { accessToken: string }).accessToken;
        token.refreshToken = (user as { refreshToken: string }).refreshToken;
        token.user = (user as { profile: { id: string; email: string; name: string } }).profile;
        return token;
      }

      if (!token.error) return token;
      if (!token.error.startsWith("RefreshNeeded")) return token;

      try {
        const res = await fetch(`${API_URL}/api/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!res.ok) return { ...token, error: `RefreshFailed:${res.status}` };

        const refreshed = await res.json() as {
          accessToken: string;
          refreshToken: string;
        };

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshFailed:network" };
      }
    },
    async session({ session, token }) {
      session.accessToken = token.accessToken;
      session.error = token.error;
      session.user.id = token.user.id;
      session.user.email = token.user.email;
      session.user.name = token.user.name;
      return session;
    },
  },
});