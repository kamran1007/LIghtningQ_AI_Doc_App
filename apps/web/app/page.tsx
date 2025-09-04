// app/page.tsx
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import Router from "next/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";

export default async function HomePage() {
  const session = await getSession();

  if (!session?.user) {
    redirect("/auth/login");
  }

  redirect("/dashboard");
}

Router.events.on("routeChangeStart", () => NProgress.start());
Router.events.on("routeChangeComplete", () => NProgress.done());
Router.events.on("routeChangeError", () => NProgress.done());