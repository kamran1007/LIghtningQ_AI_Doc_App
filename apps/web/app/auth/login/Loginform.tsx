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
    <form action={action}>
      <div className="flex flex-col gap-2 w-64">
        {state?.message && (
          <p className="text-sm text-red-500">{state.message}</p>
        )}
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            id="email"
            name="email"
            placeholder="m@example.com"
            type="email"
          />
        </div>
        {state?.error?.email && (
          <p className="text-sm text-red-500">{state.error.email}</p>
        )}

        <div>
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" name="password" />
        </div>
        {state?.error?.password && (
          <p className="text-sm text-red-500">{state.error.password}</p>
        )}
        

        <SubmitButton>Sign In</SubmitButton>
        
      </div>
    </form>
  );
};

export default LoginInForm;