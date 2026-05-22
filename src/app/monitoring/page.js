'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Button } from '@/components/ui/Button';
import { monitoringDomains } from '@/data/dummyData';

const statusMap = {
  Active: 'success',
  Review: 'warning',
  Pending: 'danger',
};

export default function MonitoringPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Monitoring"
        subtitle="Track expiry, renewal costs, and domain health in one central view."
      />

      <div className="space-y-6">
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

        <Card className="space-y-6">
          <div>
            <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Monitoring overview</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">Renewal and status highlights for your core domains.</p>
          </div>
          <div className="space-y-4 rounded-3xl border border-white/10 bg-(--surface) p-5 dark:border-white/10 dark:bg-slate-950/95">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Due in next 30 days</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">2 domains</p>
              </div>
              <StatusBadge variant="warning">Review</StatusBadge>
            </div>
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">High priority alerts</p>
                <p className="text-2xl font-semibold text-slate-900 dark:text-white">1</p>
              </div>
              <StatusBadge variant="danger">Action required</StatusBadge>
            </div>
          </div>
          <Button fullWidth>Manage monitoring</Button>
        </Card>

        <Card className="space-y-5">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-slate-900 dark:text-white">Domain monitoring</h2>
              <p className="text-sm text-slate-500 dark:text-slate-400">Live status across your tracked domains.</p>
            </div>
            <Button size="sm" variant="secondary">Add domain</Button>
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
                {monitoringDomains.map((item) => (
                  <tr key={item.domain} className="hover:bg-white/5 dark:hover:bg-white/10 transition">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{item.domain}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{item.registrar}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{item.expires}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{item.renewal}</td>
                    <td className="px-4 py-4"><StatusBadge variant={statusMap[item.status] || 'info'}>{item.status}</StatusBadge></td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{item.lastChecked}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
