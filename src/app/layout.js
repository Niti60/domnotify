import { Providers } from '@/components/theme/ThemeProvider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script';
import './globals.css';

export const metadata = {
  title: 'DomNotify - Domain Intelligence Platform',
  description: 'Monitor domains, track SSL, compare registrars, and get AI suggestions for your domain portfolio.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/FavIcon.svg" />
        <Script id="theme-loader" strategy="beforeInteractive">
          {`
            (function() {
              try {
                var theme = localStorage.getItem('domnotify-theme') || 'system';
                var isDark = theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches);
                if (isDark) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.remove('dark');
                }
              } catch (e) {}
            })()
          `}
        </Script>
      </head>
      <body className="min-h-screen bg-background text-foreground transition-colors duration-200" suppressHydrationWarning>
        <Providers>
          <AuthProvider>
            <LayoutWrapper>{children}</LayoutWrapper>
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
