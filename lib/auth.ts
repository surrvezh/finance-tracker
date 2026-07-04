import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { initDb, upsertUser } from "./db";
import { seedUserDefaults } from "./seed";

export const { handlers, auth, signIn, signOut } = NextAuth({
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID!,
      clientSecret: process.env.AUTH_GOOGLE_SECRET!,
    }),
  ],
  callbacks: {
    async signIn({ user, account }) {
      if (account?.provider === "google" && user.id && user.email) {
        await initDb();
        await upsertUser(user.id, user.email, user.name ?? null, user.image ?? null);
        await seedUserDefaults(user.id);
      }
      return true;
    },
    async session({ session, token }) {
      if (session.user && token.sub) {
        session.user.id = token.sub;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) token.sub = user.id;
      return token;
    },
  },
  pages: {
    signIn: "/login",
  },
});
