import { PrismaAdapter } from "@auth/prisma-adapter";
import { userRole } from "@prisma/client";
import NextAuth from "next-auth";

import authConfig from "@/auth.config";
import { getUserById } from "@/data/user";
import { db } from "@/lib/db";
import { generateVerificationToken } from "@/lib/tokens";
import { getAccountByUserId } from "./data/account";
import { getTwoFactorConfirmationByUserId } from "./data/two-factor-confirmation";
import { sendVerificationEmail } from "./lib/mail";

// declare module "next-auth" {
//   interface Session {
//     user: {
//       role: userRole;
//     } & DefaultSession["user"];
//   }
// }

export const {
  auth,
  signIn,
  signOut,
  handlers: { GET, POST },
} = NextAuth({
  pages: {
    signIn: "/auth/login",
    error: "/auth/error",
  },
  events: {
    async linkAccount({ user }) {
      await db.user.update({
        where: { id: user.id },
        data: { emailVerified: new Date() },
      });
    },
  },
  callbacks: {
    async signIn({ user, account }) {
      // allow OAuth
      if (account?.provider !== "credentials") return true;

      const existingUser = await getUserById(user.id as string);

      // prevent credential sign without email verification
      // TODO - redirect to /auth/verify
      if (!existingUser?.emailVerified) {
        const verificationToken = await generateVerificationToken(existingUser?.email as string);
        await sendVerificationEmail(verificationToken.email, verificationToken.token);

        return "/auth/verification-sent";
      }

      if (existingUser.isTwoFactorEnabled) {
        const twoFactorConfirmation = await getTwoFactorConfirmationByUserId(existingUser.id);

        if (!twoFactorConfirmation) return false;

        await db.twoFactorConfirmation.delete({ where: { id: twoFactorConfirmation.id } });
      }

      return true;
    },
    async session({ token, session }) {
      // session.user.customField = "value";
      if (token.sub && session.user) {
        session.user.id = token.sub;
      }

      if (token.role && session.user) {
        session.user.role = token.role as userRole;
      }

      if (token.isTwoFactorEnabled && session.user) {
        session.user.isTwoFactorEnabled = token.isTwoFactorEnabled as boolean;
      }

      if (session.user) {
        session.user.name = token.name;
        session.user.email = token.email as string;
        session.user.isOAuth = token.isOAuth as boolean;
      }

      console.log({ session });

      return session;
    },
    async jwt({ token }) {
      if (!token.sub) return token;

      const existingUser = await getUserById(token.sub);
      if (!existingUser) return token;

      const existingAccount = await getAccountByUserId(existingUser.id);

      token.isOAuth = !!existingAccount;
      token.name = existingUser.name;
      token.email = existingUser.email;
      token.role = existingUser.role;
      token.isTwoFactorEnabled = existingUser.isTwoFactorEnabled;

      console.log({ token });

      return token;
    },
  },
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  ...authConfig,
});
