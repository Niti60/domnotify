"use client";

import { usePathname } from "next/navigation";
import { AdminLayout as AdminShell } from "@/components/admin/AdminLayout";

export default function AdminRouteLayout({ children }) {
  const pathname = usePathname();

  if (pathname === "/admin") {
    return children;
  }

  return <AdminShell>{children}</AdminShell>;
}
