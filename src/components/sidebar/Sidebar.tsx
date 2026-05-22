'use client';

import { usePathname } from 'next/navigation';
import { ShieldAlert, Globe, Building, Eye } from 'lucide-react';
import { SidebarItem } from '@/components/sidebar/SidebarItem';

const secondaryItems = [
  { href: '/ssl-monitor', label: 'SSL Monitor', icon: ShieldAlert },
  { href: '/whois-checker', label: 'WHOIS Checker', icon: Globe },
  { href: '/registrars', label: 'Registrars', icon: Building },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
];

function isActive(pathname: string, href: string) {
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-4rem)] w-72 flex-col overflow-y-auto border-r border-border bg-background transition-colors duration-200 lg:flex">
        <nav className="space-y-1 px-4 py-6">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Utilities
            </p>
          </div>
          {secondaryItems.map((item) => (
            <SidebarItem
              key={item.href}
              href={item.href}
              label={item.label}
              icon={item.icon}
              active={isActive(pathname, item.href)}
            />
          ))}
        </nav>
      </aside>
      <div className="hidden w-72 lg:block" />
    </>
  );
}
