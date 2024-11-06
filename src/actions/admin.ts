"use server";

import { userRole } from "@prisma/client";

import { currentRole } from "@/lib/auth";

export const admin = async () => {
  const role = await currentRole();

  if (role !== userRole.ADMIN) return { error: "Forbidden Server Action" };

  return { success: "Allowed Server Action" };
};
