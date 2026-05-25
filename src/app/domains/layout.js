import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function DomainsLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/domains">{children}</ProtectedLayoutWrapper>;
}
