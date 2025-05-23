"use client";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { login } from "@/lib/auth";
import Link from "next/link";
import React from "react";
import { useActionState } from "react"; // not react-dom

const LoginInForm = () => {
  const [state, action] = useActionState(login, undefined);
  return (
    <form action={action} autoComplete="off" className="flex flex-col gap-4">
      {/* Hidden input to stop autofill guesses */}
      <input
        type="text"
        name="fakeUsername"
        autoComplete="username"
        style={{ display: "none" }}
        tabIndex={-1}
      />

      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}

        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            type="email"
            placeholder="Lightningq@example.com"
            autoComplete="new-email"
            required
          />
        </div>

        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            name="password"
            type="password"
            placeholder="********"
            autoComplete="new-password"
            required
          />
        </div>

        <SubmitButton>Sign In</SubmitButton>
      </div>
    </form>
  );
};

export default LoginInForm;
