'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { dashboardStats, expiringDomains, monitoringDomains, watchlistDomains, recentActivity } from '@/data/dummyData';

const statusMap = {
  Active: 'success',
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

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {dashboardStats.map((stat) => (
          <Card key={stat.label} className="space-y-3">
            <p className="text-sm font-medium text-slate-500 dark:text-slate-400">{stat.label}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">{stat.value}</p>
              <Badge variant="info">{stat.detail}</Badge>
            </div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Expiring domains</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">See the domains that need renewal soon.</p>
            </div>
            <Button variant="ghost" size="sm">
              View all
            </Button>
          </div>

          <div className="space-y-3">
            {expiringDomains.map((domain) => (
              <div key={domain.domain} className="rounded-3xl border border-white/10 bg-(--surface) p-4 dark:border-white/10 dark:bg-slate-950/95">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                  <div>
                    <p className="text-base font-semibold text-slate-900 dark:text-white">{domain.domain}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">Expires {domain.expiry} · {domain.registrar}</p>
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

        <Card className="space-y-5">
          <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Renewal budget</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">Forecast your upcoming registrar and SSL renewal spend.</p>
          <div className="rounded-3xl border border-white/10 bg-(--surface) p-5 dark:border-white/10 dark:bg-slate-950/95">
            <p className="text-sm uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">Next 30 days</p>
            <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">$382</p>
            <div className="mt-4 space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <p>2 domains expire in the next 10 days</p>
              <p>1 certificate renewal is due soon</p>
            </div>
          </div>
          <Button fullWidth>Review renewal plan</Button>
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Domain monitoring</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Live status for your active domains.</p>
          </div>
          <Badge variant="info">Updated 6 minutes ago</Badge>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead className="border-b border-white/10 text-slate-500 dark:border-white/10 dark:text-slate-400">
              <tr>
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Registrar</th>
                <th className="px-4 py-3">Expires</th>
                <th className="px-4 py-3">Renewal</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Last checked</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200 dark:divide-slate-800">
              {monitoringDomains.map((domain) => (
                <tr key={domain.domain} className="hover:bg-white/5 dark:hover:bg-white/10 transition">
                  <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{domain.domain}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{domain.registrar}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{domain.expires}</td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{domain.renewal}</td>
                  <td className="px-4 py-4"><StatusBadge variant={statusMap[domain.status] || 'info'}>{domain.status}</StatusBadge></td>
                  <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{domain.lastChecked}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Watchlist alerts</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Important domains you are tracking.</p>
          </div>
          <Button size="sm" variant="secondary">Manage watchlist</Button>
        </div>

        <div className="space-y-3">
          {watchlistDomains.map((domain) => (
            <div key={domain.domain} className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-(--surface) p-4 dark:border-white/10 dark:bg-slate-950/95 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{domain.domain}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Score {domain.score}% · {domain.status}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <Badge variant={domain.status === 'Available' ? 'success' : 'warning'}>{domain.status}</Badge>
                <p className="text-sm font-semibold text-slate-900 dark:text-white">{domain.price}</p>
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
