'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Globe, Copy, Check } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { whoisData } from '@/data/dummyData';

export default function WhoisCheckerPage() {
  const [domain, setDomain] = useState('');
  const [checked, setChecked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);

  const handleCheck = (e) => {
    e.preventDefault();
    if (!domain.trim()) return;
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      setChecked(true);
    }, 800);
  };

  const copyText = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Whois Checker"
        subtitle="Lookup registration details and DNS records for any domain."
      />

      <Card className="space-y-6">
        <div>
          <p className="text-sm text-slate-500 dark:text-slate-400">Enter a domain name to review current WHOIS records.</p>
        </div>
        <form onSubmit={handleCheck} className="grid gap-4 sm:grid-cols-[1fr_auto]">
          <Input
            label="Domain"
            placeholder="secureapp.com"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
          />
          <Button type="submit" disabled={loading || !domain.trim()}>
            {loading ? 'Checking…' : 'Lookup'}
          </Button>
        </form>
      </Card>

      {checked ? (
        <div className="space-y-6">
          <Card className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Domain</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{whoisData.domain}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Registrar</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{whoisData.registrar}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Registered</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{whoisData.created}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Expires</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{whoisData.expires}</p>
              </div>
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Registrant</p>
                <p className="mt-1 font-semibold text-slate-900 dark:text-white">{whoisData.registrant}</p>
              </div>
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Email</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-slate-900 dark:text-white">{whoisData.email}</span>
                  <button
                    type="button"
                    onClick={() => copyText(whoisData.email)}
                    className="rounded-xl bg-white/5 p-2 text-slate-600 transition hover:bg-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/10"
                  >
                    {copied === whoisData.email ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-slate-500 dark:text-slate-400">Nameservers</p>
                <div className="mt-3 space-y-2">
                  {whoisData.nameservers.map((ns) => (
                    <div key={ns} className="flex items-center justify-between rounded-3xl border border-white/10 bg-(--surface) px-4 py-3 dark:border-white/10 dark:bg-slate-950/95">
                      <span className="font-mono text-sm text-slate-900 dark:text-white">{ns}</span>
                      <button
                        type="button"
                        onClick={() => copyText(ns)}
                        className="rounded-xl bg-white/5 p-2 text-slate-600 transition hover:bg-white/10 dark:bg-slate-950 dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        {copied === ns ? <Check className="h-4 w-4 text-emerald-500" /> : <Copy className="h-4 w-4" />}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">Status</p>
                  <Badge variant="success">{whoisData.status}</Badge>
                </div>
                <div>
                  <p className="text-sm text-slate-500 dark:text-slate-400">DNSSEC</p>
                  <Badge variant="neutral">{whoisData.dnssec}</Badge>
                </div>
              </div>
            </div>
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={Globe}
          title="No domain checked yet"
          description="Enter a domain name above to view registration details and DNS metadata."
        />
      )}
    </div>
  );
}
