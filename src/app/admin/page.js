import { redirect } from 'next/navigation';
import { AdminLoginPanel } from '@/components/admin/AdminLoginPanel';
import { requireAuthServer } from '@/lib/auth';

function getSafeAdminNextPath(nextPath) {
  if (typeof nextPath !== 'string' || !nextPath.startsWith('/admin')) {
    return '/admin/dashboard';
  }

  return nextPath;
}

export default async function AdminEntryPage(props) {
  const searchParams = await props.searchParams;

  const auth = await requireAuthServer();
  const nextPath = getSafeAdminNextPath(searchParams?.next);

  if (auth.isAuthenticated && auth.user?.isAdmin) {
    redirect(nextPath);
  }

  if (auth.isAuthenticated && !auth.user?.isAdmin) {
    redirect('/dashboard');
  }

  return <AdminLoginPanel nextPath={nextPath} />;
}
