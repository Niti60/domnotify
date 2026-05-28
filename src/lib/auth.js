import jwt from 'jsonwebtoken';
import mongoose from 'mongoose';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { connectDB } from '@/lib/db';
import User from '@/models/User';
import { serializeAuthUser } from '@/lib/serializers/user';
import { verifyToken } from '@/lib/jwt';

// ─── ID safety helper ─────────────────────────────────────────────────────────
// Old tokens stored raw BSON objects in the payload.
// This coerces decoded.id to a plain string and validates it before any DB call.
function safeId(rawId) {
  if (!rawId) return null;
  const str = typeof rawId === 'string' ? rawId : rawId.toString?.() ?? '';
  return mongoose.Types.ObjectId.isValid(str) ? str : null;
}

// ─── Sync helper for Node.js API route handlers only ─────────────────────────
// jsonwebtoken works fine in Node.js (not Edge). Standard JWTs from both
// jsonwebtoken and jose are compatible — same HS256 encoding.
export function getTokenFromRequest(req) {
  return req.cookies.get('token')?.value;
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
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = safeId(decoded.id);

    if (!userId) {
      console.error('[auth.js] requireAuth: invalid id in token payload:', decoded.id);
      return {
        error: NextResponse.json(
          { success: false, message: 'Invalid token payload' },
          { status: 401 },
        ),
      };
    }

    return { userId };
  } catch {
    return {
      error: NextResponse.json(
        { success: false, message: 'Invalid token' },
        { status: 401 },
      ),
    };
  }
}

// ─── Async helpers for Server Components & layouts ────────────────────────────
// Uses the shared jose-based verifyToken (from jwt.js) which:
//   1. Verifies signature & expiry via jose (Edge-safe)
//   2. Coerces / validates decoded.id to a clean ObjectId string
//   3. Returns null instead of throwing on any failure
export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('token')?.value;

    if (!token) return null;

    const decoded = await verifyToken(token);   // returns null on any failure

    if (!decoded) {
      // Token is expired, invalid signature, or has a corrupted payload
      return null;
    }

    // decoded.id is already a validated string thanks to verifyToken
    await connectDB();

    const user = await User.findById(decoded.id).select('-password').lean();

    if (!user) {
      console.error('[auth.js] getCurrentUser: user not found for id:', decoded.id);
      return null;
    }

    return serializeAuthUser(user);
  } catch (err) {
    console.error('[auth.js] getCurrentUser unexpected error:', err);
    return null;
  }
}

export async function requireAuthServer() {
  const user = await getCurrentUser();
  if (!user) return { user: null, isAuthenticated: false, isAdmin: false };
  return { user, isAuthenticated: true, isAdmin: Boolean(user.isAdmin) };
}

export async function requireAdminServer() {
  const auth = await requireAuthServer();
  if (!auth.isAuthenticated || !auth.isAdmin) return { ...auth, isAdmin: false };
  return auth;
}
