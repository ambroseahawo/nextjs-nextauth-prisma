import { userRole } from "@prisma/client";
import { type DefaultSession } from "next-auth";

export type ExtendedUser = DefaultSession["user"] & {
  // customField: string;
  role: userRole;
};

declare module "next-auth" {
  interface Session {
    user: ExtendedUser;
  }
}
