import { Providers } from '@/components/theme/ThemeProvider';
import { LayoutWrapper } from '@/components/layout/LayoutWrapper';
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
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="min-h-screen bg-zinc-50 text-zinc-900 dark:bg-zinc-950 dark:text-zinc-100 transition-colors duration-300">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
