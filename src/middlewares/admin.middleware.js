import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * Admin Middleware Guard
 *
 * Purpose: Verify admin access for /admin routes and /api/admin/* endpoints
 *
 * Flow:
 * 1. Extract JWT from cookies
 * 2. Verify token signature
 * 3. Fetch user from database
 * 4. Check isAdmin flag
 * 5. Allow if admin, deny if not
 *
 * Used by:
 * - /admin pages
 * - /api/admin/* endpoints
 */
export async function adminGuard(req) {
  try {
    const token = req.cookies.get("token")?.value;

    console.log(`[Admin Guard] Token check - token exists: ${Boolean(token)}`);

    if (!token) {
      console.log(`[Admin Guard] No token found. Cookies available: ${Array.from(req.cookies).map(([k]) => k).join(', ') || 'none'}`);
      return {
        isAuthorized: false,
        user: null,
        message: "Not authenticated",
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log(`[Admin Guard] Token verified for user: ${decoded.id}`);
    } catch (err) {
      console.error(`[Admin Guard] Token verification failed: ${err.message}`);
      return {
        isAuthorized: false,
        user: null,
        message: "Invalid token",
      };
    }

    await connectDB();

    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      console.error(`[Admin Guard] User not found: ${decoded.id}`);
      return {
        isAuthorized: false,
        user: null,
        message: "User not found",
      };
    }

    console.log(`[Admin Guard] User found: ${user.email}, isAdmin: ${user.isAdmin}`);

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
    return {
      isAuthorized: false,
      user: null,
      message: "Internal server error",
    };
  }
}

/**
 * Helper function for admin API responses
 * Returns 403 Forbidden if not admin
 */
export function adminUnauthorized() {
  return NextResponse.json(
    { success: false, message: "Admin access required" },
    { status: 403 }
  );
}
