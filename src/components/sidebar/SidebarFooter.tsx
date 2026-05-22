'use client';

import Link from 'next/link';
import { Settings } from 'lucide-react';
import { ThemeToggle } from '@/components/theme/ThemeToggle';

interface SidebarFooterProps {
  collapsed?: boolean;
  onClose?: () => void;
}

export function SidebarFooter({ collapsed = false, onClose }: SidebarFooterProps) {
  return (
    <div className="border-t border-slate-200/10 px-4 py-5 dark:border-white/10">
      <Link href="/settings" onClick={onClose}>
        <div className="group flex items-center gap-3 rounded-2xl px-3 py-3 text-slate-700 transition-all duration-200 hover:bg-white/5 dark:text-slate-300 dark:hover:bg-white/5">
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </div>
      </Link>
      {!collapsed && <p className="mt-4 text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Theme</p>}
      <div className={collapsed ? 'mt-3 px-3' : 'mt-4'}>
        <ThemeToggle />
      </div>
    </div>
  );
}
