import { cookies } from "next/headers";
import { QueryCommand, UpdateCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "@/lib/dynamodb";

export async function POST(req: Request) {
  const code = (await cookies()).get("access")?.value;
  if (!code) return new Response("Unauthorized", { status: 401 });

  // Look up the waitlist item by code (GSI) to get the email (primary key)
  const lookup = await docClient.send(
    new QueryCommand({
      TableName: WAITLIST_TABLE,
      IndexName: "code-index",
      KeyConditionExpression: "#c = :code",
      ExpressionAttributeNames: { "#c": "code" },
      ExpressionAttributeValues: { ":code": code },
      Limit: 1,
      ProjectionExpression: "email",
    })
  );

  const email = lookup.Items?.[0]?.email as string | undefined;
  if (!email) return new Response("Unauthorized", { status: 401 });

  // Atomically decrement uses_remaining — fails if already at 0
  try {
    await docClient.send(
      new UpdateCommand({
        TableName: WAITLIST_TABLE,
        Key: { email },
        UpdateExpression: "SET uses_remaining = uses_remaining - :dec",
        ConditionExpression: "uses_remaining > :zero",
        ExpressionAttributeValues: { ":dec": 1, ":zero": 0 },
      })
    );
  } catch (err: unknown) {
    if (err instanceof Error && err.name === "ConditionalCheckFailedException") {
      return new Response(
        JSON.stringify({ error: "You've used all your analyses. Reach out for more access." }),
        { status: 429, headers: { "Content-Type": "application/json" } }
      );
    }
    throw err;
  }

  const body = await req.json();
  const upstream = await fetch(`${process.env.API_URL}/analyze`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return Response.json(await upstream.json());
}
