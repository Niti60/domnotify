'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { dashboardStats, expiringDomains, monitoringDomains, watchlistDomains, recentActivity } from '@/data/dummyData';

const statusMap = {
  Available: 'success',
  Review: 'warning',
  Pending: 'danger',
};

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Dashboard"
        subtitle="Get a quick view of your domain portfolio health, upcoming renewals, and critical alerts."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold text-foreground tracking-tight">{stat.value}</p>
              <Badge variant="info">{stat.detail}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="space-y-6">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Expiring domains</h2>
              <p className="text-sm text-muted-foreground">See the domains that need renewal soon.</p>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>

          <div className="space-y-3">
            {expiringDomains.map((domain) => (
              <div key={domain.domain} className="rounded-lg border border-border bg-muted p-4 transition-colors duration-200">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-foreground">{domain.domain}</p>
                    <p className="text-sm text-muted-foreground">Expires {domain.expiry} · {domain.registrar}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusBadge variant={domain.daysLeft <= 10 ? 'danger' : 'warning'}>
                      {domain.daysLeft} days left
                    </StatusBadge>
                    <Button size="sm" variant="secondary">
                      Renew
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Domain monitoring</h2>
            <p className="text-sm text-muted-foreground">Live status for your available domains.</p>
          </div>
          <Badge variant="info">Updated 6 minutes ago</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-border text-muted-foreground">
              <tr>
                <th className="px-4 py-3 font-semibold">Domain</th>
                <th className="px-4 py-3 font-semibold">Registrar</th>
                <th className="px-4 py-3 font-semibold">Expires</th>
                <th className="px-4 py-3 font-semibold">Renewal</th>
                <th className="px-4 py-3 font-semibold">Status</th>
                <th className="px-4 py-3 font-semibold">Last checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {monitoringDomains.map((domain) => (
                <tr key={domain.domain} className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5">
                  <td className="px-4 py-4 font-medium text-foreground">{domain.domain}</td>
                  <td className="px-4 py-4 text-muted-foreground">{domain.registrar}</td>
                  <td className="px-4 py-4 text-muted-foreground">{domain.expires}</td>
                  <td className="px-4 py-4 text-muted-foreground">{domain.renewal}</td>
                  <td className="px-4 py-4"><StatusBadge variant={statusMap[domain.status] || 'info'}>{domain.status}</StatusBadge></td>
                  <td className="px-4 py-4 text-muted-foreground">{domain.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Watchlist alerts</h2>
            <p className="text-sm text-muted-foreground">Important domains you are tracking.</p>
          </div>
          <Button size="sm" variant="secondary">Manage watchlist</Button>
        </div>

        <div className="space-y-3">
          {watchlistDomains.map((domain) => {
            const expired = domain.status === 'Expired';
            return (
              <div key={domain.domain} className="flex flex-col gap-3 rounded-lg border border-border bg-muted p-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="font-semibold text-foreground">{domain.domain}</p>
                  <p className="text-sm text-muted-foreground">Score {domain.score}% · {domain.registrar} · Expires {domain.expiry}</p>
                  {expired && <p className="mt-1 text-xs text-destructive font-medium">Already expired</p>}
                </div>
                <div className="flex items-center gap-3 flex-wrap">
                  <StatusBadge variant={domain.status === 'Available' ? 'success' : domain.status === 'Expiring soon' ? 'warning' : 'danger'}>{domain.status}</StatusBadge>
                  <p className="text-sm font-semibold text-foreground">{domain.price}</p>
                </div>
              </div>
            );
          })}
        </div>
      </Card>
    </div>
  );
}
