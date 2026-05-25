import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function WhoisLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/whois">{children}</ProtectedLayoutWrapper>;
}
