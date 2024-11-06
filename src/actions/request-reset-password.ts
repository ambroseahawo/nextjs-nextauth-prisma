"use server";

import * as z from "zod";

import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { generatePasswordResetToken } from "@/lib/tokens";
import { RequestResetPasswordSchema } from "@/schemas";

export const requestResetPassword = async (values: z.infer<typeof RequestResetPasswordSchema>) => {
  const validatedFields = RequestResetPasswordSchema.safeParse(values);

  if (!validatedFields.success) return { error: "Invalid fields" };

  const { email } = validatedFields.data;

  const existingUser = await getUserByEmail(email);

  if (existingUser) {
    const passwordResetToken = await generatePasswordResetToken(email);
    await sendPasswordResetEmail(passwordResetToken.email, passwordResetToken.token);
  }

  return { success: "Reset email sent" };
};
