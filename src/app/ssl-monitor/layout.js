import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function SslMonitorLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/ssl-monitor">{children}</ProtectedLayoutWrapper>;
}
