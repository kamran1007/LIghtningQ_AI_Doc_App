// app/page.tsx
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export default async function HomePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }
  else{
    redirect("/dashboard");

  }

  // // If session exists, you can redirect to dashboard or show content
  // redirect("/"); // or return <DashboardComponent />
}
