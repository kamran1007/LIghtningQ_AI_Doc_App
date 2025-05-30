"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import SubmitButton from "@/components/ui/submitButton";
import { login } from "@/lib/auth";
import { FormState } from "@/lib/types";
import { startLoading, stopLoading } from "@/store/globalLoaderSlice";
import { useAppDispatch } from "@/store/hooks";
import React  from "react";
import { useActionState } from "react"; // not react-dom


const LoginInForm = () => {
  const dispatch = useAppDispatch();

  const [state, action, isPending] = useActionState(async (prevState: FormState, formData: FormData) => {
    try {
      dispatch(startLoading());
      const result = await login(prevState, formData);
      // You can redirect or do something here if login is successful
      return result;
    } finally {
      dispatch(stopLoading());
    }
  }, undefined);

  return (
    <form
      action={action}
      autoComplete="off"
      className="flex flex-col items-center justify-center gap-6"
    >
      {/* Hidden input to stop autofill guesses */}
      {/* <input
        type="text"
        name="fakeUsername"
        autoComplete="username"
        style={{ display: "none" }}
        tabIndex={-1}
      /> */}

      <div className="flex flex-col gap-4 w-82">
        {state?.message && (
          <p className="text-sm text-red-500 text-center">{state.message}</p>
        )}

        <div className="flex flex-col gap-2 w-full max-w-md">
          <Label htmlFor="email">Email</Label>

          <div className="group relative w-full rounded-md">
            {/* Gradient border wrapper */}
            <div className="absolute -inset-[2px] rounded-md bg-transparent transition-all duration-300 group-focus-within:bg-[radial-gradient(circle,_rgba(0,36,34,1)_0%,_rgba(25,138,224,1)_30%,_rgba(34,224,212,1)_97%)]"></div>

            {/* Input */}
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="User@Lightningq.com"
              autoComplete="new-email"
              required
              className="relative z-10 w-full h-12 px-4 py-2 bg-white rounded-md border-none ring-0 focus:ring-0 focus:border-none outline-none"
            />
          </div>
        </div>

        <div className="flex flex-col gap-2">
          <Label htmlFor="password">Password</Label>
          <div className="group relative w-full rounded-md">
            {/* Gradient border wrapper */}
            <div className="absolute -inset-[2px] rounded-md bg-transparent transition-all duration-300 group-focus-within:bg-[radial-gradient(circle,_rgba(0,36,34,1)_0%,_rgba(25,138,224,1)_30%,_rgba(34,224,212,1)_97%)]"></div>
            <Input
              id="password"
              name="password"
              type="password"
              placeholder="********"
              autoComplete="new-password"
              required
              className="relative z-10 w-full h-12 px-4 py-2 bg-white rounded-md border-none ring-0 focus:ring-0 focus:border-none outline-none"
            />
          </div>
        </div>
        <div className="mt-4 flex justify-self-end-safe items-center ">
          <Button className="submit-button shadow-2xl px-6 py-2 cursor-pointer  rounded-4xl">
            Login
          </Button>
        </div>
      </div>
    </form>
  );
};

export default LoginInForm;
