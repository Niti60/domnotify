'use client';

import { useEffect, useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/apiClient';
import { Eye } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminWatchlistsPage() {
  const [watchlists, setWatchlists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);

  useEffect(() => {
    apiFetch(`/api/admin/watchlists?page=${page}&limit=20`)
      .then((data) => {
        setWatchlists(data.data);
        setPagination(data.pagination);
      })
      .catch((err) => {
        toast.error('Failed to load watchlists');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page]);

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Watchlists"
        subtitle="All monitored domains across the platform"
      />

      {/* Watchlists List */}
      <div className="space-y-4">
        {loading ? (
          <Card className="p-8 flex justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
          </Card>
        ) : watchlists.length === 0 ? (
          <Card className="p-8 text-center text-muted-foreground">
            No watchlists found
          </Card>
        ) : (
          watchlists.map((watchlist) => (
            <Card key={String(watchlist.user._id)} className="p-6">
              <div className="flex items-start justify-between gap-4 mb-6">
                <div>
                  <h3 className="text-lg font-bold text-foreground">
                    {watchlist.user.name}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {watchlist.user.email}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <div className="text-right">
                    <p className="text-2xl font-bold text-foreground">
                      {watchlist.domainCount}
                    </p>
                    <p className="text-xs text-muted-foreground uppercase tracking-wider">
                      Domains
                    </p>
                  </div>
                  <Badge variant="secondary">{watchlist.user.role}</Badge>
                </div>
              </div>

              {/* Domains Table */}
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="border-b border-border">
                    <tr>
                      <th className="px-4 py-2 text-left font-medium text-foreground">
                        Domain
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-foreground">
                        Status
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-foreground">
                        Expiry
                      </th>
                      <th className="px-4 py-2 text-left font-medium text-foreground">
                        SSL
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {watchlist.domains.slice(0, 5).map((domain) => (
                      <tr key={String(domain._id)} className="border-b border-border/50">
                        <td className="px-4 py-2">
                          <span className="font-medium text-foreground">
                            {domain.domainName}
                          </span>
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              domain.status === 'Available'
                                ? 'success'
                                : domain.status === 'Expiring Soon'
                                  ? 'warning'
                                  : 'destructive'
                            }
                          >
                            {domain.status}
                          </Badge>
                        </td>
                        <td className="px-4 py-2 text-muted-foreground">
                          {domain.expiryDate
                            ? new Date(domain.expiryDate).toLocaleDateString()
                            : '—'}
                        </td>
                        <td className="px-4 py-2">
                          <Badge
                            variant={
                              domain.sslStatus === 'Valid'
                                ? 'success'
                                : domain.sslStatus === 'Renew soon'
                                  ? 'warning'
                                  : 'destructive'
                            }
                          >
                            {domain.sslStatus}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>

                {watchlist.domains.length > 5 && (
                  <div className="px-4 py-2 text-xs text-muted-foreground border-t border-border/50">
                    +{watchlist.domains.length - 5} more domains
                  </div>
                )}
              </div>
            </Card>
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination && pagination.pages > 1 && (
        <div className="flex items-center justify-between px-6 py-4">
          <span className="text-sm text-muted-foreground">
            Page {pagination.page} of {pagination.pages}
          </span>
          <div className="flex gap-2">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="px-3 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors text-sm font-medium"
            >
              Previous
            </button>
            <button
              onClick={() => setPage(Math.min(pagination.pages, page + 1))}
              disabled={page === pagination.pages}
              className="px-3 py-2 rounded-lg border border-border hover:bg-muted disabled:opacity-50 transition-colors text-sm font-medium"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
