"use server";

import * as z from "zod";

import { generatePasswordResetToken } from "@/data/tokens";
import { getUserByEmail } from "@/data/user";
import { sendPasswordResetEmail } from "@/lib/mail";
import { RequestResetPasswordSchema } from "@/schemas";

export const RequestRestPassword = async (values: z.infer<typeof RequestResetPasswordSchema>) => {
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
