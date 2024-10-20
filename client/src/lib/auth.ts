import { PrismaAdapter } from '@next-auth/prisma-adapter';
import { compare } from "bcrypt";
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { db } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "Credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        emailOrUsername: { label: "Email or Username", type: "text", placeholder: "jsmith" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        if(!credentials?.emailOrUsername || !credentials?.password) return null;

        const existingUser = await db.user.findFirst({
          where: {
            OR: [
              { username: credentials?.emailOrUsername },
              { email: credentials?.emailOrUsername },
            ],
          },
        });
        if(!existingUser) return null;

        const passwordMatch = await compare(credentials?.password, existingUser.password)
        if(!passwordMatch) return null;

        return {
          id: existingUser.id,
          email: existingUser.email,
          username: existingUser.username
        }
      }
    })
  ],
  callbacks: {
    async jwt({token, user }){
      if(user){
        return { ...token, username: user.username}
      }
      return token
    },
    async session({ session, token }){
      return { ...session, user: { ...session.user, username: token.username }}
    }
  },
  session: {
    strategy: 'jwt'
  },
  adapter: PrismaAdapter(db),
  pages: {
    'signIn': '/sign-in'
  },
  secret: process.env.NEXTAUTH_SECRET
}