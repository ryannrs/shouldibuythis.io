import { NextRequest, NextResponse } from "next/server";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";

export async function POST(request: NextRequest) {
  let body: Record<string, string>;

  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  // SNS sends a SubscriptionConfirmation first — visit the URL to activate
  if (body.Type === "SubscriptionConfirmation" && body.SubscribeURL) {
    try {
      await fetch(body.SubscribeURL);
      console.log("[ses-notifications] SNS subscription confirmed");
    } catch (err) {
      console.error("[ses-notifications] subscription confirmation failed:", err);
    }
    return NextResponse.json({ ok: true });
  }

  if (body.Type !== "Notification") {
    return NextResponse.json({ ok: true });
  }

  // The actual SES event is JSON-encoded inside the SNS Message string
  let sesMessage: Record<string, unknown>;
  try {
    sesMessage = JSON.parse(body.Message);
  } catch {
    return NextResponse.json({ ok: true });
  }

  const emailsToRemove: string[] = [];

  if (sesMessage.notificationType === "Complaint") {
    const recipients =
      (
        sesMessage.complaint as {
          complainedRecipients?: { emailAddress?: string }[];
        }
      )?.complainedRecipients ?? [];
    for (const r of recipients) {
      if (r.emailAddress)
        emailsToRemove.push(r.emailAddress.toLowerCase().trim());
    }
  }

  // Only remove on permanent (hard) bounces — transient bounces leave the address alone
  if (
    sesMessage.notificationType === "Bounce" &&
    (sesMessage.bounce as { bounceType?: string })?.bounceType === "Permanent"
  ) {
    const recipients =
      (
        sesMessage.bounce as {
          bouncedRecipients?: { emailAddress?: string }[];
        }
      )?.bouncedRecipients ?? [];
    for (const r of recipients) {
      if (r.emailAddress)
        emailsToRemove.push(r.emailAddress.toLowerCase().trim());
    }
  }

  for (const email of emailsToRemove) {
    try {
      await docClient.send(
        new DeleteCommand({
          TableName: WAITLIST_TABLE,
          Key: { email },
        })
      );
      console.log(`[ses-notifications] removed ${email}`);
    } catch (err) {
      console.error(`[ses-notifications] failed to remove ${email}:`, err);
    }
  }

  return NextResponse.json({ ok: true });
}
