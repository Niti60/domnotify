'use client';

import Link from 'next/link';
import { motion } from 'framer-motion';
import type { LucideIcon } from 'lucide-react';

interface SidebarItemProps {
  href: string;
  label: string;
  icon: LucideIcon;
  active?: boolean;
  onClick?: () => void;
}

export function SidebarItem({ href, label, icon: Icon, active = false, onClick }: SidebarItemProps) {
  return (
    <Link href={href} onClick={onClick}>
      <motion.div
        whileHover={{ x: 4 }}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all duration-200 ${
          active
            ? 'bg-zinc-100 text-zinc-900 dark:bg-white/5 dark:text-white dark:border dark:border-white/10 font-medium'
            : 'text-zinc-600 hover:bg-zinc-100 dark:text-zinc-400 dark:hover:bg-white/5'
        }`}
      >
        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all duration-200 ${
          active
            ? 'text-zinc-900 dark:text-white'
            : 'text-zinc-400 group-hover:text-zinc-600 dark:text-zinc-500 dark:group-hover:text-zinc-300'
        }`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1 text-sm font-medium leading-none">{label}</span>
      </motion.div>
    </Link>
  );
}
