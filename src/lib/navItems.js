import { LayoutDashboard, Search, Activity, Shield, Globe, Building, Eye, DollarSign, Wrench } from 'lucide-react';

export const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/search-domain', label: 'Search Domain', icon: Search },
  { href: '/monitoring', label: 'Monitoring', icon: Activity },
  { href: '/ssl-monitor', label: 'SSL Monitor', icon: Shield },
  { href: '/whois-checker', label: 'Whois Checker', icon: Globe },
  { href: '/registrars', label: 'Registrars', icon: Building },
  { href: '/watchlist', label: 'Watchlist', icon: Eye },
  { href: '/pricing', label: 'Pricing', icon: DollarSign },
  { href: '/tools', label: 'Tools', icon: Wrench },
];

export function isActive(pathname, href) {
  if (href === '/dashboard' && (pathname === '/' || pathname === '/dashboard')) return true;
  return pathname === href || pathname.startsWith(`${href}/`);
}
