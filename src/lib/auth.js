import jwt from 'jsonwebtoken';
import { NextResponse } from 'next/server';

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
