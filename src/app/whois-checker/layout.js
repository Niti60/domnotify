import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function WhoisCheckerLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/whois-checker">{children}</ProtectedLayoutWrapper>;
}
