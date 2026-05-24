import { NextResponse } from 'next/server';
import { requireAuth } from '@/lib/auth';
import { ensureDb } from '@/lib/domainService';
import SearchHistory from '@/models/SearchHistory';

export async function DELETE(req, { params }) {
  try {
    const auth = requireAuth(req);
    if (auth.error) return auth.error;

    await ensureDb();

    const { id } = await params;
    const entry = await SearchHistory.findOneAndDelete({ _id: id, user: auth.userId });

    if (!entry) {
      return NextResponse.json(
        { success: false, message: 'Search history entry not found' },
        { status: 404 },
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Search history entry deleted',
    });
  } catch (error) {
    console.error('Search History DELETE Error:', error);
    return NextResponse.json(
      { success: false, message: 'Failed to delete search history entry' },
      { status: 500 },
    );
  }
}
