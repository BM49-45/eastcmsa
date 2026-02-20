import crypto from "crypto";

export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString("hex");
}

export function getSessionExpiry(): Date {
  const expires = new Date();
  expires.setDate(expires.getDate() + 30); // 30 days
  return expires;
}
