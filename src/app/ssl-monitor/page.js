'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';
import { apiFetch, statusToVariant } from '@/lib/apiClient';
import { ShieldAlert, ChevronDown, ChevronUp, Lock, Calendar, Fingerprint, Activity } from 'lucide-react';
import AuthRequiredState from '@/components/auth/AuthRequiredState';

export default function SSLMonitorPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});

  useEffect(() => {
    apiFetch('/api/ssl-monitor')
      .then(setData)
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <div className="space-y-8">
        <SectionTitle title="SSL Monitor" subtitle="Running TLS certificate checks..." />
        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      </div>
    );
  }

  if (error === 'Not authenticated' || error === 'Unauthorized' || error === '401') {
    return (
      <AuthRequiredState
        title="Please login to monitor SSL certificates"
        description="Your monitoring data, SSL checks, and watchlist are linked to your account."
      />
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <SectionTitle title="SSL Monitor" subtitle="Unable to load SSL data." />
        <Card className="text-center text-destructive">{error}</Card>
      </div>
    );
  }

  const certificates = data?.certificates || [];
  const summary = data?.summary || { active: 0, expiringSoon: 0, expired: 0 };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="SSL Monitor"
        subtitle="View certificate status, upcoming expiry, and renewal priorities."
      />

      <div className="grid gap-6 sm:grid-cols-3">
        <Card className="text-center group transition-all hover:shadow-md">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Active</p>
          <p className="mt-3 text-4xl font-bold text-foreground">{summary.active}</p>
        </Card>
        <Card className="text-center group transition-all hover:shadow-md">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Expiring soon</p>
          <p className="mt-3 text-4xl font-bold text-amber-600 dark:text-amber-400">
            {summary.expiringSoon}
          </p>
        </Card>
        <Card className="text-center group transition-all hover:shadow-md border-red-200 dark:border-red-900/30">
          <p className="text-sm text-muted-foreground uppercase tracking-wider">Expired</p>
          <p className="mt-3 text-4xl font-bold text-red-600 dark:text-red-400">
            {summary.expired}
          </p>
        </Card>
      </div>

      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">Certificate status</h2>
            <p className="text-sm text-muted-foreground">
              Combined local TLS and WHOISJSON SSL monitoring.
            </p>
          </div>
          <Button size="sm" variant="secondary">
            Refresh All
          </Button>
        </div>

        {certificates.length === 0 ? (
          <EmptyState
            icon={ShieldAlert}
            title="No SSL certificates to monitor"
            description="Add domains to your portfolio to run live TLS checks."
            action={
              <Link href="/watchlist">
                <Button variant="primary" size="sm">
                  Add domain
                </Button>
              </Link>
            }
          />
        ) : (
          <div className="divide-y divide-border rounded-lg border border-border">
            {certificates.map((cert) => (
              <div key={cert._id || cert.domain} className="group">
                <div
                  className="flex flex-col gap-4 px-6 py-5 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between cursor-pointer"
                  onClick={() => toggleExpand(cert._id)}
                >
                  <div className="flex items-center gap-4">
                    <div className={`p-2 rounded-lg bg-muted text-foreground ${cert.sslStatus === 'Valid' ? 'text-emerald-500' : 'text-amber-500'}`}>
                      <Lock className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="font-bold text-foreground text-lg">{cert.domain}</p>
                      <p className="text-sm text-muted-foreground">
                        {cert.sslIssuer} · <span className={cert.sslStatus === 'Expired' ? 'text-red-500 font-medium' : ''}>SSL expires {cert.sslExpiresAt}</span>
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="text-right hidden sm:block">
                      <p className="text-xs text-muted-foreground uppercase tracking-widest">Health check</p>
                      <p className="text-sm font-medium">
                        {cert.sslDaysLeft !== null ? (
                          cert.sslDaysLeft < 0 ? (
                            <span className="text-red-500">Expired</span>
                          ) : (
                            <span className={cert.sslDaysLeft <= 30 ? 'text-amber-500' : 'text-emerald-500'}>
                              SSL expires in {cert.sslDaysLeft} days
                            </span>
                          )
                        ) : '—'}
                      </p>
                    </div>
                    <div className="flex items-center gap-3">
                      <StatusBadge variant={statusToVariant(cert.sslStatus)}>{cert.sslStatus}</StatusBadge>
                      {expanded[cert._id] ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </div>

                {expanded[cert._id] && (
                  <div className="bg-muted/30 px-6 py-8 border-t border-border animate-in slide-in-from-top-2 duration-300">
                    <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Calendar className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Validity Period</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground flex justify-between">
                            <span className="text-muted-foreground">Certificate issued:</span>
                            <span className="font-medium">{cert.sslValidFromAt || '—'}</span>
                          </p>
                          <p className="text-sm text-foreground flex justify-between">
                            <span className="text-muted-foreground">Certificate expires:</span>
                            <span className="font-medium">{cert.sslValidToAt || '—'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Fingerprint className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Identity</span>
                        </div>
                        <div className="space-y-1">
                          <p className="text-sm text-foreground truncate" title={cert.sslSerialNumber}>
                            <span className="text-muted-foreground block text-xs">Serial Number:</span>
                            <span className="font-mono text-xs">{cert.sslSerialNumber || 'N/A'}</span>
                          </p>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Lock className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Encryption</span>
                        </div>
                        <p className="text-sm font-medium text-foreground">{cert.sslEncryption || 'Standard TLS'}</p>
                      </div>

                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Activity className="h-4 w-4" />
                          <span className="text-xs font-semibold uppercase tracking-wider">Chain Status</span>
                        </div>
                        <Badge variant={cert.sslChainStatus === 'Valid' ? 'success' : 'neutral'}>
                          {cert.sslChainStatus || 'Unknown'}
                        </Badge>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="relative overflow-hidden transition-all duration-200 hover:border-blue-500/30 group">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Pro SSL Monitoring</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              Get notified immediately when your certificates are about to expire or if any chain issues are detected.
            </p>
            <Link href="/pricing" className="inline-block">
              <Button variant="primary">
                Upgrade Account
              </Button>
            </Link>
          </div>
          <Lock className="absolute -bottom-8 -right-8 h-48 w-48 text-muted-foreground/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-500/10" />
        </Card>

        <Card className="relative overflow-hidden transition-all duration-200 hover:border-emerald-500/30 group">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-foreground">Automated Renewal</h3>
            <p className="text-muted-foreground text-sm max-w-[280px]">
              Connect your domain registrar via API to enable seamless SSL renewal for all your active certificates.
            </p>
            <Link href="/registrars" className="inline-block">
              <Button variant="secondary">
                Check Integration
              </Button>
            </Link>
          </div>
          <Activity className="absolute -bottom-8 -right-8 h-48 w-48 text-muted-foreground/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-emerald-500/10" />
        </Card>
      </div>
    </div>
  );
}
