import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { checkDomainSSL, ensureDb } from '@/lib/domainService';
import { serializeDomain } from '@/lib/domainHelpers';
import Domain from '@/models/Domain';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const domains = await Domain.find({ user: auth.userId }).sort({ domainName: 1 });

    const checked = await Promise.all(
      domains.map(async (domain) => {
        await checkDomainSSL(domain);
        return serializeDomain(domain);
      }),
    );

    const summary = {
      active: checked.filter((c) => c.sslStatus === 'Valid').length,
      expiringSoon: checked.filter((c) => c.sslStatus === 'Renew soon').length,
      expired: checked.filter((c) => c.sslStatus === 'Expired').length,
      unknown: checked.filter((c) => c.sslStatus === 'Unknown').length,
    };

    return NextResponse.json({
      success: true,
      summary,
      certificates: checked,
    });
  } catch (error) {
    console.error('SSL Monitor API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load SSL monitor data' },
      { status: 500 },
    );
  }
}
