'use client';

import Link from 'next/link';
import { Heart, Share2, Mail, Link as LinkIcon } from 'lucide-react';

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = [
    {
      title: 'Product',
      links: [
        { text: 'Domain Search', href: '/search' },
        { text: 'WHOIS Checker', href: '/whois' },
        { text: 'AI Suggestions', href: '/ai-suggestions' },
        { text: 'Power Tools', href: '/tools' },
      ],
    },
    {
      title: 'Resources',
      links: [
        { text: 'Documentation', href: '#' },
        { text: 'Blog', href: '#' },
        { text: 'API Docs', href: '#' },
        { text: 'Status', href: '#' },
      ],
    },
    {
      title: 'Company',
      links: [
        { text: 'About', href: '#' },
        { text: 'Contact', href: '#' },
        { text: 'Privacy', href: '#' },
        { text: 'Terms', href: '#' },
      ],
    },
  ];

  return (
    <footer className="bg-slate-950 dark:bg-slate-900 text-slate-200 dark:text-slate-400">
      {/* Gradient border top */}
      <div className="h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main footer content */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center text-white font-bold text-sm">
                D
              </div>
              <span className="text-lg font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent">
                DomInfo
              </span>
            </div>
            <p className="text-sm text-slate-400 mb-4">
              Your all-in-one domain intelligence platform.
            </p>
            <div className="flex gap-4">
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Heart className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Share2 className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <LinkIcon className="w-5 h-5" />
              </a>
              <a
                href="#"
                className="text-slate-400 hover:text-blue-400 transition-colors"
              >
                <Mail className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Footer links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="font-semibold text-slate-100 mb-4">
                {section.title}
              </h3>
              <ul className="space-y-2">
                {section.links.map((link) => (
                  <li key={`${section.title}-${link.text}`}>
                    <a
                      href={link.href}
                      className="text-sm text-slate-400 hover:text-slate-200 transition-colors"
                    >
                      {link.text}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom footer */}
        <div className="border-t border-slate-800 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-slate-400">
            © {currentYear} DomInfo. All rights reserved.
          </p>
          <p className="text-xs text-slate-500 mt-4 md:mt-0">
            Built with modern web technologies | Powered by Next.js & Tailwind
          </p>
        </div>
      </div>
    </footer>
  );
}
