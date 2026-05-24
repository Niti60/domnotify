import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ensureDb, getDomainForUser } from '@/lib/domainService';
import { computeDomainStatus, parseRenewalPrice, serializeDomain } from '@/lib/domainHelpers';

export async function PATCH(req, { params }) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const { id } = await params;
    const domain = await getDomainForUser(auth.userId, id);

    if (!domain) {
      return NextResponse.json(
        { success: false, message: 'Domain not found' },
        { status: 404 },
      );
    }

    const body = await req.json();

    if (body.domainName !== undefined) {
      const name = body.domainName.trim().toLowerCase();
      if (!name) {
        return NextResponse.json(
          { success: false, message: 'Domain name cannot be empty' },
          { status: 400 },
        );
      }
      domain.domainName = name;
    }
    if (body.registrar !== undefined) domain.registrar = body.registrar;
    if (body.expiryDate !== undefined) {
      domain.expiryDate = body.expiryDate ? new Date(body.expiryDate) : null;
      domain.status = computeDomainStatus(domain.expiryDate);
    }
    if (body.renewalPrice !== undefined) {
      domain.renewalPrice = parseRenewalPrice(body.renewalPrice);
    }
    if (body.autoRenew !== undefined) domain.autoRenew = Boolean(body.autoRenew);
    if (body.watchlist !== undefined) domain.watchlist = Boolean(body.watchlist);
    if (body.status !== undefined) domain.status = body.status;
    if (body.nameservers !== undefined) domain.nameservers = body.nameservers;

    domain.lastChecked = new Date();
    await domain.save();

    return NextResponse.json({
      success: true,
      domain: serializeDomain(domain),
      message: 'Domain updated successfully',
    });
  } catch (error) {
    console.error('Watchlist PATCH Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to update domain' },
      { status: 500 },
    );
  }
}

export async function DELETE(req, { params }) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const { id } = await params;
    const domain = await getDomainForUser(auth.userId, id);

    if (!domain) {
      return NextResponse.json(
        { success: false, message: 'Domain not found' },
        { status: 404 },
      );
    }

    await domain.deleteOne();

    return NextResponse.json({
      success: true,
      message: 'Domain removed from watchlist',
    });
  } catch (error) {
    console.error('Watchlist DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to remove domain' },
      { status: 500 },
    );
  }
}
