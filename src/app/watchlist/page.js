'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { watchlistDomains } from '@/data/dummyData';

function StatusPill({ status }) {
  const variant = status === 'Available' ? 'success' : status === 'Expiring soon' ? 'warning' : 'danger';
  return <StatusBadge variant={variant}>{status}</StatusBadge>;
}

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Watchlist"
        subtitle="Track domains you want to monitor closely."
        action={<Button variant="primary">Add domain</Button>}
      />

      <Card>
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-foreground">Watchlist</h3>
          <p className="mt-1 text-sm text-muted-foreground">Unified list of your tracked domains and statuses.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-muted-foreground border-b border-border">
                <th className="px-4 py-3 font-semibold">Domain</th>
                <th className="px-4 py-3 font-semibold">Registrar</th>
                <th className="px-4 py-3 font-semibold">Expiry date</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {watchlistDomains.map((row) => {
                const expired = row.status === 'Expired';
                return (
                  <tr key={row.domain} className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5">
                    <td className="px-4 py-4 font-medium text-foreground">{row.domain}</td>
                    <td className="px-4 py-4 text-muted-foreground">{row.registrar}</td>
                    <td className="px-4 py-4 text-muted-foreground">
                      <div className="flex flex-col">
                        <span>{row.expiry}</span>
                        {expired && <span className="mt-1 text-xs text-destructive font-medium">Already expired</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-4">
                      <button className={`${expired ? 'text-destructive' : 'text-muted-foreground hover:text-foreground'} text-sm font-medium transition-colors underline-offset-4 hover:underline`}>View details</button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
