import { compare } from "bcryptjs";
import type { NextAuthConfig } from "next-auth";
import Credentials from "next-auth/providers/credentials";

import { getUserByEmail } from "@/data/user";
import { LoginSchema } from "./schemas";

export default {
  providers: [
    Credentials({
      async authorize(credentials) {
        const validatedFields = LoginSchema.safeParse(credentials);

        if (validatedFields.success) {
          const { email, password } = validatedFields.data;

          const existingUser = await getUserByEmail(email);
          if (!existingUser || !existingUser.password) return null;

          const passwordMatch = await compare(password, existingUser.password);

          if (passwordMatch) return existingUser;
        }
        return null;
      },
    }),
  ],
} satisfies NextAuthConfig;
