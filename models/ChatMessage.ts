import { Schema, model, models, type InferSchemaType, type Model } from "mongoose";

/**
 * A message in the per-policy "request" conversation. Partners and admins can
 * both post messages against a policy submission — this powers the chat-style
 * Q&A on each request.
 */

const chatMessageSchema = new Schema(
  {
    policy: { type: Schema.Types.ObjectId, ref: "Policy", required: true, index: true },
    senderRole: { type: String, enum: ["partner", "admin"], required: true },
    senderName: { type: String, required: true },
    text: { type: String, required: true, trim: true },
  },
  { timestamps: true }
);

export type ChatMessageDoc = InferSchemaType<typeof chatMessageSchema> & {
  _id: string;
};

export const ChatMessage: Model<ChatMessageDoc> =
  (models.ChatMessage as Model<ChatMessageDoc>) ||
  model<ChatMessageDoc>("ChatMessage", chatMessageSchema);
