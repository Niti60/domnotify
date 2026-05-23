export { middleware } from "@/middlewares/auth.middleware";

export const config = {
  matcher: [
    "/dashboard/:path*",
    "/monitoring/:path*",
    "/watchlist/:path*",
    "/ssl-monitor/:path*",
  ],
};