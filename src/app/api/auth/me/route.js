import { connectDB } from "@/lib/db";
import User from "@/models/User";
import mongoose from "mongoose";
import { NextResponse } from "next/server";
import { serializeAuthUser } from "@/lib/serializers/user";
import { verifyToken } from "@/lib/jwt";

export async function GET(req) {
  try {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Not authenticated" },
        { status: 401 }
      );
    }

    // Use the shared jose verifyToken — validates signature, expiry, and id format
    const decoded = await verifyToken(token);

    if (!decoded) {
      // Clear the stale / corrupted cookie so the browser doesn't keep sending it
      const res = NextResponse.json(
        { success: false, message: "Invalid or expired token" },
        { status: 401 }
      );
      res.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      return res;
    }

    // decoded.id is already a validated ObjectId string (coerced by verifyToken)
    await connectDB();

    const user = await User.findById(decoded.id).select("-password").lean();

    if (!user) {
      return NextResponse.json(
        { success: false, message: "Account not found." },
        { status: 404 }
      );
    }

    return NextResponse.json(
      { success: true, user: serializeAuthUser(user) },
      { status: 200 }
    );
  } catch (error) {
    console.error("Auth /me Error:", error);
    return NextResponse.json(
      { success: false, message: "Something went wrong. Please try again." },
      { status: 500 }
    );
  }
}
