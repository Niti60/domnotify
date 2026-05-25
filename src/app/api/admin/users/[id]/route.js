import { connectDB } from "@/lib/db";
import User from "@/models/User";
import Domain from "@/models/Domain";
import { NextResponse } from "next/server";
import { adminGuard, adminUnauthorized } from "@/middlewares/admin.middleware";
import bcryptjs from "bcryptjs";
import { serializeAuthUser } from "@/lib/serializers/user";

/**
 * GET /api/admin/users/[id]
 * Get single user details
 */
export async function GET(req, { params }) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    const { id } = params;

    await connectDB();

    const user = await User.findById(id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Get additional stats
    const watchlistCount = await Domain.countDocuments({
      user: user._id,
      watchlist: true,
    });

    const totalDomains = await Domain.countDocuments({
      user: user._id,
    });

    return NextResponse.json(
      {
        success: true,
        user: {
          ...serializeAuthUser(user),
          watchlistCount,
          totalDomains,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Get User Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * PATCH /api/admin/users/[id]
 * Update user (name, email, role, premium status, etc.)
 */
export async function PATCH(req, { params }) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    const { id } = params;
    const {
      name,
      email,
      password,
      role,
      companyName,
      isPremiumUser,
      premiumPlanType,
      isAdmin,
    } = await req.json();

    await connectDB();

    const user = await User.findById(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Update fields
    if (name !== undefined) user.name = name;
    if (email !== undefined) user.email = email.toLowerCase();
    if (password !== undefined) {
      const salt = await bcryptjs.genSalt(10);
      user.password = await bcryptjs.hash(password, salt);
    }
    if (role !== undefined) user.role = role;
    if (companyName !== undefined) user.companyName = companyName;
    if (isPremiumUser !== undefined) user.isPremiumUser = isPremiumUser;
    if (premiumPlanType !== undefined) user.premiumPlanType = premiumPlanType;
    if (isAdmin !== undefined) user.isAdmin = isAdmin;

    await user.save();

    return NextResponse.json(
      {
        success: true,
        message: "User updated successfully",
        user: serializeAuthUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Update User Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}

/**
 * DELETE /api/admin/users/[id]
 * Delete a user (admin only)
 */
export async function DELETE(req, { params }) {
  // Admin guard
  const auth = await adminGuard(req);
  if (!auth.isAuthorized) {
    return adminUnauthorized();
  }

  try {
    const { id } = params;

    await connectDB();

    // Prevent self-deletion
    if (auth.user._id.toString() === id.toString()) {
      return NextResponse.json(
        { success: false, message: "Cannot delete your own account" },
        { status: 400 }
      );
    }

    const user = await User.findByIdAndDelete(id);

    if (!user) {
      return NextResponse.json(
        { success: false, message: "User not found" },
        { status: 404 }
      );
    }

    // Delete user's domains and all associated data
    await Domain.deleteMany({ user: id });

    return NextResponse.json(
      { success: true, message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("Admin Delete User Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
