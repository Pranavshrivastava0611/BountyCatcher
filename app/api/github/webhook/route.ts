// app/api/github/webhook/route.ts
import { NextRequest } from "next/server";
import appFn from "@/probot/app";
import probot from "@/lib/probot";
import { handleVerification } from "@/lib/verifySignature";

probot.load(appFn);

export async function POST(req: NextRequest) {
  try {
    const body = await handleVerification(req); // returns raw string
    const eventName = req.headers.get("x-github-event")!;
    const id = req.headers.get("x-github-delivery")!;
    const signature = req.headers.get("x-hub-signature-256")!;

    await probot.webhooks.receive({
      id,
      //@ts-ignore
      name : eventName,
      payload: JSON.parse(body), // ✅ this is now the correct raw string
      signature,
    });
    return new Response("Webhook received", { status: 200 });
  } catch (err: any) {
    console.error("❌ Webhook error:", err);
    return new Response("Webhook error", { status: 500 });
  }
}
