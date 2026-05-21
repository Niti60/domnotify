'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { watchlistDomains } from '@/data/dummyData';

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Watchlist"
        subtitle="Track domains you want to monitor closely."
        action={<Button variant="primary">Add domain</Button>}
      />

      <div className="grid gap-6 sm:grid-cols-2">
        <Card className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Tracked domains</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">{watchlistDomains.length}</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Potential value</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">$5,290</p>
        </Card>
      </div>

      {watchlistDomains.length > 0 ? (
        <Card className="space-y-4">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Tracked domains</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Domain availability, score, and alert status.</p>
            </div>
            <Button size="sm" variant="secondary">Manage</Button>
          </div>

          <div className="space-y-3">
            {watchlistDomains.map((domain) => (
              <div key={domain.domain} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-(--surface) p-4 dark:border-white/10 dark:bg-slate-950/95 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-base font-semibold text-slate-900 dark:text-white">{domain.domain}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Relevance score {domain.score}%</p>
                </div>
                <div className="flex flex-wrap items-center gap-3">
                  <Badge variant={domain.status === 'Available' ? 'success' : 'warning'}>{domain.status}</Badge>
                  <p className="font-semibold text-slate-900 dark:text-white">{domain.price}</p>
                  {domain.status === 'Available' && (
                    <Button size="sm" variant="primary">Register</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </Card>
      ) : (
        <EmptyState
          icon={Eye}
          title="Your watchlist is empty"
          description="Add domains to track availability, expiry, and registrar changes."
          action={<Button variant="primary">Start watching</Button>}
        />
      )}
    </div>
  );
}
