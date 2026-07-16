import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A policy-creation request submitted by a partner.
 *
 * Because each insurance category has a different form, the service-specific
 * answers are stored in a flexible `details` object keyed by field name (see
 * lib/forms.ts). A few common applicant fields are promoted to the top level
 * for listing, search and display.
 *
 * The admin reviews the request, issues a policy number and (before marking it
 * "created") credits a coin reward.
 */

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
    planName: { type: String, trim: true }, // optional specific plan/product name

    // Promoted applicant fields (from the form's customer* fields)
    applicantName: { type: String, required: true, trim: true },
    applicantMobile: { type: String, required: true, trim: true },
    applicantEmail: { type: String, trim: true, lowercase: true },

    // All service-specific answers, keyed by form field name
    details: { type: Schema.Types.Mixed, default: {} },

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
    policyNumber: { type: String, trim: true },
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
