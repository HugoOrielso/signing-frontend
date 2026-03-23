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
          profile: { id: string; email: string; name: string; role: string };
          accessToken: string;
          refreshToken: string;
          accessTokenExpires: number;
        };

        return {
          ...token,
          user: u.profile,
          accessToken: u.accessToken,
          refreshToken: u.refreshToken,
          accessTokenExpires: u.accessTokenExpires,
          error: undefined,
        };
      }

      if (Date.now() < (token.accessTokenExpires as number)) {
        return token;
      }

      try {
        const res = await fetch(`${API_URL}/auth/refresh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ refreshToken: token.refreshToken }),
        });

        if (!res.ok) {
          const errorData = await res.json().catch(() => ({}));
          const message = (errorData as { error?: string }).error ?? "RefreshFailed";
          return { ...token, error: message };
        }

        const refreshed = await res.json() as {
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
  },
});