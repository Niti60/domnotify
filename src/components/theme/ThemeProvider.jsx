'use client';

import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext({
  theme: 'system',
  setTheme: (t) => { },
  resolvedTheme: 'light'
});

export function Providers({ children }) {
  const [theme, setThemeState] = useState('system');
  const [resolvedTheme, setResolvedTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('domnotify-theme') || 'system';
    setThemeState(savedTheme);
    applyTheme(savedTheme);

    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    const handleChange = () => {
      if (localStorage.getItem('domnotify-theme') === 'system' || !localStorage.getItem('domnotify-theme')) {
        applyTheme('system');
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const applyTheme = (t) => {
    const root = window.document.documentElement;
    const isDark = t === 'dark' || (t === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);

    root.classList.toggle('dark', isDark);
    setResolvedTheme(isDark ? 'dark' : 'light');
  };

  const setTheme = (newTheme) => {
    localStorage.setItem('domnotify-theme', newTheme);
    setThemeState(newTheme);
    applyTheme(newTheme);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, resolvedTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
