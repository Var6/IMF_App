import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A policy-creation request submitted by a partner. The partner fills in the
 * proposer / nominee / plan details; the admin reviews it, issues a policy
 * number and (before marking it "created") credits a coin reward.
 *
 * Required policy fields are based on standard Indian life-insurance proposal
 * data: proposer KYC, nominee designation (Section 39, Insurance Act 1938),
 * sum assured, premium, premium frequency, policy term and premium paying term.
 */

const nomineeSchema = new Schema(
  {
    name: { type: String, required: true, trim: true },
    relation: { type: String, required: true, trim: true },
    dob: { type: String }, // ISO date string
    sharePercent: { type: Number, default: 100 },
    appointeeName: { type: String, trim: true }, // required if nominee is a minor
  },
  { _id: false }
);

const documentSchema = new Schema(
  {
    label: { type: String, required: true },
    key: { type: String, required: true }, // R2 object key
  },
  { _id: false }
);

const policySchema = new Schema(
  {
    partner: { type: Schema.Types.ObjectId, ref: "Partner", required: true, index: true },

    // What is being sold
    category: { type: String, required: true, index: true }, // e.g. "life"
    insurerSlug: { type: String, required: true },
    insurerName: { type: String, required: true },
    planName: { type: String, required: true, trim: true },
    planType: {
      type: String,
      enum: ["term", "endowment", "ulip", "whole-life", "money-back", "other"],
      default: "term",
    },

    // Proposer / life-to-be-insured
    proposerName: { type: String, required: true, trim: true },
    proposerDob: { type: String, required: true },
    proposerGender: { type: String, enum: ["male", "female", "other"], required: true },
    proposerMobile: { type: String, required: true, trim: true },
    proposerEmail: { type: String, trim: true, lowercase: true },
    proposerPan: { type: String, trim: true, uppercase: true },
    proposerAadhaar: { type: String, trim: true },
    proposerAddress: { type: String, trim: true },
    occupation: { type: String, trim: true },
    annualIncome: { type: Number },
    tobaccoUser: { type: Boolean, default: false },
    medicalHistory: { type: String, trim: true },

    // Nominee (mandatory for death-benefit policies)
    nominee: { type: nomineeSchema, required: true },

    // Plan financials
    sumAssured: { type: Number, required: true },
    premiumAmount: { type: Number, required: true },
    premiumFrequency: {
      type: String,
      enum: ["monthly", "quarterly", "half-yearly", "yearly", "single"],
      default: "yearly",
    },
    policyTermYears: { type: Number, required: true },
    premiumPayingTermYears: { type: Number, required: true },
    proposedStartDate: { type: String },

    // Supporting documents (R2 keys)
    documents: { type: [documentSchema], default: [] },

    // Free-text notes from the partner
    partnerNotes: { type: String, trim: true },

    // Admin workflow
    status: {
      type: String,
      enum: ["submitted", "under_review", "created", "rejected"],
      default: "submitted",
      index: true,
    },
    policyNumber: { type: String, trim: true }, // set by admin when created
    adminNotes: { type: String, trim: true },
    rejectionReason: { type: String, trim: true },

    // Reward tied to this policy
    rewardCoins: { type: Number, default: 0 },
    rewardCredited: { type: Boolean, default: false },
    createdByAdminAt: { type: Date },
  },
  { timestamps: true }
);

export type PolicyDoc = InferSchemaType<typeof policySchema> & { _id: string };

export const Policy: Model<PolicyDoc> =
  (models.Policy as Model<PolicyDoc>) || model<PolicyDoc>("Policy", policySchema);
