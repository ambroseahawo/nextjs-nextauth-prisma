"use client";

import { CardWrapper } from "@/components/auth/card-wrapper";

import { FormSuccess } from "@/components/form-success";

// interface VerificationSentProps {
//   message: string;
// }

export const VerificationSentForm = () => {
  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        <FormSuccess message="Confirmation email sent" />
      </div>
    </CardWrapper>
  );
};
