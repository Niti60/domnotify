'use client';

import { usePathname } from 'next/navigation';
import { ShieldAlert, Globe, BookmarkPlus, Eye, Wrench } from 'lucide-react';
import { SidebarItem } from '@/components/sidebar/SidebarItem';

const secondaryItems = [
  { href: '/ssl-monitor', label: 'SSL Monitor', icon: ShieldAlert },
  { href: '/whois-checker', label: 'WHOIS Checker', icon: Globe },
  { href: '/registrars', label: 'Registrars', icon: BookmarkPlus },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/power-tools', label: 'Power Tools', icon: Wrench },
];

function isActive(pathname: string, href: string) {
  return pathname.startsWith(href);
}

export function Sidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop Sidebar - Fixed, no collapse */}
      <aside className="fixed left-0 top-16 z-30 hidden h-[calc(100vh-64px)] w-72 flex-col overflow-y-auto border-r border-white/10 bg-(--surface)/50 backdrop-blur-sm transition-all duration-200 dark:bg-slate-950/30 lg:flex">
        <nav className="space-y-1 px-4 py-6">
          <div className="mb-6">
            <p className="px-3 text-xs font-semibold uppercase tracking-wider text-slate-500 dark:text-slate-400">Tools & Utilities</p>
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
