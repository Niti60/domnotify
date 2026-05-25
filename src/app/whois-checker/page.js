'use client';

import { useEffect, useState, useCallback } from 'react';
import { useSearchParams } from 'next/navigation';
import { Globe, Copy, Check, ChevronDown, ChevronUp, Search, Info, Shield, Server, Network } from 'lucide-react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetch } from '@/lib/apiClient';

export default function WhoisCheckerPage() {
  const searchParams = useSearchParams();
  const [domain, setDomain] = useState('');
  const [results, setResults] = useState(null);
  const [loading, setLoading] = useState(false);
  const [copied, setCopied] = useState(null);
  const [showSubdomains, setShowSubdomains] = useState(false);
  const [error, setError] = useState(null);

  const handleCheck = useCallback(async (domainToChecked) => {
    const d = domainToChecked || domain;
    if (!d.trim()) return;

    setLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await apiFetch(`/api/whois?domain=${d.trim().toLowerCase()}`);
      if (response.success) {
        setResults(response.data);
      } else {
        setError(response.message || 'Failed to fetch WHOIS data');
      }
    } catch (err) {
      setError('An error occurred while fetching data');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [domain]);

  useEffect(() => {
    const domainParam = searchParams.get('domain');
    if (domainParam) {
      setDomain(domainParam);
      handleCheck(domainParam);
    }
  }, [searchParams, handleCheck]);

  const copyText = (text) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopied(text);
    setTimeout(() => setCopied(null), 2000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const whois = results?.whois?.whois || results?.whois || {};
  const dnsRecords = results?.dns?.records || [];
  const subdomains = results?.subdomains?.subdomains || [];

  const mainStats = [
    ['Domain', whois.domain_name || domain],
    ['Registrar', whois.registrar || 'N/A'],
    ['Registered', formatDate(whois.created_date || whois.registration_date)],
    ['Expires', formatDate(whois.expiration_date || whois.expiry_date)],
    ['Updated', formatDate(whois.updated_date)],
  ];

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
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleCheck();
          }}
          className="grid gap-4 sm:grid-cols-[1fr_auto]"
        >
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
        {error && (
          <p className="text-sm text-red-500 font-medium">{error}</p>
        )}
      </Card>

      {results ? (
        <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
          {/* Registration Details */}
          <div className="grid gap-6 lg:grid-cols-2">
            <Card className="space-y-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Info className="h-4 w-4 text-blue-500" />
                Registration Info
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                {mainStats.map(([label, value]) => (
                  <div key={label}>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-1 font-semibold text-foreground">{value}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="space-y-6">
              <h3 className="flex items-center gap-2 font-semibold text-foreground">
                <Shield className="h-4 w-4 text-emerald-500" />
                Ownership
              </h3>
              <div className="grid gap-4 sm:grid-cols-2">
                <div>
                  <p className="text-sm text-muted-foreground">Registrant</p>
                  <p className="mt-1 font-semibold text-foreground">
                    {whois.registrant_name || whois.registrant?.name || 'Private/Hidden'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-muted-foreground">Email</p>
                  <div className="mt-1 flex items-center gap-2">
                    <span className="truncate font-semibold text-foreground">
                      {whois.registrant_email || whois.registrant?.email || 'N/A'}
                    </span>
                    {(whois.registrant_email || whois.registrant?.email) && (
                      <button
                        type="button"
                        onClick={() => copyText(whois.registrant_email || whois.registrant?.email)}
                        className="rounded-lg border border-border p-2 text-muted-foreground transition-colors duration-200 hover:bg-black/5 hover:text-foreground dark:hover:bg-white/5"
                      >
                        {copied === (whois.registrant_email || whois.registrant?.email) ? (
                          <Check className="h-4 w-4 text-emerald-600" />
                        ) : (
                          <Copy className="h-4 w-4" />
                        )}
                      </button>
                    )}
                  </div>
                </div>
              </div>
              <div className="pt-2">
                <p className="text-sm text-muted-foreground">Status</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {Array.isArray(whois.status) ? (
                    whois.status.map((s) => (
                      <Badge key={s} variant="success">
                        {s}
                      </Badge>
                    ))
                  ) : (
                    <Badge variant="success">{whois.status || 'Active'}</Badge>
                  )}
                </div>
              </div>
            </Card>
          </div>

          {/* Nameservers */}
          <Card className="space-y-6">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Server className="h-4 w-4 text-purple-500" />
              Nameservers
            </h3>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {(whois.name_servers || whois.nameservers || []).map((ns) => (
                <div
                  key={ns}
                  className="flex items-center justify-between rounded-lg border border-border bg-muted/50 px-4 py-3"
                >
                  <span className="font-mono text-xs text-foreground truncate">{ns}</span>
                  <button
                    type="button"
                    onClick={() => copyText(ns)}
                    className="ml-2 rounded-lg p-1.5 text-muted-foreground transition-colors duration-200 hover:bg-black/10 hover:text-foreground dark:hover:bg-white/10"
                  >
                    {copied === ns ? (
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                    ) : (
                      <Copy className="h-3.5 w-3.5" />
                    )}
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* DNS Records */}
          <Card className="space-y-6">
            <h3 className="flex items-center gap-2 font-semibold text-foreground">
              <Network className="h-4 w-4 text-amber-500" />
              DNS Records
            </h3>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm text-muted-foreground">
                <thead className="border-b border-border text-foreground">
                  <tr>
                    <th className="px-4 py-3 text-left font-semibold">Type</th>
                    <th className="px-4 py-3 text-left font-semibold">Value</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {dnsRecords.length > 0 ? (
                    dnsRecords.map((record, index) => (
                      <tr key={index} className="hover:bg-black/5 dark:hover:bg-white/5">
                        <td className="px-4 py-3 font-semibold text-foreground">
                          <Badge variant="neutral">{record.type}</Badge>
                        </td>
                        <td className="px-4 py-3 font-mono text-xs break-all">{record.value}</td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="2" className="px-4 py-8 text-center text-muted-foreground italic">
                        No DNS records found or lookup failed.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </Card>

          {/* Subdomains Collapsible */}
          <Card className="p-0 overflow-hidden">
            <button
              onClick={() => setShowSubdomains(!showSubdomains)}
              className="flex w-full items-center justify-between p-6 transition-colors hover:bg-black/5 dark:hover:bg-white/5"
            >
              <div className="flex items-center gap-3">
                <div className="rounded-lg bg-blue-100 p-2 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400">
                  <Search className="h-5 w-5" />
                </div>
                <div className="text-left">
                  <h3 className="font-semibold text-foreground">Discovered Subdomains</h3>
                  <p className="text-sm text-muted-foreground">
                    {subdomains.length} subdomains identified
                  </p>
                </div>
              </div>
              {showSubdomains ? (
                <ChevronUp className="h-5 w-5 text-muted-foreground" />
              ) : (
                <ChevronDown className="h-5 w-5 text-muted-foreground" />
              )}
            </button>
            {showSubdomains && (
              <div className="border-t border-border px-6 pb-6 pt-2">
                <div className="overflow-x-auto">
                  <table className="min-w-full text-sm text-muted-foreground">
                    <thead className="text-foreground">
                      <tr>
                        <th className="px-2 py-3 text-left font-semibold">Subdomain</th>
                        <th className="px-2 py-3 text-left font-semibold">CNAME/Target</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border">
                      {subdomains.length > 0 ? (
                        subdomains.map((sub, index) => (
                          <tr key={index}>
                            <td className="px-2 py-3 font-medium text-foreground">{sub.subdomain}</td>
                            <td className="px-2 py-3 font-mono text-xs truncate max-w-xs">{sub.cname || 'Pointed'}</td>
                          </tr>
                        ))
                      ) : (
                        <tr>
                          <td colSpan="2" className="py-4 text-center italic">No subdomains found.</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </Card>
        </div>
      ) : (
        <EmptyState
          icon={Globe}
          title={loading ? 'Checking domain metadata...' : 'No domain checked yet'}
          description={loading ? 'We are querying WHOIS servers and DNS records.' : 'Enter a domain name above to view registration details and DNS metadata.'}
        />
      )}
    </div>
  );
}
