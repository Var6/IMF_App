import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Partner } from "@/models/Partner";
import { CoinTransaction } from "@/models/CoinTransaction";
import { requireRole } from "@/lib/auth";

export const runtime = "nodejs";

/**
 * Manually adjust a partner's coin balance (credit or debit). A positive
 * `amount` credits the partner, a negative `amount` debits them. Every change
 * is written to the CoinTransaction ledger so the partner can see where it
 * came from.
 */
export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await requireRole("admin");
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });

  const { id } = await params;
  const { amount, reason } = (await req.json().catch(() => ({}))) as {
    amount?: number;
    reason?: string;
  };

  const value = Number(amount);
  if (!Number.isFinite(value) || value === 0) {
    return NextResponse.json(
      { error: "Enter a non-zero coin amount." },
      { status: 400 }
    );
  }
  if (!reason || !reason.trim()) {
    return NextResponse.json({ error: "A reason is required." }, { status: 400 });
  }

  await connectDB();
  const partner = await Partner.findById(id);
  if (!partner) return NextResponse.json({ error: "Partner not found." }, { status: 404 });

  const newBalance = (partner.coins ?? 0) + value;
  if (newBalance < 0) {
    return NextResponse.json(
      { error: "This would take the partner's balance below zero." },
      { status: 400 }
    );
  }

  partner.coins = newBalance;
  await partner.save();

  await CoinTransaction.create({
    partner: partner._id,
    amount: value,
    type: "adjustment",
    reason: reason.trim(),
    balanceAfter: newBalance,
    byAdminName: session.name,
  });

  return NextResponse.json({ ok: true, balance: newBalance });
}
