import { cache } from "react";
import { ScanCommand } from "@aws-sdk/lib-dynamodb";
import { docClient, WAITLIST_TABLE } from "./dynamodb";

export const getWaitlistCount = cache(async (): Promise<number> => {
  try {
    const result = await docClient.send(
      new ScanCommand({
        TableName: WAITLIST_TABLE,
        Select: "COUNT",
      })
    );
    return result.Count ?? 0;
  } catch (err) {
    console.error("[waitlist] count error:", err);
    return 0;
  }
});
