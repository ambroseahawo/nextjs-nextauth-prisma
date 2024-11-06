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
