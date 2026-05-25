'use client';

import { useCallback, useEffect, useState } from 'react';
import { Search, X, Plus, Eye, Trash2, Loader2, BookmarkCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { Card } from '@/components/ui/Card';
import { SearchBar } from '@/components/ui/SearchBar';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { EmptyState } from '@/components/ui/EmptyState';
import { CardSkeleton } from '@/components/ui/Skeleton';
import { apiFetch } from '@/lib/apiClient';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext';

export default function SearchDomainPage() {
  const router = useRouter();
  const { user } = useAuth();
  const [query, setQuery] = useState('');
  const [searched, setSearched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [results, setResults] = useState([]);
  const [tlds, setTlds] = useState(['.com', '.io', '.dev', '.app', '.co', '.ai']);
  const [history, setHistory] = useState([]);
  const [watchlist, setWatchlist] = useState([]); // Stores { domainName, _id }
  const [actionLoading, setActionLoading] = useState({});

  const loadWatchlist = useCallback(async () => {
    try {
      const res = await apiFetch('/api/watchlist');
      if (res.success) {
        setWatchlist(res.domains.map(d => ({ domainName: d.domainName, _id: d._id })));
      }
    } catch (err) {
      // Don't show error for watchlist load on search page if unauthenticated
      if (err.message !== 'Not authenticated' && err.message !== 'Unauthorized' && err.message !== '401') {
        console.error('Failed to load watchlist:', err);
      }
    }
  }, []);

  const loadHistory = useCallback(() => {
    apiFetch('/api/search-history')
      .then((res) => setHistory(res.history || []))
      .catch((err) => {
        // Silently fail for history if unauthenticated
      });
  }, []);

  useEffect(() => {
    loadHistory();
    loadWatchlist();
  }, [loadHistory, loadWatchlist]);

  const handleSearch = async (value) => {
    if (!value?.trim()) return;
    setQuery(value);
    setLoading(true);
    setError('');
    setSearched(true);
    try {
      const res = await apiFetch(`/api/search?q=${encodeURIComponent(value)}`);
      if (res.success) {
        setResults(res.results || []);
        if (res.tlds) setTlds(res.tlds);
        loadHistory();
        // Refresh watchlist to ensure accurate status after search
        loadWatchlist();
      } else {
        setError(res.message || 'Failed to search');
      }
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteHistory = async (id) => {
    try {
      await apiFetch(`/api/search-history/${id}`, { method: 'DELETE' });
      setHistory((prev) => prev.filter((h) => h._id !== id));
    } catch {
      /* ignore */
    }
  };

  const toggleWatchlist = async (result) => {
    if (!user) {
      toast('Login required to save domains');
      return;
    }

    const existing = watchlist.find(w => w.domainName.toLowerCase() === result.domain.toLowerCase());
    const isAdding = !existing;

    // Optimistic Update
    const prevWatchlist = [...watchlist];
    if (isAdding) {
      setWatchlist(prev => [...prev, { domainName: result.domain, _id: 'temp' }]);
    } else {
      setWatchlist(prev => prev.filter(w => w.domainName.toLowerCase() !== result.domain.toLowerCase()));
    }

    setActionLoading(prev => ({ ...prev, [result.domain]: true }));

    try {
      if (isAdding) {
        const res = await apiFetch('/api/watchlist', {
          method: 'POST',
          body: JSON.stringify({
            domainName: result.domain,
            registrar: result.registrar || 'Pending',
            renewalPrice: result.price,
          }),
        });
        if (res.success) {
          setWatchlist(prev => prev.map(w => w.domainName === result.domain ? { domainName: w.domainName, _id: res.domain._id } : w));
          toast.success(`"${result.domain}" added to watchlist`);
        } else {
          throw new Error(res.message);
        }
      } else {
        const res = await apiFetch(`/api/watchlist/${existing._id}`, { method: 'DELETE' });
        if (res.success) {
          toast.success(`"${result.domain}" removed from watchlist`);
        } else {
          throw new Error(res.message);
        }
      }
    } catch (err) {
      // Rollback
      setWatchlist(prevWatchlist);
      toast.error(err.message || `Failed to ${isAdding ? 'add' : 'remove'} domain`);
    } finally {
      setActionLoading(prev => ({ ...prev, [result.domain]: false }));
    }
  };

  const handleHistoryClick = (q) => {
    handleSearch(q);
  };

  const isInWatchlist = (domain) => {
    return watchlist.some(w => w.domainName.toLowerCase() === domain.toLowerCase());
  };

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Search Domain"
        subtitle="Find available domains, compare registrar pricing, and discover smart alternatives."
        action={
          <div className="hidden sm:block">
            <Badge variant="info">Live WHOIS Data</Badge>
          </div>
        }
      />

      <Card className="space-y-6">
        <p className="text-sm text-muted-foreground">
          Type a keyword or brand name to search domain availability.
        </p>
        <SearchBar placeholder="example" onSearch={handleSearch} large />

        <div className="grid gap-3 sm:grid-cols-3">
          {tlds.map((tld) => (
            <Badge key={tld} variant="neutral" className="justify-center">
              {tld}
            </Badge>
          ))}
        </div>

        {history.length > 0 && (
          <div className="space-y-2 border-t border-border pt-4">
            <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
              Recent searches
            </p>
            <div className="flex flex-wrap gap-2">
              {history.slice(0, 8).map((item) => (
                <div
                  key={item._id}
                  className="group inline-flex items-center gap-1 rounded-md border border-border bg-muted px-3 py-1 text-sm text-foreground transition-colors duration-200 hover:bg-black/5 dark:hover:bg-white/5"
                >
                  <button
                    type="button"
                    onClick={() => handleHistoryClick(item.query)}
                    className="flex items-center"
                  >
                    {item.query}
                  </button>
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteHistory(item._id);
                    }}
                    className="ml-1 opacity-0 transition-opacity group-hover:opacity-100"
                  >
                    <X className="h-3 w-3 text-muted-foreground" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
      </Card>

      {loading ? (
        <div className="grid gap-4 lg:grid-cols-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <CardSkeleton key={i} />
          ))}
        </div>
      ) : searched ? (
        <div className="space-y-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm uppercase tracking-widest text-muted-foreground">Search results</p>
              <h2 className="text-2xl font-semibold text-foreground">
                {results.length} domains {results.length === 1 ? 'found' : 'found'}
              </h2>
            </div>
            <Button variant="secondary" onClick={() => setSearched(false)}>
              Back
            </Button>
          </div>

          {error && <Card className="text-destructive border-destructive/50">{error}</Card>}

          <div className="grid gap-4 lg:grid-cols-2">
            {results.length > 0 ? (
              results.map((result) => {
                const added = isInWatchlist(result.domain);
                return (
                  <Card key={result.domain} className="group relative overflow-hidden transition-all hover:shadow-md">
                    <div className="flex items-start justify-between gap-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <p className="text-xl font-bold text-foreground">{result.domain}</p>
                          {result.premium && (
                            <Badge variant="warning" className="text-[10px] uppercase">Premium</Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {result.available ? 'Ready for registration' : `Owned by ${result.registrar || 'someone else'}`}
                        </p>
                      </div>
                      <Badge variant={result.available ? 'success' : 'neutral'}>
                        {result.available ? 'Available' : 'Taken'}
                      </Badge>
                    </div>

                    <div className="mt-6 flex items-center justify-between gap-4">
                      <div>
                        <p className="text-lg font-bold text-blue-600 dark:text-blue-400">
                          {result.available ? result.price : 'N/A'}
                        </p>
                        <p className="text-[10px] uppercase tracking-wider text-muted-foreground">Estimate price</p>
                      </div>
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          variant="ghost"
                          title="View WHOIS"
                          onClick={() => router.push(`/whois-checker?domain=${result.domain}`)}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant={added ? 'secondary' : 'secondary'}
                          disabled={actionLoading[result.domain]}
                          onClick={() => toggleWatchlist(result)}
                          className={added ? 'text-blue-600 dark:text-blue-400' : ''}
                        >
                          {actionLoading[result.domain] ? (
                            <Loader2 className="h-4 w-4 animate-spin" />
                          ) : added ? (
                            <Trash2 className="h-4 w-4" />
                          ) : (
                            <Plus className="h-4 w-4" />
                          )}
                          <span className="hidden sm:inline ml-1">
                            {added ? 'Watchlist' : 'Watchlist'}
                          </span>
                        </Button>
                      </div>
                    </div>
                  </Card>
                );
              })
            ) : (
              !error && (
                <Card className="border-dashed text-center text-muted-foreground py-12">
                  No matching domains were found for &quot;{query}&quot;.
                </Card>
              )
            )}
          </div>
        </div>
      ) : (
        <EmptyState
          icon={Search}
          title="Ready to find a domain"
          description="Start your search with a keyword and review availability across suggested registrars."
        />
      )}
    </div>
  );
}
