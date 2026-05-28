import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { serializeAuthUser } from "@/lib/serializers/user";
import { verifyToken } from "@/lib/jwt";

/**
 * Admin Middleware Guard
 *
 * Uses the shared jose-based verifyToken so the id is always
 * coerced to a validated ObjectId string before any DB query.
 *
 * Flow:
 * 1. Extract JWT from cookies
 * 2. Verify token via jose (signature + expiry + id validation)
 * 3. Fetch user from database using the safe string id
 * 4. Check isAdmin flag
 * 5. Allow if admin, deny if not
 */
export async function adminGuard(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      console.log("[Admin Guard] No token found.");
      return { isAuthorized: false, user: null, message: "Not authenticated" };
    }

    // verifyToken validates: signature, expiry, and coerces id to a valid string
    const decoded = await verifyToken(token);

    if (!decoded) {
      console.error("[Admin Guard] Token verification failed or payload invalid.");
      return { isAuthorized: false, user: null, message: "Invalid token" };
    }

    console.log(`[Admin Guard] Token verified, userId: ${decoded.id}`);

    await connectDB();

    // decoded.id is already a validated ObjectId string — safe to pass to findById
    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      console.error(`[Admin Guard] User not found for id: ${decoded.id}`);
      return { isAuthorized: false, user: null, message: "User not found" };
    }

    console.log(`[Admin Guard] User: ${user.email}, isAdmin: ${user.isAdmin}`);

    if (!user.isAdmin) {
      console.error(`[Admin Guard] User is not admin: ${user.email}`);
      return {
        isAuthorized: false,
        user: serializeAuthUser(user),
        message: "Admin access required",
      };
    }

    console.log(`[Admin Guard] Authorization successful for ${user.email}`);
    return {
      isAuthorized: true,
      user: serializeAuthUser(user),
      message: "Authorized",
    };
  } catch (error) {
    console.error("[Admin Guard] Unexpected error:", error);
    return { isAuthorized: false, user: null, message: "Internal server error" };
  }
}

/**
 * Helper for admin API unauthorized responses
 */
export function adminUnauthorized() {
  return NextResponse.json(
    { success: false, message: "Admin access required" },
    { status: 403 }
  );
}
