import { getSession, commitSession } from "@/lib/session";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const { HospitalId, HospitalName } = await req.json();

  const session = await getSession();
  if (!session) {
    return NextResponse.json({ error: "No active session" }, { status: 401 });
  }

  session.selectedHospital = { HospitalId, hospitalName: HospitalName };

  const res = NextResponse.json({ ok: true });
  await commitSession(session, res);

  return res;
}
