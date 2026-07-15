import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import {
  verifyPassword,
  signSession,
  setSessionCookie,
} from "@/lib/auth";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const { email, password } = (await req.json().catch(() => ({}))) as {
    email?: string;
    password?: string;
  };

  if (!email || !password) {
    return NextResponse.json(
      { error: "Email and password are required." },
      { status: 400 }
    );
  }

  await connectDB();
  const partner = await Partner.findOne({ email: email.toLowerCase().trim() });

  if (!partner || !(await verifyPassword(password, partner.passwordHash))) {
    return NextResponse.json(
      { error: "Invalid email or password." },
      { status: 401 }
    );
  }

  if (partner.status === "pending") {
    return NextResponse.json(
      {
        error:
          "Your account is still pending verification. You'll be able to log in once an admin approves it.",
        status: "pending",
      },
      { status: 403 }
    );
  }
  if (partner.status === "rejected") {
    return NextResponse.json(
      {
        error:
          partner.rejectionReason ||
          "Your registration was not approved. Please contact support.",
        status: "rejected",
      },
      { status: 403 }
    );
  }

  const token = await signSession({
    sub: String(partner._id),
    role: "partner",
    name: partner.name,
  });
  await setSessionCookie(token);

  return NextResponse.json({ ok: true });
}
