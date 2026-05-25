import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function MonitoringLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/monitoring">{children}</ProtectedLayoutWrapper>;
}
