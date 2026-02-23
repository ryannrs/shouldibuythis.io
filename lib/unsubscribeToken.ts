import { createHmac, timingSafeEqual } from "crypto";

const SECRET = process.env.UNSUBSCRIBE_SECRET ?? "dev-secret-change-me";

export function generateUnsubscribeToken(email: string): string {
  return createHmac("sha256", SECRET)
    .update(email.toLowerCase())
    .digest("hex");
}

export function verifyUnsubscribeToken(email: string, token: string): boolean {
  try {
    const expected = generateUnsubscribeToken(email);
    const a = Buffer.from(expected, "hex");
    const b = Buffer.from(token, "hex");
    return a.length === b.length && timingSafeEqual(a, b);
  } catch {
    return false;
  }
}
