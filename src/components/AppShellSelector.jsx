'use client';

import { usePathname } from 'next/navigation';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';

export function AppShellSelector({ children }) {
  const pathname = usePathname();

  // For auth and wait routes we don't want the main app shell (sidebar/navbar)
  if (pathname && (pathname.startsWith('/auth') || pathname === '/wait')) {
    return <>{children}</>;
  }

  return <LayoutWrapper>{children}</LayoutWrapper>;
}

export default AppShellSelector;
