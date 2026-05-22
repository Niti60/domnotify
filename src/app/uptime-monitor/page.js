'use client';

import { Activity, ShieldCheck, Clock3 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/cards/DashboardCard';
import { Badge } from '@/components/ui/Badge';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const uptimeData = [
  { time: '00:00', uptime: 99.5 },
  { time: '04:00', uptime: 99.8 },
  { time: '08:00', uptime: 100 },
  { time: '12:00', uptime: 99.9 },
  { time: '16:00', uptime: 100 },
  { time: '20:00', uptime: 99.7 },
  { time: '24:00', uptime: 99.9 },
];

const monitors = [
  { name: 'app.example.com', status: 'Online', response: '120ms' },
  { name: 'api.example.com', status: 'Online', response: '98ms' },
  { name: 'blog.example.com', status: 'Degraded', response: '310ms' },
  { name: 'dashboard.example.com', status: 'Offline', response: '—' },
];

export default function UptimeMonitorPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Uptime Monitor"
        subtitle="Track availability and response times across your monitored domains"
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-emerald-500/10 p-4 text-emerald-600 dark:text-emerald-400">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Uptime today</p>
              <p className="text-3xl font-semibold text-foreground">99.92%</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-blue-500/10 p-4 text-blue-600 dark:text-blue-400">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Active monitors</p>
              <p className="text-3xl font-semibold text-foreground">8</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-lg bg-muted p-4 text-foreground">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Avg response time</p>
              <p className="text-3xl font-semibold text-foreground">142ms</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Uptime Trend">
        <div className="h-80 min-h-80">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" className="stroke-border" />
              <XAxis dataKey="time" className="text-muted-foreground" />
              <YAxis domain={[99, 100]} className="text-muted-foreground" />
              <Tooltip />
              <Area type="monotone" dataKey="uptime" stroke="#2563eb" fill="#2563eb" fillOpacity={0.1} strokeWidth={2} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <DashboardCard title="Current Monitors">
        <div className="space-y-3">
          {monitors.map((monitor) => (
            <div
              key={monitor.name}
              className="flex items-center justify-between rounded-lg border border-border p-4 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div>
                <p className="font-semibold text-foreground">{monitor.name}</p>
                <p className="text-sm text-muted-foreground">Response time: {monitor.response}</p>
              </div>
              <Badge
                variant={
                  monitor.status === 'Online'
                    ? 'success'
                    : monitor.status === 'Degraded'
                      ? 'warning'
                      : 'danger'
                }
              >
                {monitor.status}
              </Badge>
            </div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
