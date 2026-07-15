import { getSession } from "@/lib/auth";
import { connectDB } from "@/lib/db";
import { Partner, type PartnerDoc } from "@/models/Partner";
import { Admin, type AdminDoc } from "@/models/Admin";

/** Load the currently-logged-in partner document (or null). */
export async function getCurrentPartner(): Promise<PartnerDoc | null> {
  const session = await getSession();
  if (!session || session.role !== "partner") return null;
  await connectDB();
  const partner = await Partner.findById(session.sub).lean<PartnerDoc>();
  return partner ?? null;
}

/** Load the currently-logged-in admin document (or null). */
export async function getCurrentAdmin(): Promise<AdminDoc | null> {
  const session = await getSession();
  if (!session || session.role !== "admin") return null;
  await connectDB();
  const admin = await Admin.findById(session.sub).lean<AdminDoc>();
  return admin ?? null;
}
