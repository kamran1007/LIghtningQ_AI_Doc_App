import type { Metadata } from "next";

// These styles apply to every route in the application
import "./globals.css";
import AppBar from "@/components/ui/appBar";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Lightning Queue",
  description: "Solution At Lightning Speed",
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();



  return (
    <html lang="en">
      <head />
      <body>
      {session?.user && <AppBar />}
      {children}
      </body>
    </html>
  );
}
