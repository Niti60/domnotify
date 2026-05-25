'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetch, statusToVariant } from '@/lib/apiClient';
import { Activity } from 'lucide-react';
import { toast } from 'sonner';
import { getRegistrarInfo } from '@/lib/registrars';
import AuthRequiredState from '@/components/auth/AuthRequiredState';

export default function MonitoringPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleRenew = (registrarName) => {
    const info = getRegistrarInfo(registrarName);
    if (!info || !info.renewalUrl) {
      toast.error('Registrar renewal link unavailable');
      window.open('/registrars', '_blank');
      return;
    }
    window.open(info.renewalUrl, '_blank', 'noopener,noreferrer');
  };

  useEffect(() => {
    apiFetch('/api/monitoring')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return (
      <div className="space-y-8">
        <SectionTitle title="Monitoring" subtitle="Loading monitoring data..." />
        <div className="grid gap-6">
          <CardSkeleton />
          <CardSkeleton />
        </div>
      </div>
    );
  }

  if (error === 'Not authenticated' || error === 'Unauthorized' || error === '401') {
    return (
      <AuthRequiredState
        title="Please login to view monitoring data"
        description="Your monitoring data, SSL checks, and watchlist are linked to your account."
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <SectionTitle title="Monitoring" subtitle="Unable to load monitoring data." />
        <Card className="text-center text-destructive">{error}</Card>
      </div>
    );
  }

  const domains = data?.domains || [];

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Monitoring"
        subtitle="Track expiry, renewal costs, and domain health in one central view."
      />

      <div className="space-y-6">
        <Card className="space-y-5">
          <h2 className="text-lg font-semibold text-foreground">Renewal budget</h2>
          <p className="text-sm text-muted-foreground">
            Forecast your upcoming registrar and SSL renewal spend.
          </p>
          <div className="rounded-lg border border-border bg-muted p-5">
            <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/80">
              Next 30 days
            </p>
            <p className="mt-3 text-4xl font-semibold tracking-tight text-foreground">
              ${Math.round(data.renewalBudget || 0).toLocaleString()}
            </p>
            <div className="mt-4 space-y-3 text-sm text-muted-foreground">
              <p>{data.domainsExpiringIn10} domain(s) expire in the next 10 days</p>
              <p>{data.sslRenewalsDue} certificate renewal(s) due soon</p>
            </div>
          </div>
          <Button fullWidth>Review renewal plan</Button>
        </Card>

        <Card className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-foreground">Monitoring overview</h3>
            <p className="text-sm text-muted-foreground">
              Renewal and status highlights for your core domains.
            </p>
          </div>
          <div className="space-y-4 rounded-lg border border-border bg-muted p-5">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">Due in next 30 days</p>
                <p className="text-2xl font-semibold text-foreground">{data.domainsDueIn30} domains</p>
              </div>
              <StatusBadge variant="warning">Review</StatusBadge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-muted-foreground">High priority alerts</p>
                <p className="text-2xl font-semibold text-foreground">{data.highPriorityAlerts}</p>
              </div>
              <StatusBadge variant="danger">Action required</StatusBadge>
            </div>
          </div>
          <Button fullWidth>Manage monitoring</Button>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-foreground">Domain monitoring</h2>
              <p className="text-sm text-muted-foreground">Live status across your tracked domains.</p>
            </div>
            <Link href="/watchlist">
              <Button size="sm" variant="secondary">
                Add domain
              </Button>
            </Link>
          </div>

          {domains.length === 0 ? (
            <EmptyState
              icon={Activity}
              title="No monitored domains"
              description="Add domains to your watchlist to start tracking renewals and status."
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
                    <th className="px-4 py-3 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {domains.map((item) => (
                    <tr
                      key={item._id || item.domain}
                      className="transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                    >
                      <td className="px-4 py-4 font-medium text-foreground">{item.domain}</td>
                      <td className="px-4 py-4 text-muted-foreground">{item.registrar}</td>
                      <td className="px-4 py-4 text-muted-foreground">{item.domainExpiresAt}</td>
                      <td className="px-4 py-4 text-muted-foreground">{item.renewal}</td>
                      <td className="px-4 py-4">
                        <StatusBadge variant={statusToVariant(item.status)}>{item.status}</StatusBadge>
                      </td>
                      <td className="px-4 py-4 text-right">
                        <Button
                          size="sm"
                          variant="ghost"
                          className="text-xs"
                          onClick={() => handleRenew(item.registrar)}
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
      </div>
    </div>
  );
}
