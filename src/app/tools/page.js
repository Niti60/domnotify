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
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-muted text-foreground">
              <tool.icon className="h-6 w-6" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">{tool.name}</h3>
              <p className="text-sm leading-6 text-muted-foreground">{tool.description}</p>
            </div>
            <Button size="sm" variant="primary">
              Open
            </Button>
          </Card>
        ))}
      </div>

      <Card>
        <div className="grid gap-6 md:grid-cols-3">
          {[
            ['Quick access', 'Start with the domain search or SSL check.'],
            ['Automations', 'Configure alerts for expiring domains.'],
            ['Visibility', 'Keep your domain portfolio secure and renewal-ready.'],
          ].map(([label, value]) => (
            <div key={label}>
              <p className="text-sm text-muted-foreground">{label}</p>
              <p className="mt-2 text-xl font-semibold text-foreground">{value}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
