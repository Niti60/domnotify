import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ensureDb, searchDomains, SEARCH_TLDS } from '@/lib/domainService';
import SearchHistory from '@/models/SearchHistory';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q')?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 },
      );
    }

    await ensureDb();

    await SearchHistory.create({
      user: auth.userId,
      query,
      searchedAt: new Date(),
    });

    const results = await searchDomains(query);

    return NextResponse.json({
      success: true,
      query,
      results,
      tlds: SEARCH_TLDS,
    });
  } catch (error) {
    console.error('Search API Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to search domains' },
      { status: 500 },
    );
  }
}
