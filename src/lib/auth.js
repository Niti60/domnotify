import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { serializeAuthUser } from '@/lib/serializers/user';

export function getTokenFromRequest(req) {
  return req.cookies.get('token')?.value;
}

export function verifyToken(token) {
  return jwt.verify(token, process.env.JWT_SECRET);
}

export function requireAuth(req) {
  const token = getTokenFromRequest(req);

  if (!token) {
    return {
      error: NextResponse.json(
        { success: false, message: 'Not authenticated' },
        { status: 401 },
      ),
    };
  }

  try {
    const decoded = verifyToken(token);
    return { userId: decoded.id };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      ),
    };
  }
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) {
      return null;
    }

    const decoded = verifyToken(token);

    await connectDB();

    const user = await User.findById(decoded.id).select('-password').lean();
    return serializeAuthUser(user);
  } catch {
    return null;
  }
}

export async function requireAuthServer() {
  const user = await getCurrentUser();

  if (!user) {
    return { user: null, isAuthenticated: false, isAdmin: false };
  }

  return {
    user,
    isAuthenticated: true,
    isAdmin: Boolean(user.isAdmin),
  };
}

export async function requireAdminServer() {
  const auth = await requireAuthServer();

  if (!auth.isAuthenticated || !auth.isAdmin) {
    return { ...auth, isAdmin: false };
  }

  return auth;
}
