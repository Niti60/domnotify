'use client';

import { motion } from 'framer-motion';
import { Wrench, ShieldCheck, Sparkles, Globe } from 'lucide-react';
import { SectionHeader } from '@/components/ui/SectionHeader';
import { DashboardCard } from '@/components/cards/DashboardCard';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';

const tools = [
  { title: 'SSL Audit', description: 'Scan certificates and detect vulnerabilities.', icon: ShieldCheck, status: 'Live' },
  { title: 'Domain Health', description: 'Analyze domain reputation and performance.', icon: Globe, status: 'Live' },
  { title: 'AI Name Generator', description: 'Create domain ideas using AI.', icon: Sparkles, status: 'New' },
  { title: 'Bulk Manager', description: 'Manage registrations across portfolios.', icon: Wrench, status: 'Live' },
];

export default function PowerToolsPage() {
  return (
    <div className="space-y-8">
      <SectionHeader
        title="Power Tools"
        subtitle="Essential utilities to manage and optimize your domains"
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {tools.map((tool, index) => {
          const Icon = tool.icon;
          return (
            <motion.div
              key={tool.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.06 }}
            >
              <DashboardCard>
                <div className="flex items-start gap-4">
                  <div className="rounded-3xl bg-blue-500/10 p-4 text-blue-600 dark:bg-blue-500/15 dark:text-blue-300">
                    <Icon className="h-6 w-6" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <h3 className="text-xl font-semibold text-slate-900 dark:text-white">{tool.title}</h3>
                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{tool.description}</p>
                      </div>
                      <Badge variant={tool.status === 'New' ? 'purple' : 'success'}>{tool.status}</Badge>
                    </div>
                    <div className="mt-6 flex flex-wrap gap-3">
                      <Button size="sm" variant="primary">Open</Button>
                      <Button size="sm" variant="secondary">Learn More</Button>
                    </div>
                  </div>
                </div>
              </DashboardCard>
            </motion.div>
          );
        })}
      </div>

      <DashboardCard title="Toolbox Summary">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="rounded-2xl border border-white/10 p-5 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">Active tools</p>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">4</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">New tools</p>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">1</p>
          </div>
          <div className="rounded-2xl border border-white/10 p-5 dark:border-white/10">
            <p className="text-sm text-slate-500 dark:text-slate-400">Automations</p>
            <p className="text-3xl font-semibold text-slate-900 dark:text-white">12</p>
          </div>
        </div>
      </DashboardCard>
    </div>
  );
}
