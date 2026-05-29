import { NextResponse } from 'next/server';

import { requireAuth } from '@/lib/auth';

import {
  checkDomainSSL,
  ensureDb,
} from '@/lib/domainService';

import { serializeDomain } from '@/lib/domainHelpers';

import Domain from '@/models/Domain';

export async function GET(req) {
  try {
    const { searchParams } = new URL(req.url);

    const domain =
      searchParams.get('domain');

    /*
    =====================================
    SSL SEARCH MODE
    =====================================
    */

    if (domain) {
      const response = await fetch(
        `https://ssl-checker-api-lovat.vercel.app/api/ssl-check?domain=${encodeURIComponent(domain)}`,
        {
          cache: 'no-store',
        }
      );

      const data =
        await response.json();

      return NextResponse.json({
        success: true,
        data,
      });
    }

    /*
    =====================================
    SSL DASHBOARD MODE
    =====================================
    */

    const auth = requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    await ensureDb();

    const domains =
      await Domain.find({
        user: auth.userId,
      }).sort({
        domainName: 1,
      });

    /*
    =====================================
    BACKGROUND SSL REFRESH
    =====================================
    */

    domains.forEach((domain) => {
      const shouldRefresh =
        !domain.sslLastCheckedAt ||
        Date.now() -
        new Date(
          domain.sslLastCheckedAt
        ).getTime() >
        1000 * 60 * 60 * 6;

      if (shouldRefresh) {
        checkDomainSSL(domain).catch(
          (error) => {
            console.error(
              '[SSL_BACKGROUND_REFRESH_ERROR]',
              error
            );
          }
        );
      }
    });

    /*
    =====================================
    SERIALIZE DATA
    =====================================
    */

    const certificates =
      domains.map(serializeDomain);

    /*
    =====================================
    SUMMARY
    =====================================
    */

    const summary = {
      active: certificates.filter(
        (c) =>
          c.sslStatus === 'Valid'
      ).length,

      expiringSoon:
        certificates.filter(
          (c) =>
            c.sslStatus ===
            'Renew soon'
        ).length,

      expired: certificates.filter(
        (c) =>
          c.sslStatus ===
          'Expired'
      ).length,

      unknown: certificates.filter(
        (c) =>
          c.sslStatus ===
          'Unknown'
      ).length,
    };

    return NextResponse.json({
      success: true,
      summary,
      certificates,
    });
  } catch (error) {
    console.error(
      '[SSL_MONITOR_API_ERROR]',
      error
    );

    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to load SSL monitor data',
      },
      {
        status: 500,
      }
    );
  }
}