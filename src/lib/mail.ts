import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export const sendVerificationEmail = async (email: string, token: string) => {
  const confirmationLink = `${process.env.FRONTEND_HOST}/auth/new-verification?token=${token}`;

  await resend.emails.send({
    from: "NextAuth <onboarding@resend.dev>",
    to: email,
    subject: "Confirm your account",
    html: `<p>Click <a href="${confirmationLink}">here</a> to confirm your account</p>`,
  });
};

export const sendPasswordResetEmail = async (email: string, token: string) => {
  const resetLink = `${process.env.FRONTEND_HOST}/auth/reset-password?token=${token}`;

  await resend.emails.send({
    from: "NextAuth <onboarding@resend.dev>",
    to: email,
    subject: "Reset your password",
    html: `<p>Click <a href="${resetLink}">here</a> to confirm your account</p>`,
  });
};

export const sendTwoFactorTokenEmail = async (email: string, token: string) => {
  await resend.emails.send({
    from: "NextAuth <onboarding@resend.dev>",
    to: email,
    subject: "2FA Code",
    html: `<p>Your 2FA Code: ${token}</p>`,
  });
};
