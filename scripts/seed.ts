/**
 * Seed script — creates the first admin account.
 *
 * Usage:  npm run seed
 *
 * Reads SEED_ADMIN_EMAIL / SEED_ADMIN_PASSWORD / SEED_ADMIN_NAME and
 * MONGODB_URI from .env.local. Safe to run multiple times (idempotent).
 */
import { config } from "dotenv";
config({ path: ".env.local" });

import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Admin } from "../models/Admin";

async function main() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error("✗ MONGODB_URI is not set in .env.local");
    process.exit(1);
  }

  const email = (process.env.SEED_ADMIN_EMAIL || "admin@citizenimf.com").toLowerCase();
  const password = process.env.SEED_ADMIN_PASSWORD || "Admin@12345";
  const name = process.env.SEED_ADMIN_NAME || "Portal Admin";

  console.log("Connecting to MongoDB…");
  await mongoose.connect(uri);

  const existing = await Admin.findOne({ email });
  if (existing) {
    console.log(`✓ Admin already exists: ${email}`);
    console.log("  (delete it from the DB first if you want to reset the password)");
  } else {
    const passwordHash = await bcrypt.hash(password, 10);
    await Admin.create({ name, email, passwordHash });
    console.log("✓ Created admin account:");
    console.log(`    Email:    ${email}`);
    console.log(`    Password: ${password}`);
    console.log("  You can log in at /admin/login");
  }

  await mongoose.disconnect();
  console.log("Done.");
  process.exit(0);
}

main().catch((err) => {
  console.error("Seed failed:", err);
  process.exit(1);
});
