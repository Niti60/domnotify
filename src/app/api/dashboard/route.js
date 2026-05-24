import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  createDomainExpiryAlerts,
  ensureDb,
  getDashboardStats,
  getUserDomains,
} from '@/lib/domainService';
import { formatRelativeTime, serializeDomain } from '@/lib/domainHelpers';
import Alert from '@/models/Alert';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();
    await createDomainExpiryAlerts(auth.userId);

    const dashboard = await getDashboardStats(auth.userId);
    const domains = await getUserDomains(auth.userId);
    const serialized = domains.map(serializeDomain);

    const expiringDomains = serialized
      .filter((d) => d.daysLeft !== null && d.daysLeft <= 30)
      .sort((a, b) => (a.daysLeft ?? 0) - (b.daysLeft ?? 0))
      .slice(0, 10);

    const monitoringDomains = serialized.slice(0, 20);
    const watchlistDomains = serialized.filter((d) => d.watchlist).slice(0, 10);

    const alerts = await Alert.find({ user: auth.userId })
      .sort({ createdAt: -1 })
      .limit(10)
      .populate('domain', 'domainName')
      .lean();

    const recentActivity = alerts.map((alert) => ({
      id: alert._id.toString(),
      message: alert.message,
      time: formatRelativeTime(alert.createdAt),
      read: alert.read,
    }));

    return NextResponse.json({
      success: true,
      stats: dashboard.stats,
      totalDomains: dashboard.totalDomains,
      expiringCount: dashboard.expiringCount,
      sslAlertCount: dashboard.sslAlertCount,
      renewalBudget: dashboard.renewalBudget,
      watchlistCount: dashboard.watchlistCount,
      monitoredCount: dashboard.monitoredCount,
      expiringDomains,
      monitoringDomains,
      watchlistDomains,
      recentActivity,
    });
  } catch (error) {
    console.error('Dashboard API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load dashboard data' },
      { status: 500 },
    );
  }
}
