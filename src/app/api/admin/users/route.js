import { connectDB } from "@/lib/db";
import User from "@/models/User";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";
import Domain from "@/models/Domain";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * GET /api/admin/users
 * List all users with pagination and filtering
 * Query params: page, limit, search, filterPremium, filterRole
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
    const search = searchParams.get("search") || "";
    const filterPremium = searchParams.get("filterPremium");
    const filterRole = searchParams.get("filterRole");

    // Build filter query - Exclude internal admins from customer table
    const filter = { isAdmin: { $ne: true } };

    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { email: { $regex: search, $options: "i" } },
      ];
    }

    if (filterPremium === "true") {
      filter.isPremiumUser = true;
    } else if (filterPremium === "false") {
      filter.isPremiumUser = false;
    }

    if (filterRole) {
      filter.role = filterRole;
    }

    const total = await User.countDocuments(filter);
    const users = await User.find(filter)
      .select("-password")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Get watchlist count for each user
    const usersWithStats = await Promise.all(
      users.map(async (user) => {
        const watchlistCount = await Domain.countDocuments({
          user: user._id,
          watchlist: true,
        });
        return {
          ...serializeAuthUser(user),
          watchlistCount,
        };
      })
    );

    return NextResponse.json(
      {
        success: true,
        data: usersWithStats,
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
    console.error("Admin Get Users Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * POST /api/admin/users
 * Create a new user (admin only)
 */
export async function POST(req) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    const { name, email, password, role, companyName } = await req.json();

    if (!name || !email || !password || !role) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 }
      );
    }

    await connectDB();

    // Check if user exists
    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 409 }
      );
    }

    const newUser = new User({
      name,
      email: email.toLowerCase(),
      password,
      role,
      companyName: companyName || null,
      isVerified: true,
      isPremiumUser: false,
      premiumPlanType: null,
      isAdmin: false,
    });

    await newUser.save();

    return NextResponse.json(
      {
        success: true,
        message: "User created successfully",
        user: serializeAuthUser(newUser),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error("Admin Create User Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
