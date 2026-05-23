'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { Menu } from 'lucide-react';
import { SearchBar } from '@/components/ui/SearchBar';
import { ThemeToggle } from '@/components/theme/ThemeToggle';
import { Logo } from '@/components/ui/Logo';
import { cn } from '@/lib/cn';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

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
    <header className="fixed inset-x-0 top-0 z-50 border-b border-border bg-background transition-colors duration-200">
      <div className="mx-auto flex h-16 max-w-full items-center justify-between gap-8 px-4 sm:px-6 lg:px-8">
        <div className="flex shrink-0 items-center gap-3">
          <button
            type="button"
            onClick={onMenuClick}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-border text-foreground transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 lg:hidden"
          >
            <Menu className="h-5 w-5" />
          </button>
          <Logo priority className="" />
        </div>

        <nav className="hidden items-center gap-1 lg:flex">
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200',
                isActive(item.href)
                  ? 'text-foreground'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {item.label}
            </Link>
          ))}
        </nav>

        <div className="ml-auto flex items-center gap-3">
          <div className="hidden lg:block">
            <SearchBar placeholder="Search..." />
          </div>
          <ThemeToggle />
          <AuthStatus />
        </div>
      </div>
    </header>
  );
}

function AuthStatus() {
  const { user, loading } = useAuth();
  const router = useRouter();

  if (loading) {
    return null;
  }

  if (!user) {
    return (
      <button
        onClick={() => router.push('/auth')}
        className="ml-2 rounded-md px-3 py-1.5 text-sm font-medium bg-blue-600 hover:bg-blue-500 text-white transition-colors duration-200"
        aria-label="Sign in"
      >
        Login
      </button>
    );
  }

  const initial = user.name ? user.name.charAt(0).toUpperCase() : 'U';

  return (
    <button
      onClick={() => router.push('/me')}
      className="ml-2 inline-flex h-9 w-9 items-center justify-center rounded-full border border-border bg-card text-foreground text-sm font-medium hover:opacity-90 transition-opacity duration-150 overflow-hidden"
      aria-label="Account"
    >
      {user.profilePic ? (
        <Image
          src={user.profilePic}
          alt={user.name || 'avatar'}
          width={36}
          height={36}
          className="h-full w-full object-cover"
          style={{ height: 'auto' }}
        />
      ) : (
        <span className="h-full w-full inline-flex items-center justify-center rounded-full bg-blue-600 text-white">{initial}</span>
      )}
    </button>
  );
}
