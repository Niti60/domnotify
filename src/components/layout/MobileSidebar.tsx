 'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { useEffect } from 'react';
import { SidebarItem } from '@/components/sidebar/SidebarItem';
import { SidebarFooter } from '@/components/sidebar/SidebarFooter';
import { X } from 'lucide-react';
import { navItems, isActive as isPrimaryActive } from '@/lib/navItems';
import { ShieldAlert, Globe, Building, Eye } from 'lucide-react';

const secondaryItems = [
  { href: '/ssl-monitor', label: 'SSL Monitor', icon: ShieldAlert },
  { href: '/whois-checker', label: 'WHOIS Checker', icon: Globe },
  { href: '/registrars', label: 'Registrars', icon: Building },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
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
            transition={{ duration: 0.24 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-black/40 backdrop-blur-sm"
          />
          <motion.aside
            initial={{ x: '-100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '-100%', opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            role="dialog"
            aria-modal="true"
            className="fixed left-0 top-0 z-50 flex h-screen w-[78%] max-w-[280px] flex-col overflow-y-auto border-r border-slate-200/10 bg-white/95 p-4 dark:border-zinc-800 dark:bg-zinc-950/95 shadow-2xl"
          >
            <div className="flex items-center justify-between gap-4 border-b border-slate-200/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-slate-900 text-white font-bold dark:bg-white dark:text-slate-950">
                  D
                </div>
                <div>
                  <p className="text-sm font-semibold text-zinc-900 dark:text-white">DomNotify</p>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400">Domain operations on mobile</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-zinc-700 transition hover:bg-zinc-100 dark:text-zinc-200 dark:hover:bg-white/5"
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            <div className="mt-6 space-y-2">
              {navItems.map((item) => (
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
                <p className="px-3 text-xs font-semibold uppercase tracking-wider text-zinc-600 dark:text-zinc-400">Utilities</p>
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
