"use server";

import { hash } from "bcryptjs";
import * as z from "zod";

import { getPasswordResetTokenByToken } from "@/data/password-reset-token";
import { getUserByEmail } from "@/data/user";
import { db } from "@/lib/db";
import { ResetPasswordSchema } from "@/schemas";

export const resetPassword = async (values: z.infer<typeof ResetPasswordSchema>, token: string) => {
  const validatedFields = ResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid token" };

  const { password } = validatedFields.data;

  const existingToken = await getPasswordResetTokenByToken(token);

  if (!existingToken) return { error: "Invalid Token" };

  const hasExpired = new Date(existingToken.expires) < new Date();

  if (hasExpired) return { error: "Invalid Token" };

  const existingUser = await getUserByEmail(existingToken.email);

  if (!existingUser) return { error: "Invalid Token" };

  const hashedPassword = await hash(password, 10);

  await db.user.update({
    where: { id: existingUser.id },
    data: { password: hashedPassword },
  });

  await db.passwordResetToken.delete({ where: { id: existingToken.id } });

  return { success: "Updated" };
};
