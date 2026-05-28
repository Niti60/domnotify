import { NextResponse } from "next/server";
import { jwtVerify } from "jose";

// Read secret lazily at call time — avoids capturing undefined env at module init
function getSecret() {
  return new TextEncoder().encode(
    process.env.JWT_SECRET || "default_secret_please_change"
  );
}

async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getSecret());
    return payload;
  } catch {
    return null;
  }
}

function getRequestedPath(req) {
  return `${req.nextUrl.pathname}${req.nextUrl.search}`;
}

function isAdminPage(pathname) {
  return pathname === "/admin" || pathname.startsWith("/admin/");
}

function isAdminApi(pathname) {
  return pathname.startsWith("/api/admin/");
}

function isPublicAdminRoute(pathname) {
  return pathname === "/admin" || pathname === "/api/admin/login";
}

function clearTokenCookie(response) {
  response.cookies.set({
    name: "token",
    value: "",
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 0,
    path: "/",
  });
}

/**
 * Authentication Middleware
 *
 * Uses `jose` for Edge-compatible JWT verification.
 *
 * Flow:
 * 1. Request to protected route
 * 2. Middleware intercepts before page loads
 * 3. Extract JWT token from HttpOnly cookie
 * 4. Verify token signature and expiration via jose
 * 5. If invalid/missing → Redirect to /auth (HTTP 307)
 * 6. If valid → Allow request through (NextResponse.next())
 */
export async function middleware(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const requestedPath = getRequestedPath(req);
    const pathname = req.nextUrl.pathname;

    // ── Admin public routes (login page / login API) ──────────────────────
    if (isPublicAdminRoute(pathname)) {
      return NextResponse.next();
    }

    // ── Admin pages & admin API ───────────────────────────────────────────
    if (isAdminPage(pathname) || isAdminApi(pathname)) {
      if (!token) {
        if (isAdminApi(pathname)) {
          return NextResponse.json(
            { success: false, message: "Admin access required" },
            { status: 401 }
          );
        }
        const adminUrl = new URL("/admin", req.url);
        adminUrl.searchParams.set("next", requestedPath);
        return NextResponse.redirect(adminUrl, { status: 307 });
      }

      const decoded = await verifyToken(token);

      if (!decoded) {
        // Token invalid or expired
        if (isAdminApi(pathname)) {
          const res = NextResponse.json(
            { success: false, message: "Invalid token" },
            { status: 401 }
          );
          clearTokenCookie(res);
          return res;
        }
        const adminUrl = new URL("/admin", req.url);
        adminUrl.searchParams.set("next", requestedPath);
        const res = NextResponse.redirect(adminUrl, { status: 307 });
        clearTokenCookie(res);
        return res;
      }

      if (!decoded.isAdmin) {
        if (isAdminApi(pathname)) {
          return NextResponse.json(
            { success: false, message: "Admin access required" },
            { status: 403 }
          );
        }
        return NextResponse.redirect(new URL("/dashboard", req.url), {
          status: 307,
        });
      }

      return NextResponse.next();
    }

    // ── Regular protected routes ──────────────────────────────────────────

    // No token found
    if (!token) {
      const authUrl = new URL("/auth", req.url);
      authUrl.searchParams.set("next", requestedPath);
      authUrl.searchParams.set("reason", "unauthorized");
      return NextResponse.redirect(authUrl, { status: 307 });
    }

    // Token exists — verify it
    const decoded = await verifyToken(token);

    if (!decoded) {
      // Token is expired or corrupted
      const authUrl = new URL("/auth", req.url);
      authUrl.searchParams.set("next", requestedPath);
      authUrl.searchParams.set("reason", "expired");
      const res = NextResponse.redirect(authUrl, { status: 307 });
      clearTokenCookie(res);
      return res;
    }

    return NextResponse.next();
  } catch (error) {
    console.error("[Middleware] Unexpected error:", error);
    return NextResponse.redirect(new URL("/auth", req.url), { status: 307 });
  }
}