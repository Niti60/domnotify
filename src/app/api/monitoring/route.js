import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import {
  createDomainExpiryAlerts,
  ensureDb,
  getMonitoringSummary,
} from '@/lib/domainService';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();
    await createDomainExpiryAlerts(auth.userId);

    const summary = await getMonitoringSummary(auth.userId);

    return NextResponse.json({
      success: true,
      renewalBudget: summary.renewalBudget,
      domainsExpiringIn10: summary.domainsExpiringIn10,
      sslRenewalsDue: summary.sslRenewalsDue,
      domainsDueIn30: summary.domainsDueIn30,
      highPriorityAlerts: summary.highPriorityAlerts,
      domains: summary.domains,
    });
  } catch (error) {
    console.error('Monitoring API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load monitoring data' },
      { status: 500 },
    );
  }
}
