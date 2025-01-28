import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const roomsDir = path.join(process.cwd(), 'DB', 'rooms');
    const roomPath = path.join(roomsDir, `${roomId}.json`);
    
    // Check if room exists
    try {
      await fs.access(roomPath);
    } catch {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }

    // Read and parse the room file
    const roomData = await fs.readFile(roomPath, 'utf8');
    const room = JSON.parse(roomData);

    // Get user details from DB/users
    const usersDir = path.join(process.cwd(), 'DB', 'users');
    const users = await Promise.all(
      room.userIds.map(async (userId: string) => {
        try {
          const userPath = path.join(usersDir, `${userId}.json`);
          const userData = await fs.readFile(userPath, 'utf8');
          return JSON.parse(userData);
        } catch {
          // If user file doesn't exist, return basic user info
          return {
            userId,
            name: 'Anonymous',
            isOnline: true
          };
        }
      })
    );

    return NextResponse.json({ ...room, users });
  } catch (error) {
    console.error('Error reading room:', error);
    return NextResponse.json(
      { error: 'Failed to get room details' },
      { status: 500 }
    );
  }
} 