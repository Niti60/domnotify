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
        <link rel="icon" href="/FavIcon.svg" />
      </head>
      <body className="min-h-screen bg-background text-foreground antialiased">
        <Providers>
          <LayoutWrapper>{children}</LayoutWrapper>
        </Providers>
      </body>
    </html>
  );
}
