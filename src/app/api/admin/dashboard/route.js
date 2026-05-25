import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Domain from "@/models/Domain";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";

/**
 * GET /api/admin/dashboard
 * Get admin dashboard statistics
 */
export async function GET(req) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    await connectDB();

    // Get total platform users (excluding admins)
    const totalUsers = await User.countDocuments({ isAdmin: { $ne: true } });

    // Get premium users count (excluding admins)
    const premiumUsers = await User.countDocuments({ isPremiumUser: true, isAdmin: { $ne: true } });

    // Get active users (those with lastLogin in last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const activeUsers = await User.countDocuments({
      lastLogin: { $gte: thirtyDaysAgo },
      isAdmin: { $ne: true },
    });

    // Get total domains
    const totalDomains = await Domain.countDocuments();

    // Get watchlist domains
    const watchlistDomains = await Domain.countDocuments({ watchlist: true });

    // Get expiring domains (within 30 days)
    const expiringDomains = await Domain.countDocuments({
      expiryDate: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
    });

    // Get SSL expiring soon (within 30 days)
    const expiringSsl = await Domain.countDocuments({
      sslValidTo: {
        $gte: new Date(),
        $lte: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      },
      sslStatus: { $ne: "Expired" },
    });

    // Get premium breakdown
    const premiumBreakdown = await User.aggregate([
      { $match: { isPremiumUser: true, isAdmin: { $ne: true } } },
      {
        $group: {
          _id: "$premiumPlanType",
          count: { $sum: 1 },
        },
      },
    ]);

    // Get new users this month
    const firstDayOfMonth = new Date();
    firstDayOfMonth.setDate(1);
    firstDayOfMonth.setHours(0, 0, 0, 0);

    const newUsersThisMonth = await User.countDocuments({
      createdAt: { $gte: firstDayOfMonth },
      isAdmin: { $ne: true },
    });

    return NextResponse.json(
      {
        success: true,
        stats: {
          totalUsers,
          premiumUsers,
          activeUsers,
          newUsersThisMonth,
          totalDomains,
          watchlistDomains,
          expiringDomains,
          expiringSsl,
          premiumBreakdown,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Dashboard Stats Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
