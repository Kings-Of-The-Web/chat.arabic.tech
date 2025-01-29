import { NextRequest, NextResponse } from 'next/server';

import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get all ids from the query parameters
    const searchParams = request.nextUrl.searchParams;
    const userIds = searchParams.getAll('ids');

    if (!userIds.length) {
      return NextResponse.json({ error: 'No user IDs provided' }, { status: 400 });
    }

    // Query the database for all users that match the provided IDs
    const users = await db.user.findMany({
      where: {
        userId: {
          in: userIds,
        },
      },
      select: {
        userId: true,
        name: true,
        isOnline: true,
      },
    });

    return NextResponse.json(users);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
