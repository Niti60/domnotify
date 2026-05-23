'use client';

import Image from 'next/image';
import { useTheme } from '../theme/ThemeProvider';
import { useEffect, useState } from 'react';

export function Logo({ className = '', priority = false }) {
  const { resolvedTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isDark = mounted && resolvedTheme === 'dark';

  const fullSrc = isDark ? '/dark-mode-logo-.png' : '/lightModeLogo.png';
  const iconSrc = isDark ? '/dark-mode-logoOnly.png' : '/light-mode-logoOnly.png';

  if (!mounted) {
    return <div className={`h-9 w-32 ${className}`} />;
  }

  return (
    <div className={`flex items-center ${className}`}>
      <div className="block md:hidden">
        <Image
          src={iconSrc}
          alt="DomNotify"
          width={32}
          height={32}
          priority={priority}
          style={{ height: 'auto' }}
        />
      </div>
      <div className="hidden items-center md:flex">
        <Image
          src={fullSrc}
          alt="DomNotify"
          width={160}
          height={36}
          priority={priority}
          style={{ height: 'auto' }}
        />
      </div>
    </div>
  );
}
