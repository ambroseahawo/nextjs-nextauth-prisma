"use client";

import { useCallback, useEffect, useRef, useState } from "react";

import { useSearchParams } from "next/navigation";
import { BeatLoader } from "react-spinners";

import { CardWrapper } from "@/components/auth/card-wrapper";

import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";

import { newVerification } from "@/actions/new-verification";

export const NewVerificationForm = () => {
  const [error, setError] = useState<string | undefined>("");
  const [success, setSuccess] = useState<string | undefined>("");

  const searchParams = useSearchParams();

  const token = searchParams.get("token");

  const onSubmit = useCallback(() => {
    if (!token) {
      setError("Invalid token");
      return;
    }

    newVerification(token)
      .then((data) => {
        setSuccess(data.success);
        setError(data.error);
      })
      .catch(() => {
        setError("Verification failed");
      });
  }, [token]);

  const executedRef = useRef(false);

  useEffect(() => {
    if (!executedRef.current) {
      onSubmit();
      executedRef.current = true;
    }
  }, [onSubmit]);

  return (
    <CardWrapper
      headerLabel="Confirming your verification"
      backButtonLabel="Back to login"
      backButtonHref="/auth/login"
    >
      <div className="flex items-center w-full justify-center">
        {!success && !error && <BeatLoader />}
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
    </CardWrapper>
  );
};
