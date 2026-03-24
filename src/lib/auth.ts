import NextAuth from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const { handlers, auth, signIn, signOut } = NextAuth({
  pages: { signIn: "/" },
  providers: [
    Credentials({
      name: "credentials",
      credentials: { email: {}, password: {} },
      async authorize(credentials) {
        const API_URL = process.env.API_URL;
        if (!API_URL) return null;

        const email = String(credentials?.email ?? "").trim();
        const password = String(credentials?.password ?? "").trim();

        if (!email || !password) return null;

        try {
          const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ email, password }),
          });

          if (!res.ok) return null;

          const data = await res.json();

          if (!data?.admin?.id || !data?.accessToken || !data?.refreshToken) {
            return null;
          }

          return {
            id: data.admin.id,
            email: data.admin.email,
            name: data.admin.name,
            role: data.admin.role,
            profile: data.admin,
            accessToken: data.accessToken,
            refreshToken: data.refreshToken,
            accessTokenExpires: Date.now() + 60 * 60 * 1000,
          };
        } catch {
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
        const u = user as {
          id: string;
          email: string;
          name: string;
          role?: string;
          profile?: { id: string; email: string; name: string; role?: string };
          accessToken: string;
          refreshToken: string;
          accessTokenExpires: number;
        };

        return {
          ...token,
          user: {
            id: u.profile?.id ?? u.id,
            email: u.profile?.email ?? u.email,
            name: u.profile?.name ?? u.name,
            role: u.profile?.role ?? u.role ?? "",
          },
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: u.accessTokenExpires,
          error: undefined,
        };
      }

      if (
        token.accessTokenExpires &&
        Date.now() < Number(token.accessTokenExpires)
      ) {
        return token;
      }

      if (!API_URL || !token.refreshToken) {
        return { ...token, error: "RefreshFailed:missing_config_or_token" };
      }

      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!res.ok) {
          return { ...token, error: `RefreshFailed:${res.status}` };
        }

        const refreshed = (await res.json()) as {
          accessToken: string;
          refreshToken: string;
        };

        return {
          ...token,
          accessToken: refreshed.accessToken,
          refreshToken: refreshed.refreshToken,
          accessTokenExpires: Date.now() + 60 * 60 * 1000,
          error: undefined,
        };
      } catch {
        return { ...token, error: "RefreshFailed:network" };
      }
    },

    async session({ session, token }) {
      session.accessToken = token.accessToken; 
      session.refreshToken = token.refreshToken; 
      session.error = token.error; 
      session.user.id = token.user.id; 
      session.user.email = token.user.email; 
      session.user.name = token.user.name; 
      session.user.role = token.user.role; 
      return session;
    },
  }
});