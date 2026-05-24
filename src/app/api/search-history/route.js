import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ensureDb } from '@/lib/domainService';
import SearchHistory from '@/models/SearchHistory';

export async function GET(req) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const history = await SearchHistory.find({ user: auth.userId })
      .sort({ searchedAt: -1 })
      .limit(20)
      .lean();

    return NextResponse.json({
      success: true,
      history: history.map((item) => ({
        _id: item._id.toString(),
        query: item.query,
        searchedAt: item.searchedAt,
      })),
    });
  } catch (error) {
    console.error('Search History GET Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to load search history' },
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
    const query = body.query?.trim().toLowerCase();

    if (!query) {
      return NextResponse.json(
        { success: false, message: 'Search query is required' },
        { status: 400 },
      );
    }

    const entry = await SearchHistory.create({
      user: auth.userId,
      query,
      searchedAt: new Date(),
    });

    return NextResponse.json(
      {
        success: true,
        entry: {
          _id: entry._id.toString(),
          query: entry.query,
          searchedAt: entry.searchedAt,
        },
      },
      { status: 201 },
    );
  } catch (error) {
    console.error('Search History POST Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to save search history' },
      { status: 500 },
    );
  }
}
