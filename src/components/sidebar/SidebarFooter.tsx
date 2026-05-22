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
    <div className="border-t border-border px-4 py-5">
      <Link href="/settings" onClick={onClose}>
        <div className="group flex items-center gap-3 rounded-lg px-3 py-2.5 text-muted-foreground transition-colors duration-200 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5">
          <Settings className="h-5 w-5" />
          {!collapsed && <span className="text-sm font-medium">Settings</span>}
        </div>
      </Link>
      {!collapsed && (
        <p className="mt-4 px-3 text-xs font-semibold uppercase tracking-wider text-muted-foreground">
          Theme
        </p>
      )}
      <div className={collapsed ? 'mt-3 px-3' : 'mt-4 px-3'}>
        <ThemeToggle />
      </div>
    </div>
  );
}
