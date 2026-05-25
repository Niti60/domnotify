import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function AnalyticsLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/analytics">{children}</ProtectedLayoutWrapper>;
}
