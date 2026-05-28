import { SignJWT, jwtVerify } from "jose";
import mongoose from "mongoose";

// ─── Secret ──────────────────────────────────────────────────────────────────
// Read lazily at call time so process.env is never captured as undefined
// during module initialization (common issue in both Edge & Node runtimes).
function getSecret() {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("[jwt.js] JWT_SECRET environment variable is not set");
  }
  return new TextEncoder().encode(secret);
}

// ─── Coerce id to a clean string ─────────────────────────────────────────────
// Old tokens signed before the jose migration stored raw BSON ObjectId objects
// ({buffer:...}) instead of strings.  This helper normalises whatever comes back
// from the JWT payload into a plain hex string, or returns null if unrecoverable.
function coerceId(rawId) {
  if (!rawId) return null;

  // Already a plain string
  if (typeof rawId === "string") {
    return mongoose.Types.ObjectId.isValid(rawId) ? rawId : null;
  }

  // BSON ObjectId instance (has .toString())
  if (typeof rawId === "object" && typeof rawId.toString === "function") {
    const str = rawId.toString();
    return mongoose.Types.ObjectId.isValid(str) ? str : null;
  }

  return null;
}

// ─── Token generation ─────────────────────────────────────────────────────────
export async function generateToken(user) {
  // Always store id as a plain string — never pass raw BSON.
  const token = await new SignJWT({
    id: String(user._id),          // guaranteed string
    email: String(user.email),
    role: user.role ?? null,
    isAdmin: Boolean(user.isAdmin),
  })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(getSecret());

  return token;
}

// ─── Token verification ───────────────────────────────────────────────────────
// Returns the payload with `id` normalised to a valid ObjectId string,
// or null if the token is expired / invalid / has a corrupted payload.
export async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());

    const id = coerceId(payload.id);

    if (!id) {
      console.error(
        "[jwt.js] Token payload contains invalid/non-string id:",
        payload.id
      );
      return null;
    }

    return { ...payload, id };
  } catch {
    // Covers TokenExpiredError, JWTInvalid, etc.
    return null;
  }
}