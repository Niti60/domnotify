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
            ? 'bg-black/5 text-slate-900 dark:bg-white/5 dark:text-white font-medium'
            : 'text-slate-600 hover:bg-black/3 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-white/3 dark:hover:text-slate-200'
        }`}
      >
        <span className={`flex h-5 w-5 flex-shrink-0 items-center justify-center rounded-md transition-all duration-200 ${
          active
            ? 'text-blue-600 dark:text-blue-400'
            : 'text-slate-400 group-hover:text-slate-600 dark:text-slate-500 dark:group-hover:text-slate-300'
        }`}>
          <Icon className="h-4 w-4" />
        </span>
        <span className="flex-1 text-sm font-medium leading-none">{label}</span>
      </motion.div>
    </Link>
  );
}
