"use client";
import React, { PropsWithChildren } from "react";
import { Button } from "./button";
import { useFormStatus } from "react-dom";

const SubmitButton = ({ children }: PropsWithChildren) => {
  const { pending } = useFormStatus();

  return (
    <Button
      className="submit-button"
      type="submit"
      aria-disabled={pending}
    >
      {pending ? "Submitting..." : children}
    </Button>
  );
};

export default SubmitButton;
