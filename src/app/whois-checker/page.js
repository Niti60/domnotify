'use client';

import { useState } from 'react';
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
        <p className="text-sm text-muted-foreground">
          Enter a domain name to review current WHOIS records.
        </p>
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
              {[
                ['Domain', whoisData.domain],
                ['Registrar', whoisData.registrar],
                ['Registered', whoisData.created],
                ['Expires', whoisData.expires],
              ].map(([label, value]) => (
                <div key={label}>
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <p className="mt-1 font-semibold text-foreground">{value}</p>
                </div>
              ))}
            </div>
          </Card>

          <Card className="space-y-6">
            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <p className="text-sm text-muted-foreground">Registrant</p>
                <p className="mt-1 font-semibold text-foreground">{whoisData.registrant}</p>
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Email</p>
                <div className="mt-1 flex items-center gap-2">
                  <span className="font-semibold text-foreground">{whoisData.email}</span>
                  <button
                    type="button"
                    onClick={() => copyText(whoisData.email)}
                    className="rounded-lg border border-border p-2 text-muted-foreground transition-colors duration-200 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                  >
                    {copied === whoisData.email ? (
                      <Check className="h-4 w-4 text-emerald-600" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>
            </div>
          </Card>

          <Card>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-muted-foreground">Nameservers</p>
                <div className="mt-3 space-y-2">
                  {whoisData.nameservers.map((ns) => (
                    <div
                      key={ns}
                      className="flex items-center justify-between rounded-lg border border-border bg-muted px-4 py-3"
                    >
                      <span className="font-mono text-sm text-foreground">{ns}</span>
                      <button
                        type="button"
                        onClick={() => copyText(ns)}
                        className="rounded-lg border border-border p-2 text-muted-foreground transition-colors duration-200 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                      >
                        {copied === ns ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Status</p>
                  <Badge variant="success" className="mt-2">
                    {whoisData.status}
                  </Badge>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">DNSSEC</p>
                  <Badge variant="neutral" className="mt-2">
                    {whoisData.dnssec}
                  </Badge>
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
