import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function DashboardLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/dashboard">{children}</ProtectedLayoutWrapper>;
}
