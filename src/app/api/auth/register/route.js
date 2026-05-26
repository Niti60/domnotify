import { connectDB } from "@/lib/db";
import User from "@/models/User";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import { generateToken } from "@/lib/jwt";
import { serializeAuthUser } from "@/lib/serializers/user";

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();

    const {
      name,
      email,
      password,
      confirmPassword,
      role,
      companyName,
    } = body;

    // Validation
    if (!name || !email || !password || !confirmPassword || !role) {
      return NextResponse.json(
        { success: false, message: "All fields are required" },
        { status: 400 }
      );
    }

    // Password match
    if (password !== confirmPassword) {
      return NextResponse.json(
        { success: false, message: "Passwords do not match" },
        { status: 400 }
      );
    }

    // Company validation
    if ((role === "entrepreneur" || role === "company") && !companyName) {
      return NextResponse.json(
        { success: false, message: "Company name is required" },
        { status: 400 }
      );
    }

    // Existing user
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return NextResponse.json(
        { success: false, message: "User already exists" },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role,
      companyName: ["entrepreneur", "company"].includes(role) ? companyName : null,
    });

    // AUTO LOGIN: Generate token and set cookie
    const token = generateToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: "Registration successful",
        token,
        user: serializeAuthUser(user),
      },
      { status: 201 }
    );

    response.cookies.set({
      name: "token",
      value: token,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Register Error:", error);
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 }
    );
  }
}
