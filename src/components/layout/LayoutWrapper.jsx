'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from '@/components/sidebar/Sidebar';
import { Navbar } from '@/components/navbar/Navbar';
import { MobileSidebar } from '@/components/layout/MobileSidebar';

/**
 * LayoutWrapper
 * 
 * Manages layout rendering based on route and auth state.
 * For protected routes, waits for auth verification before rendering sidebar/navbar.
 * This prevents layout flashing for unauthenticated users.
 */
export function LayoutWrapper({ children }) {
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const pathname = usePathname();

  const isAuthPage = pathname?.startsWith('/auth');
  const isAdminRoute = pathname?.startsWith('/admin');

  if (isAuthPage || isAdminRoute) {
    return (
      <div className="min-h-screen bg-background text-foreground">
        {children}
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Navbar onMenuClick={() => setMobileNavOpen(true)} />
      <Sidebar />
      <MobileSidebar open={mobileNavOpen} onClose={() => setMobileNavOpen(false)} />
      <main className="pt-16 lg:pl-72">
        <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">{children}</div>
      </main>
    </div>
  );
}
