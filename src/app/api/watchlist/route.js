import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ensureDb } from '@/lib/domainService';
import { computeDomainStatus, parseRenewalPrice, serializeDomain } from '@/lib/domainHelpers';
import Domain from '@/models/Domain';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const domains = await Domain.find({ user: auth.userId, watchlist: true })
      .sort({ updatedAt: -1 })
      .lean();

    return NextResponse.json({
      success: true,
      domains: domains.map(serializeDomain),
    });
  } catch (error) {
    console.error('Watchlist GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load watchlist' },
      { status: 500 },
    );
  }
}

export async function POST(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const body = await req.json();
    const domainName = body.domainName?.trim().toLowerCase();

    if (!domainName) {
      return NextResponse.json(
        { success: false, message: 'Domain name is required' },
        { status: 400 },
      );
    }

    if (!/^[a-z0-9]([a-z0-9-]*[a-z0-9])?(\.[a-z0-9]([a-z0-9-]*[a-z0-9])?)+$/.test(domainName)) {
      return NextResponse.json(
        { success: false, message: 'Invalid domain name format' },
        { status: 400 },
      );
    }

    const existing = await Domain.findOne({ user: auth.userId, domainName });
    if (existing) {
      existing.watchlist = true;
      if (body.registrar) existing.registrar = body.registrar;
      if (body.expiryDate) {
        existing.expiryDate = new Date(body.expiryDate);
        existing.status = computeDomainStatus(existing.expiryDate);
      }
      if (body.renewalPrice !== undefined) {
        existing.renewalPrice = parseRenewalPrice(body.renewalPrice);
      }
      existing.lastChecked = new Date();
      await existing.save();

      return NextResponse.json({
        success: true,
        domain: serializeDomain(existing),
        message: 'Domain updated on watchlist',
      });
    }

    const expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
    const domain = await Domain.create({
      user: auth.userId,
      domainName,
      registrar: body.registrar || 'Unknown',
      expiryDate,
      renewalPrice: parseRenewalPrice(body.renewalPrice),
      watchlist: true,
      status: computeDomainStatus(expiryDate),
      lastChecked: new Date(),
    });

    return NextResponse.json(
      { success: true, domain: serializeDomain(domain), message: 'Domain added to watchlist' },
      { status: 201 },
    );
  } catch (error) {
    console.error('Watchlist POST Error:', error);
    if (error.code === 11000) {
      return NextResponse.json(
        { success: false, message: 'Domain already exists in your portfolio' },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: false, message: 'Failed to add domain to watchlist' },
      { status: 500 },
    );
  }
}
