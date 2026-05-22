'use client';

import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const demoRows = [
  { domain: 'futurestack.ai', registrar: 'Namecheap', expiry: '2025-11-12', status: 'Active' },
  { domain: 'growthlabs.dev', registrar: 'Cloudflare', expiry: '2025-06-14', status: 'Expiring soon' },
  { domain: 'launchcode.app', registrar: 'Google Domains', expiry: '2025-07-03', status: 'Active' },
  { domain: 'cloudpilot.io', registrar: 'Namecheap', expiry: '2025-06-18', status: 'Expiring soon' },
  { domain: 'motiongrid.co', registrar: 'GoDaddy', expiry: '2025-05-10', status: 'Expired' },
  { domain: 'stackverse.ai', registrar: 'Cloudflare', expiry: '2025-06-20', status: 'Expiring soon' },
];

function StatusPill({ status }) {
  const classes =
    status === 'Active'
      ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-emerald-500/10 text-emerald-400 dark:bg-emerald-500/10 dark:text-emerald-300'
      : status === 'Expiring soon'
      ? 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-amber-500/10 text-amber-400 dark:bg-amber-500/10 dark:text-amber-300'
      : 'inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold bg-red-500/10 text-red-400 dark:bg-red-500/10 dark:text-red-300';

  return <span className={classes}>{status}</span>;
}

export default function WatchlistPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Watchlist"
        subtitle="Track domains you want to monitor closely."
        action={<Button variant="primary">Add domain</Button>}
      />

      <Card className="rounded-2xl border border-zinc-200 bg-white p-4 dark:border-zinc-800 dark:bg-zinc-950">
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-slate-900 dark:text-white">Watchlist</h3>
          <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Unified list of your tracked domains and statuses.</p>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="text-slate-500 dark:text-slate-400">
                <th className="px-4 py-3">Domain</th>
                <th className="px-4 py-3">Registrar</th>
                <th className="px-4 py-3">Expiry date</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
              {demoRows.map((row) => {
                const expired = row.status === 'Expired';
                return (
                  <tr key={row.domain} className="transition hover:bg-zinc-50 dark:hover:bg-white/5">
                    <td className="px-4 py-4 font-medium text-slate-900 dark:text-white">{row.domain}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">{row.registrar}</td>
                    <td className="px-4 py-4 text-slate-600 dark:text-slate-400">
                      <div className="flex flex-col">
                        <span>{row.expiry}</span>
                        {expired && <span className="mt-1 text-xs text-red-400">Already expired</span>}
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <StatusPill status={row.status} />
                    </td>
                    <td className="px-4 py-4">
                      <button className={`${expired ? 'text-red-400' : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'} text-sm font-medium transition underline-offset-2 hover:underline`}>View details</button>
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
