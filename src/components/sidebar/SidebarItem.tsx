'use client';

import Link from 'next/link';
import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/cn';

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
      <div
        className={cn(
          'group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-colors duration-200',
          active
            ? 'bg-muted font-medium text-foreground'
            : 'text-muted-foreground hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5',
        )}
      >
        <Icon
          className={cn(
            'h-4 w-4 shrink-0 transition-colors duration-200',
            active ? 'text-foreground' : 'text-muted-foreground group-hover:text-foreground',
          )}
        />
        <span className="flex-1 leading-none">{label}</span>
      </div>
    </Link>
  );
}
