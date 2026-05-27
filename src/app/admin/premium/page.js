'use client';

import { useEffect, useState, useCallback } from 'react';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { Card } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { apiFetch } from '@/lib/apiClient';
import { Crown } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminPremiumPage() {
  const [premiumUsers, setPremiumUsers] = useState([]);
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState(null);
  const [editing, setEditing] = useState(null);

  const loadPremiumUsers = useCallback(async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/premium?page=${page}&limit=20`);
      setPremiumUsers(data.data || []);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err) {
      toast.error('Failed to load premium users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, [page]);

  useEffect(() => {
    loadPremiumUsers();
  }, [loadPremiumUsers]);

  const handleTogglePremium = async (userId, currentPremium) => {
    try {
      await apiFetch('/api/admin/premium', {
        method: 'PATCH',
        body: JSON.stringify({
          userId,
          isPremiumUser: !currentPremium,
          premiumPlanType: 'custom',
        }),
      });
      toast.success('Premium status updated');
      loadPremiumUsers();
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update premium status');
    }
  };

  const handleChangePlan = async (userId, newPlan) => {
    try {
      await apiFetch('/api/admin/premium', {
        method: 'PATCH',
        body: JSON.stringify({
          userId,
          premiumPlanType: newPlan,
        }),
      });
      toast.success('Plan updated');
      loadPremiumUsers();
      setEditing(null);
    } catch (err) {
      toast.error(err.message || 'Failed to update plan');
    }
  };

  return (
    <div className="space-y-6">
      <SectionTitle
        title="Premium Management"
        subtitle="Manage premium subscriptions and plans"
      />

      {/* Stats */}
      {stats && (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Card className="p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Total Premium Users
            </p>
            <p className="text-3xl font-bold text-foreground">
              {stats.totalPremiumUsers}
            </p>
          </Card>
          <Card className="p-6 space-y-2">
            <p className="text-sm font-medium text-muted-foreground">
              Active Plans
            </p>
            <div className="flex gap-2">
              <Badge variant="success">Pro: {stats.planCounts?.pro || 0}</Badge>
              <Badge variant="warning">Business: {stats.planCounts?.business || 0}</Badge>
            </div>
          </Card>
          <Card className="p-6 space-y-2 text-primary">
            <div className="flex items-center gap-2">
              <Crown className="h-4 w-4" />
              <p className="text-sm font-medium">Conversion Rate</p>
            </div>
            <p className="text-3xl font-bold">{stats.conversionRate}%</p>
          </Card>
        </div>
      )}

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-border">
            <thead className="bg-muted/50">
              <tr>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  User
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Plan
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Status
                </th>
                <th className="px-6 py-4 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Join Date
                </th>
                <th className="px-6 py-4 text-right text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border bg-card">
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <tr key={i} className="animate-pulse">
                    <td colSpan={5} className="px-6 py-4">
                      <div className="h-4 w-full rounded bg-muted/50" />
                    </td>
                  </tr>
                ))
              ) : premiumUsers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                    No premium users found
                  </td>
                </tr>
              ) : (
                premiumUsers.map((user) => (
                  <tr key={user._id} className="hover:bg-muted/30 transition-colors">
                    <td className="whitespace-nowrap px-6 py-4">
                      <div className="flex flex-col">
                        <span className="font-medium text-foreground">{user.name}</span>
                        <span className="text-xs text-muted-foreground">{user.email}</span>
                      </div>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant={user.premiumPlanType === 'business' ? 'warning' : 'success'}>
                        {user.premiumPlanType}
                      </Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4">
                      <Badge variant="neutral">Active</Badge>
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-sm text-muted-foreground">
                      {new Date(user.createdAt).toLocaleDateString()}
                    </td>
                    <td className="whitespace-nowrap px-6 py-4 text-right text-sm">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => setEditing(user._id)}
                        >
                          Modify
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-destructive hover:text-destructive hover:bg-destructive/10"
                          onClick={() => handleTogglePremium(user._id, true)}
                        >
                          Revoke
                        </Button>
                      </div>

                      {editing === user._id && (
                        <div className="absolute right-0 z-10 mt-2 w-48 origin-top-right rounded-md border border-border bg-card p-2 shadow-lg ring-1 ring-black ring-opacity-5">
                          <div className="grid gap-1">
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => handleChangePlan(user._id, 'pro')}
                            >
                              Upgrade to Pro
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start"
                              onClick={() => handleChangePlan(user._id, 'business')}
                            >
                              Upgrade to Business
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="justify-start text-destructive"
                              onClick={() => setEditing(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {pagination && pagination.pages > 1 && (
          <div className="flex items-center justify-between border-t border-border bg-muted/30 px-6 py-4">
            <p className="text-sm text-muted-foreground">
              Showing page {page} of {pagination.pages}
            </p>
            <div className="flex gap-2">
              <Button
                variant="outline"
                size="sm"
                disabled={page === 1}
                onClick={() => setPage(page - 1)}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                disabled={page === pagination.pages}
                onClick={() => setPage(page + 1)}
              >
                Next
              </Button>
            </div>
          </div>
        )}
      </Card>
    </div>
  );
}
