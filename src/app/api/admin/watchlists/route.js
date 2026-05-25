import { connectDB } from "@/lib/db";
import Domain from "@/models/Domain";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * GET /api/admin/watchlists
 * Get all watchlists across all users
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

    // Get all watchlist domains with user info
    const total = await Domain.countDocuments({ watchlist: true });

    const watchlists = await Domain.find({ watchlist: true })
      .populate("user", "name email role isPremiumUser premiumPlanType isAdmin isVerified createdAt updatedAt lastLogin companyName authProvider")
      .select(
        "domainName user status expiryDate sslStatus sslValidTo lastChecked createdAt"
      )
      .sort({ lastChecked: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Group by user for better stats
    const grouped = {};
    watchlists.forEach((domain) => {
      const userId = domain.user._id;
      if (!grouped[userId]) {
        grouped[userId] = {
          user: serializeAuthUser(domain.user),
          domains: [],
        };
      }
      grouped[userId].domains.push(domain);
    });

    const watchlistStats = Object.values(grouped).map((group) => ({
      user: group.user,
      domainCount: group.domains.length,
      domains: group.domains,
    }));

    return NextResponse.json(
      {
        success: true,
        data: watchlistStats,
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
    console.error("Admin Get Watchlists Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
