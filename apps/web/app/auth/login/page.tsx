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
      className="fixed inset-0 flex items-center justify-center bg-no-repeat bg-center bg-cover"
      style={{
        backgroundImage: "url('/loginBackgroundImage.png')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-white p-8 rounded-2xl shadow-4xl w-full max-w-2xl">
      {/* <div className="p-10 backdrop-blur-sm rounded-2xl  border border-white/20 shadow-xl w-[700px] max-w-[90%] h-[450px]"> */}
        <div className="text-center mb-10">
          <Image
            priority={false}
            src="/LoginCard.png"
            alt="Logo"
            width={340}
            height={100}
            className="mx-auto"
          />
        </div>
        <LoginInForm />
      </div>
    </div>
  );
}
