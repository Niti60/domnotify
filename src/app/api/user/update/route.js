import { connectDB } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function PATCH(req) {
    try {
        const token = req.cookies.get("token")?.value;

        if (!token) {
            return NextResponse.json(
                { success: false, message: "Not authenticated" },
                { status: 401 }
            );
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return NextResponse.json(
                { success: false, message: "Invalid token" },
                { status: 401 }
            );
        }

        await connectDB();

        const body = await req.json();
        const { name, role, companyName, profilePic } = body;

        // Validation
        if (!name || !role) {
            return NextResponse.json(
                { success: false, message: "Name and role are required" },
                { status: 400 }
            );
        }

        const validRoles = ["student", "developer", "entrepreneur", "company"];
        if (!validRoles.includes(role)) {
            return NextResponse.json(
                { success: false, message: "Invalid role" },
                { status: 400 }
            );
        }

        if (["entrepreneur", "company"].includes(role) && !companyName) {
            return NextResponse.json(
                { success: false, message: "Company name is required for your role" },
                { status: 400 }
            );
        }

        const updatedUser = await User.findByIdAndUpdate(
            decoded.id,
            {
                name,
                role,
                companyName: ["entrepreneur", "company"].includes(role) ? companyName : null,
                profilePic: profilePic || undefined,
            },
            { new: true, runValidators: true }
        ).select("-password");

        if (!updatedUser) {
            return NextResponse.json(
                { success: false, message: "User not found" },
                { status: 404 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: "Profile updated successfully",
                user: updatedUser,
            },
            { status: 200 }
        );
    } catch (error) {
        console.error("User Update Error:", error);
        return NextResponse.json(
            { success: false, message: "Internal server error" },
            { status: 500 }
        );
    }
}
