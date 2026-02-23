import { NextRequest, NextResponse } from "next/server";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";
import { verifyUnsubscribeToken } from "@/lib/unsubscribeToken";

const APP_URL = process.env.APP_URL ?? "https://shouldibuythis.io";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").toLowerCase().trim();
  const token = searchParams.get("token") ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=invalid", APP_URL)
    );
  }

  try {
    await docClient.send(
      new DeleteCommand({
        TableName: WAITLIST_TABLE,
        Key: { email },
      })
    );
    return NextResponse.redirect(
      new URL("/unsubscribe?status=success", APP_URL)
    );
  } catch (err) {
    console.error("[unsubscribe] DynamoDB error:", err);
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", APP_URL)
    );
  }
}
