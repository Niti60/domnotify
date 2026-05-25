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

    if (!token) {
      return {
        isAuthorized: false,
        user: null,
        message: "Not authenticated",
      };
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return {
        isAuthorized: false,
        user: null,
        message: "Invalid token",
      };
    }

    await connectDB();

    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return {
        isAuthorized: false,
        user: null,
        message: "User not found",
      };
    }

    if (!user.isAdmin) {
      return {
        isAuthorized: false,
        user: serializeAuthUser(user),
        message: "Admin access required",
      };
    }

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
