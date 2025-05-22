import { getSession } from "@/lib/session";
import Link from "next/link";
import React from "react";

const LogInButton = async () => {
  const session = await getSession();
  return (
    <div className="flex items-center gap-2 ml-auto">
      {!session || !session.user ? (
        <>
          <Link href={"/auth/login"}> Login</Link>
        </>
      ) : (
        <>
          <p>{session.user.name}</p>
          <a href={"/api/auth/logout"}>log Out</a>
        </>
      )}
    </div>
  );
};

export default LogInButton;