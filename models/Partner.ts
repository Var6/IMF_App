import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A registered partner (agent) of the portal. Created via the public
 * "Partner Registration Portal". Starts life as `pending` and can only log in
 * once an admin marks the account `verified`.
 */

const bankSchema = new Schema(
  {
    accountHolderName: { type: String, required: true, trim: true },
    accountNumber: { type: String, required: true, trim: true },
    ifsc: { type: String, required: true, trim: true, uppercase: true },
    bankName: { type: String, required: true, trim: true },
    branch: { type: String, trim: true },
  },
  { _id: false }
);

const partnerSchema = new Schema(
  {
    // Identity
    name: { type: String, required: true, trim: true },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    mobile: { type: String, required: true, trim: true },
    passwordHash: { type: String, required: true },

    // KYC (mandatory)
    aadhaarNumber: { type: String, required: true, trim: true },
    panNumber: { type: String, required: true, trim: true, uppercase: true },
    selfieKey: { type: String, required: true }, // R2 object key

    // KYC document images (optional but recommended)
    aadhaarImageKey: { type: String },
    panImageKey: { type: String },

    // Extra profile info
    dob: { type: String }, // ISO date string
    gender: { type: String, enum: ["male", "female", "other", ""], default: "" },
    address: { type: String, trim: true },
    city: { type: String, trim: true },
    state: { type: String, trim: true },
    pincode: { type: String, trim: true },

    // Bank details (mandatory)
    bank: { type: bankSchema, required: true },

    // Optional education documents
    marksheet10Key: { type: String },
    marksheet12Key: { type: String },
    graduationKey: { type: String },
    postGraduationKey: { type: String },

    // Account lifecycle
    status: {
      type: String,
      enum: ["pending", "verified", "rejected"],
      default: "pending",
      index: true,
    },
    rejectionReason: { type: String },
    verifiedAt: { type: Date },

    // Rewards
    coins: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export type PartnerDoc = InferSchemaType<typeof partnerSchema> & { _id: string };

export const Partner: Model<PartnerDoc> =
  (models.Partner as Model<PartnerDoc>) ||
  model<PartnerDoc>("Partner", partnerSchema);
