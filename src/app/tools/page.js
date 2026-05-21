'use client';

import { Search, Shield, Globe, Activity, Wand2, Eye, Database } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';

const tools = [
  { name: 'DNS Checker', description: 'Validate DNS records and propagation across regions.', icon: Database },
  { name: 'SSL Checker', description: 'Confirm certificate validity and expiry status.', icon: Shield },
  { name: 'Whois Lookup', description: 'View registration details for any domain name.', icon: Globe },
  { name: 'Uptime Monitor', description: 'Track availability and response time for websites.', icon: Activity },
  { name: 'Domain Generator', description: 'Create memorable domain ideas for new projects.', icon: Wand2 },
  { name: 'Expiry Checker', description: 'Find expiring domains and monitor renewal windows.', icon: Search },
  { name: 'Availability Audit', description: 'Check domain availability across top TLDs.', icon: Eye },
];

export default function ToolsPage() {
  return (
    <div className="space-y-8">
      <SectionTitle
        title="Tools"
        subtitle="Launch quick domain and security checks from a single toolkit."
      />

      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
        {tools.map((tool) => (
          <Card key={tool.name} className="space-y-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-3xl bg-white/5 text-slate-900 dark:bg-white/10 dark:text-white">
              <tool.icon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-slate-900 dark:text-white">{tool.name}</h3>
              <p className="text-sm leading-6 text-slate-600 dark:text-slate-400">{tool.description}</p>
            </div>
            <Button size="sm" variant="primary">Open</Button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="grid gap-6 md:grid-cols-3">
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Quick access</p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Start with the domain search or SSL check.</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Automations</p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Configure alerts for expiring domains.</p>
          </div>
          <div>
            <p className="text-sm text-slate-500 dark:text-slate-400">Visibility</p>
            <p className="mt-2 text-xl font-semibold text-slate-900 dark:text-white">Keep your domain portfolio secure and renewal-ready.</p>
          </div>
        </div>
      </Card>
    </div>
  );
}
