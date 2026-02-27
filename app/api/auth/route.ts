import { NextResponse } from "next/server";
import { QueryCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";

export async function POST(req: Request) {
  const { code } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Invalid code" }, { status: 401 });
  }

  const normalized = code.trim().toUpperCase();

  const result = await docClient.send(
    new QueryCommand({
      TableName: WAITLIST_TABLE,
      IndexName: "code-index",
      KeyConditionExpression: "#c = :code",
      ExpressionAttributeNames: { "#c": "code" },
      ExpressionAttributeValues: { ":code": normalized },
      Limit: 1,
    })
  );

  const item = result.Items?.[0];
  if (!item || (item.uses_remaining ?? 0) <= 0) {
    return NextResponse.json({ error: "Invalid or expired code" }, { status: 401 });
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set("access", normalized, {
    httpOnly: true,
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7, // 7 days
    secure: process.env.NODE_ENV === "production",
  });
  return res;
}
