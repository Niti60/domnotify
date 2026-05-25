import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function ToolsLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/tools">{children}</ProtectedLayoutWrapper>;
}
