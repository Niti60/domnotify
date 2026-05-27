'use client';

import { useEffect, useState } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/apiClient';
import { Search, Trash2, Edit, Users } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminUsersPage() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [filterPremium, setFilterPremium] = useState('');
  const [deleting, setDeleting] = useState(null);

  useEffect(() => {
    let active = true;

    (async () => {
      try {
        const params = new URLSearchParams({
          page,
          limit: 20,
          ...(search && { search }),
          ...(filterPremium && { filterPremium }),
        });

        const data = await apiFetch(`/api/admin/users?${params}`);

        if (!active) return;

        setUsers(data.data);
        setPagination(data.pagination);
      } catch (err) {
        if (!active) return;

        toast.error('Failed to load users');
        console.error(err);
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    })();

    return () => {
      active = false;
    };
  }, [page, search, filterPremium]);

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Delete user "${userName}"? This cannot be undone.`)) {
      return;
    }

    setDeleting(userId);
    try {
      await apiFetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
      });
      toast.success('User deleted successfully');

      const params = new URLSearchParams({
        page,
        limit: 20,
        ...(search && { search }),
        ...(filterPremium && { filterPremium }),
      });

      const data = await apiFetch(`/api/admin/users?${params}`);
      setUsers(data.data);
      setPagination(data.pagination);
    } catch (err) {
      toast.error(err.message || 'Failed to delete user');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="User Management"
        subtitle="Manage all platform users"
      />
      {/* Filters */}
      <Card className="p-6 space-y-4">
        <div className="grid gap-4 sm:grid-cols-3">
          <div>
            <label className="text-sm font-medium text-foreground">
              Search
            </label>
            <div className="mt-2 relative">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground"
              />
              <Input
                placeholder="Name or email..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  setPage(1);
                }}
                className="pl-10"
              />
            </div>
          </div>

          <div>
            <label className="text-sm font-medium text-foreground">
              Premium Status
            </label>
            <select
              value={filterPremium}
              onChange={(e) => {
                setFilterPremium(e.target.value);
                setPage(1);
              }}
              className="mt-2 w-full rounded-lg border border-border bg-background px-3 py-2 text-foreground text-sm"
            >
              <option value="">All</option>
              <option value="true">Premium Only</option>
              <option value="false">Free Only</option>
            </select>
          </div>

          <div className="flex items-end gap-2">
            <Button
              onClick={() => {
                setSearch('');
                setFilterPremium('');
                setPage(1);
              }}
              variant="outline"
              className="w-full"
            >
              Reset Filters
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-muted/50">
              <tr>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Name
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Email
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Role
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Premium
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Watchlist
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Joined
                </th>
                <th className="px-6 py-3 text-right font-medium text-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center">
                    <div className="flex justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-border border-t-foreground" />
                    </div>
                  </td>
                </tr>
              ) : users.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-muted-foreground">
                    No users found
                  </td>
                </tr>
              ) : (
                users.map((user, index) => (
                  <tr
                    key={user._id?.toString?.() || user.id || user.email || index}
                    className="border-b border-border hover:bg-muted/30 transition-colors"
                  >
                    <td className="px-6 py-4">
                      <span className="font-medium text-foreground">
                        {user.name}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.email}
                    </td>
                    <td className="px-6 py-4">
                      <Badge variant="secondary">{user.role}</Badge>
                    </td>
                    <td className="px-6 py-4">
                      {user.isPremiumUser ? (
                        <Badge variant="default">
                          {user.premiumPlanType}
                        </Badge>
                      ) : (
                        <span className="text-muted-foreground text-xs">
                          Free
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {user.watchlistCount}
                    </td>
                    <td className="px-6 py-4 text-muted-foreground whitespace-nowrap">
                      <span suppressHydrationWarning>
                        {user.createdAt ? (
                          new Date(user.createdAt).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                          })
                        ) : (
                          '—'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button
                        onClick={() =>
                          handleDeleteUser(user._id, user.name)
                        }
                        disabled={deleting === user._id}
                        className="inline-flex items-center gap-1.5 px-2 py-1.5 text-xs font-medium rounded text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors disabled:opacity-50"
                      >
                        <Trash2 size={14} />
                        {deleting === user._id ? 'Deleting...' : 'Delete'}
                      </button>
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
              Page {pagination.page} of {pagination.pages} ({pagination.total} total)
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
