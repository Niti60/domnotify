import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';

import {
  ensureDb,
  syncDomainWhois,
  checkDomainSSL,
} from '@/lib/domainService';

import {
  computeDomainStatus,
  parseRenewalPrice,
  serializeDomain,
} from '@/lib/domainHelpers';

import Domain from '@/models/Domain';

/**
 * Normalize registrar payload from WHOIS providers.
 * Supports:
 * - string registrar
 * - object registrar
 */
function normalizeRegistrar(registrar) {
  if (!registrar) {
    return 'Unknown';
  }

  if (typeof registrar === 'string') {
    return registrar;
  }

  if (typeof registrar === 'object') {
    return registrar.name || 'Unknown';
  }

  return 'Unknown';
}

/**
 * Normalize expiry date safely.
 */
function normalizeExpiryDate(expiryDate) {
  if (!expiryDate) {
    return null;
  }

  const parsed = new Date(expiryDate);

  if (Number.isNaN(parsed.getTime())) {
    return null;
  }

  return parsed;
}

/**
 * Validate domain format.
 */
function validateDomain(domain) {
  return /^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(
    domain
  );
}

/**
 * GET WATCHLIST
 */
export async function GET(req) {
  try {
    const auth = requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    await ensureDb();

    const domains = await Domain.find({
      user: auth.userId,
      watchlist: true,
    })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      domains: domains.map(serializeDomain),
    });
  } catch (error) {
    console.error('[WATCHLIST_GET_ERROR]', error);

    return NextResponse.json(
      {
        success: false,
        message: 'Failed to load watchlist',
      },
      {
        status: 500,
      }
    );
  }
}

/**
 * ADD / UPDATE WATCHLIST
 */
export async function POST(req) {
  try {
    const auth = requireAuth(req);

    if (auth.error) {
      return auth.error;
    }

    await ensureDb();

    const body = await req.json();

    const domainName = body.domainName
      ?.trim()
      .toLowerCase();

    /**
     * Validation
     */
    if (!domainName) {
      return NextResponse.json(
        {
          success: false,
          message: 'Domain name is required',
        },
        {
          status: 400,
        }
      );
    }

    if (!validateDomain(domainName)) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid domain name format',
        },
        {
          status: 400,
        }
      );
    }

    /**
     * Normalize payloads
     */
    const normalizedRegistrar =
      normalizeRegistrar(body.registrar);

    const normalizedExpiryDate =
      normalizeExpiryDate(body.expiryDate);

    const renewalPrice = parseRenewalPrice(
      body.renewalPrice
    );


    // Check existing domain
    const existing = await Domain.findOne({
      user: auth.userId,
      domainName,
    });

    /**
     * UPDATE EXISTING DOMAIN
     */
    if (existing) {
      existing.watchlist = true;
      existing.registrar = normalizedRegistrar;

      if (normalizedExpiryDate) {
        existing.expiryDate =
          normalizedExpiryDate;

        existing.status = computeDomainStatus(
          normalizedExpiryDate
        );
      }

      existing.renewalPrice = renewalPrice;
      existing.lastChecked = new Date();

      await existing.save();

      /**
       * Background enrichment
       * Non-blocking
       */
      Promise.allSettled([
        syncDomainWhois(existing),
        checkDomainSSL(existing),
      ]).catch((error) => {
        console.error(
          '[WATCHLIST_BACKGROUND_UPDATE_ERROR]',
          error
        );
      });

      return NextResponse.json({
        success: true,
        domain: serializeDomain(existing),
        message: 'Domain updated on watchlist',
      });
    }

    /**
     * CREATE NEW DOMAIN
     */
    const domain = await Domain.create({
      user: auth.userId,
      domainName,
      registrar: normalizedRegistrar,
      expiryDate: normalizedExpiryDate,
      renewalPrice,
      watchlist: true,
      status: computeDomainStatus(
        normalizedExpiryDate
      ),
      lastChecked: new Date(),
    });

    /**
     * Instant response
     * Background enrichment afterwards
     */
    const response = NextResponse.json(
      {
        success: true,
        domain: serializeDomain(domain),
        message: 'Domain added to watchlist',
      },
      {
        status: 201,
      }
    );

    /**
     * Background enrichment
     * Non-blocking
     */
    Promise.allSettled([
      syncDomainWhois(domain),
      checkDomainSSL(domain),
    ]).catch((error) => {
      console.error(
        '[WATCHLIST_BACKGROUND_CREATE_ERROR]',
        error
      );
    });

    return response;
  } catch (error) {
    console.error(
      '[WATCHLIST_POST_ERROR]',
      error
    );

    /**
     * Duplicate domain
     */
    if (error.code === 11000) {
      return NextResponse.json(
        {
          success: false,
          message:
            'Domain already exists in your portfolio',
        },
        {
          status: 409,
        }
      );
    }

    return NextResponse.json(
      {
        success: false,
        message:
          'Failed to add domain to watchlist',
      },
      {
        status: 500,
      }
    );
  }
}
