import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { Resend } from "resend";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";
import { generateUnsubscribeToken } from "@/lib/unsubscribeToken";

const APP_URL = process.env.APP_URL ?? "https://shouldibuythis.io";
const FROM_EMAIL = process.env.WAITLIST_FROM_EMAIL ?? "hello@shouldibuythis.io";
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function buildConfirmationEmail(toEmail: string) {
  const token = generateUnsubscribeToken(toEmail);
  const unsubscribeUrl = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(toEmail)}&token=${token}`;

  return {
    from: FROM_EMAIL,
    to: toEmail,
    subject: "You're on the ShouldIBuyThis.io waitlist",
    html: `
<!DOCTYPE html>
<html lang="en">
<head><meta charset="UTF-8"/></head>
<body style="margin:0;padding:0;background:#09090b;font-family:system-ui,sans-serif;">
  <div style="max-width:520px;margin:40px auto;padding:40px 32px;background:#18181b;border:1px solid #27272a;border-radius:16px;">
    <div style="margin-bottom:28px;">
      <span style="font-weight:800;font-size:18px;letter-spacing:-0.5px;color:#fff;">
        ShouldIBuyThis<span style="color:#818cf8">.io</span>
      </span>
    </div>
    <h1 style="font-size:24px;font-weight:800;color:#fff;margin:0 0 12px;line-height:1.2;">
      You're on the list.
    </h1>
    <p style="color:#a1a1aa;line-height:1.7;margin:0 0 24px;font-size:15px;">
      Thanks for signing up. I'll keep you in the loop on what's being built,
      what's shipping next, and when you can try it.
    </p>
    <div style="border-top:1px solid #27272a;padding-top:20px;margin-top:8px;">
      <p style="color:#52525b;font-size:13px;margin:0;line-height:1.6;">
        If you didn't sign up for this, you can safely ignore this email.
        Questions? Reply to this email or reach me at
        <a href="mailto:hello@shouldibuythis.io" style="color:#818cf8;text-decoration:none;">hello@shouldibuythis.io</a>.
        <br/><br/>
        <a href="${unsubscribeUrl}" style="color:#52525b;text-decoration:underline;">Unsubscribe</a>
      </p>
    </div>
  </div>
</body>
</html>`,
    text: [
      "ShouldIBuyThis.io: You're on the list.",
      "",
      "Thanks for signing up. I'll keep you in the loop on what's being built,",
      "what's shipping next, and when you can try it.",
      "",
      "Questions? Email me at hello@shouldibuythis.io",
      "",
      "If you didn't sign up for this, you can safely ignore this email.",
      "",
      `To unsubscribe: ${unsubscribeUrl}`,
    ].join("\n"),
  };
}

export async function POST(request: NextRequest) {
  let body: { email?: string };

  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      { error: "Invalid request body." },
      { status: 400 }
    );
  }

  const email = (body.email ?? "").trim().toLowerCase();

  if (!email || !EMAIL_RE.test(email)) {
    return NextResponse.json(
      { error: "Please enter a valid email address." },
      { status: 400 }
    );
  }

  try {
    await docClient.send(
      new PutCommand({
        TableName: WAITLIST_TABLE,
        Item: {
          email,
          createdAt: new Date().toISOString(),
          source: "landing-page",
        },
        ConditionExpression: "attribute_not_exists(email)",
      })
    );

    // Fire-and-forget confirmation email
    const resend = new Resend(process.env.RESEND_API_KEY);
    resend.emails
      .send(buildConfirmationEmail(email))
      .catch((err) => console.error("[waitlist] Resend error:", err));

    return NextResponse.json({
      success: true,
      message: "You're on the list! Check your email for a confirmation.",
    });
  } catch (error: unknown) {
    if (
      error instanceof Error &&
      error.name === "ConditionalCheckFailedException"
    ) {
      return NextResponse.json(
        { error: "This email is already on the waitlist." },
        { status: 409 }
      );
    }

    console.error("[waitlist] DynamoDB error:", error);
    return NextResponse.json(
      { error: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
