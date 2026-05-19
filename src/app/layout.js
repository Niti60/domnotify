'use client';

import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import './globals.css';

export default function RootLayout({ children }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="description" content="DomInfo - Find Everything About Any Domain" />
        <link rel="icon" href="/favicon.svg" />
      </head>
      <body className="bg-white dark:bg-slate-950 text-slate-900 dark:text-white transition-colors">
        <Navbar />
        <main className="min-h-screen">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
