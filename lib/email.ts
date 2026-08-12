/**
 * Email notifications via EmailJS (server-side REST API).
 *
 * All triggers happen when the admin acts (approve/reject a partner, create or
 * reject a policy), so we call the EmailJS REST endpoint from the server using
 * the private key. If EmailJS env vars are not set the sender silently no-ops,
 * so the app works fine before email is configured.
 *
 * Required env (see .env.example):
 *   EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, EMAILJS_PUBLIC_KEY,
 *   EMAILJS_PRIVATE_KEY, APP_BASE_URL
 *
 * NOTE: In your EmailJS account, enable
 *   Account → Security → "Allow EmailJS API for non-browser applications"
 * otherwise server-side calls are rejected.
 */

const EMAILJS_ENDPOINT = "https://api.emailjs.com/api/v1.0/email/send";

export function appBaseUrl(): string {
  return (process.env.APP_BASE_URL || "https://app.citizenimf.com").replace(
    /\/+$/,
    ""
  );
}

export interface NotifyArgs {
  toEmail: string;
  toName?: string;
  subject: string;
  title: string;
  message: string;
  actionLabel?: string;
  actionUrl?: string;
}

/** Low-level sender. Never throws — logs and returns false on failure. */
export async function sendNotification(args: NotifyArgs): Promise<boolean> {
  const serviceId = process.env.EMAILJS_SERVICE_ID;
  const templateId = process.env.EMAILJS_TEMPLATE_ID;
  const publicKey = process.env.EMAILJS_PUBLIC_KEY;
  const privateKey = process.env.EMAILJS_PRIVATE_KEY;

  if (!serviceId || !templateId || !publicKey || !args.toEmail) {
    // Not configured (or no recipient) — skip quietly.
    return false;
  }

  try {
    const res = await fetch(EMAILJS_ENDPOINT, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_id: serviceId,
        template_id: templateId,
        user_id: publicKey,
        accessToken: privateKey, // required for non-browser (server) calls
        template_params: {
          to_email: args.toEmail,
          to_name: args.toName ?? "",
          subject: args.subject,
          title: args.title,
          message: args.message,
          action_url: args.actionUrl ?? "",
          action_label: args.actionLabel ?? "",
          app_name: "Citizen IMF",
        },
      }),
    });
    if (!res.ok) {
      console.error(
        "EmailJS send failed:",
        res.status,
        await res.text().catch(() => "")
      );
      return false;
    }
    return true;
  } catch (err) {
    console.error("EmailJS error:", err);
    return false;
  }
}

/* ---------------------------------------------------------------------------
 * Composed notifications for each event. Each is fire-and-forget safe.
 * ------------------------------------------------------------------------- */

interface PartnerLike {
  email?: string;
  name?: string;
}
interface PolicyLike {
  _id: unknown;
  insurerName?: string;
  planName?: string;
  categoryName?: string;
  policyNumber?: string;
  rewardCoins?: number;
}

export function notifyPartnerApproved(partner: PartnerLike) {
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: "Your Citizen IMF partner account is approved ✅",
    title: "Account approved",
    message:
      "Good news! Your partner account has been verified and approved. " +
      "You can now log in with your email and password and start creating policies.",
    actionLabel: "Log in",
    actionUrl: `${appBaseUrl()}/login`,
  });
}

export function notifyPartnerRejected(partner: PartnerLike, reason?: string) {
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: "Update on your Citizen IMF partner application",
    title: "Application not approved",
    message:
      `Your partner registration could not be approved at this time.\n\n` +
      `Reason: ${reason || "Not approved."}\n\n` +
      `Please review the details and contact us if you'd like to reapply.`,
    actionLabel: "Visit Citizen IMF",
    actionUrl: appBaseUrl(),
  });
}

export function notifyPartnerPasswordReset(
  partner: PartnerLike,
  newPassword: string
) {
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: "Your Citizen IMF password has been reset",
    title: "Password reset",
    message:
      `An administrator has reset your password.\n\n` +
      `Your new temporary password is: ${newPassword}\n\n` +
      `Please log in and change it as soon as possible.`,
    actionLabel: "Log in",
    actionUrl: `${appBaseUrl()}/login`,
  });
}

/** Thank a new partner for registering and tell them it's under review. */
export function notifyPartnerRegistered(partner: PartnerLike) {
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: "Thank you for registering with Citizen IMF 🙏",
    title: "Registration received",
    message:
      `Thank you for registering as a Citizen IMF partner.\n\n` +
      `Your application has been received and is now under review by our team. ` +
      `You'll get an email as soon as your account is verified — after that you ` +
      `can log in with your email and password and start creating policies.\n\n` +
      `We're glad to have you on board!`,
    actionLabel: "Go to login",
    actionUrl: `${appBaseUrl()}/login`,
  });
}

/** Alert the admin that a new partner has registered and needs review. */
export function notifyAdminNewRegistration(partner: {
  name?: string;
  email?: string;
  mobile?: string;
}) {
  const adminEmail =
    process.env.ADMIN_NOTIFY_EMAIL || process.env.SEED_ADMIN_EMAIL || "";
  if (!adminEmail) return Promise.resolve(false);
  return sendNotification({
    toEmail: adminEmail,
    toName: "Admin",
    subject: "New partner registration — review needed",
    title: "New partner registered",
    message:
      `A new partner has registered and is awaiting verification.\n\n` +
      `Name: ${partner.name ?? "-"}\n` +
      `Email: ${partner.email ?? "-"}\n` +
      `Mobile: ${partner.mobile ?? "-"}\n\n` +
      `Please review and approve or reject the application.`,
    actionLabel: "Review partners",
    actionUrl: `${appBaseUrl()}/admin/partners`,
  });
}

export function notifyPolicyCreated(partner: PartnerLike, policy: PolicyLike) {
  const rewardLine = policy.rewardCoins
    ? `\n\nYou earned ${policy.rewardCoins} reward coins for this policy. 🪙`
    : "";
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: `Policy created — ${policy.policyNumber ?? ""}`.trim(),
    title: "Policy created 🎉",
    message:
      `Your request has been approved and the policy has been created.\n\n` +
      `Insurer: ${policy.insurerName ?? "-"}\n` +
      `Policy number: ${policy.policyNumber ?? "-"}` +
      rewardLine,
    actionLabel: "View policy",
    actionUrl: `${appBaseUrl()}/dashboard/requests/${String(policy._id)}`,
  });
}

export function notifyPolicyRejected(
  partner: PartnerLike,
  policy: PolicyLike,
  reason?: string
) {
  return sendNotification({
    toEmail: partner.email ?? "",
    toName: partner.name,
    subject: "Action needed on your policy request",
    title: "Policy request needs changes",
    message:
      `Your policy request for ${policy.insurerName ?? "the selected insurer"} ` +
      `was not approved and needs changes.\n\n` +
      `Reason: ${reason || "Not approved."}\n\n` +
      `You can edit the form and resubmit it for approval.`,
    actionLabel: "Edit & resubmit",
    actionUrl: `${appBaseUrl()}/dashboard/requests/${String(policy._id)}/edit`,
  });
}
