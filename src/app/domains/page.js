'use client';

import Link from 'next/link';
import { Globe, Search, BookmarkPlus, Sparkles } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/cards/DashboardCard';
import { Button } from '@/components/ui/Button';

const sections = [
  {
    title: 'Domain Discovery',
    description: 'Search available domains with instant pricing and availability.',
    icon: Search,
    href: '/search-domain',
  },
  {
    title: 'WHOIS Lookup',
    description: 'Inspect ownership, registrar data, and registration history.',
    icon: Globe,
    href: '/whois-checker',
  },
  {
    title: 'Registrar Insights',
    description: 'Compare registrar performance, pricing, and trust signals.',
    icon: BookmarkPlus,
    href: '/registrars',
  },
  {
    title: 'Free Domain Finds',
    description: 'Discover special offers and free domain opportunities.',
    icon: Sparkles,
    href: '/free-domains',
  },
];

export default function DomainsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Domains"
        subtitle="Find, analyze, and manage domains from a single control center."
      />

      <div className="grid gap-6 xl:grid-cols-2">
        {sections.map((section) => {
          const Icon = section.icon;
          return (
            <DashboardCard key={section.title}>
              <div className="flex flex-col gap-6">
                <div className="flex items-center gap-4">
                  <div className="rounded-lg bg-muted p-4 text-foreground">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div>
                    <p className="text-lg font-semibold text-foreground">{section.title}</p>
                    <p className="text-sm text-muted-foreground">{section.description}</p>
                  </div>
                </div>
                <div className="flex items-center justify-between">
                  <Link href={section.href}>
                    <Button variant="primary" size="sm">
                      Open
                    </Button>
                  </Link>
                  <span className="text-xs uppercase tracking-widest text-muted-foreground">
                    Integrated
                  </span>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
