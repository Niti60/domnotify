'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarItem } from '@/components/sidebar/SidebarItem';
import { SidebarFooter } from '@/components/sidebar/SidebarFooter';
import { X } from 'lucide-react';
import { isActive as isPrimaryActive } from '@/lib/navItems';
import { LayoutDashboard, Search, Activity, ShieldAlert, Globe, Building, Eye, DollarSign } from 'lucide-react';

const primaryItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/search-domain', label: 'Search Domain', icon: Search },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

const secondaryItems = [
  { href: '/ssl-monitor', label: 'SSL Monitor', icon: ShieldAlert },
  { href: '/whois-checker', label: 'WHOIS Checker', icon: Globe },
  { href: '/registrars', label: 'Registrars', icon: Building },
];

function isActive(pathname: string, href: string) {
  if (href === '/dashboard' && pathname === '/') return true;
  return pathname.startsWith(href);
}

interface MobileSidebarProps {
  open: boolean;
  onClose: () => void;
}

export function MobileSidebar({ open, onClose }: MobileSidebarProps) {
  const pathname = usePathname();

  useEffect(() => {
    const originalOverflow = document.body.style.overflow;
    if (open) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = originalOverflow || '';
    }
    return () => {
      document.body.style.overflow = originalOverflow || '';
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            transition={{ duration: 0.2, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="fixed left-0 top-0 z-50 flex h-screen w-[78%] max-w-[280px] flex-col overflow-y-auto border-r border-border bg-background p-4 lg:hidden"
          >
            <div className="flex items-center justify-between gap-4 border-b border-border pb-4">
              <p className="text-sm font-semibold text-foreground">DomNotify</p>
              <button
                type="button"
                onClick={onClose}
                className="rounded-lg p-2 text-muted-foreground transition-colors duration-200 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {primaryItems.map((item) => (
                <SidebarItem
                  key={item.href}
                  href={item.href}
                  label={item.label}
                  icon={item.icon}
                  active={isPrimaryActive(pathname, item.href)}
                  onClick={onClose}
                />
              ))}

              <div className="mt-4">
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Utilities
                </p>
                <div className="mt-2 space-y-2">
                  {secondaryItems.map((item) => (
                    <SidebarItem
                      key={item.href}
                      href={item.href}
                      label={item.label}
                      icon={item.icon}
                      active={isActive(pathname, item.href)}
                      onClick={onClose}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-auto">
                <SidebarFooter onClose={onClose} />
              </div>
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
