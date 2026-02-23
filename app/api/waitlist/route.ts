import { NextRequest, NextResponse } from "next/server";
import { PutCommand } from "@aws-sdk/lib-dynamodb";
import { SESClient, SendEmailCommand } from "@aws-sdk/client-ses";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";
import { generateUnsubscribeToken } from "@/lib/unsubscribeToken";

const APP_URL = process.env.APP_URL ?? "https://shouldibuythis.io";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const sesClient = new SESClient({
  region: process.env.AWS_REGION ?? "us-east-1",
  ...(process.env.AWS_ACCESS_KEY_ID && {
    credentials: {
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
    },
  }),
});

const FROM_EMAIL =
  process.env.WAITLIST_FROM_EMAIL ?? "hello@shouldibuythis.io";

function buildConfirmationEmail(toEmail: string) {
  const token = generateUnsubscribeToken(toEmail);
  const unsubscribeUrl = `${APP_URL}/api/unsubscribe?email=${encodeURIComponent(toEmail)}&token=${token}`;

  return new SendEmailCommand({
    Source: FROM_EMAIL,
    Destination: { ToAddresses: [toEmail] },
    Message: {
      Subject: { Data: "You're on the ShouldIBuyThis.io waitlist" },
      Body: {
        Html: {
          Data: `
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
      Thanks for signing up. You'll hear from me when early access opens.
      Waitlist members get input on which features get built first.
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
        },
        Text: {
          Data: [
            "ShouldIBuyThis.io: You're on the list.",
            "",
            "Thanks for signing up. You'll hear from me when early access opens.",
            "Waitlist members get input on which features get built first.",
            "",
            "Questions? Email me at hello@shouldibuythis.io",
            "",
            "If you didn't sign up for this, you can safely ignore this email.",
            "",
            `To unsubscribe: ${unsubscribeUrl}`,
          ].join("\n"),
        },
      },
    },
  });
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
        // Reject duplicate emails at the DB level
        ConditionExpression: "attribute_not_exists(email)",
      })
    );

    // Fire-and-forget: send confirmation email via SES.
    // We don't await so a slow/failed send doesn't block the response.
    sesClient
      .send(buildConfirmationEmail(email))
      .catch((err) => console.error("[waitlist] SES send error:", err));

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
