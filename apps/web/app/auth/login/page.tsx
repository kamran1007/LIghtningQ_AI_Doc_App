// app/auth/login/page.tsx
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import LoginInForm from "./Loginform";
import Image from "next/image";
import RedirectWithLoader from "@/components/RedirectWithLoader";

export default async function SignInPage() {
  const session = await getSession();
  console.log("Session in login page:", session);
  // if (session?.user) {
  //   return <RedirectWithLoader to="/dashboard" />;
  // }


  if (session?.user && session?.selectedHospital) {
    redirect("/dashboard");
  }

  return (
    <div
      className="fixed top-0 left-0 h-screen w-screen bg-cover bg-center flex items-center justify-center"
      style={{
        backgroundImage: "url('/loginBackgroundImage.png')",
      }}
    >
      <div className="bg-white p-16 rounded-2xl shadow-4xl w-full max-w-2xl">
        <div className="text-center mb-10">
          <Image
            priority={false}
            src="/LoginCard.png"
            alt="Logo"
            width={320}
            height={100}
            className="mx-auto"
          />
        </div>
        <LoginInForm />
      </div>
    </div>
  );
}
