export { middleware } from "@/middlewares/auth.middleware";

export const config = {
  matcher: [
    // Protected routes - require authentication
    '/dashboard/:path*',
    '/monitoring/:path*',
    '/watchlist/:path*',
    '/ssl-monitor/:path*',
    '/me/:path*',
    '/analytics/:path*',
    '/domains/:path*',
    '/registrars/:path*',
    '/tools/:path*',
    '/uptime-monitor/:path*',
    '/power-tools/:path*',
    '/whois/:path*',
    '/whois-checker/:path*',
    // Admin routes
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};