import { NextRequest, NextResponse } from "next/server";
import { DeleteCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";
import { verifyUnsubscribeToken } from "@/lib/unsubscribeToken";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const email = (searchParams.get("email") ?? "").toLowerCase().trim();
  const token = searchParams.get("token") ?? "";

  if (!email || !token || !verifyUnsubscribeToken(email, token)) {
    return NextResponse.redirect(
      new URL("/unsubscribe?status=invalid", request.url)
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
      new URL("/unsubscribe?status=success", request.url)
    );
  } catch (err) {
    console.error("[unsubscribe] DynamoDB error:", err);
    return NextResponse.redirect(
      new URL("/unsubscribe?status=error", request.url)
    );
  }
}
