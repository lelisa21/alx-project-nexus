import crypto from "crypto";

export type SessionPayload = {
  userId: string;
  email: string;
  name?: string | null;
  isDemo?: boolean;
};

const sessionSecret =
  process.env.NEXTAUTH_SECRET || process.env.SESSION_SECRET || "pollify-dev-secret";

function encodeBase64Url(value: string) {
  return Buffer.from(value).toString("base64url");
}

function decodeBase64Url(value: string) {
  return Buffer.from(value, "base64url").toString("utf8");
}

function sign(value: string) {
  return crypto.createHmac("sha256", sessionSecret).update(value).digest("base64url");
}

export function createSessionToken(payload: SessionPayload) {
  const body = encodeBase64Url(JSON.stringify(payload));
  return `${body}.${sign(body)}`;
}

export function verifySessionToken(token?: string): SessionPayload | null {
  if (!token) return null;

  const [body, signature] = token.split(".");
  if (!body || !signature || sign(body) !== signature) return null;

  try {
    return JSON.parse(decodeBase64Url(body)) as SessionPayload;
  } catch {
    return null;
  }
}
