import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function RegistrarsLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/registrars">{children}</ProtectedLayoutWrapper>;
}
