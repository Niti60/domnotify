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
          <p className="text-sm text-slate-500 dark:text-slate-400">Active certificates</p>
          <p className="mt-3 text-4xl font-semibold text-slate-900 dark:text-white">4</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Expiring soon</p>
          <p className="mt-3 text-4xl font-semibold text-amber-600 dark:text-amber-400">1</p>
        </Card>
        <Card className="text-center">
          <p className="text-sm text-slate-500 dark:text-slate-400">Expired certificates</p>
          <p className="mt-3 text-4xl font-semibold text-rose-600 dark:text-rose-400">1</p>
        </Card>
      </div>

      <Card>
        <div className="flex items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Certificate status</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400">Track the health of each SSL certificate on your domains.</p>
          </div>
          <Button size="sm" variant="secondary">Configure alerts</Button>
        </div>

        <div className="space-y-3">
          {sslCertificates.map((cert) => (
            <div key={cert.domain} className="flex flex-col gap-4 rounded-3xl border border-white/10 bg-(--surface) p-4 dark:border-white/10 dark:bg-slate-950/95 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{cert.domain}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">{cert.issuer} · Expires {cert.expires}</p>
              </div>
              <div className="flex items-center gap-3 flex-wrap">
                <StatusBadge variant={cert.status === 'Valid' || cert.status === 'valid' ? 'success' : cert.status === 'Renew soon' || cert.status === 'warning' ? 'warning' : 'danger'}>
                  {cert.status}
                </StatusBadge>
                <Button size="sm" variant="primary">Renew</Button>
              </div>
            </div>
          ))}
        </div>
      </Card>

      <Card>
        <div className="rounded-3xl border border-blue-200/80 bg-blue-50/80 p-5 text-sm text-blue-900 dark:border-blue-900/40 dark:bg-blue-950/15 dark:text-blue-200">
          <p className="font-semibold">Pro tip:</p>
          <p className="mt-2">Enable SSL auto-renewal to reduce manual maintenance and prevent service interruptions.</p>
        </div>
      </Card>
    </div>
  );
}
