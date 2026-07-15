import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * Ledger of every change to a partner's coin (reward-point) balance.
 *
 * NOTE: "coins" are non-monetary reward points, not currency. A positive
 * `amount` credits the partner; a negative `amount` debits them. Every entry is
 * recorded so a partner can always see exactly where each reward came from.
 */

const coinTransactionSchema = new Schema(
  {
    partner: { type: Schema.Types.ObjectId, ref: "Partner", required: true, index: true },
    amount: { type: Number, required: true }, // + credit, - debit
    type: {
      type: String,
      enum: ["reward", "adjustment"],
      required: true,
    },
    reason: { type: String, required: true, trim: true },
    policy: { type: Schema.Types.ObjectId, ref: "Policy" }, // set for policy rewards
    balanceAfter: { type: Number, required: true },
    byAdminName: { type: String },
  },
  { timestamps: true }
);

export type CoinTransactionDoc = InferSchemaType<typeof coinTransactionSchema> & {
  _id: string;
};

export const CoinTransaction: Model<CoinTransactionDoc> =
  (models.CoinTransaction as Model<CoinTransactionDoc>) ||
  model<CoinTransactionDoc>("CoinTransaction", coinTransactionSchema);
