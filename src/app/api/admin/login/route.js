import { connectDB } from '@/lib/db';
import User from '@/models/User';
import bcrypt from 'bcryptjs';
import { NextResponse } from 'next/server';
import { generateToken } from '@/lib/jwt';
import { serializeAuthUser } from '@/lib/serializers/user';

export async function POST(req) {
  try {
    await connectDB();

    const body = await req.json();
    const email = body.email?.toLowerCase().trim();
    const password = body.password;

    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'Admin email and password required' },
        { status: 400 }
      );
    }

    const user = await User.findOne({ email, isAdmin: true });

    if (!user) {
      console.warn(`[Admin Auth] Login failed: User not found or not admin (${email})`);
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      console.warn(`[Admin Auth] Login failed: Password mismatch (${email})`);
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    // Refresh last login timestamp
    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    const response = NextResponse.json(
      {
        success: true,
        message: 'Admin login successful',
        token,
        user: serializeAuthUser(user),
      },
      { status: 200 }
    );

    response.cookies.set({
      name: 'token',
      value: token,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    return response;
  } catch (error) {
    console.error('Admin Login Error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
