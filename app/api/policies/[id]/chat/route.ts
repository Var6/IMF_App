import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Policy } from "@/models/Policy";
import { ChatMessage } from "@/models/ChatMessage";
import { getSession } from "@/lib/auth";

export const runtime = "nodejs";

/** Confirm the session may access this policy thread. Returns the policy or null. */
async function authorize(policyId: string) {
  const session = await getSession();
  if (!session) return { session: null, policy: null };
  const policy = await Policy.findById(policyId);
  if (!policy) return { session, policy: null };
  if (session.role === "partner" && String(policy.partner) !== session.sub) {
    return { session, policy: null };
  }
  return { session, policy };
}

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const { session, policy } = await authorize(id);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!policy) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const messages = await ChatMessage.find({ policy: id }).sort({ createdAt: 1 }).lean();
  return NextResponse.json({
    messages: messages.map((m) => ({
      id: String(m._id),
      senderRole: m.senderRole,
      senderName: m.senderName,
      text: m.text,
      createdAt: m.createdAt,
    })),
  });
}

export async function POST(
  req: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  await connectDB();
  const { session, policy } = await authorize(id);
  if (!session) return NextResponse.json({ error: "Unauthorized." }, { status: 401 });
  if (!policy) return NextResponse.json({ error: "Not found." }, { status: 404 });

  const { text } = (await req.json().catch(() => ({}))) as { text?: string };
  if (!text || !text.trim()) {
    return NextResponse.json({ error: "Message cannot be empty." }, { status: 400 });
  }

  const msg = await ChatMessage.create({
    policy: id,
    senderRole: session.role,
    senderName: session.name,
    text: text.trim(),
  });

  return NextResponse.json({
    ok: true,
    message: {
      id: String(msg._id),
      senderRole: msg.senderRole,
      senderName: msg.senderName,
      text: msg.text,
      createdAt: msg.createdAt,
    },
  });
}
