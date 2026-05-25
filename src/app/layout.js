import { Toaster } from 'sonner';
import { Providers } from '@/components/theme/ThemeProvider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
import { AuthProvider } from '@/context/AuthContext';
import Script from 'next/script';
import './globals.css';
import { getCurrentUser } from '@/lib/auth';

export const metadata = {
  title: 'DomNotify - Domain Intelligence Platform',
  description: 'Monitor domains, track SSL, compare registrars, and get AI suggestions for your domain portfolio.',
};

/**
 * RootLayout
 * 
 * Note: Middleware provides the primary auth gate.
 * Protected routes never reach this layout without valid auth token.
 * This layout renders the UI chrome for authenticated users.
 */
export default async function RootLayout({ children }) {
  const initialUser = await getCurrentUser();

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
          <AuthProvider initialUser={initialUser}>
            <LayoutWrapper>{children}</LayoutWrapper>
            <Toaster position="top-right" richColors />
          </AuthProvider>
        </Providers>
      </body>
    </html>
  );
}
