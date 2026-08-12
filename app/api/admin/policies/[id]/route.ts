import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { Partner } from "@/models/Partner";
import { CoinTransaction } from "@/models/CoinTransaction";
import { requireRole } from "@/lib/auth";
import { categoryName } from "@/lib/catalog";
import { notifyPolicyCreated, notifyPolicyRejected } from "@/lib/email";

export const runtime = "nodejs";

/**
 * Admin actions on a policy submission.
 *   action = "review"  -> move to under_review
 *   action = "create"  -> issue the policy. REQUIRES a policyNumber AND a coin
 *                         reward (rewardCoins > 0). The reward is credited to
 *                         the partner immediately and logged to the ledger.
 *   action = "reject"  -> reject with a reason
 *   action = "note"    -> save/append admin notes
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
    policyNumber?: string;
    rewardCoins?: number;
    reason?: string;
    adminNotes?: string;
  };

  await connectDB();
  const policy = await Policy.findById(id);
  if (!policy) return NextResponse.json({ error: "Policy not found." }, { status: 404 });

  switch (body.action) {
    case "review":
      policy.status = "under_review";
      break;

    case "reject":
      policy.status = "rejected";
      policy.rejectionReason = body.reason?.trim() || "Not approved.";
      break;

    case "note":
      policy.adminNotes = body.adminNotes?.trim() || "";
      break;

    case "create": {
      if (policy.status === "created") {
        return NextResponse.json(
          { error: "This policy has already been created." },
          { status: 400 }
        );
      }
      const policyNumber = body.policyNumber?.trim();
      const reward = Number(body.rewardCoins);

      if (!policyNumber) {
        return NextResponse.json(
          { error: "A policy number is required to mark the policy as created." },
          { status: 400 }
        );
      }
      // Enforce the reward-before-creation rule.
      if (!Number.isFinite(reward) || reward <= 0) {
        return NextResponse.json(
          {
            error:
              "You must assign a coin reward (greater than 0) before marking this policy as created.",
          },
          { status: 400 }
        );
      }

      const partner = await Partner.findById(policy.partner);
      if (!partner) {
        return NextResponse.json(
          { error: "The partner for this policy no longer exists." },
          { status: 400 }
        );
      }

      policy.status = "created";
      policy.policyNumber = policyNumber;
      policy.rewardCoins = reward;
      policy.rewardCredited = true;
      policy.createdByAdminAt = new Date();
      if (body.adminNotes !== undefined) policy.adminNotes = body.adminNotes.trim();
      await policy.save();

      // Credit the reward to the partner and log it.
      const newBalance = (partner.coins ?? 0) + reward;
      partner.coins = newBalance;
      await partner.save();

      await CoinTransaction.create({
        partner: partner._id,
        amount: reward,
        type: "reward",
        reason: `Policy created — ${policy.insurerName} ${policy.planName} (${policyNumber})`,
        policy: policy._id,
        balanceAfter: newBalance,
        byAdminName: session.name,
      });

      // Notify the partner their policy was created (no-op if email not set up).
      await notifyPolicyCreated(partner, {
        _id: policy._id,
        insurerName: policy.insurerName ?? undefined,
        planName: policy.planName ?? undefined,
        categoryName: categoryName(policy.category),
        policyNumber,
        rewardCoins: reward,
      });

      return NextResponse.json({
        ok: true,
        status: policy.status,
        rewardCoins: reward,
        partnerBalance: newBalance,
      });
    }

    default:
      return NextResponse.json({ error: "Unknown action." }, { status: 400 });
  }

  await policy.save();

  // On rejection, email the partner with the reason + resubmit link.
  if (body.action === "reject") {
    const partner = await Partner.findById(policy.partner);
    if (partner) {
      await notifyPolicyRejected(partner, {
        _id: policy._id,
        insurerName: policy.insurerName ?? undefined,
        planName: policy.planName ?? undefined,
      }, policy.rejectionReason ?? undefined);
    }
  }

  return NextResponse.json({ ok: true, status: policy.status });
}
