import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

export async function middleware(req) {
  try {
    const token = req.cookies.get("token")?.value;

    // No token
    if (!token) {
      return NextResponse.redirect(
        new URL("/auth", req.url)
      );
    }

    // Verify token
    jwt.verify(token, process.env.JWT_SECRET);

    return NextResponse.next();
  } catch (error) {
    return NextResponse.redirect(
      new URL("/auth", req.url)
    );
  }
}