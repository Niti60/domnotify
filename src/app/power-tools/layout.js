import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function PowerToolsLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/power-tools">{children}</ProtectedLayoutWrapper>;
}
