'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/monitoring', label: 'Monitoring' },
  { href: '/search-domain', label: 'Search Domain' },
  { href: '/pricing', label: 'Pricing' },
];

export function Navbar({ onMenuClick }) {
  const pathname = usePathname();

  const isActive = (href) => {
    if (href === '/dashboard' && pathname === '/') return true;
    return pathname.startsWith(href);
  };

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/10 bg-(--background)/80 backdrop-blur-xl transition-all duration-200">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        {/* Logo */}
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-slate-700 transition-all hover:bg-white/5 dark:text-slate-300 dark:hover:bg-white/5 md:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-slate-900 text-white font-semibold text-sm dark:bg-white dark:text-slate-950">
              D
            </div>
            <div className="hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white">DomNotify</p>
            </div>
          </div>
        </div>

        {/* Primary Navigation - Desktop Only */}
        <nav className="hidden lg:flex items-center gap-1">
          {navItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <motion.div
                whileHover={{ y: -2 }}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive(item.href)
                    ? 'text-slate-900 dark:text-white'
                    : 'text-slate-600 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white'
                }`}
              >
                {item.label}
              </motion.div>
            </Link>
          ))}
        </nav>

        {/* Right side - Search & Theme */}
        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <SearchBar placeholder="Search..." />
          </div>
          <ThemeToggle />
        </div>
      </div>
    </header>
  );
}
