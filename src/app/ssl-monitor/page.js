'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { Badge } from '@/components/ui/Badge';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { EmptyState } from '@/components/ui/EmptyState';

import {
  apiFetch,
  statusToVariant,
} from '@/lib/apiClient';

import {
  ShieldAlert,
  ChevronDown,
  ChevronUp,
  Lock,
  Calendar,
  Fingerprint,
  Activity,
  Search,
} from 'lucide-react';

export default function SSLMonitorPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [expanded, setExpanded] = useState({});
  const [search, setSearch] = useState('');

  const [searchResult, setSearchResult] =
    useState(null);

  const [searchHistory, setSearchHistory] =
    useState([]);

  const [checkingSSL, setCheckingSSL] =
    useState(false);

  useEffect(() => {
    const loadSSLData = async () => {
      try {
        setLoading(true);
        setError('');

        const response = await apiFetch(
          '/api/ssl-monitor'
        );

        if (!response?.success) {
          throw new Error(
            response?.message ||
            'Failed to load SSL data'
          );
        }

        setData(response);
      } catch (err) {
        console.error(
          '[SSL_MONITOR_LOAD_ERROR]',
          err
        );

        setError(
          err?.message ||
          'Unable to load SSL data'
        );
      } finally {
        setLoading(false);
      }
    };

    loadSSLData();
  }, []);

  const toggleExpand = (id) => {
    setExpanded((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleSSLCheck = async () => {
    if (!search.trim()) {
      toast.error(
        'Please enter a domain'
      );

      return;
    }

    let normalizedDomain = search
      .trim()
      .toLowerCase();

    // auto append .com
    if (
      normalizedDomain &&
      !normalizedDomain.includes('.')
    ) {
      normalizedDomain =
        `${normalizedDomain}.com`;

      toast.success(
        `Checking ${normalizedDomain}`
      );
    }

    // validation
    const domainRegex =
      /^(?:[a-zA-Z0-9-]+\.)+[a-zA-Z]{2,}$/;

    if (
      !domainRegex.test(
        normalizedDomain
      )
    ) {
      toast.error(
        'Invalid domain format'
      );

      return;
    }

    try {
      setCheckingSSL(true);

      const response = await fetch(
        `/api/ssl-monitor?domain=${encodeURIComponent(normalizedDomain)}`
      );

      const result =
        await response.json();

      if (!result.success) {
        throw new Error(
          result.message ||
          'SSL lookup failed'
        );
      }

      setSearchResult(result.data);

      setSearchHistory((prev) => {
        const updated = [
          normalizedDomain,
          ...prev.filter(
            (item) =>
              item !== normalizedDomain
          ),
        ];

        localStorage.setItem(
          'ssl-search-history',
          JSON.stringify(
            updated.slice(0, 5)
          )
        );

        return updated.slice(0, 5);
      });

      setSearch('');
    } catch (error) {
      console.error(
        'SSL Check Failed:',
        error
      );

      toast.error(
        error.message ||
        'SSL lookup failed'
      );
    } finally {
      setCheckingSSL(false);
    }
  };
  const cleanDomain =
    searchResult?.subject_cn?.replace(
      '*.',
      ''
    );

  if (loading) {
    return (
      <div className="space-y-8">
        <SectionTitle
          title="SSL Monitor"
          subtitle="Running TLS certificate checks..."
        />

        <div className="grid gap-6 sm:grid-cols-3">
          {Array.from({ length: 3 }).map(
            (_, i) => (
              <CardSkeleton key={i} />
            )
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-8">
        <SectionTitle
          title="SSL Monitor"
          subtitle="Unable to load SSL data."
        />

        <Card className="text-center text-destructive">
          {error}
        </Card>
      </div>
    );
  }

  const certificates =
    data?.certificates || [];

  const summary = data?.summary || {
    active: 0,
    expiringSoon: 0,
    expired: 0,
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="SSL Monitor"
        subtitle="View certificate status, upcoming expiry, and renewal priorities."
      />

      {/* Search */}
      <div className="flex justify-center py-2">
        <div className="flex w-full max-w-3xl items-center gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

            <input
              type="text"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleSSLCheck();
                }
              }}
              placeholder="Search domains, issuers, or certificate status..."
              className="h-11 w-full rounded-xl border border-border bg-background pl-11 pr-4 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-primary"
            />
          </div>

          <Button
            variant="primary"
            className="h-11 px-5"
            disabled={
              !search.trim() ||
              checkingSSL
            }
            onClick={handleSSLCheck}
          >
            {checkingSSL
              ? 'Checking...'
              : 'Check SSL'}
          </Button>
        </div>
      </div>

      {/* Search History */}
      {searchHistory.length > 0 && (
        <div className="flex flex-wrap items-center gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
            Recent Searches
          </p>

          {searchHistory.map((item) => (
            <button
              key={item}
              onClick={() =>
                setSearch(item)
              }
              className="rounded-full border border-border bg-muted/40 px-3 py-1 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
            >
              {item}
            </button>
          ))}
        </div>
      )}

      {/* Live SSL Result */}
      {searchResult && (
        <Card className="overflow-hidden border-border">
          <div className="border-b border-border px-6 py-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                  Live SSL Lookup
                </p>

                <h2 className="mt-2 text-2xl font-bold text-foreground">
                  {cleanDomain}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  SSL certificate
                  intelligence powered
                  by live TLS inspection.
                </p>
              </div>

              <Badge variant="success">
                Active SSL
              </Badge>
            </div>
          </div>

          <div className="grid gap-6 p-6 sm:grid-cols-2 lg:grid-cols-3">
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Issuer Organization
              </p>

              <p className="text-sm font-medium text-foreground">
                {searchResult.issuer_o}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Issuer CN
              </p>

              <p className="text-sm font-medium text-foreground">
                {searchResult.issuer_cn}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Signature Type
              </p>

              <p className="text-sm font-medium text-foreground">
                {
                  searchResult.signature_type
                }
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Valid From
              </p>

              <p className="text-sm font-medium text-foreground">
                {new Date(
                  searchResult.valid_from_timestamp *
                  1000
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Valid Until
              </p>

              <p className="text-sm font-medium text-foreground">
                {new Date(
                  searchResult.valid_to_timestamp *
                  1000
                ).toLocaleDateString()}
              </p>
            </div>

            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
                Serial Number
              </p>

              <p className="truncate font-mono text-xs text-muted-foreground">
                {
                  searchResult.serial_number
                }
              </p>
            </div>
          </div>
        </Card>
      )}

      {/* SSL label */}
      <div className="space-y-4 pt-2">
        <p className="px-1 text-xs font-semibold uppercase tracking-[0.2em] text-muted-foreground">
          Your SSLs
        </p>

        <div className="grid gap-6 sm:grid-cols-3">
          <Card className="text-center group transition-all hover:shadow-md">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Active
            </p>

            <p className="mt-3 text-3xl font-bold text-foreground">
              {summary.active}
            </p>
          </Card>

          <Card className="text-center group transition-all hover:shadow-md">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Expiring Soon
            </p>

            <p className="mt-3 text-3xl font-bold text-amber-500">
              {summary.expiringSoon}
            </p>
          </Card>

          <Card className="border-red-200 text-center transition-all hover:shadow-md dark:border-red-900/30">
            <p className="text-sm uppercase tracking-wider text-muted-foreground">
              Expired
            </p>

            <p className="mt-3 text-3xl font-bold text-red-500">
              {summary.expired}
            </p>
          </Card>
        </div>
      </div>



      {/* SSL list */}
      <Card>
        <div className="mb-6 flex items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Certificate status
            </h2>

            <p className="text-sm text-muted-foreground">
              Combined local TLS and
              WHOISJSON SSL
              monitoring.
            </p>
          </div>

          <Button
            size="sm"
            variant="secondary"
          >
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
                <Button
                  variant="primary"
                  size="sm"
                >
                  Add domain
                </Button>
              </Link>
            }
          />
        ) : (
          <>
            <div className="divide-y divide-border overflow-hidden rounded-lg border border-border">
              {certificates
                .slice(0, 3)
                .map((cert) => (
                  <div
                    key={
                      cert._id ||
                      cert.domain
                    }
                    className="group"
                  >
                    <div
                      className="flex cursor-pointer flex-col gap-4 px-6 py-5 transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5 sm:flex-row sm:items-center sm:justify-between"
                      onClick={() =>
                        toggleExpand(
                          cert._id
                        )
                      }
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`rounded-lg bg-muted p-2 ${cert.sslStatus ===
                            'Valid'
                            ? 'text-emerald-500'
                            : 'text-amber-500'
                            }`}
                        >
                          <Lock className="h-5 w-5" />
                        </div>

                        <div>
                          <p className="text-lg font-bold text-foreground">
                            {cert.domain}
                          </p>

                          <p className="text-sm text-muted-foreground">
                            {
                              cert.sslIssuer
                            }{' '}
                            · SSL expires{' '}
                            {
                              cert.sslExpiresAt
                            }
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-6">
                        <div className="hidden text-right sm:block">
                          <p className="text-xs uppercase tracking-widest text-muted-foreground">
                            Health Check
                          </p>

                          <p className="text-sm font-medium">
                            {cert.sslDaysLeft !==
                              null ? (
                              cert.sslDaysLeft <
                                0 ? (
                                <span className="text-red-500">
                                  Expired
                                </span>
                              ) : (
                                <span
                                  className={
                                    cert.sslDaysLeft <=
                                      30
                                      ? 'text-amber-500'
                                      : 'text-emerald-500'
                                  }
                                >
                                  SSL expires
                                  in{' '}
                                  {
                                    cert.sslDaysLeft
                                  }{' '}
                                  days
                                </span>
                              )
                            ) : (
                              '—'
                            )}
                          </p>
                        </div>

                        <div className="flex items-center gap-3">
                          <StatusBadge
                            variant={statusToVariant(
                              cert.sslStatus
                            )}
                          >
                            {
                              cert.sslStatus
                            }
                          </StatusBadge>

                          {expanded[
                            cert._id
                          ] ? (
                            <ChevronUp className="h-5 w-5 text-muted-foreground" />
                          ) : (
                            <ChevronDown className="h-5 w-5 text-muted-foreground" />
                          )}
                        </div>
                      </div>
                    </div>

                    {expanded[
                      cert._id
                    ] && (
                        <div className="animate-in slide-in-from-top-2 border-t border-border bg-muted/30 px-6 py-8 duration-300">
                          <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Calendar className="h-4 w-4" />

                                <span className="text-xs font-semibold uppercase tracking-wider">
                                  Validity
                                  Period
                                </span>
                              </div>

                              <div className="space-y-1">
                                <p className="flex justify-between text-sm text-foreground">
                                  <span className="text-muted-foreground">
                                    Issued:
                                  </span>

                                  <span className="font-medium">
                                    {cert.sslValidFromAt ||
                                      '—'}
                                  </span>
                                </p>

                                <p className="flex justify-between text-sm text-foreground">
                                  <span className="text-muted-foreground">
                                    Expires:
                                  </span>

                                  <span className="font-medium">
                                    {cert.sslValidToAt ||
                                      '—'}
                                  </span>
                                </p>
                              </div>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Fingerprint className="h-4 w-4" />

                                <span className="text-xs font-semibold uppercase tracking-wider">
                                  Identity
                                </span>
                              </div>

                              <p className="truncate font-mono text-xs text-muted-foreground">
                                {cert.sslSerialNumber ||
                                  'N/A'}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Lock className="h-4 w-4" />

                                <span className="text-xs font-semibold uppercase tracking-wider">
                                  Encryption
                                </span>
                              </div>

                              <p className="text-sm font-medium text-foreground">
                                {cert.sslEncryption ||
                                  'Standard TLS'}
                              </p>
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-muted-foreground">
                                <Activity className="h-4 w-4" />

                                <span className="text-xs font-semibold uppercase tracking-wider">
                                  Chain
                                  Status
                                </span>
                              </div>

                              <Badge
                                variant={
                                  cert.sslChainStatus ===
                                    'Valid'
                                    ? 'success'
                                    : 'neutral'
                                }
                              >
                                {cert.sslChainStatus ||
                                  'Unknown'}
                              </Badge>
                            </div>
                          </div>
                        </div>
                      )}
                  </div>
                ))}
            </div>

            {certificates.length >
              3 && (
                <div className="mt-5 flex justify-end">
                  <Link href="/monitoring">
                    <Button variant="ghost">
                      View all SSL
                      certificates →
                    </Button>
                  </Link>
                </div>
              )}
          </>
        )}
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="group relative overflow-hidden transition-all duration-200 hover:border-blue-500/30">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Pro SSL Monitoring
            </h3>

            <p className="max-w-[280px] text-sm text-muted-foreground">
              Get notified
              immediately when
              your certificates are
              about to expire or if
              any chain issues are
              detected.
            </p>

            <Link
              href="/pricing"
              className="inline-block"
            >
              <Button variant="primary">
                Upgrade Account
              </Button>
            </Link>
          </div>

          <Lock className="absolute -bottom-8 -right-8 h-48 w-48 text-muted-foreground/10 transition-transform duration-300 group-hover:scale-110 group-hover:text-blue-500/10" />
        </Card>

        <Card className="group relative overflow-hidden transition-all duration-200 hover:border-emerald-500/30">
          <div className="relative z-10 space-y-4">
            <h3 className="text-xl font-bold text-foreground">
              Automated Renewal
            </h3>

            <p className="max-w-[280px] text-sm text-muted-foreground">
              Connect your domain
              registrar via API to
              enable seamless SSL
              renewal for all your
              active certificates.
            </p>

            <Link
              href="/registrars"
              className="inline-block"
            >
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