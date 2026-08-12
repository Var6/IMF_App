import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { hashPassword } from "@/lib/auth";
import { registrationSchema } from "@/lib/validation";
import {
  notifyAdminNewRegistration,
  notifyPartnerRegistered,
} from "@/lib/email";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const parsed = registrationSchema.safeParse(body);

  if (!parsed.success) {
    // Build dot-path field errors (so nested bank.* fields surface) plus a
    // short readable summary listing exactly what to fix.
    const fieldErrors: Record<string, string[]> = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path.join(".") || "_";
      (fieldErrors[key] ??= []).push(issue.message);
    }
    const summary = Object.values(fieldErrors)
      .map((m) => m[0])
      .slice(0, 5)
      .join("; ");
    return NextResponse.json(
      { error: summary || "Please check your details.", fieldErrors },
      { status: 400 }
    );
  }
  const data = parsed.data;

  await connectDB();

  const exists = await Partner.findOne({ email: data.email }).lean();
  if (exists) {
    return NextResponse.json(
      { error: "An account with this email already exists." },
      { status: 409 }
    );
  }

  const passwordHash = await hashPassword(data.password);

  await Partner.create({
    name: data.name,
    email: data.email,
    mobile: data.mobile,
    passwordHash,
    aadhaarNumber: data.aadhaarNumber,
    panNumber: data.panNumber,
    selfieKey: data.selfieKey,
    aadhaarImageKey: data.aadhaarImageKey || undefined,
    panImageKey: data.panImageKey || undefined,
    dob: data.dob || undefined,
    gender: data.gender || "",
    address: data.address || undefined,
    city: data.city || undefined,
    state: data.state || undefined,
    pincode: data.pincode || undefined,
    bank: {
      accountHolderName: data.bank.accountHolderName,
      accountNumber: data.bank.accountNumber,
      ifsc: data.bank.ifsc,
      bankName: data.bank.bankName,
      branch: data.bank.branch || undefined,
    },
    marksheet10Key: data.marksheet10Key || undefined,
    marksheet12Key: data.marksheet12Key || undefined,
    status: "pending",
    coins: 0,
  });

  // Thank the partner + alert the admin (no-op if email is not configured).
  await Promise.allSettled([
    notifyPartnerRegistered({ name: data.name, email: data.email }),
    notifyAdminNewRegistration({
      name: data.name,
      email: data.email,
      mobile: data.mobile,
    }),
  ]);

  return NextResponse.json({ ok: true });
}
