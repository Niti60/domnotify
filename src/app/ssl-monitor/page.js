'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { sslCertificates } from '@/data/dummyData';

export default function SSLMonitorPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="SSL Monitor"
        subtitle="View certificate status, upcoming expiry, and renewal priorities."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="text-center">
          <p className="text-sm text-muted-foreground">Active certificates</p>
          <p className="mt-3 text-4xl font-semibold text-foreground">4</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-muted-foreground">Expiring soon</p>
          <p className="mt-3 text-4xl font-semibold text-amber-600 dark:text-amber-400">1</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-muted-foreground">Expired certificates</p>
          <p className="mt-3 text-4xl font-semibold text-red-600 dark:text-red-400">1</p>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Certificate status</h2>
            <p className="text-sm text-muted-foreground">
              Track the health of each SSL certificate on your domains.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            Configure alerts
          </Button>
        </div>

        <div className="divide-y divide-border rounded-lg border border-border">
          {sslCertificates.map((cert) => (
            <div
              key={cert.domain}
              className="flex flex-col gap-4 px-4 py-4 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="font-semibold text-foreground">{cert.domain}</p>
                <p className="text-sm text-muted-foreground">
                  {cert.issuer} · Expires {cert.expires}
                </p>
              </div>
              <div className="flex flex-wrap items-center gap-4">
                <StatusBadge
                  variant={
                    cert.status === 'Valid' || cert.status === 'valid'
                      ? 'success'
                      : cert.status === 'Renew soon' || cert.status === 'warning'
                        ? 'warning'
                        : 'danger'
                  }
                >
                  {cert.status}
                </StatusBadge>
                <button
                  type="button"
                  className="text-sm text-muted-foreground underline-offset-2 transition-colors duration-200 hover:text-foreground hover:underline"
                >
                  View details
                </button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="rounded-lg border border-border bg-muted p-5 text-sm text-foreground">
          <p className="font-semibold">Pro tip</p>
          <p className="mt-2 text-muted-foreground">
            Enable SSL auto-renewal to reduce manual maintenance and prevent service interruptions.
          </p>
        </div>
      </Card>
    </div>
  );
}
