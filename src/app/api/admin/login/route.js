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
      console.error('[Admin Login] Missing credentials - email or password');
      return NextResponse.json(
        { success: false, message: 'Admin email and password required' },
        { status: 400 }
      );
    }

    console.log(`[Admin Login] Attempting login for email: ${email}`);

    // Query for ANY user matching email (not just admin), for debugging
    const user = await User.findOne({ email });

    if (!user) {
      console.error(`[Admin Login] User not found for email: ${email}`);
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    console.log(`[Admin Login] User found: ${user._id}, isAdmin=${user.isAdmin}, email=${user.email}`);

    if (!user.isAdmin) {
      console.error(`[Admin Login] User ${user._id} is not an admin. isAdmin=${user.isAdmin}`);
      return NextResponse.json(
        { success: false, message: 'Admin access required' },
        { status: 403 }
      );
    }

    // Verify password with detailed logging
    console.log(`[Admin Login] Comparing password for user ${user._id}`);
    console.log(`[Admin Login] Password hash exists: ${Boolean(user.password)}`);
    console.log(`[Admin Login] Entered password length: ${password.length}`);
    console.log(`[Admin Login] Stored hash length: ${user.password?.length || 0}`);

    let isMatch = false;
    try {
      isMatch = await bcrypt.compare(password, user.password);
      console.log(`[Admin Login] Password comparison result: ${isMatch}`);
    } catch (bcryptError) {
      console.error(`[Admin Login] bcrypt.compare() error:`, bcryptError.message);
      return NextResponse.json(
        { success: false, message: 'Authentication error' },
        { status: 500 }
      );
    }

    if (!isMatch) {
      console.error(`[Admin Login] Password mismatch for user ${user._id}`);
      return NextResponse.json(
        { success: false, message: 'Invalid admin credentials' },
        { status: 401 }
      );
    }

    console.log(`[Admin Login] Authentication successful for ${user.email}`);

    user.lastLogin = new Date();
    await user.save();

    const token = generateToken(user);

    console.log(`[Admin Login] JWT token generated for ${user._id}`);

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
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    });

    console.log(`[Admin Login] Login completed, redirecting to admin dashboard`);

    return response;
  } catch (error) {
    console.error('[Admin Login] Unexpected error:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
