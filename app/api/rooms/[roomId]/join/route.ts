import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(
  request: NextRequest,
  { params }: { params: { roomId: string } }
) {
  try {
    const { roomId } = params;
    const { userId } = await request.json();
    
    if (!userId) {
      return NextResponse.json(
        { error: 'userId is required' },
        { status: 400 }
      );
    }

    // Check if room exists
    const roomsDir = path.join(process.cwd(), 'DB', 'rooms');
    const roomPath = path.join(roomsDir, `${roomId}.json`);
    
    try {
      // Try to read the room file
      const roomData = await fs.readFile(roomPath, 'utf-8');
      const room = JSON.parse(roomData) as App.Room;
      
      // Add user to the room if not already present
      if (!room.userIds.includes(userId)) {
        room.userIds.push(userId);
        await fs.writeFile(roomPath, JSON.stringify(room, null, 2));

        // Create and save the join event
        const eventsDir = path.join(process.cwd(), 'DB', 'events');
        await fs.mkdir(eventsDir, { recursive: true });
        
        const event: App.Event = {
          userId,
          roomId,
          type: 'joined',
          timestamp: new Date()
        };
        
        const eventId = uuidv4();
        const eventPath = path.join(eventsDir, `${eventId}.json`);
        await fs.writeFile(eventPath, JSON.stringify(event, null, 2));
      }
      
      return NextResponse.json({ success: true, room });
    } catch (error) {
      return NextResponse.json(
        { error: 'Room not found' },
        { status: 404 }
      );
    }
  } catch (error) {
    console.error('Failed to join room:', error);
    return NextResponse.json(
      { error: 'Failed to join room' },
      { status: 500 }
    );
  }
} 