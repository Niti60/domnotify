'use client';

import { motion } from 'framer-motion';
import { Activity, ShieldCheck, Clock3 } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/cards/DashboardCard';
import { Button } from '@/components/ui/Button';
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

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-emerald-500/15 p-4 text-emerald-600">
              <ShieldCheck className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Uptime today</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">99.92%</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-blue-500/15 p-4 text-blue-600">
              <Activity className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active monitors</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">8</p>
            </div>
          </div>
        </DashboardCard>
        <DashboardCard>
          <div className="flex items-start gap-4">
            <div className="rounded-3xl bg-purple-500/15 p-4 text-purple-600">
              <Clock3 className="h-6 w-6" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Avg response time</p>
              <p className="text-3xl font-semibold text-slate-900 dark:text-white">142ms</p>
            </div>
          </div>
        </DashboardCard>
      </div>

      <DashboardCard title="Uptime Trend">
        <div className="h-80 min-h-80">
          <ResponsiveContainer width="100%" height={320}>
            <AreaChart data={uptimeData}>
              <CartesianGrid strokeDasharray="3 3" stroke="currentColor" />
              <XAxis dataKey="time" />
              <YAxis domain={[99, 100]} />
              <Tooltip />
              <Area type="monotone" dataKey="uptime" stroke="#3b82f6" fill="#eff6ff" strokeWidth={3} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </DashboardCard>

      <DashboardCard title="Current Monitors">
        <div className="space-y-3">
          {monitors.map((monitor, index) => (
            <motion.div
              key={monitor.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className="flex items-center justify-between rounded-2xl border border-white/10 p-4 hover:bg-white/5 dark:hover:bg-white/10 transition"
            >
              <div>
                <p className="font-semibold text-slate-900 dark:text-white">{monitor.name}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400">Response time: {monitor.response}</p>
              </div>
              <Badge variant={monitor.status === 'Online' ? 'success' : monitor.status === 'Degraded' ? 'warning' : 'danger'}>
                {monitor.status}
              </Badge>
            </motion.div>
          ))}
        </div>
      </DashboardCard>
    </div>
  );
}
