'use client';

import { BarChart3, TrendingUp, Users } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/cards/DashboardCard';

const analyticsCards = [
  {
    title: 'Traffic Trends',
    value: '124k',
    description: 'Domain visits and organic discovery over the last 30 days.',
    icon: TrendingUp,
  },
  {
    title: 'Conversion Rate',
    value: '18.4%',
    description: 'Lead capture and performance for your domain campaigns.',
    icon: BarChart3,
  },
  {
    title: 'Audience Reach',
    value: '9.8k',
    description: 'Unique contacts and domain referrals from top sources.',
    icon: Users,
  },
];

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Analytics"
        subtitle="Review domain performance metrics and trends across your portfolio."
      />

      <div className="grid gap-6 xl:grid-cols-3">
        {analyticsCards.map((card) => {
          const Icon = card.icon;
          return (
            <DashboardCard key={card.title}>
              <div className="flex items-center gap-4">
                <div className="rounded-lg bg-muted p-4 text-foreground">
                  <Icon className="h-6 w-6" />
                </div>
                <div>
                  <p className="text-sm font-medium uppercase tracking-widest text-muted-foreground">
                    {card.title}
                  </p>
                  <p className="mt-2 text-3xl font-semibold text-foreground">{card.value}</p>
                  <p className="mt-2 text-sm text-muted-foreground">{card.description}</p>
                </div>
              </div>
            </DashboardCard>
          );
        })}
      </div>
    </div>
  );
}
