import type { Metadata } from "next";
import "./globals.css";
import { getSession } from "@/lib/session";
import { AppSidebar } from "@/components/AppSidebar";
import { ReactQueryProvider } from "@/components/ReactQueryProvider";
import { Toaster } from "react-hot-toast";
import { headers } from "next/headers";
import ClientLayoutWrapper from "@/hooks/ClientLayoutWrapper";
import ClientAppBarWrapper from "@/hooks/ClientAppBarWrapper"; // ⬅️ Import new wrapper
import { Orbitron } from "next/font/google";

// ⬇️ Load Orbitron font
const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["500"],
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lightning Queue",
  description: "Solution At Lightning Speed",
  icons: {
    icon: "/favicon.png",
    apple: "/apple-touch-icon.png",
    shortcut: "/favicon-32x32.png",
  },
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getSession();
  const pathname = (await headers()).get("x-next-url") || "";
  const isAuthPage = pathname.startsWith("/auth");

  return (
    <html lang="en" className={orbitron.className}>
      <body className="h-screen flex flex-col">
        <ReactQueryProvider>
          <Toaster position="top-center" reverseOrder={false} />
          <ClientLayoutWrapper>
            {!isAuthPage && (
              <ClientAppBarWrapper session={session}/> 
            )}
            <div className="flex flex-1 overflow-hidden">
              {!isAuthPage && session?.user && <AppSidebar />}
              <main className="flex-1 overflow-y-auto p-4">{children}</main>
            </div>
          </ClientLayoutWrapper>
        </ReactQueryProvider>
      </body>
    </html>
  );
}
