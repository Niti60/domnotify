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
      {/* Desktop Sidebar - Fixed, no collapse */}
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-72 flex-col overflow-y-auto border-r border-zinc-200 bg-white/95 transition-all duration-200 dark:bg-zinc-950 dark:border-zinc-800 lg:flex">
        <nav className="space-y-1 px-4 py-6">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Utilities</p>
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

      {/* Spacer for desktop layout */}
      <div className="hidden lg:block w-72" />
    </>
  );
}
