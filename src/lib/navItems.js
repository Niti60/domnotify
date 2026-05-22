import { LayoutDashboard, Search, Activity, DollarSign } from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/search-domain', label: 'Search Domain', icon: Search },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
];

export function isActive(pathname, href) {
  if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
