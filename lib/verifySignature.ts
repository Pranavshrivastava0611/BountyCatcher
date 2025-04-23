// lib/verifySignature.ts
import { Webhooks } from "@octokit/webhooks";
import { NextRequest } from "next/server";

const webhooks = new Webhooks({
  secret: process.env.WEBHOOK_SECRET!,
});

export async function handleVerification(req: NextRequest): Promise<string> {
  const signature = req.headers.get("x-hub-signature-256")!;
  const body = await req.text();

  const isValid = await webhooks.verify(body, signature);
  if (!isValid) {
    throw new Error("Invalid webhook signature");
  }

  return body; // ✅ Return raw body string
}
