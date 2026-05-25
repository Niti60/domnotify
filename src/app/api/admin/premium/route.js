import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * GET /api/admin/premium
 * Get premium users and premium statistics
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
    const limit = Math.min(100, parseInt(searchParams.get("limit")) || 20);
    const plan = searchParams.get("plan"); // filter by plan

    // Build filter - Exclude admins
    const filter = { isPremiumUser: true, isAdmin: { $ne: true } };
    if (plan) {
      filter.premiumPlanType = plan;
    }

    const total = await User.countDocuments(filter);

    const premiumUsers = await User.find(filter)
      .select("name email role premiumPlanType createdAt updatedAt")
      .sort({ updatedAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get stats (excluding admins)
    const allPremiumUsers = await User.countDocuments({ isPremiumUser: true, isAdmin: { $ne: true } });
    const planStats = await User.aggregate([
      { $match: { isPremiumUser: true, isAdmin: { $ne: true } } },
      {
        $group: {
          _id: "$premiumPlanType",
          count: { $sum: 1 },
        },
      },
    ]);

    return NextResponse.json(
      {
        success: true,
        data: premiumUsers.map((user) => serializeAuthUser(user)),
        stats: {
          totalPremiumUsers: allPremiumUsers,
          planBreakdown: planStats,
        },
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Get Premium Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/premium
 * Update user premium status
 * Body: { userId, isPremiumUser, premiumPlanType }
 */
export async function PATCH(req) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    const { userId, isPremiumUser, premiumPlanType } = await req.json();

    if (!userId) {
      return NextResponse.json(
        { success: false, message: "User ID required" },
        { status: 400 }
      );
    }

    await connectDB();

    const user = await User.findById(userId);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    if (isPremiumUser !== undefined) {
      user.isPremiumUser = isPremiumUser;
    }

    if (premiumPlanType !== undefined) {
      user.premiumPlanType = premiumPlanType;
    }

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "Premium status updated",
        user: serializeAuthUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Update Premium Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
