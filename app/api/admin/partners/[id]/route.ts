import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { requireRole, hashPassword } from "@/lib/auth";
import {
  notifyPartnerApproved,
  notifyPartnerRejected,
  notifyPartnerPasswordReset,
} from "@/lib/email";

export const runtime = "nodejs";

/**
 * Admin actions on a partner account.
 *   action = "verify"          -> approve the account (can now log in)
 *   action = "reject"          -> reject with a reason
 *   action = "reset-password"  -> set a new password for the partner
 */
export async function PATCH(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("admin");
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const body = (await req.json().catch(() => ({}))) as {
    action?: string;
    reason?: string;
    newPassword?: string;
  };

  await connectDB();
  const partner = await Partner.findById(id);
  if (!partner) return NextResponse.json({ error: "Partner not found." }, { status: 404 });

  switch (body.action) {
    case "verify":
      partner.status = "verified";
      partner.verifiedAt = new Date();
      partner.rejectionReason = undefined;
      break;
    case "reject":
      partner.status = "rejected";
      partner.rejectionReason = body.reason?.trim() || "Not approved.";
      break;
    case "reset-password": {
      const pw = body.newPassword?.trim();
      if (!pw || pw.length < 8) {
        return NextResponse.json(
          { error: "New password must be at least 8 characters." },
          { status: 400 }
        );
      }
      partner.passwordHash = await hashPassword(pw);
      break;
    }
    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  await partner.save();

  // Email the partner about the action (no-op if EmailJS is not configured).
  if (body.action === "verify") {
    await notifyPartnerApproved(partner);
  } else if (body.action === "reject") {
    await notifyPartnerRejected(partner, partner.rejectionReason ?? undefined);
  } else if (body.action === "reset-password") {
    await notifyPartnerPasswordReset(partner, body.newPassword!.trim());
  }

  return NextResponse.json({ ok: true, status: partner.status });
}
