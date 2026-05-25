'use client';

import { useEffect, useState } from 'react';
import { StatCard } from '@/components/admin/StatCard';
import { Card } from '@/components/ui/Card';
import { SectionTitle } from '@/components/ui/SectionTitle';
import { apiFetch } from '@/lib/apiClient';
import {
  Users,
  Crown,
  BarChart3,
  AlertCircle,
  TrendingUp,
  Shield,
} from 'lucide-react';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    apiFetch('/api/admin/dashboard')
      .then((data) => setStats(data.stats))
      .catch((err) => console.error('Failed to load dashboard stats:', err))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-8">
      <SectionTitle
        title="Admin Dashboard"
        subtitle="Platform overview and operational metrics"
      />

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        <StatCard
          icon={Users}
          label="Total Users"
          value={loading ? '—' : stats?.totalUsers || 0}
          subtext={`${stats?.newUsersThisMonth || 0} new this month`}
        />
        <StatCard
          icon={Crown}
          label="Premium Users"
          value={loading ? '—' : stats?.premiumUsers || 0}
          subtext={`${((stats?.premiumUsers / stats?.totalUsers) * 100 || 0).toFixed(1)}% adoption`}
        />
        <StatCard
          icon={TrendingUp}
          label="Active Users (30d)"
          value={loading ? '—' : stats?.activeUsers || 0}
          subtext={`${((stats?.activeUsers / stats?.totalUsers) * 100 || 0).toFixed(1)}% engagement`}
        />
        <StatCard
          icon={BarChart3}
          label="Total Domains"
          value={loading ? '—' : stats?.totalDomains || 0}
          subtext={`${stats?.watchlistDomains || 0} on watchlists`}
        />
        <StatCard
          icon={AlertCircle}
          label="Expiring Soon"
          value={loading ? '—' : stats?.expiringDomains || 0}
          subtext={`${stats?.expiringSsl || 0} SSL certificates`}
        />
        <StatCard
          icon={Shield}
          label="Admin"
          value="Active"
          subtext="System operational"
        />
      </div>

      {stats?.premiumBreakdown && stats.premiumBreakdown.length > 0 && (
        <Card className="p-6">
          <h3 className="mb-6 text-lg font-bold text-foreground">
            Premium Plan Breakdown
          </h3>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {stats.premiumBreakdown.map((plan) => (
              <div
                key={plan._id}
                className="rounded-lg border border-border bg-card p-4"
              >
                <p className="text-sm font-medium capitalize text-muted-foreground">
                  {plan._id || 'Unknown'}
                </p>
                <p className="mt-2 text-2xl font-bold text-foreground">
                  {plan.count}
                </p>
                <p className="mt-1 text-xs text-muted-foreground">users</p>
              </div>
            ))}
          </div>
        </Card>
      )}

      <Card className="p-6">
        <h3 className="mb-4 text-lg font-bold text-foreground">Quick Actions</h3>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
          {[
            { href: '/admin/users', label: 'Manage Users' },
            { href: '/admin/watchlists', label: 'View Watchlists' },
            { href: '/admin/premium', label: 'Premium Plans' },
            { href: '/admin/activity', label: 'Activity Logs' },
            { href: '/dashboard', label: 'Main App' },
          ].map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="rounded-lg border border-border bg-background px-4 py-3 text-center text-sm font-medium transition-colors hover:bg-muted"
            >
              {link.label}
            </a>
          ))}
        </div>
      </Card>
    </div>
  );
}
