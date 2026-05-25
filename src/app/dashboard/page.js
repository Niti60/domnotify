'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetch, statusToVariant } from '@/lib/apiClient';
import { LayoutDashboard } from 'lucide-react';
import { toast } from 'sonner';
import { getRegistrarInfo } from '@/lib/registrars';

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleRenew = (registrarName, domain) => {
    const info = getRegistrarInfo(registrarName);
    if (!info || !info.renewalUrl) {
      toast.error('Registrar renewal link unavailable');
      window.open('/registrars', '_blank');
      return;
    }
    window.open(info.renewalUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    apiFetch('/api/dashboard')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <SectionTitle
          title="Dashboard"
          subtitle="Get a quick view of your domain portfolio health, upcoming renewals, and critical alerts."
        />
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <SectionTitle title="Dashboard" subtitle="Unable to load dashboard data." />
        <Card className="text-center text-destructive">{error}</Card>
      </div>
    );
  }

  const {
    stats = [],
    expiringDomains = [],
    monitoringDomains = [],
    watchlistDomains = [],
  } = data;

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Dashboard"
        subtitle="Get a quick view of your domain portfolio health, upcoming renewals, and critical alerts."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.label} className="space-y-3">
            <p className="text-sm font-medium text-muted-foreground">{stat.label}</p>
            <div className="flex items-center justify-between gap-4">
              <p className="text-3xl font-semibold tracking-tight text-foreground">{stat.value}</p>
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
            <Link href="/monitoring">
              <Button variant="ghost" size="sm">
                View all
              </Button>
            </Link>
          </div>

          {expiringDomains.length === 0 ? (
            <p className="text-sm text-muted-foreground">No domains expiring within 30 days.</p>
          ) : (
            <div className="space-y-3">
              {expiringDomains.map((domain) => (
                <div
                  key={domain._id || domain.domain}
                  className="rounded-lg border border-border bg-muted p-4 transition-colors duration-200"
                >
                  <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                      <p className="text-base font-semibold text-foreground">{domain.domain}</p>
                      <p className="text-sm text-muted-foreground">
                        Expires {domain.domainExpiresAt} · {domain.registrar}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <StatusBadge variant={domain.daysLeft <= 10 ? 'danger' : 'warning'}>
                        {domain.daysLeft} days left
                      </StatusBadge>
                      <Button
                        size="sm"
                        variant="secondary"
                        onClick={() => handleRenew(domain.registrar, domain.domain)}
                      >
                        Renew
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>

      <Card className="space-y-5">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Domain monitoring</h2>
            <p className="text-sm text-muted-foreground">Live status for your tracked domains.</p>
          </div>
          <Badge variant="info">{monitoringDomains.length} tracked</Badge>
        </div>

        {monitoringDomains.length === 0 ? (
          <EmptyState
            icon={LayoutDashboard}
            title="No domains tracked yet"
            description="Add domains to your watchlist to start monitoring."
            action={
              <Link href="/watchlist">
                <Button variant="primary" size="sm">
                  Add domain
                </Button>
              </Link>
            }
          />
        ) : (
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
                  <th className="px-4 py-3 font-semibold text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {monitoringDomains.map((domain) => (
                  <tr
                    key={domain._id || domain.domain}
                    className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                  >
                    <td className="px-4 py-4 font-medium text-foreground">{domain.domain}</td>
                    <td className="px-4 py-4 text-muted-foreground">{domain.registrar}</td>
                    <td className="px-4 py-4 text-muted-foreground">{domain.domainExpiresAt}</td>
                    <td className="px-4 py-4 text-muted-foreground">{domain.renewal}</td>
                    <td className="px-4 py-4">
                      <StatusBadge variant={statusToVariant(domain.status)}>{domain.status}</StatusBadge>
                    </td>
                    <td className="px-4 py-4 text-muted-foreground">{domain.lastChecked}</td>
                    <td className="px-4 py-4 text-right">
                      <Button
                        size="sm"
                        variant="ghost"
                        className="text-xs"
                        onClick={() => handleRenew(domain.registrar, domain.domain)}
                      >
                        Renew
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Card>

      <Card className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Watchlist alerts</h2>
            <p className="text-sm text-muted-foreground">Important domains you are tracking.</p>
          </div>
          <Link href="/watchlist">
            <Button size="sm" variant="secondary">
              Manage watchlist
            </Button>
          </Link>
        </div>

        {watchlistDomains.length === 0 ? (
          <p className="text-sm text-muted-foreground">No watchlist domains yet.</p>
        ) : (
          <div className="space-y-3">
            {watchlistDomains.map((domain) => {
              const expired = domain.status === 'Expired';
              return (
                <div
                  key={domain._id || domain.domain}
                  className="flex flex-col gap-3 rounded-lg border border-border bg-muted p-4 transition-colors duration-200 sm:flex-row sm:items-center sm:justify-between"
                >
                  <div>
                    <p className="font-semibold text-foreground">{domain.domain}</p>
                    <p className="text-sm text-muted-foreground">
                      {domain.registrar} · Expires {domain.domainExpiresAt}
                    </p>
                    {expired && (
                      <p className="mt-1 text-xs font-medium text-destructive">Already expired</p>
                    )}
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    <StatusBadge variant={statusToVariant(domain.status)}>{domain.status}</StatusBadge>
                    <p className="text-sm font-semibold text-foreground">{domain.renewal}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Card>
    </div>
  );
}
