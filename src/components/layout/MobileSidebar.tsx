'use client';

import { AnimatePresence, motion } from 'framer-motion';
import { usePathname } from 'next/navigation';
import { SidebarItem } from '@/components/sidebar/SidebarItem';
import { SidebarFooter } from '@/components/sidebar/SidebarFooter';
import { X, LayoutDashboard, Globe, Activity, Eye, BarChart3, DollarSign } from 'lucide-react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/domains', label: 'Domains', icon: Globe },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/analytics', label: 'Analytics', icon: BarChart3 },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
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

  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 z-40 bg-slate-950/50"
          />
          <motion.aside
            initial={{ x: '-100%' }}
            animate={{ x: 0 }}
            exit={{ x: '-100%' }}
            className="fixed left-0 top-0 z-50 flex h-screen w-80 flex-col overflow-y-auto border-r border-white/10 bg-slate-950/95 p-4 backdrop-blur-xl shadow-2xl shadow-slate-950/30"
          >
            <div className="flex items-center justify-between gap-4 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-linear-to-br from-blue-600 to-violet-600 text-white font-bold">
                  D
                </div>
                <div>
                  <p className="text-sm font-semibold text-white">DomNotify</p>
                  <p className="text-xs text-slate-400">Modern domain ops</p>
                </div>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="rounded-2xl p-2 text-slate-300 transition-all duration-200 hover:bg-white/5"
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
                  active={isActive(pathname, item.href)}
                  onClick={onClose}
                />
              ))}
            </div>

            <div className="mt-auto">
              <SidebarFooter onClose={onClose} />
            </div>
          </motion.aside>
        </>
      )}
    </AnimatePresence>
  );
}
