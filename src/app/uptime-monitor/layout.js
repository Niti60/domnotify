import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function UptimeMonitorLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/uptime-monitor">{children}</ProtectedLayoutWrapper>;
}
