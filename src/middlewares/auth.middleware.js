import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";

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

/**
 * Authentication Middleware
 * 
 * Purpose: Block unauthenticated access to protected routes at the HTTP level,
 * BEFORE page HTML is sent to the client.
 * 
 * This prevents auth flickering by ensuring unauthenticated requests never
 * reach the browser.
 * 
 * Flow:
 * 1. Request to protected route
 * 2. Middleware intercepts before page loads
 * 3. Check for JWT token in cookies
 * 4. Verify token signature and expiration
 * 5. If invalid/missing → Redirect to /auth (HTTP 307)
 * 6. If valid → Allow request through (NextResponse.next())
 */
export async function middleware(req) {
  try {
    const token = req.cookies.get("token")?.value;
    const requestedPath = getRequestedPath(req);
    const pathname = req.nextUrl.pathname;

    if (isPublicAdminRoute(pathname)) {
      return NextResponse.next();
    }

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
        return NextResponse.redirect(adminUrl, {
          status: 307,
        });
      }

      try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        if (!decoded?.isAdmin) {
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
      } catch (tokenError) {
        if (isAdminApi(pathname)) {
          const errorResponse = NextResponse.json(
            { success: false, message: "Invalid token" },
            { status: 401 }
          );

          errorResponse.cookies.set({
            name: "token",
            value: "",
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "lax",
            maxAge: 0,
            path: "/",
          });

          return errorResponse;
        }

        const adminUrl = new URL("/admin", req.url);
        adminUrl.searchParams.set("next", requestedPath);

        const redirectResponse = NextResponse.redirect(adminUrl, {
          status: 307,
        });

        redirectResponse.cookies.set({
          name: "token",
          value: "",
          httpOnly: true,
          secure: process.env.NODE_ENV === "production",
          sameSite: "lax",
          maxAge: 0,
          path: "/",
        });

        return redirectResponse;
      }
    }

    // No token found in cookies
    if (!token) {
      const authUrl = new URL("/auth", req.url);
      authUrl.searchParams.set("next", requestedPath);
      return NextResponse.redirect(authUrl, {
        status: 307,
      });
    }

    // Token exists - verify it's valid (not expired, not corrupted)
    try {
      jwt.verify(token, process.env.JWT_SECRET);
      return NextResponse.next();
    } catch (tokenError) {
      // Token verification failed (expired, invalid signature, etc.)
      const authUrl = new URL("/auth", req.url);
      authUrl.searchParams.set("next", requestedPath);
      const redirectResponse = NextResponse.redirect(authUrl, { status: 307 });
      
      // Clear the invalid token from cookies
      redirectResponse.cookies.set({
        name: "token",
        value: "",
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: 0,
        path: "/",
      });
      
      return redirectResponse;
    }
  } catch (error) {
    console.error("[Middleware] Unexpected error:", error);
    // On unexpected errors, redirect to auth for safety
    return NextResponse.redirect(new URL("/auth", req.url), {
      status: 307,
    });
  }
}