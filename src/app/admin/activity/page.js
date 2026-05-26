'use client';

import { useEffect, useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/apiClient';
import { LogIn, Search } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminActivityPage() {
  const [activity, setActivity] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [activityType, setActivityType] = useState('login');

  useEffect(() => {
    apiFetch(`/api/admin/activity?type=${activityType}&page=${page}&limit=50`)
      .then((data) => {
        setActivity(data.data);
        setPagination(data.pagination);
      })
      .catch((err) => {
        toast.error('Failed to load activity');
        console.error(err);
      })
      .finally(() => setLoading(false));
  }, [page, activityType]);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <SectionTitle
          title="Activity Logs"
          subtitle="Track user activity across the platform"
        />
        <div className="flex gap-2">
          <button
            onClick={() => {
              setActivityType('login');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activityType === 'login'
                ? 'bg-foreground text-background'
                : 'border border-border hover:bg-muted'
              }`}
          >
            <LogIn size={16} className="inline mr-2" />
            Logins
          </button>
          <button
            onClick={() => {
              setActivityType('search');
              setPage(1);
            }}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${activityType === 'search'
                ? 'bg-foreground text-background'
                : 'border border-border hover:bg-muted'
              }`}
          >
            <Search size={16} className="inline mr-2" />
            Searches
          </button>
        </div>
      </div>

      {/* Activity Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  User
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  {activityType === 'login' ? 'Last Login' : 'Search Query'}
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Premium
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Timestamp
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
                    </div>
                  </td>
                </tr>
              ) : activity.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    No {activityType} activity found
                  </td>
                </tr>
              ) : (
                activity.map((item) => (
                  <tr
                    key={String(item._id)}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">
                        {item.user?.name || item.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {item.user?.email || item.email}
                    </td>
                    <td className="px-6 py-4">
                      {activityType === 'login' ? (
                        item.lastLogin ? (
                          new Date(item.lastLogin).toLocaleString()
                        ) : (
                          <span className="text-muted-foreground">Never</span>
                        )
                      ) : (
                        <span className="font-mono text-xs text-muted-foreground">
                          {item.query}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      {item.isPremiumUser ? (
                        <Badge variant="default">Premium</Badge>
                      ) : (
                        <span className="text-xs text-muted-foreground">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {activityType === 'login'
                        ? item.lastLogin
                          ? new Date(item.lastLogin).toLocaleDateString()
                          : '—'
                        : new Date(item.searchedAt).toLocaleString()}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-border px-6 py-4">
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
      </Card>
    </div>
  );
}
