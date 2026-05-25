import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function MeLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/me">{children}</ProtectedLayoutWrapper>;
}
