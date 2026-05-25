import { AdminLayout as AdminLayoutUI } from "@/components/admin/AdminLayout";
import { requireAdminServer } from "@/lib/auth";

export default async function AdminLayout({ children }) {
  const auth = await requireAdminServer();

  // If authenticated as admin, wrap in the admin UI with sidebar
  if (auth.isAuthenticated && auth.isAdmin) {
    return <AdminLayoutUI>{children}</AdminLayoutUI>;
  }

  // Otherwise (e.g. login page), just return children
  return <>{children}</>;
}
