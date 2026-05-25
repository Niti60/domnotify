import { redirect } from 'next/navigation';
import { requireAuthServer, requireAdminServer } from '@/lib/auth';

export async function ProtectedLayoutWrapper({ children, pathname, adminOnly = false }) {
  const auth = adminOnly ? await requireAdminServer() : await requireAuthServer();

  if (!auth.isAuthenticated) {
    redirect(`/auth?next=${encodeURIComponent(pathname || '/dashboard')}`);
  }

  if (adminOnly && !auth.isAdmin) {
    redirect('/dashboard');
  }

  return children;
}
