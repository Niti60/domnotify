import { connectDB } from "@/lib/db";
import User from "@/models/User";
import SearchHistory from "@/models/SearchHistory";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * GET /api/admin/activity
 * Get activity logs (latest logins and searches)
 */
export async function GET(req) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    await connectDB();

    const { searchParams } = new URL(req.url);
    const page = Math.max(1, parseInt(searchParams.get("page")) || 1);
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 50);
    const activityType = searchParams.get("type") || "login"; // login or search

    if (activityType === "search") {
      // Get latest search history
      const total = await SearchHistory.countDocuments();

      const searches = await SearchHistory.find()
        .populate("user", "name email role")
        .sort({ searchedAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      return NextResponse.json(
        {
          success: true,
          activityType: "search",
          data: searches,
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    } else {
      // Get latest login activity (excluding admins)
      const users = await User.find({ lastLogin: { $ne: null }, isAdmin: { $ne: true } })
        .select("name email role isPremiumUser lastLogin createdAt")
        .sort({ lastLogin: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean();

      const total = await User.countDocuments({ lastLogin: { $ne: null }, isAdmin: { $ne: true } });

      return NextResponse.json(
        {
          success: true,
          activityType: "login",
          data: users.map((user) => serializeAuthUser(user)),
          pagination: {
            total,
            page,
            limit,
            pages: Math.ceil(total / limit),
          },
        },
        { status: 200 }
      );
    }
  } catch (error) {
    console.error("Admin Get Activity Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
