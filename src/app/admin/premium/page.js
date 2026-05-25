'use client';

import { useEffect, useState } from 'react';
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

  const loadPremiumUsers = async () => {
    setLoading(true);
    try {
      const data = await apiFetch(`/api/admin/premium?page=${page}&limit=20`);
      setPremiumUsers(data.data);
      setPagination(data.pagination);
      setStats(data.stats);
    } catch (err) {
      toast.error('Failed to load premium users');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPremiumUsers();
  }, [page]);

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

          {stats.planBreakdown && stats.planBreakdown.length > 0 && (
            stats.planBreakdown.map((plan) => (
              <Card key={plan._id} className="p-6 space-y-2">
                <p className="text-sm font-medium text-muted-foreground capitalize">
                  {plan._id || 'Unknown'} Plan
                </p>
                <p className="text-3xl font-bold text-foreground">
                  {plan.count}
                </p>
                <p className="text-xs text-muted-foreground">
                  {(
                    (plan.count / (stats.totalPremiumUsers || 1)) *
                    100
                  ).toFixed(1)}
                  % of premium
                </p>
              </Card>
            ))
          )}
        </div>
      )}

      {/* Premium Users Table */}
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
                  Plan
                </th>
                <th className="px-6 py-3 text-left font-medium text-foreground">
                  Subscriber Since
                </th>
                <th className="px-6 py-3 text-right font-medium text-foreground">
                  Actions
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
              ) : premiumUsers.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-muted-foreground">
                    No premium users found
                  </td>
                </tr>
              ) : (
                premiumUsers.map((user) => (
                  <tr
                    key={user._id}
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
                      <Badge variant="default">{user.premiumPlanType}</Badge>
                    </td>
                    <td className="px-6 py-4 text-muted-foreground">
                      {new Date(user.updatedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 text-right">
                      {editing === user._id ? (
                        <div className="flex gap-2 justify-end">
                          <select
                            onChange={(e) =>
                              handleChangePlan(user._id, e.target.value)
                            }
                            className="rounded border border-border bg-background px-2 py-1 text-xs"
                          >
                            <option value="">Select plan...</option>
                            <option value="pro">Pro</option>
                            <option value="ultra">Ultra</option>
                            <option value="enterprise">Enterprise</option>
                          </select>
                          <button
                            onClick={() => setEditing(null)}
                            className="px-2 py-1 text-xs rounded border border-border hover:bg-muted"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <button
                          onClick={() => setEditing(user._id)}
                          className="px-3 py-1.5 text-xs font-medium rounded text-purple-600 hover:bg-purple-50 dark:hover:bg-purple-900/20 transition-colors"
                        >
                          <Crown size={14} className="inline mr-1" />
                          Edit
                        </button>
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
