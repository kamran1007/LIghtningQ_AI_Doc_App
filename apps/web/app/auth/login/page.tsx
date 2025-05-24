import React from "react";
import LoginInForm from "./Loginform";
import Image from "next/image";

const SignInPage = () => {
  return (
    <div
      className="min-h-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/loginBackgroundImage.png')", // ensure your image is at public/images/bg-login.jpg
      }}
    >
      <div className="bg-white p-16 rounded-2xl shadow-2xl w-full max-w-2xl">
        <div className="text-center mb-10">
          <Image priority={false}
            src="/LoginCard.png"
            alt="Logo"
            width={300}
            height={100}
            className="mx-auto"
          />
        </div>
        <LoginInForm />
      </div>
    </div>
  );
};

export default SignInPage;
