import { getProfile } from "@/lib/action";
import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import React from "react";

const page = async () => {
  const session = await getSession();
  const res = await getProfile();

  if (!session || !session.user) redirect("/auth/login");
  console.log("session", session);
  return (
    <div className="json-output">
      <pre>{JSON.stringify(res, null, 2)}</pre>
      <p>hello this is dashboard</p>
    </div>
  );
};

export default page;
