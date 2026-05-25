import { ProtectedLayoutWrapper } from '@/components/layout/ProtectedLayoutWrapper';

export default async function WatchlistLayout({ children }) {
  return <ProtectedLayoutWrapper pathname="/watchlist">{children}</ProtectedLayoutWrapper>;
}
